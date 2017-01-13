## Install

    npm install --save-dev protractor-save-expected-conditions

## Global usage in onPrepare

Override the function `visibilityOf` and `textToBePresentInElement` globally;

    // protractorConfig.js
    exports.config = {
        baseUrl: 'http://localhost:8080/',
        capabilities: {
            browserName: 'chrome'
        },
        framework: 'jasmine',
        seleniumAddress: 'http://localhost:4444/wd/hub',
        specs: ['specs/*.spec.js'],
        onPrepare: function() {
            var saveExpectedConditions = require('protractor-save-expected-conditions');
            protractor.ExpectedConditions.visibilityOf = saveExpectedConditions.saveVisibilityOf;
            protractor.ExpectedConditions.textToBePresentInElement = saveExpectedConditions.saveTextToBePresentInElement;
        }
    };
