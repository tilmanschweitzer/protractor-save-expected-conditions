var falseOnRaceConditionError = require('./falseOnRaceConditionError');

function saveVisibilityOf(element) {
	return function () {
		return element.isPresent().then(function (isPresent) {
			if (!isPresent) {
				return false;
			}
			return element.isDisplayed().then(function (isDisplayed) {
				return isDisplayed;
			}, falseOnRaceConditionError);
		});
	}
}

module.exports = saveVisibilityOf;
