var testHelper = require('./testHelper');

describe('visibilityOf race condition', function() {

	// switch to empty page
	beforeAll(function () {
		browser.get('data:,');
	});

	var EC = protractor.ExpectedConditions;

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
	it('calls isPresent and isDisplayed', function (done) {
		spyOn(RACE_CONDITION_ELEMENT, 'isPresent').and.callThrough();
		spyOn(RACE_CONDITION_ELEMENT, 'isDisplayed').and.callThrough();

		var visibilityCondition = EC.visibilityOf(RACE_CONDITION_ELEMENT);

		expect(visibilityCondition()).toBe(true);

		visibilityCondition().then(function () {
			expect(RACE_CONDITION_ELEMENT.isPresent).toHaveBeenCalled();
			expect(RACE_CONDITION_ELEMENT.isDisplayed).toHaveBeenCalled();
			done();
		});
	});

	describe('workaround for visibilityOf', function () {

		var EC = protractor.ExpectedConditions;

		/*
		 * Comment out this line to reproduce the original race condition error
		 */
		EC.visibilityOf = require('../src/saveVisibilityOf');

		it('returns true is element is present', function () {
			var raceConditionElement = EC.visibilityOf(RACE_CONDITION_ELEMENT);

			expect(raceConditionElement()).toBe(true);
		});

		it('returns false is element is not present', function () {
			var raceConditionElement = EC.visibilityOf(RACE_CONDITION_ELEMENT);

			testHelper.removeTestElementById(RACE_CONDITION_ELEMENT_ID);

			expect(raceConditionElement()).toBe(false);
		});

		it('returns false when element is removed between isPresent and getText', function () {
			testHelper.prepareInterceptorToRemoveElementBeforeCall(RACE_CONDITION_ELEMENT, RACE_CONDITION_ELEMENT_ID, 'isDisplayed');

			var raceConditionElement = EC.visibilityOf(RACE_CONDITION_ELEMENT);

			expect(raceConditionElement()).toBe(false);
		});

	});
});
