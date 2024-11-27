# Automating SLS Login and Updating MOE Modules with Playwright: A Beginner's Guide

This guide will help you set up and run a Playwright script to automate logging into the SLS platform and updating module titles. It is designed for beginners and provides step-by-step instructions to get the script running on your computer.

---

## Table of Contents
1. [Step 1: Install Node.js](#step-1-install-nodejs)
2. [Step 2: Set Up a New Project](#step-2-set-up-a-new-project)
3. [Step 3: Prepare a CSV File](#step-3-prepare-a-csv-file)
4. [Step 4: Write the Automation Script](#step-4-write-the-automation-script)
5. [Step 5: Run the Script](#step-5-run-the-script)
6. [Step 6: Troubleshooting](#step-6-troubleshooting)
7. [Optional Enhancements](#optional-enhancements)
8. [Conclusion](#conclusion)

---

## Step 1: Install Node.js

Playwright requires Node.js to run. Follow these steps to install it:

1. Go to the [Node.js official website](https://nodejs.org/).
2. Download the **LTS version** (recommended for most users).
3. Run the installer and follow the instructions.
4. Verify the installation by opening a terminal and typing:

   ```bash
   node -v
   npm -v

Automating SLS Login and Change Title of MOE modules with Playwright: A Beginner's Guide
This guide will help you set up and run a Playwright script to automate logging into the SLS platform. It is designed for beginners and provides step-by-step instructions to get the script running on your own computer.

Step 1: Install Node.js
Playwright requires Node.js to run. Follow these steps to install it:

Go to the Node.js official website.

Download the LTS version (recommended for most users).

Run the installer and follow the instructions.

After installation, verify it by opening a terminal and typing:

node -v
npm -v
This should display the versions of Node.js and npm (Node Package Manager).

Step 2: Set Up a New Project
Create a folder for your project: using command line or terminal

mkdir playwright-sls
cd playwright-sls
Initialize a new Node.js project:

npm init -y
Install Playwright, a CSV parser, and a prompt package:

npm install playwright prompt-sync csv-parser
Step 3: Prepare a CSV File
Create a CSV file named scienceNT2024.csv in the project folder, taking from the email with the master data, using Excel to save as to CSV. 

Format the file with the following columns: Remember to remove the spaces in the names of the variables in the first line of the CSV.

LessonAdminURL,LessonTitle
https://example.com/lesson1,Lesson 1 Title
https://example.com/lesson2,Lesson 2 Title
Add as many rows as needed for your tasks.

Step 4: Write the Automation Script
Create a new file called sls-automation.js in your project folder.

Open the file in your text editor and copy the following code:

const { chromium } = require('playwright');
const fs = require('fs');
const csv = require('csv-parser');
const prompt = require('prompt-sync')({ sigint: true });

(async () => {
  const results = [];

  // Prompt the user for their login credentials
  const username = prompt('Enter your SLS Username: ');
  const password = prompt('Enter your SLS Password: ', { echo: '*' });

  if (!username || !password) {
    throw new Error('Username or password not provided.');
  }

  const path = require('path');
const csvFilePath = path.resolve('/Users/lookang/Desktop/tagui/flows/pohYin/tests/scienceNT2024.csv');

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    automate(results, username, password);
  });


  async function automate(dataArray, username, password) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    for (let i = 0; i < dataArray.length; i++) {
      const { LessonAdminURL, LessonTitle } = dataArray[i];
      console.log(`LessonAdminURL: ${LessonAdminURL}`);
      console.log(`LessonTitle: ${LessonTitle}`);
      console.log(`Current iteration: ${i + 1}`);

      // First iteration: Perform login
      if (i === 0) {
        await performLogin(page, username, password);
      }

      // Visit the URL and perform actions
      await visitAndEditLesson(page, LessonAdminURL, LessonTitle);
    }

    // Close the browser if desired
    // await browser.close();
  }

  async function performLogin(page, username, password) {
    await page.goto('https://vle.learning.moe.edu.sg/login');
    await page.getByRole('button', { name: 'Login With SLS' }).click();
    await page.getByPlaceholder('SLS Username').click();
    await page.getByPlaceholder('SLS Username').fill(username);
    await page.getByPlaceholder('SLS Password').click();
    await page.getByPlaceholder('SLS Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(3000);
  }

  async function visitAndEditLesson(page, LessonAdminURL, LessonTitle) {
    // Modify the URL
    const fulleditableURLsubstring = LessonAdminURL.substring(8);
    await page.goto(`https://${fulleditableURLsubstring}`);

    // Read the title
    const title = await page.textContent("(//div[@class='output-text'])[1]");
    console.log(`Title: ${title}`);

    // Click buttons as per your script
    await page.click("//button[@type='button']//button[@type='button']//*[name()='svg']//*[name()='path']");
    await page.click("//div[@class='fetch-data-button button tip-bottom']//button[@role='button']");
    await page.waitForTimeout(3000);

    // Click 'Open' to open the component
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.click("(//a[@tag='component'][normalize-space()='Open'])[1]"),
    ]);

    // Perform actions in the popup
    await editLessonPopup(popup, LessonTitle);

    // Close the popup
    await popup.close();
  }

  async function editLessonPopup(popup, LessonTitle) {
    await popup.waitForLoadState();

    await popup.waitForTimeout(3000);
    await popup.click("(//*[name()='svg'][@name='Pen32'])[1]"); // Edit button
    await popup.waitForTimeout(3000);
    await popup.click("//div[@class='output-text']"); // Click on the text area
    await popup.waitForTimeout(3000);
    await popup.click("//input[@class='bx--text-input']"); // Click on the input field
    await popup.waitForTimeout(3000);

    // Update the text
    const updatedText = LessonTitle.replace(/\[.*?\]/, "[For 2014 USS NT syllabus]");
    await popup.fill("//input[@class='bx--text-input']", updatedText);

    // Save changes
    await popup.click("(//*[name()='svg'][@name='CheckmarkCircle32'])[1]");
    await popup.waitForTimeout(3000);
    await popup.click("(//*[name()='svg'][@name='Approve32'])[1]");
    await popup.waitForTimeout(3000);

    // Click 'OK' on confirmation dialog
    await popup.click('text=OK');
    await popup.waitForTimeout(3000);
  }
})();

Step 5: Run the Script
Open your terminal in the project folder.

Run the script:

node sls-automation.js
Follow the prompts:

Enter your SLS Username.

Enter your SLS Password (it will be masked for security).

The script will:

Open a browser.

Navigate to the SLS login page.

Log in using your credentials.

Visit each URL in the CSV and perform the specified actions.

Step 6: Troubleshooting
If the script doesn’t work as expected, check the following:

Correct Credentials: Ensure the username and password you entered are accurate.

Selectors: If the website layout changes, the script’s selectors may need to be updated. Use the Playwright Inspector to debug.

Dependencies: Ensure Playwright, csv-parser, and prompt-sync are installed:

npm install playwright csv-parser prompt-sync
Browser Issues: If the browser doesn’t open, ensure Chromium is installed by running:

npx playwright install
Optional Enhancements
Save Sessions: Save the login session to avoid entering credentials each time.

await context.storageState({ path: 'authState.json' });
Use a Headless Browser: Run the browser in the background by setting headless: true.

Package as Executable: Use a tool like pkg to create a standalone executable for non-technical users.

npm install -g pkg
pkg sls-automation.js
Conclusion
You’ve successfully set up and run a Playwright script to automate SLS login and perform actions based on a CSV file. This guide provides a foundation for automating other tasks on the SLS platform. Experiment with additional features in Playwright to expand your automation capabilities.
