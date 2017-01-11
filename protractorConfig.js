// conf.js
exports.config = {
	baseUrl: 'http://localhost:8090/',
	capabilities: {
		browserName: 'chrome',
		chromeOptions: {
			args: [ 'lang=en-EN', '--window-size=1280,960'],
			prefs: {
				intl: { accept_languages: "en-EN" }
			}
		}
	},
	framework: 'jasmine',
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: ['specs/*.spec.js'],
	onPrepare: function() {
		// ignoreSynchronization prevents protractor from waiting for angular
		browser.ignoreSynchronization = true;
	}
};
