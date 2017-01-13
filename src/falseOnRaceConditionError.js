function falseOnRaceConditionError(error) {
	if (error && (error.name === 'NoSuchElementError' || error.name === 'StaleElementReferenceError')) {
		return false;
	}
	throw error;
}

module.exports = falseOnRaceConditionError;
