# 📤 Sharing Guide - How to Share This Automation

This guide explains how to share the SLS Teacher Addition Automation with other people and how they can run it on their computers.

## 🎯 Quick Summary for Recipients

**What they need:**
1. Node.js (version 16+)
2. The automation files
3. Their own `data.csv` with teacher emails
4. 5 minutes to set up

**What they get:**
- Automated teacher addition to SLS classes
- No manual clicking required
- Progress tracking and error reports

---

## 📁 Method 1: ZIP File Sharing (Easiest)

### For You (Sender):

1. **Create a ZIP file:**
   ```bash
   cd ..
   zip -r SLS-Playwright-Automation.zip SLS-Playwright-Automation/
   ```
   
   **Or on Mac/Windows:**
   - Right-click the `SLS-Playwright-Automation` folder
   - Select "Compress" (Mac) or "Send to > Compressed folder" (Windows)

2. **Share the ZIP file via:**
   - Email attachment
   - Google Drive / OneDrive
   - USB drive
   - Slack / Teams
   - WeTransfer

### For Recipient:

1. **Download and extract** the ZIP file
2. **Open Terminal/Command Prompt**
3. **Navigate to folder:**
   ```bash
   cd path/to/SLS-Playwright-Automation
   ```
4. **Run setup:**
   ```bash
   ./install.sh
   ```
   (Or `npm install` then `npx playwright install`)
5. **Create their data.csv** (see DATA-SETUP.md)
6. **Run automation:**
   ```bash
   npm start
   ```

---

## 📧 Method 2: Email Instructions

### Email Template:

```
Subject: SLS Teacher Addition Automation Tool

Hi [Name],

I'm sharing an automation tool that can help you add teachers as students in SLS automatically. Instead of clicking manually for each teacher, this tool processes your entire list automatically.

ATTACHED: SLS-Playwright-Automation.zip

SETUP (5 minutes):
1. Extract the ZIP file to your Desktop
2. Install Node.js from: https://nodejs.org/ (if not already installed)
3. Open Terminal/Command Prompt
4. Navigate to the folder: cd Desktop/SLS-Playwright-Automation
5. Run: ./install.sh (Mac/Linux) or npm install (Windows)
6. Create your data.csv file (see DATA-SETUP.md for help)
7. Run: npm start

WHAT IT DOES:
- Opens browser to SLS login (you login manually)
- Asks for your class group ID
- Automatically processes all teachers from your CSV
- Provides progress updates and error reports
- Takes screenshots if anything goes wrong

HELP FILES:
- QUICKSTART.md - 5-minute setup guide
- DATA-SETUP.md - How to prepare your teacher list
- README.md - Complete documentation

Let me know if you need help!
```

---

## ☁️ Method 3: Cloud Storage Sharing

### Google Drive / OneDrive:

1. **Upload the folder** to your cloud storage
2. **Share the folder** with view/download permissions
3. **Send them the link** with instructions:

```
Hi! I've shared an SLS automation tool with you:

LINK: [Your shared folder link]

SETUP:
1. Download the entire folder
2. Follow the QUICKSTART.md guide
3. You'll need Node.js installed first

This will automate adding teachers as students in SLS. Let me know if you need help!
```

---

## 💻 Method 4: GitHub Repository (Advanced)

### For You:

1. **Create a GitHub repository**
2. **Upload all files** (except logs/ and screenshots/)
3. **Share the repository URL**

### For Recipients:

1. **Clone or download** from GitHub
2. **Follow README.md** instructions
3. **Run setup and automation**

---

## 🏢 Method 5: Network/Shared Drive (Organizations)

### For Organizations:

1. **Place folder** on shared network drive
2. **Send location** to colleagues
3. **Include setup instructions**

### Network Path Example:
```
\\server\shared\Tools\SLS-Playwright-Automation\
```

---

## 📋 What Recipients Need to Know

### System Requirements:
- **Windows 10+**, **macOS 10.14+**, or **Linux**
- **Node.js 16+** (free download from nodejs.org)
- **Internet connection**
- **SLS account** with admin permissions

### Files They'll Receive:
```
SLS-Playwright-Automation/
├── 📄 QUICKSTART.md          ← Start here!
├── 📄 DATA-SETUP.md          ← How to prepare data
├── 📄 README.md              ← Full documentation
├── 🔧 install.sh             ← One-click setup
├── 📊 data-sample.csv        ← Example format
├── ⚙️ addTeachersPlaywright.js ← Main script
├── ⚙️ config.json            ← Settings
├── ⚙️ package.json           ← Dependencies
└── 📁 logs/, screenshots/    ← Will be created
```

### What They Need to Do:
1. **Install Node.js** (if not already installed)
2. **Extract/download** the automation files
3. **Run the setup** script or commands
4. **Create their data.csv** with teacher emails
5. **Run the automation**

---

## 🆘 Support Instructions for Recipients

### If They Get Stuck:

1. **Check the guides:**
   - QUICKSTART.md for basic setup
   - DATA-SETUP.md for CSV file help
   - README.md for detailed troubleshooting

2. **Common issues:**
   - **Node.js not installed**: Download from nodejs.org
   - **CSV format wrong**: Check DATA-SETUP.md examples
   - **Permission errors**: Run as administrator/sudo

3. **Contact you with:**
   - Screenshot of error message
   - What step they're stuck on
   - Their operating system (Windows/Mac/Linux)

---

## 🔒 Security Notes

### What to Tell Recipients:

- **Safe to use**: No credentials stored in files
- **Local only**: Runs on their computer, not cloud
- **Open source**: They can inspect all code
- **No data collection**: Logs stay on their machine

### What NOT to Share:

- ❌ Your personal data.csv file
- ❌ Log files with email addresses
- ❌ Screenshots with sensitive info
- ❌ Your SLS credentials

---

## 📞 Quick Help Script

### Give Recipients This Checklist:

```
□ Node.js installed? (node --version)
□ Files extracted to a folder?
□ Ran setup? (./install.sh or npm install)
□ Created data.csv with @moe.edu.sg emails?
□ SLS account ready with admin permissions?

If all checked, run: npm start
```

---

## 🎉 Success Message Template

### When It Works:

```
Great! The automation should now be running. You'll see:

1. Browser opens to SLS login page
2. Login manually, then press Enter in terminal
3. Enter your class group ID when prompted
4. Watch it automatically process your teachers!

Check the logs/ folder for detailed reports.
```

---

**Remember: Each person needs to create their own `data.csv` file with their specific teacher emails. The sample file is just for reference!**
