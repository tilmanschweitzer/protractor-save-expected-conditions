var testHelper = {
	createTestElementWithId: function (id) {
		return browser.executeScript(function (id) {
			var element = document.createElement('div');
			element.appendChild(document.createTextNode(id));
			element.id = id;
			document.body.appendChild(element);
			return element;
		}, id);
	},
	range: function (from, til, step) {
		step = step || 1;

		if (til === undefined) {
			til = from || 0;
			from = 0;
		}

		var numbers = [];

		for (var i = from; i < til; i += step) {
			numbers.push(Math.round(i));
		}

		return numbers;
	},
	removeTestElementById: function (id) {
		return browser.executeScript(function (id) {
			var e = document.getElementById(id);
			if (e) {
				e.remove();
			}
		}, id);
	},
	removeTestElementByIdInTimeout: function (id, timeout) {

		return browser.executeScript(function (id, timeout) {
			var e = document.getElementById(id);
			if (e) {
				setTimeout(function () {
					e.remove();
				}, timeout);
			}
		}, id, timeout);
	},
	prepareInterceptorToRemoveElementBeforeCall: function (raceConditionElement, elementId, fnName) {
		var originalFn = raceConditionElement[fnName];

		raceConditionElement[fnName] = function () {
			// Remove element between isPresent and isDisplayed call
			testHelper.removeTestElementById(elementId);
			return originalFn.apply(this);
		};
	},
	prepareInterceptorToRemoveWithTimeoutElementBeforeCall: function (raceConditionElement, elementId, fnName, timeout) {
		var originalFn = raceConditionElement[fnName];

		raceConditionElement[fnName] = function () {
			// Remove element between isPresent and isDisplayed call
			testHelper.removeTestElementByIdInTimeout(elementId, timeout);

			return originalFn.apply(this);
		};
	},
	resolveAndIgnoreNoSuchElementErrors: function (promise, done) {
		// ignore NoSuchElementError
		promise.then(function () {
			done()
		}, function (error) {
			if (error.name === 'NoSuchElementError') {
				done();
			} else {
				done.fail(error);
			}
		});
	}
};

module.exports = testHelper;
