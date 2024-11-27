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

Step 2: Set Up a New Project
Open your terminal and create a new folder for the project:

bash
Copy code
mkdir playwright-sls
cd playwright-sls
Initialize a new Node.js project:

bash
Copy code
npm init -y
Install the required packages:

bash
Copy code
npm install playwright prompt-sync csv-parser
Step 3: Prepare a CSV File
Create a file named scienceNT2024.csv in the project folder.

Format the file with the following columns (remove spaces in the column names):

csv
Copy code
LessonAdminURL,LessonTitle
https://example.com/lesson1,Lesson 1 Title
https://example.com/lesson2,Lesson 2 Title
Add additional rows as needed, following the same format.

Step 4: Write the Automation Script
Create a new file called sls-automation.js in the project folder.

Copy and paste the following code into the file:

javascript
Copy code
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
  const csvFilePath = path.resolve('scienceNT2024.csv');

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

      if (i === 0) {
        await performLogin(page, username, password);
      }

      await visitAndEditLesson(page, LessonAdminURL, LessonTitle);
    }

    await browser.close();
  }

  async function performLogin(page, username, password) {
    await page.goto('https://vle.learning.moe.edu.sg/login');
    await page.getByRole('button', { name: 'Login With SLS' }).click();
    await page.getByPlaceholder('SLS Username').fill(username);
    await page.getByPlaceholder('SLS Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
  }

  async function visitAndEditLesson(page, LessonAdminURL, LessonTitle) {
    const modifiedURL = LessonAdminURL.replace(/^https?:\/\//, '');
    await page.goto(`https://${modifiedURL}`);
    console.log(`Visiting: https://${modifiedURL}`);
  }
})();
Step 5: Run the Script
Open your terminal in the project folder.

Run the script using Node.js:

bash
Copy code
node sls-automation.js
Follow the prompts:

Enter your SLS Username.
Enter your SLS Password (input will be masked for security).
The script will:

Launch a browser.
Log into the SLS platform using the provided credentials.
Visit each URL in the CSV and perform the specified actions.
Step 6: Troubleshooting
If the script doesn’t work as expected, consider the following:

Credentials: Ensure the username and password you entered are correct.

Selectors: If the website’s layout changes, you may need to update the selectors in the script. Use the Playwright Inspector to debug.

Dependencies: Verify that the required packages are installed by running:

bash
Copy code
npm install playwright csv-parser prompt-sync
Browser Issues: If the browser doesn’t open, install Chromium by running:

bash
Copy code
npx playwright install
Optional Enhancements
Save Sessions: Save the login session to avoid entering credentials every time:

javascript
Copy code
await context.storageState({ path: 'authState.json' });
Headless Mode: Run the browser in the background:

javascript
Copy code
const browser = await chromium.launch({ headless: true });
Package as Executable: Create a standalone executable for easy distribution:

bash
Copy code
npm install -g pkg
pkg sls-automation.js
Conclusion
Congratulations! You have successfully set up and executed a Playwright script to automate SLS login and perform actions based on a CSV file. This setup serves as a foundation for automating more tasks on the SLS platform. Experiment with Playwright's features to expand your automation capabilities!
