var falseOnRaceConditionError = require('./falseOnRaceConditionError');

function saveTextToBePresentInElement(element, expectedText) {
	function hasText(actualText) {
		return actualText.replace(/\r?\n|\r/g, '').indexOf(expectedText) > -1;
	}
	return function () {
		return element.isPresent().then(function (isPresent) {
			if (!isPresent) {
				return false;
			}
			return element.getText().then(hasText, falseOnRaceConditionError);
		});
	}
}

module.exports = saveTextToBePresentInElement;
