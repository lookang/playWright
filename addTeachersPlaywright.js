#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs-extra');
const csv = require('csv-parser');
const path = require('path');

// Load configuration - look for config.json relative to the script location
const getConfigPath = () => {
    // Try current directory first
    if (fs.existsSync('config.json')) {
        return 'config.json';
    }
    // Try relative to the executable location
    const execDir = path.dirname(process.execPath);
    const configPath = path.join(execDir, 'config.json');
    if (fs.existsSync(configPath)) {
        return configPath;
    }
    // Try relative to the script location
    const scriptDir = path.dirname(__filename);
    const scriptConfigPath = path.join(scriptDir, 'config.json');
    if (fs.existsSync(scriptConfigPath)) {
        return scriptConfigPath;
    }
    throw new Error('config.json not found. Please ensure config.json is in the same directory as the executable.');
};

const config = JSON.parse(fs.readFileSync(getConfigPath(), 'utf8'));

class SLSAutomation {
    constructor() {
        this.browser = null;
        this.page = null;
        this.logFile = path.join('logs', `automation-${new Date().toISOString().slice(0, 10)}.log`);
        this.errors = [];
        this.processed = 0;
        this.successful = 0;
    }

    async log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] ${message}`;
        console.log(logMessage);
        
        // Ensure logs directory exists
        await fs.ensureDir('logs');
        await fs.appendFile(this.logFile, logMessage + '\n');
    }

    async takeScreenshot(name) {
        if (config.settings.screenshotOnError && this.page) {
            const screenshotPath = path.join('screenshots', `${name}-${Date.now()}.png`);
            await fs.ensureDir('screenshots');
            await this.page.screenshot({ path: screenshotPath, fullPage: true });
            await this.log(`Screenshot saved: ${screenshotPath}`);
            return screenshotPath;
        }
    }

    async readCSVData() {
        // Find data.csv file - look in multiple locations
        const getDataPath = () => {
            // Try current directory first
            if (fs.existsSync('data.csv')) {
                return 'data.csv';
            }
            // Try relative to the executable location
            const execDir = path.dirname(process.execPath);
            const dataPath = path.join(execDir, 'data.csv');
            if (fs.existsSync(dataPath)) {
                return dataPath;
            }
            // Try relative to the script location
            const scriptDir = path.dirname(__filename);
            const scriptDataPath = path.join(scriptDir, 'data.csv');
            if (fs.existsSync(scriptDataPath)) {
                return scriptDataPath;
            }
            return null;
        };

        const dataPath = getDataPath();
        if (!dataPath) {
            throw new Error(`
❌ data.csv file not found!

📋 You need to create your data.csv file first:

Quick setup:
1. Copy sample: cp data-sample.csv data.csv
2. Edit data.csv with your teacher emails

📖 For detailed help, read: DATA-SETUP.md
(Covers Excel, Google Sheets, and troubleshooting)

Expected format:
SerialNo,Email
1,teacher1@moe.edu.sg
2,teacher2@moe.edu.sg
            `);
        }

        return new Promise((resolve, reject) => {
            const results = [];
            fs.createReadStream(dataPath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    this.log(`Loaded ${results.length} records from CSV`);
                    resolve(results);
                })
                .on('error', (err) => {
                    reject(new Error(`
❌ Error reading data.csv: ${err.message}

📖 Check DATA-SETUP.md for troubleshooting help.

