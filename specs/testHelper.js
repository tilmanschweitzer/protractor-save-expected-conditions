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
	removeTestElementById: function (id) {
		return browser.executeScript(function (id) {
			var e = document.getElementById(id);
			if (e) {
				e.remove();
			}
		}, id);
	}
};

module.exports = testHelper;
