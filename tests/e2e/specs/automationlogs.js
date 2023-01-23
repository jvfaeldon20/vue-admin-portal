module.exports = {
    'Open Automation Logs suite': function (browser) {
        browser
        .url(browser.launch_url)
        .setWindowSize(1920, 1080)
        .useXpath()
        .setValue('//*[@id="username"]', browser.globals.username)
        .setValue('//*[@id="password"]', browser.globals.password)
        .click('//*[@id="t-btn-login"]')
        .pause(browser.globals.waitForLoginTimeout)
        .waitForElementVisible('//*[@id="app"]/div/header/div/button', 1000)
        // .saveScreenshot('tests/e2e/reports/autologs1.png')
        .click('//*[@id="app"]/div/nav/div[1]/div/div/a[4]') //Automation Logs menu
        .pause(2000)
        // .saveScreenshot('tests/e2e/reports/autologs2.png')
        .assert.elementPresent('//*[@id="app"]/div/header/div/h1') //Automation Logs title
    },

    'Check System Trigger Logs list display': function (browser) {
        browser
        .pause(15000)
        .assert.elementPresent('//*[@class="text-start"]') //row data
        // .saveScreenshot('tests/e2e/reports/autologs3.png')
    },

    'Check System Trigger search filter function': function (browser) {
        browser
        .pause(1000)
        .setValue('//*[@id="status"]', 'start') //Status
        .pause(1000)
        .assert.containsText('//*[@id="cards-container"]/div/div[3]/div/div[1]/div[1]/table/tbody/tr[1]/td[2]/span/span', 'start')
        .pause(1000)
        .click('//*[@id="cards-container"]/div/div[1]/div[1]/div/div/div[1]/div[1]/div[2]/div/button') //clear status
        .pause(1000)
        .setValue('//*[@id="projectname"]', browser.globals.systemTriggerFilterProjectName) //Project Name
        .pause(1000)
        .assert.containsText('//*[@id="cards-container"]/div/div[3]/div/div[1]/div[1]/table/tbody/tr[1]/td[1]', browser.globals.systemTriggerFilterProjectName)
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/autologs4.png')
        .click('//*[@id="cards-container"]/div/div[2]/div[5]/button[1]') //Clear Filters button
        .pause(1000)
        .setValue('//*[@id="referenceid"]', browser.globals.systemTriggerFilterReferenceId)
        .pause(1000)
        .assert.containsText('//*[@id="cards-container"]/div/div[3]/div/div[1]/div[1]/table/tbody/tr/td[6]', browser.globals.systemTriggerFilterReferenceId)
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/autologs5.png')
        .click('//*[@id="cards-container"]/div/div[1]/div[5]/div/div/div[1]/div[2]/div/button') //clear reference id
        .pause(1000)
        .setValue('//*[@id="accessgroupname"]', browser.globals.automationLogsFilterAccessGroup) //Access Group
        .pause(1000)
        .assert.containsText('//*[@id="cards-container"]/div/div[3]/div/div[1]/div[1]/table/tbody/tr[1]/td[7]', browser.globals.automationLogsFilterAccessGroup)
        .pause(1000)
        .click('//*[@id="cards-container"]/div/div[2]/div[5]/button[1]') //Clear Filters button
        // .saveScreenshot('tests/e2e/reports/autologs6.png')
    },

    'View System Trigger Log Details': function (browser) {
        browser
        .pause(3000)
        .click('//*[@id="cards-container"]/div/div[3]/div/div[1]/div[1]/table/tbody/tr[1]/td[8]/a') //View button
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/autologs7.png')
        .assert.containsText('//*[@id="form-container"]/div/div/h1', 'Log Details')
        .pause(5000)
        // .saveScreenshot('tests/e2e/reports/autologs8.png')
        .assert.elementPresent('//*[@class="text-left"]') //row data
    },

    'Check Manual Trigger Logs list display': function (browser) {
        browser
        .click('//*[@id="app"]/div/nav/div[1]/div/div/a[4]') //Automation Logs menu
        .pause(5000)
        // .saveScreenshot('tests/e2e/reports/autologs9.png')
        .click('//*[@id="toolbar"]/a') //click Manual Logs button
        .pause(5000)
        .assert.elementPresent('//*[@class="text-start"]') //row data
        // .saveScreenshot('tests/e2e/reports/autologs10.png')
    },

    'Check Manual Trigger search filter function': function (browser) {
        browser
        .setValue('//*[@id="requestor"]', browser.globals.manualTriggerFilterRequestor) //Requestor
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/autologs12.png')
        .assert.containsText('//*[@id="cards-container"]/div/div[2]/div/div/div[1]/table/tbody/tr[1]/td[2]', browser.globals.manualTriggerFilterRequestor)
        .click('//*[@id="cards-container"]/div/div[2]/div/div/div[2]/div[1]') //lost focus
        .click('//*[@id="cards-container"]/div/div[1]/div[2]/div/div/div[1]/div[1]/div[2]/div/button') //clear Requestor
        .pause(1000)
        .setValue('//*[@id="triggerReason"]', browser.globals.manualTriggerFilterTriggerReason) //Trigger Reason
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/autologs13.png')
        .assert.containsText('//*[@id="cards-container"]/div/div[2]/div/div/div[1]/table/tbody/tr[1]/td[3]', browser.globals.manualTriggerFilterTriggerReason)
        .click('//*[@id="cards-container"]/div/div[1]/div[3]/div/div/div[1]/div[2]/div/button') //clear Trigger Reason
        .pause(1000)
        .setValue('//*[@id="accessGroup"]', browser.globals.automationLogsFilterAccessGroup) //Access Group
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/autologs14.png')
        .assert.containsText('//*[@id="cards-container"]/div/div[2]/div/div/div[1]/table/tbody/tr[1]/td[5]', browser.globals.automationLogsFilterAccessGroup)
        .click('//*[@id="cards-container"]/div/div[2]/div/div/div[2]/div[1]') //lost focus
        .click('//*[@id="cards-container"]/div/div[1]/div[5]/div/div/div[1]/div[1]/div[2]/div/button') //clear Access Group
    },
};
