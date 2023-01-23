module.exports = {
    'Access GISAUTO Admin Portal URL': function (browser) {
        browser
        .url(browser.launch_url)
        .end();
    },

    'Login form exists': function (browser) {
        browser
        .useXpath()
        .url(browser.launch_url)
        .assert.elementPresent('//*[@id="username"]')
        .assert.elementPresent('//*[@id="password"]')
        .assert.elementPresent('//*[@id="t-btn-login"]')
        .end();
    },

    'Input invalid credentials': function (browser) {
        browser
        .url(browser.launch_url)
        .setWindowSize(1920, 1080)
        .useXpath()
        .setValue('//*[@id="username"]', browser.globals.username)
        .setValue('//*[@id="password"]', browser.globals.passwordinvalid)
        // .saveScreenshot('tests/e2e/reports/login1.png')
        .click('//*[@id="t-btn-login"]')
        // .saveScreenshot('tests/e2e/reports/login2.png')
        .pause(browser.globals.waitForLoginTimeout)
        // .saveScreenshot('tests/e2e/reports/login3.png')
        .assert.visible('//*[@id="release-text-wrapper"]/div/div/div[3]/div/div')
        .expect.element('//*[@id="release-text-wrapper"]/div/div/div[3]/div/div').text.to.contain('Invalid Login. Please try again.')
    },

    'Valid credentials': function (browser) {
        browser
        .url(browser.launch_url)
        .setWindowSize(1920, 1080)
        .useXpath()
        .setValue('//*[@id="username"]', browser.globals.username)
        .setValue('//*[@id="password"]', browser.globals.password)
        // .saveScreenshot('tests/e2e/reports/login4.png')
        .click('//*[@id="t-btn-login"]')
        // .saveScreenshot('tests/e2e/reports/login5.png')
        .pause(browser.globals.waitForLoginTimeout)
        // .saveScreenshot('tests/e2e/reports/login6.png')
        .waitForElementVisible('//*[@id="app"]/div/header/div/button', browser.globals.waitForLoginTimeout)
        // .saveScreenshot('tests/e2e/reports/login7.png')
        .expect.element('//*[@id="app"]/div/header/div/h1').text.to.equal('Automations')
    },

    'Logout GISAUTO Admin Portal': function (browser) {
        browser
        .pause(1000)
        .click('//*[@id="app"]/div/nav/div[2]/div/div/div/button')
        .pause(1000)
        .click('//*[@id="inspire"]/div[2]')
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/login8.png')
        .assert.elementPresent('//*[@id="username"]')
        .end();
    }
};