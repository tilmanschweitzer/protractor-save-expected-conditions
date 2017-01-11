var testHelper = require('./testHelper');

describe('visibilityOf race condition', function() {

	// switch to empty page
	beforeAll(function () {
		browser.get('data:,');
	});

	var RACE_CONDITION_ELEMENT_ID;
	var RACE_CONDITION_ELEMENT;

	beforeEach(function () {
		RACE_CONDITION_ELEMENT_ID = 'race-condition-element';
		RACE_CONDITION_ELEMENT = element(by.id(RACE_CONDITION_ELEMENT_ID));
	});

	function prepareInterceptorOnIsDisplayedToRemoveElementBeforeIsDisplayed() {
		var originalIsDisplayedFn = RACE_CONDITION_ELEMENT.isDisplayed;

		RACE_CONDITION_ELEMENT.isDisplayed = function () {
			// Remove element between isPresent and isDisplayed call

			testHelper.removeTestElementById(RACE_CONDITION_ELEMENT_ID);
			expect(RACE_CONDITION_ELEMENT.isPresent()).toBe(false);


			return originalIsDisplayedFn.call(this);
		};
	}

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

		var visibilityOfRaceConditionElement = protractor.ExpectedConditions.visibilityOf(RACE_CONDITION_ELEMENT);

		expect(visibilityOfRaceConditionElement()).toBe(true);

		visibilityOfRaceConditionElement().then(function () {
			expect(RACE_CONDITION_ELEMENT.isPresent).toHaveBeenCalled();
			expect(RACE_CONDITION_ELEMENT.isDisplayed).toHaveBeenCalled();
			done();
		});
	});

	/*
	 * Actual problem
	 */
	it('throws NoSuchElementError when element is removed between isPresent and isDisplayed', function (done) {
		prepareInterceptorOnIsDisplayedToRemoveElementBeforeIsDisplayed();

		var visibilityOfRaceConditionElement = protractor.ExpectedConditions.visibilityOf(RACE_CONDITION_ELEMENT);

		expect(visibilityOfRaceConditionElement()).toBe(false);

		visibilityOfRaceConditionElement().then(function () {
			done();
		});

	});

	describe('workaround saveVisibilityOf', function () {

		function saveVisibilityOf(element) {
			return function () {
				return element.isPresent().then(function (isPresent) {
					if (!isPresent) {
						return false;
					}
					return element.isDisplayed().then(function (isDisplayed) {
						return isDisplayed;
					}, function (error) {
						if (error && error.name && error.name === 'NoSuchElementError') {
							console.log('Detected race condition in visibilityOfSave for element', element.locator().value);
							return false;
						}
						throw error;
					});
				});
			}
		}

		it('returns true when element is removed between isPresent and isDisplayed', function (done) {
			prepareInterceptorOnIsDisplayedToRemoveElementBeforeIsDisplayed();

			var visibilityOfRaceConditionElement = saveVisibilityOf(RACE_CONDITION_ELEMENT);

			expect(visibilityOfRaceConditionElement()).toBe(false);

			visibilityOfRaceConditionElement().then(function () {
				done();
			});
		});
	});
});
