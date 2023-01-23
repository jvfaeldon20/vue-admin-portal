///////////////////////////////////////////////////////////////////////////////////
// Refer to the entire list of global config settings here:
// https://github.com/nightwatchjs/nightwatch/blob/master/lib/settings/defaults.js#L16
//
// More info on test globals:
//   https://nightwatchjs.org/gettingstarted/configuration/#test-globals
//
///////////////////////////////////////////////////////////////////////////////////

module.exports = {
  globals: {
    // this controls whether to abort the test execution when an assertion failed and skip the rest
    // it's being used in waitFor commands and expect assertions
    abortOnAssertionFailure: true,

    // this will overwrite the default polling interval (currently 500ms) for waitFor commands
    // and expect assertions that use retry
    waitForConditionPollInterval: 500,

    // default timeout value in milliseconds for waitFor commands and implicit waitFor value for
    // expect assertions
    waitForConditionTimeout : 5000,

    // since 1.4.0 – this controls whether to abort the test execution when an element cannot be located; an error
    // is logged in all cases, but this also enables skipping the rest of the testcase;
    // it's being used in element commands such as .click() or .getText()
    abortOnElementLocateError: false,

    // this will cause waitFor commands on elements to throw an error if multiple
    // elements are found using the given locate strategy and selector
    throwOnMultipleElementsReturned: false,

    // By default a warning is printed if multiple elements are found using the given locate strategy
    // and selector; set this to true to suppress those warnings
    suppressWarningsOnMultipleElementsReturned: false,

    // controls the timeout value for async hooks. Expects the done() callback to be invoked within this time
    // or an error is thrown
    asyncHookTimeout : 10000,

    // controls the timeout value for when running async unit tests. Expects the done() callback to be invoked within this time
    // or an error is thrown
    unitTestsTimeout : 2000,

    // controls the timeout value for when executing the global async reporter. Expects the done() callback to be 
    // invoked within this time or an error is thrown
    customReporterCallbackTimeout: 20000,

    // Automatically retrying failed assertions - You can tell Nightwatch to automatically retry failed assertions 
    // until a given timeout is reached, before the test runner gives up and fails the test.
    retryAssertionTimeout: 5000,

    // Custom reporter
    reporter: function(results, done) {
      // do something with the results
      done(results);
    }
},

  'firefox': {
    /*
    The globals defined here are available only when the chrome testing env is being used
       i.e. when running with --env firefox
    */
    /*
     * myGlobal: function() {
     *   return 'Firefox specific global';
     * }
     */
  },

  /////////////////////////////////////////////////////////////////
  // Global hooks
  // - simple functions which are executed as part of the test run
  // - take a callback argument which can be called when an async
  //    async operation is finished
  /////////////////////////////////////////////////////////////////
  /**
   * executed before the test run has started, so before a session is created
   */
  /*
  before(cb) {
    //console.log('global before')
    cb();
  },
  */

  /**
   * executed before every test suite has started
   */
  /*
  beforeEach(browser, cb) {
    //console.log('global beforeEach')
    cb();
  },
  */

  /**
   * executed after every test suite has ended
   */
  /*
  afterEach(browser, cb) {
    browser.perform(function() {
      //console.log('global afterEach')
      cb();
    });
  },
  */

  /**
   * executed after the test run has finished
   */
  /*
  after(cb) {
    //console.log('global after')
    cb();
  },
  */

  /////////////////////////////////////////////////////////////////
  // Global reporter
  //  - define your own custom reporter
  /////////////////////////////////////////////////////////////////
  reporter(results, cb) {
    cb();
  }
}
