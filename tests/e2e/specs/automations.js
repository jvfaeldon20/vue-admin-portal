module.exports = {
    'Automations list display': function (browser) {
        browser
        .url(browser.launch_url)
        .setWindowSize(1920, 1080)
        .useXpath()
        .setValue('//*[@id="username"]', browser.globals.username)
        .setValue('//*[@id="password"]', browser.globals.password)
        .click('//*[@id="t-btn-login"]')
        .pause(browser.globals.waitForLoginTimeout)
        .waitForElementVisible('//*[@id="app"]/div/header/div/button', 1000) //Toggle
        // .saveScreenshot('tests/e2e/reports/automation1.png')
        .expect.element('//*[@id="app"]/div/header/div/h1').text.to.equal('Automations')
    },
    
    'Check Toggle icon functionalities': function (browser) {
        browser
        .click('//*[@id="app"]/div/header/div/button')
        .assert.cssProperty('//*[@id="app"]/div/nav', 'transform', 'matrix(1, 0, 0, 1, -175, 0)')
        // .saveScreenshot('tests/e2e/reports/automation2.png')
        .pause(1000)
        .click('//*[@id="app"]/div/header/div/button')
        .assert.cssProperty('//*[@id="app"]/div/nav', 'transform', 'matrix(1, 0, 0, 1, 0, 0)')
        // .saveScreenshot('tests/e2e/reports/automation3.png')
    },

    'Add New Automation': function (browser) {
        browser
        .click('//*[@id="toolbar"]/a') //New automation
        .pause(1000)
        .assert.elementPresent('//*[@id="projectType"]')
        .setValue('//*[@id="projectType"]', 'Web Service')
        .click('//*[@id="form-container"]/div/div[2]/div[1]/div/div[1]/h1')
        // .saveScreenshot('tests/e2e/reports/automation4.png')
        .assert.elementPresent('//*[@id="projectName"]')
        .setValue('//*[@id="projectName"]', browser.globals.projectName)
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/automation5.png')
        .click('//*[@id="form-container"]/div/div[2]/div[1]/div/div[2]/button') //Next
        // .saveScreenshot('tests/e2e/reports/automation6.png')
        .pause(1000)
        .assert.elementPresent('//*[@id="projectKey"]') 
        .setValue('//*[@id="projectKey"]', browser.globals.projectKey)
        .assert.elementPresent('//*[@id="projectOwner"]')
        .setValue('//*[@id="projectOwner"]','Ted') //Project Owner
        .keys(browser.Keys.ARROW_DOWN).keys(browser.Keys.ARROW_DOWN)
        .keys(browser.Keys.ENTER)
        // .saveScreenshot('tests/e2e/reports/automation7.png')
        .assert.elementPresent('//*[@id="projectDescription"]')
        .setValue('//*[@id="projectDescription"]',browser.globals.projectDescription) //Description
        .assert.elementPresent('//*[@id="projectAccessGroup"]')
        .setValue('//*[@id="projectAccessGroup"]', ['Auto', browser.Keys.ENTER]) //Access Group
        .assert.elementPresent('//*[@id="projectProcessTime"]')
        .setValue('//*[@id="projectProcessTime"]','0') //Processing time
        .assert.elementPresent('//*[@id="projectFqdn"]')
        .setValue('//*[@id="projectFqdn"]','https://compliance-stg.gisauto.trendmicro.com') //Site FQDN
        // .saveScreenshot('tests/e2e/reports/automation8.png')
        .pause(1000)
        .click('//*[@id="form-container"]/div/div[2]/div[2]/div/div[2]/button[2]')
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/automation9.png')
        .assert.elementPresent('//*[@id="submit"]')
        .click('//*[@id="submit"]')
        .pause(5000)
        .assert.elementPresent('//*[@id="toolbar"]/a')
        .pause(10000)
        // .saveScreenshot('tests/e2e/reports/automation10.png')
    },

    'Search and filter Automation service with keyword "e2e test"': function (browser) {
        
        browser
        .assert.elementPresent('//*[@id="searchAutomation"]')
        .setValue('//*[@id="searchAutomation"]', browser.globals.searchKeywordAutomation)
        // .saveScreenshot('tests/e2e/reports/automation11.png')
        .expect.element('//*[@id="cards-container"]/div/div[2]/h3').text.to.equal(browser.globals.projectName)
    },
    
    '"E2E Test Automation" click Run and will open a new tab that will redirect to Site FQDN': function (browser) {
        browser
        .pause(1000)
        .click('//*[@id="cards-container"]/div/div[2]/button')
        // .saveScreenshot('tests/e2e/reports/automation12.png')
        .windowHandles(function(result) {
            browser.assert.equal(result.value.length, 2, 'There should be a new tab to open for IT Helpdesk Ticket Submission Form');

            var mainWindowHandle = result.value[0];
            browser.switchWindow(mainWindowHandle);
        })
    },

    'Open modal popup when MORE DETAILS has been clicked': function (browser) {
        browser
        .pause(3000)
        // .saveScreenshot('tests/e2e/reports/automation13.png')
        .click('//*[@id="cards-container"]/div/div[2]/div[4]/div[1]/button')
        .pause(3000)
        // .saveScreenshot('tests/e2e/reports/automation14.png')
        .assert.containsText('//*[@id="inspire"]/div[3]/div/div/header/div', 'Automation Details')
        .keys(browser.Keys.ESCAPE)
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/automation15.png')
    },

    'Modify and update Automation details': function (browser) {
        browser
        .waitForElementVisible('//*[@id="cards-container"]/div/div[2]/div[4]/div[2]/button', 1000)
        .click('//*[@id="cards-container"]/div/div[2]/div[4]/div[2]/button') //open menu
        // .saveScreenshot('tests/e2e/reports/automation16.png')
        .pause(1000)
        .keys(browser.Keys.ARROW_DOWN)
        .keys(browser.Keys.ENTER)
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/automation17.png')
        .assert.containsText('//*[@id="form-container"]/div/form/h1', 'Edit Automation')
        .updateValue('//*[@id="projectDescriptionEdit"]', browser.globals.projectDescriptionUpdate)
        .click('//*[@id="update"]')
        .pause(3000)
        // .saveScreenshot('tests/e2e/reports/automation18.png')
        .assert.elementPresent('//*[@id="toolbar"]/a')
        .pause(3000)
        // .saveScreenshot('tests/e2e/reports/automation19.png')
    },

    'Generating token': function (browser) {
        browser
        .setValue('//*[@id="searchAutomation"]', browser.globals.searchKeywordAutomation)
        // .saveScreenshot('tests/e2e/reports/automation20.png')
        .waitForElementVisible('//*[@id="cards-container"]/div/div[2]/div[4]/div[2]/button', 1000)
        .click('//*[@id="cards-container"]/div/div[2]/div[4]/div[2]/button') //open menu
        // .saveScreenshot('tests/e2e/reports/automation21.png')
        .pause(1000)
        .keys(browser.Keys.ARROW_DOWN).keys(browser.Keys.ARROW_DOWN)
        .keys(browser.Keys.ENTER)
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/automation22.png')
        .assert.containsText('//*[@id="form-container"]/div/div/h1', 'Generate Token')
        .assert.elementPresent('//*[@id="generate"]')
        .click('//*[@id="generate"]')
        .pause(5000)
        .getValue('//*[@id="token"]', function(result) {
            this.assert.notEqual(result.value.length,0)
            // this.saveScreenshot('tests/e2e/reports/automation23.png')
        })
        .click('//*[@id="toolbar"]/a') //back
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/automation24.png')
    },

    'Modify Form': function (browser) {
        browser
        .pause(2000)
        .setValue('//*[@id="searchAutomation"]', browser.globals.searchKeywordAutomation)
        // .saveScreenshot('tests/e2e/reports/automation25.png')
        .waitForElementVisible('//*[@id="cards-container"]/div/div[2]/div[4]/div[2]/button', 1000)
        .click('//*[@id="cards-container"]/div/div[2]/div[4]/div[2]/button') //open menu
        // .saveScreenshot('tests/e2e/reports/automation26.png')
        .pause(1000)
        .keys(browser.Keys.ARROW_DOWN).keys(browser.Keys.ARROW_DOWN).keys(browser.Keys.ARROW_DOWN) //select Modify Form
        .keys(browser.Keys.ENTER)
        .pause(3000)
        // .saveScreenshot('tests/e2e/reports/automation27.png')
        .assert.containsText('//*[@id="form-container"]/div/div/h1', 'Modify Form')
        .click('//*[@id="addFormObject"]')
        .pause(3000)
        // .saveScreenshot('tests/e2e/reports/automation28.png')
        .setValue('//*[@id="formObjectType"]', 'Textbox')
        .setValue('//*[@id="formObjectLabel"]', 'Test Form')
        .setValue('//*[@id="formObjectDescription"]', 'Test Form description')
        // .saveScreenshot('tests/e2e/reports/automation29.png')
        .click('//*[@id="saveFormObject"]')
        .pause(3000)
        // .saveScreenshot('tests/e2e/reports/automation30.png')
        .click('//*[@id="inspire"]/div[3]/div/div/header/div')
        .keys(browser.Keys.ESCAPE)
        .pause(3000)
        // .saveScreenshot('tests/e2e/reports/automation31.png')
        .assert.containsText('//*[@id="form-container"]/div/div/div[2]/div[1]/table/tbody/tr[1]/td[1]', 'Textbox')
        .click('//*[@id="saveFormObjectChanges"]')
        .pause(3000)
        .setValue('//*[@id="searchAutomation"]', browser.globals.searchKeywordAutomation)
        // .saveScreenshot('tests/e2e/reports/automation32.png')
        .waitForElementVisible('//*[@id="cards-container"]/div/div[2]/div[4]/div[2]/button', 1000)
        .click('//*[@id="cards-container"]/div/div[2]/div[4]/div[2]/button') //open menu
        // .saveScreenshot('tests/e2e/reports/automation33.png')
        .pause(1000)
        .keys(browser.Keys.ARROW_DOWN).keys(browser.Keys.ARROW_DOWN).keys(browser.Keys.ARROW_DOWN) //select Modify Form
        .keys(browser.Keys.ENTER)
        .pause(3000)
        .assert.containsText('//*[@id="form-container"]/div/div/div[2]/div[1]/table/tbody/tr[1]/td[1]', 'Textbox')
        // .saveScreenshot('tests/e2e/reports/automation34.png')  
        .click('//*[@id="toolbar"]/a') //back
        .pause(1000)
        // .saveScreenshot('tests/e2e/reports/automation35.png')
    },

    'View history': function (browser) {
        browser
        .setValue('//*[@id="searchAutomation"]', browser.globals.searchKeywordAutomation)
        // .saveScreenshot('tests/e2e/reports/automation36.png')
        .waitForElementVisible('//*[@id="cards-container"]/div/div[2]/div[4]/div[2]/button', 1000)
        .click('//*[@id="cards-container"]/div/div[2]/div[4]/div[2]/button') //open menu
        // .saveScreenshot('tests/e2e/reports/automation37.png')
        .pause(1000)
        .keys(browser.Keys.ARROW_DOWN).keys(browser.Keys.ARROW_DOWN).keys(browser.Keys.ARROW_DOWN).keys(browser.Keys.ARROW_DOWN) //select View History
        .keys(browser.Keys.ENTER)
        .pause(3000)
        .assert.containsText('//*[@id="form-container"]/div/div/h1', 'Trigger History')
        .assert.elementPresent('//*[@id="form-container"]/div/div/div[2]/div/div[1]/table/tbody/tr/td[1]')
        .pause(3000)
        .click('//*[@id="toolbar"]/a') //back to list
        // .saveScreenshot('tests/e2e/reports/automation38.png')
    }
};