Common issues:
- File format should be UTF-8
- Header must be: SerialNo,Email
- No extra spaces around commas
                    `));
                });
        });
    }

    async initBrowser() {
        await this.log('Initializing browser...');
        
        // Check if browsers are installed, if not, install them
        try {
            await this.log('Checking Playwright browser installation...');
            this.browser = await chromium.launch({
                headless: config.settings.headless,
                slowMo: config.settings.slowMo
            });
        } catch (error) {
            if (error.message.includes("Executable doesn't exist")) {
                await this.log('Playwright browsers not found. Installing browsers...', 'WARN');
                await this.log('This is a one-time setup and may take a few minutes.');
                
                try {
                    const { execSync } = require('child_process');
                    
                    // Try different installation approaches for SSOE/restricted environments
                    const installCommands = [
                        'npx playwright install chromium',
                        'npx playwright install chromium --with-deps',
                        'npm exec playwright install chromium',
                        'node_modules\\.bin\\playwright install chromium'
                    ];
                    
                    let installSuccess = false;
                    let lastError = null;
                    
                    for (const command of installCommands) {
                        try {
                            await this.log(`Trying: ${command}`);
                            execSync(command, { 
                                stdio: 'pipe',
                                timeout: 300000, // 5 minutes timeout
                                env: { ...process.env, PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '0' }
                            });
                            installSuccess = true;
                            await this.log(`Browser installation completed with: ${command}`);
                            break;
                        } catch (cmdError) {
                            lastError = cmdError;
                            await this.log(`Command failed: ${command}`, 'WARN');
                            continue;
                        }
                    }
                    
                    if (!installSuccess) {
                        throw new Error(`All installation methods failed. Last error: ${lastError.message}`);
                    }
                    
                    // Retry browser launch
                    this.browser = await chromium.launch({
                        headless: config.settings.headless,
                        slowMo: config.settings.slowMo
                    });
                    
                } catch (installError) {
                    // Enhanced error message with SSOE-specific guidance
                    throw new Error(`
❌ Failed to install Playwright browsers automatically.

🏫 SSOE/School Network Users:
Your network may have restrictions that prevent automatic browser downloads.

📋 Manual Setup Options:

Option 1 - Try manual command:
1. Open Command Prompt as Administrator
2. Navigate to the folder containing this executable
3. Run: npx playwright install
4. Run the automation again

Option 2 - Use portable browser:
1. Download portable Chrome/Chromium
2. Contact IT support for browser installation assistance

Option 3 - Run on personal device:
1. Use this tool on a personal computer with internet access
2. Or ask IT to whitelist Playwright browser downloads

🔧 Technical Details:
- Error: ${installError.message}
- This is likely due to network security policies
- Contact your IT administrator if the issue persists

