var testHelper = require('./testHelper');

describe('textToBePresentInElement race condition', function() {

	// switch to empty page
	beforeAll(function () {
		browser.get('data:,');
	});

	var EC = protractor.ExpectedConditions;
	var TIMEOUTS = testHelper.range(0, 20, 2);

	var RACE_CONDITION_ELEMENT_ID;
	var RACE_CONDITION_ELEMENT;


	beforeEach(function () {
		RACE_CONDITION_ELEMENT_ID = 'race-condition-element';
		RACE_CONDITION_ELEMENT = element(by.id(RACE_CONDITION_ELEMENT_ID));
	});

	beforeEach(function () {
		testHelper.createTestElementWithId(RACE_CONDITION_ELEMENT_ID);
	});

	afterEach(function () {
		testHelper.removeTestElementById(RACE_CONDITION_ELEMENT_ID);
	});

	/*
	 * Verify assumptions about internal behaviour
	 */
	it('calls isPresent and getText', function (done) {
		spyOn(RACE_CONDITION_ELEMENT, 'isPresent').and.callThrough();
		spyOn(RACE_CONDITION_ELEMENT, 'getText').and.callThrough();

		var textPresentCondition = EC.textToBePresentInElement(RACE_CONDITION_ELEMENT, RACE_CONDITION_ELEMENT_ID);

		expect(textPresentCondition()).toBe(true);

		textPresentCondition().then(function () {
			expect(RACE_CONDITION_ELEMENT.isPresent).toHaveBeenCalled();
			expect(RACE_CONDITION_ELEMENT.getText).toHaveBeenCalled();
			done();
		});
	});

	describe('workaround for textToBePresentInElement', function () {

		/*
		 * Comment out this line to reproduce the original race condition error
		 */
		EC.textToBePresentInElement = require('../src/saveTextToBePresentinElement');

		it('returns false when element is removed between isPresent and getText', function () {
			testHelper.prepareInterceptorToRemoveElementBeforeCall(RACE_CONDITION_ELEMENT, RACE_CONDITION_ELEMENT_ID, 'getText');

			var raceConditionElement = EC.textToBePresentInElement(RACE_CONDITION_ELEMENT, RACE_CONDITION_ELEMENT_ID);

			expect(raceConditionElement()).toBe(false);
		});

		TIMEOUTS.forEach(function (timeout) {
			it('throws NO StaleElementReferenceError error when element is removed between isPresent and getText', function (done) {
				testHelper.prepareInterceptorToRemoveWithTimeoutElementBeforeCall(RACE_CONDITION_ELEMENT, RACE_CONDITION_ELEMENT_ID, 'getText', timeout);

				var raceConditionElement = EC.textToBePresentInElement(RACE_CONDITION_ELEMENT, RACE_CONDITION_ELEMENT_ID);
				testHelper.resolveAndIgnoreNoSuchElementErrors(raceConditionElement(), done);
			});
		});

	});
});
