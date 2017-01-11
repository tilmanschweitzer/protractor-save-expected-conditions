var testHelper = require('./testHelper');

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

describe('testHelper', function () {
	it('creates an element', function () {
		expect(RACE_CONDITION_ELEMENT.isPresent()).toBe(false);

		testHelper.createTestElementWithId(RACE_CONDITION_ELEMENT_ID);

		expect(RACE_CONDITION_ELEMENT.isPresent()).toBe(true);
	});

	it('removes an element', function () {
		expect(RACE_CONDITION_ELEMENT.isPresent()).toBe(true);

		testHelper.removeTestElementById(RACE_CONDITION_ELEMENT_ID);

		expect(RACE_CONDITION_ELEMENT.isPresent()).toBe(false);
	});
});