💡 Alternative: Try running this on a personal device or ask IT to install Playwright browsers manually.
                    `);
                }
            } else {
                throw error;
            }
        }
        
        this.page = await this.browser.newPage();
        
        // Set default timeout
        this.page.setDefaultTimeout(config.timeouts.default);
        
        // Set viewport
        await this.page.setViewportSize({ width: 1280, height: 720 });
        
        await this.log('Browser initialized successfully');
    }

    async login() {
        await this.log('Navigating to login page...');
        await this.page.goto(config.urls.login, { 
            waitUntil: 'networkidle',
            timeout: config.timeouts.navigation 
        });
        
        await this.log('Please complete the login process manually...');
        await this.log('Press Enter in the terminal when you have logged in and are ready to continue...');
        
        // Wait for user input
        await new Promise(resolve => {
            process.stdin.once('data', () => resolve());
        });
        
        await this.log('Continuing with automation...');
    }

    async navigateToClassGroup(classGroupId) {
        const url = `${config.urls.baseClassGroup}${classGroupId}?tab=admin`;
        await this.log(`Navigating to class group: ${url}`);
        
        await this.page.goto(url, { 
            waitUntil: 'networkidle',
            timeout: config.timeouts.navigation 
        });
        
        await this.page.waitForTimeout(config.delays.afterClick);
    }

    async closeAnyOpenModals() {
        try {
            await this.log('Checking for open modals to close...');
            
            // Try pressing Escape multiple times
            for (let i = 0; i < 3; i++) {
                await this.page.keyboard.press('Escape');
                await this.page.waitForTimeout(300);
            }
            
            // Try to click any close buttons that might be visible
            const closeSelectors = [
                'button[aria-label="Close"]',
                'button.bx--modal-close',
                '.bx--modal-close',
                '[data-modal-close]',
                'button:has-text("Close")',
                'button:has-text("Cancel")',
                '.close-button',
                '.modal-close',
                '[class*="close"]',
                'button[class*="close"]'
            ];
            
            let modalsClosed = 0;
            for (const selector of closeSelectors) {
                try {
                    const elements = await this.page.locator(selector);
                    const count = await elements.count();
                    
                    for (let i = 0; i < count; i++) {
                        const element = elements.nth(i);
                        if (await element.isVisible({ timeout: 500 })) {
                            await element.click();
                            await this.page.waitForTimeout(500);
                            modalsClosed++;
                            await this.log(`Closed modal dialog using selector: ${selector}`);
                        }
                    }
                } catch (e) {
                    // Continue to next selector
                }
            }
            
            // Check for any visible modal containers and try to close them
            const modalContainerSelectors = [
                '.bx--modal.is-visible',
                '.content-subpage.is-visible',
                '.modal.show',
                '[class*="modal"][class*="visible"]'
            ];
            
            for (const selector of modalContainerSelectors) {
                try {
                    const modals = await this.page.locator(selector);
                    const count = await modals.count();
                    
                    if (count > 0) {
                        await this.log(`Found ${count} visible modal(s) with selector: ${selector}`);
                        // Try clicking outside the modal to close it
                        await this.page.click('body', { position: { x: 10, y: 10 } });
                        await this.page.waitForTimeout(500);
                    }
                } catch (e) {
                    // Continue
                }
            }
            
            if (modalsClosed > 0) {
                await this.log(`Successfully closed ${modalsClosed} modal dialog(s)`);
            }
            
        } catch (error) {
            await this.log(`Error in modal closing: ${error.message}`, 'DEBUG');
        }
    }

    async addTeacherAsStudent(email) {
        try {
            await this.log(`Processing teacher: ${email}`);
            
            // Close any open modals first
            await this.closeAnyOpenModals();
            
            // Click EDIT DETAILS button
            await this.log('Clicking EDIT DETAILS button...');
            await this.page.click(config.selectors.editDetailsButton);
            await this.page.waitForTimeout(config.delays.afterClick);
            
            // Click Add Student and wait for dropdown to appear
            await this.log('Clicking Add Student...');
            await this.page.click(config.selectors.addStudentSpan);
            await this.page.waitForTimeout(config.delays.afterClick);
            
            // Wait for the dropdown menu to appear and become visible
            await this.log('Waiting for dropdown menu to appear...');
            try {
                await this.page.waitForSelector(config.selectors.teacherAsStudentSpan, { 
                    state: 'visible', 
                    timeout: 10000 
                });
            } catch (error) {
                await this.log('Dropdown not visible, trying to click Add Student again...', 'WARN');
                await this.page.click(config.selectors.addStudentSpan);
                await this.page.waitForTimeout(2000);
                await this.page.waitForSelector(config.selectors.teacherAsStudentSpan, { 
                    state: 'visible', 
                    timeout: 10000 
                });
            }
            
            // Click Teacher as Student
            await this.log('Clicking Teacher as Student...');
            await this.page.click(config.selectors.teacherAsStudentSpan);
            await this.page.waitForTimeout(config.delays.afterClick);
            
            // Handle school selection
            await this.log('Selecting school...');
            await this.page.click(config.selectors.schoolInput);
            await this.page.waitForTimeout(config.delays.afterClick);
            await this.page.click(config.selectors.allSchoolsDiv);
            await this.page.waitForTimeout(config.delays.afterClick);
            
            // Search for teacher
            await this.log(`Searching for teacher: ${email}`);
            await this.page.click(config.selectors.findTeachersInput);
            await this.page.fill(config.selectors.findTeachersInput, '');
            await this.page.fill(config.selectors.findTeachersInput, email);
            await this.page.press(config.selectors.findTeachersInput, 'Enter');
            
            // Wait for search results
            await this.page.waitForTimeout(config.delays.afterSearch);
            
            // Check if teacher was found and select
            const checkbox = await this.page.locator(config.selectors.firstCheckbox).first();
            if (await checkbox.isVisible()) {
                await this.log('Teacher found, selecting...');
                await checkbox.click();
                await this.page.waitForTimeout(config.delays.afterClick);
                
                // Click Add button
                await this.log('Clicking Add button...');
                try {
                    // Check if Add button is enabled
                    const addButton = await this.page.locator(config.selectors.addButton).first();
                    const isEnabled = await addButton.isEnabled();
                    
                    if (!isEnabled) {
                        await this.log(`Teacher ${email} may already be added to this class (Add button disabled)`, 'WARN');
                        await this.takeScreenshot(`teacher-already-added-${email.replace('@', '_at_')}`);
                        return false;
                    }
                    
                    await addButton.click();
                    await this.page.waitForTimeout(config.delays.afterClick);
                } catch (error) {
                    await this.log(`Failed to click Add button for ${email}: ${error.message}`, 'WARN');
                    return false;
                }
                
                // Click Save button
                await this.log('Saving changes...');
                await this.page.click(config.selectors.saveButton);
                await this.page.waitForTimeout(config.delays.afterClick);
                
                // Handle OK button if it appears
                try {
                    await this.page.waitForSelector(config.selectors.okButton, { timeout: 5000 });
                    await this.page.click(config.selectors.okButton);
                    await this.page.waitForTimeout(config.delays.afterClick);
                } catch (e) {
                    // OK button might not appear, continue
                }
                
                await this.log(`Successfully added teacher: ${email}`);
                this.successful++;
                return true;
                
            } else {
                await this.log(`Teacher not found: ${email}`, 'WARN');
                await this.takeScreenshot(`teacher-not-found-${email.replace('@', '_at_')}`);
                return false;
            }
            
        } catch (error) {
            await this.log(`Error processing ${email}: ${error.message}`, 'ERROR');
            await this.takeScreenshot(`error-${email.replace('@', '_at_')}`);
            this.errors.push({ email, error: error.message });
            return false;
        }
    }

    async processAllTeachers() {
        try {
            const data = await this.readCSVData();
            
            if (data.length === 0) {
                await this.log('No data found in CSV file', 'ERROR');
                return;
            }

            // Get class group ID from user
            console.log('\nPlease enter your class group ID (the part after /view/ in the URL):');
            console.log('Example: if URL is https://vle.learning.moe.edu.sg/class-group/view/85813c71-2a74-4b4d-af3e-2b5a43883df3?tab=admin');
            console.log('Enter: 85813c71-2a74-4b4d-af3e-2b5a43883df3');
            
            const classGroupId = await new Promise(resolve => {
                process.stdin.once('data', (data) => {
                    let input = data.toString().trim();
                    // Extract just the UUID if user pasted the full URL
                    if (input.includes('/class-group/view/')) {
                        const match = input.match(/\/class-group\/view\/([a-f0-9-]+)/);
                        if (match) {
                            input = match[1];
                        }
                    }
                    resolve(input);
                });
            });

            await this.navigateToClassGroup(classGroupId);
            
            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                this.processed++;
                
                await this.log(`\n--- Processing ${this.processed}/${data.length} ---`);
                
                if (!row.Email) {
                    await this.log(`Row ${i + 1}: No email found, skipping`, 'WARN');
                    continue;
                }
                
                const success = await this.addTeacherAsStudent(row.Email);
                
                if (!success) {
                    // Wait a bit before retrying or continuing
                    await this.page.waitForTimeout(2000);
                }
                
                // Small delay between processing
                await this.page.waitForTimeout(1000);
            }
            
        } catch (error) {
            await this.log(`Fatal error in processAllTeachers: ${error.message}`, 'ERROR');
            await this.takeScreenshot('fatal-error');
            throw error;
        }
    }

    async generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            processed: this.processed,
            successful: this.successful,
            failed: this.processed - this.successful,
            errors: this.errors
        };
        
        const reportPath = path.join('logs', `report-${new Date().toISOString().slice(0, 10)}.json`);
        await fs.writeJson(reportPath, report, { spaces: 2 });
        
        await this.log('\n=== AUTOMATION REPORT ===');
        await this.log(`Total processed: ${report.processed}`);
        await this.log(`Successful: ${report.successful}`);
        await this.log(`Failed: ${report.failed}`);
        await this.log(`Report saved: ${reportPath}`);
        
        if (this.errors.length > 0) {
            await this.log('\nErrors encountered:');
            this.errors.forEach(error => {
                this.log(`- ${error.email}: ${error.error}`, 'ERROR');
            });
        }
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            await this.log('Browser closed');
        }
    }

    async run() {
        try {
            await this.log('=== SLS Teacher Addition Automation Started ===');
            
            await this.initBrowser();
            await this.login();
            await this.processAllTeachers();
            await this.generateReport();
            
            await this.log('=== Automation completed successfully ===');
            
        } catch (error) {
            await this.log(`Fatal error: ${error.message}`, 'ERROR');
            await this.takeScreenshot('fatal-error');
            throw error;
        } finally {
            await this.cleanup();
        }
    }
}

// Main execution
async function main() {
    const automation = new SLSAutomation();
    
    try {
        await automation.run();
        process.exit(0);
    } catch (error) {
        console.error('Automation failed:', error);
        process.exit(1);
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    console.log('\nReceived SIGINT, cleaning up...');
    process.exit(0);
});

// Run if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = SLSAutomation;
