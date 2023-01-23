module.exports = {
    'Access Dashboard test suite': function (browser) {
        browser
        .url(browser.launch_url)
        .setWindowSize(1920, 1080)
        .useXpath()
        .setValue('//*[@id="username"]', browser.globals.username)
        .setValue('//*[@id="password"]', browser.globals.password)
        .click('//*[@id="t-btn-login"]')
        .pause(browser.globals.waitForLoginTimeout)
        .waitForElementVisible('//*[@id="app"]/div/header/div/button', 1000)
        // .saveScreenshot('tests/e2e/reports/dashboard1.png')
        .click('//*[@id="app"]/div/nav/div[1]/div/div/a[2]') //Dashboard menu
        .pause(2000)
        // .saveScreenshot('tests/e2e/reports/dashboard2.png')
        .assert.elementPresent('//*[@id="app"]/div/header/div/h1') //Dashboard page title
    },

    'Load Service Usage graph': function (browser) {
        browser
        // .saveScreenshot('tests/e2e/reports/dashboard3.png')
        .waitForElementVisible('//*[@id="serviceUsageGraph"]', 10000)
        // .saveScreenshot('tests/e2e/reports/dashboard4.png')
        .assert.elementPresent('//*[@id="serviceUsageGraph"]') //Service usage graph
    },
    
    'Load Service Usage logs': function (browser) {
        browser
        .pause(5000)
        .waitForElementVisible('//*[@id="serviceUsageList"]', 1000)
        .assert.elementPresent('//*[@id="serviceUsageList"]')
        .assert.elementPresent('//*[@class="text-start"]') //row data
        // .saveScreenshot('tests/e2e/reports/dashboard5.png')
    },

    'Check Service Usage filter functions': function (browser) {
        browser
        .setValue('//*[@id="username"]', browser.globals.dashboardFilterUsername) //Username
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/dashboard6.png')
        .assert.containsText('//*[@id="serviceUsageList"]/div[1]/table/tbody/tr[1]/td[1]', browser.globals.dashboardFilterUsername)
        .click('//*[@id="cards-container"]/div/div[1]/div[2]/div/div/div[1]/div[1]/div[2]/div/button') // clear
        // .saveScreenshot('tests/e2e/reports/dashboard7.png')
        .setValue('//*[@id="messages"]', browser.globals.dashboardServiceUsageFilterMessageKeyword) //Messages
        .pause(1000)
        //.saveScreenshot('tests/e2e/reports/dashboard8.png')
        .assert.containsText('//*[@id="serviceUsageList"]/div[1]/table/tbody/tr[1]/td[2]', browser.globals.dashboardServiceUsageFilterMessageResult)
        .click('//*[@id="cards-container"]/div/div[1]/div[3]/div/div/div[1]/div[2]/div/button') //clear
        // .saveScreenshot('tests/e2e/reports/dashboard9.png')
        .setValue('//*[@id="category"]', browser.globals.dashboardServiceUsageFilterCategory) //Category
        // .saveScreenshot('tests/e2e/reports/dashboard10.png')
        .assert.containsText('//*[@id="serviceUsageList"]/div[1]/table/tbody/tr[1]/td[4]/span', browser.globals.dashboardServiceUsageFilterCategory)
        .pause(1000)
        .click('//*[@id="clearFilters"]') //clear
        // .saveScreenshot('tests/e2e/reports/dashboard11.png')
    },    

    'Load User Usage graph': function (browser) {
        browser
        .pause(1000)
        .click('//*[@id="toolbar"]/a') //User Usage button
        // .saveScreenshot('tests/e2e/reports/dashboard12.png')
        .pause(5000)
        .assert.elementPresent('//*[@id="userUsageGraph"]')
        // .saveScreenshot('tests/e2e/reports/dashboard13.png')
    },

    'Load User Usage logs': function (browser) {
        browser
        .pause(1000)
        .assert.elementPresent('//*[@class="text-center"]') //row data
        // .saveScreenshot('tests/e2e/reports/dashboard14.png')
    },

    'Check User Usage filter functions': function (browser) {
        browser
        .setValue('//*[@id="username"]', browser.globals.dashboardFilterUsername) //Username
        .pause(3000)
        .assert.containsText('//*[@id="cards-container"]/div/div[2]/div/div/div[1]/table/tbody/tr/td[1]', browser.globals.dashboardFilterUsername)
        // .saveScreenshot('tests/e2e/reports/dashboard15.png')
    }
};
