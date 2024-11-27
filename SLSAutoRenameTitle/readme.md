# Automating SLS Login and Updating MOE Modules with Playwright

## Overview

This guide provides a step-by-step tutorial for setting up a Playwright script to automate logging into the SLS platform and performing module updates. It's designed for beginners and includes comprehensive instructions for implementation.

## Table of Contents

1. [Install Node.js](#1-install-nodejs)
2. [Set Up Project](#2-set-up-project)
3. [Prepare CSV File](#3-prepare-csv-file)
4. [Write Automation Script](#4-write-automation-script)
5. [Run the Script](#5-run-the-script)
6. [Troubleshooting](#6-troubleshooting)
7. [Optional Enhancements](#7-optional-enhancements)

## 1. Install Node.js

### Prerequisites
- Visit the [Node.js official website](https://nodejs.org/)
- Download the LTS version (recommended for most users)

### Verify Installation
Open a terminal and run:
```bash
node -v
npm -v
```

## 2. Set Up Project

Create and initialize the project:
```bash
# Create project directory
mkdir playwright-sls
cd playwright-sls

# Initialize Node.js project
npm init -y

# Install required packages
npm install playwright prompt-sync csv-parser
```

## 3. Prepare CSV File

Create a file named `scienceNT2024.csv` with the following format:

```csv
LessonAdminURL,LessonTitle
https://example.com/lesson1,Lesson 1 Title
https://example.com/lesson2,Lesson 2 Title
```

## 4. Write Automation Script

Create `sls-automation.js` with the following content:

```javascript
const { chromium } = require('playwright');
const fs = require('fs');
const csv = require('csv-parser');
const prompt = require('prompt-sync')({ sigint: true });

(async () => {
  const results = [];

  // Prompt for login credentials
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
```

## 5. Run the Script

Execute the script:
```bash
node sls-automation.js
```

Follow the prompts:
- Enter your SLS Username
- Enter your SLS Password (input will be masked)

## 6. Troubleshooting

### Common Issues
- **Credentials**: Verify username and password
- **Selectors**: Update script if website layout changes
- **Dependencies**: Reinstall packages
  ```bash
  npm install playwright csv-parser prompt-sync
  ```
- **Browser Issues**: Install Chromium
  ```bash
  npx playwright install
  ```

## 7. Optional Enhancements

### Save Login Session
```javascript
await context.storageState({ path: 'authState.json' });
```

### Run in Headless Mode
```javascript
const browser = await chromium.launch({ headless: true });
```

### Create Executable
```bash
npm install -g pkg
pkg sls-automation.js
```

## Conclusion

You've now created a Playwright script to automate SLS platform interactions. This foundation can be expanded to automate more tasks efficiently.

## Disclaimer

Ensure you have proper authorization before automating interactions with any platform.

## License

[Insert appropriate license here]
