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
  const csvFilePath = path.join(__dirname, 'scienceNT2024.csv');

  fs.createReadStream('scienceNT2024.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Start automation after reading CSV
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
