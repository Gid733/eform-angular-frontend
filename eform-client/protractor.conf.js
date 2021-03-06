// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/*global jasmine */
var SpecReporter = require('jasmine-spec-reporter');
exports.config = {
  allScriptsTimeout: 4500000,
  specs: [
     // './e2e/tests/settings/settings.login-page.e2e-spec.ts',
     // './e2e/tests/device-users/device-users.add.e2e-spec.ts',
     // './e2e/tests/device-users/device-users.delete.e2e-spec.ts',
     // './e2e/tests/device-users/device-users.edit.e2e-spec.ts',
     // './e2e/tests/main-page/main-page.create-eform.e2e-spec.ts',
     // './e2e/tests/main-page/main-page.filter-eform.e2e-spec.ts',
     // './e2e/tests/main-page/main-page.sort-eform.e2e-spec.ts',
     // './e2e/tests/main-page/main-page.tags.e2e-spec.ts',
     // './e2e/tests/main-page/main-page.delete-eform.e2e-spec.ts',
     // './e2e/tests/main-page/main-page.pairing-eform.e2e-spec.ts'
  ],
  suites: {
    // 'site-header': './e2e/tests/settings/settings.site-header.e2e-spec.ts',
    // 'login-page': './e2e/tests/settings/settings.login-page.e2e-spec.ts',
    // 'device-users-add': './e2e/tests/device-users/device-users.add.e2e-spec.ts',
    // 'device-users-edit': './e2e/tests/device-users/device-users.edit.e2e-spec.ts',
    // 'device-users-delete': './e2e/tests/device-users/device-users.delete.e2e-spec.ts',
    // 'main-page-create': './e2e/tests/main-page/main-page.create-eform.e2e-spec.ts',
    // 'main-page-filter':'./e2e/tests/main-page/main-page.filter-eform.e2e-spec.ts',
    // 'main-page-sort':'./e2e/tests/main-page/main-page.sort-eform.e2e-spec.ts',
    // 'main-page-tags':'./e2e/tests/main-page/main-page.tags.e2e-spec.ts',
    // 'main-page-delete':'./e2e/tests/main-page/main-page.delete-eform.e2e-spec.ts',
    // 'main-page-pairing':'./e2e/tests/main-page/main-page.pairing-eform.e2e-spec.ts'
  },
  SELENIUM_PROMISE_MANAGER: false,
  ignoreUncaughtExceptions: true,
  capabilities: {
    browserName: 'chrome',
    maxSessions: 1,
    maxInstances: 1,
    // options for headless mode
    chromeOptions: {args: ["--headless", "--disable-gpu"]}
  },
  directConnect: true,
  baseUrl:
    'http://localhost:4200/',
  framework:
    'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 720000,
    print: function () {
    }
  },
  useAllAngular2AppRoots: true,
  beforeLaunch: function () {
    require('ts-node').register({
      project: 'e2e'
    });
  },
  onPrepare: function () {
    jasmine.getEnv().addReporter(new SpecReporter());
    browser.driver.manage().window().maximize();
  }

};

