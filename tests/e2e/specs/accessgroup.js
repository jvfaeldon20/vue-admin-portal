module.exports = {
    'Open Access Group test suite': function (browser) {
        browser
        .url(browser.launch_url)
        .setWindowSize(1920, 1080)
        .useXpath()
        .setValue('//*[@id="username"]', browser.globals.username)
        .setValue('//*[@id="password"]', browser.globals.password)
        .click('//*[@id="t-btn-login"]')
        .pause(browser.globals.waitForLoginTimeout)
        .waitForElementVisible('//*[@id="app"]/div/header/div/button', 5000)
        // .saveScreenshot('tests/e2e/reports/accessgroup1.png')
        .click('//*[@id="app"]/div/nav/div[1]/div/div/a[3]') //Access Group menu
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/accessgroup2.png')
        .assert.elementPresent('//*[@id="app"]/div/header/div/h1') //Access Group page title
    },

    'Check Access Group list display': function (browser) {
        browser
        // .expect.element('//*[@id="form-container"]/div/div[2]/div[1]/div/div[1]/form/h1[1]').text.to.equal('Access Group Details')
        .assert.elementPresent('//*[@id="cards-container"]')
        // .saveScreenshot('tests/e2e/reports/accessgroup3.png')
    },
    
    'Add New Access Group': function (browser) {
        browser
        .click('//*[@id="newAccessGroup"]') //new automation button
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/accessgroup4.png')
        .click('//*[@id="dl"]')
        .keys(browser.Keys.ARROW_DOWN).keys(browser.Keys.ENTER) //select 1st DL data
        .click('//*[@id="form-container"]/div/div[2]/div[1]/div/div[1]/form/h1[1]') //lost focus
        .setValue('//*[@id="accessGroupName"]', browser.globals.accessGroupValue)
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/accessgroup5.png')
        .click('//*[@id="form-container"]/div/div[2]/div[1]/div/div[2]/button') //Next
        .pause(1000)
        .click('//*[@id="form-container"]/div/div[2]/div[2]/div/div[2]/div/button') //submit
        .pause(3000)
        // .saveScreenshot('tests/e2e/reports/accessgroup6.png')
        .assert.elementPresent('//*[@id="cards-container"]') //check if back to Access Group list
    },

    'Access Group Search filter function': function (browser) {
        browser
        // .saveScreenshot('tests/e2e/reports/accessgroup7.png')
        .pause(1000)
        .setValue('//*[@id="searchAccessGroup"]', 'e2e')
        .pause(2000)
        .assert.containsText('//*[@id="cards-container"]/div/div[1]/div[3]/h3', 'E2E Test Access Group')
        // .saveScreenshot('tests/e2e/reports/accessgroup8.png')
    },

    'Edit Access Group': function (browser) {
        browser
        .click('//*[@id="cards-container"]/div/div[2]/div/a') //edit
        .pause(5000)
        // .saveScreenshot('tests/e2e/reports/accessgroup9.png')
        .assert.containsText('//*[@id="form-container"]/div/div/div[1]/div/div/div/div[1]/div[2]/div[1]/div', 'All of Trend GIS Automation Team')
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/accessgroup10.png')
        .click('//*[@id="form-container"]/div/div/div[1]/div/div/div/div[1]/div[2]/div[1]/div')
        .keys(browser.Keys.ARROW_DOWN).keys(browser.Keys.ARROW_DOWN).keys(browser.Keys.ENTER) //add 2nd DL data
        // .saveScreenshot('tests/e2e/reports/accessgroup11.png')
        .click('//*[@id="form-container"]/div/div/h1') //lost focus
        .click('//*[@id="form-container"]/div/div/div[2]/button') //Next
        .pause(5000)
        .assert.elementPresent('//*[@id="cards-container"]')
        // .saveScreenshot('tests/e2e/reports/accessgroup12.png')
    },

    'Delete Access Group': function (browser) {
        browser
        .pause(1000)
        .setValue('//*[@id="searchAccessGroup"]', 'e2e')
        .pause(3000)
        // .saveScreenshot('tests/e2e/reports/accessgroup13.png')
        .click('//*[@id="cards-container"]/div/div[2]/div/div/button') //delete
        .pause(3000)
        .assert.elementPresent('//*[@id="inspire"]/div[3]/div') //Confirm Dialog box
        // .saveScreenshot('tests/e2e/reports/accessgroup14.png')
        .click('//*[@id="inspire"]/div[3]/div/div/div[3]/button[1]') //Delete button
        .pause(5000)
        .assert.containsText('//*[@id="automation"]/div[3]/div/div[1]', 'No matching records found')
        // .saveScreenshot('tests/e2e/reports/accessgroup15.png')
    }
};
