# 🚀 Quick Start Guide

Get up and running with SLS Teacher Addition Automation in 5 minutes!

## Step 1: Prerequisites ✅

Make sure you have:
- **Node.js** (version 16+) - [Download here](https://nodejs.org/)
- **Your CSV file** with teacher emails
- **SLS account** with admin permissions

## Step 2: Installation 📦

### Option A: Automatic Installation (Recommended)
```bash
cd SLS-Playwright-Automation
./install.sh
```

### Option B: Manual Installation
```bash
cd SLS-Playwright-Automation
npm install
npm run install-browsers
```

## Step 3: Prepare Your Data 📊

**📋 You need to create your own `data.csv` file with your teacher emails.**

### Quick Setup:
1. **Copy the sample:** `cp data-sample.csv data.csv`
2. **Edit `data.csv`** with your actual teacher emails
3. **Format must be:**
   ```csv
   SerialNo,Email
   1,john.doe@moe.edu.sg
   2,jane.smith@moe.edu.sg
   3,bob.wilson@moe.edu.sg
   ```

### 📖 Need detailed help?
**Read the complete guide:** `DATA-SETUP.md` - covers Excel, Google Sheets, and troubleshooting!

## Step 4: Run the Automation 🤖

```bash
npm start
```

## Step 5: Follow the Prompts 👆

1. **Browser opens** → Complete SLS login manually
2. **Press Enter** in terminal when logged in
3. **Enter Class Group ID** when prompted
4. **Sit back and watch** the automation work!

## What Happens Next? 📈

- ✅ Each teacher email is processed automatically
- 📝 Progress is logged in real-time
- 📸 Screenshots saved on errors
- 📊 Final report generated in `logs/` folder

## Quick Tips 💡

- **First time?** Keep browser visible (`"headless": false` in config.json)
- **Having issues?** Check the `logs/` folder for details
- **Need to stop?** Press `Ctrl+C` in terminal
- **Want to resume?** Just run `npm start` again

## Need Help? 🆘

1. Check `README.md` for detailed instructions
2. Look at error screenshots in `screenshots/` folder
3. Review logs in `logs/` folder
4. Verify your CSV format and SLS permissions

---

**That's it! You're ready to automate teacher additions to SLS! 🎉**
