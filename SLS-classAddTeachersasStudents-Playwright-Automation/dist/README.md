# SLS Playwright Automation - Executable Distribution

## 🚀 Download Latest Version

### Windows Users - Choose Your Version:

#### 🏫 For SSOE/School Networks (Recommended)
**[📥 Download SSOE Version (868MB)](https://github.com/lookang/playWright/releases/download/SSOE/sls-playwright-automation-win-SSOE.exe)**
- ✅ **Bundled Chromium browser** - no downloads needed
- ✅ **Works on restricted networks** - perfect for school computers
- ✅ **No IT approval required** - completely self-contained
- ✅ **Eliminates browser errors** - solves "Executable doesn't exist" issues

#### 💻 For Personal/Unrestricted Networks
**[📥 Download Regular Version (45MB)](https://github.com/lookang/playWright/releases/download/SSOE/sls-playwright-automation-win.exe)**
- ✅ Smaller download size
- ✅ Automatic browser installation on first run

### Mac/Linux Users:
- **[📥 Download macOS Version (59MB)](https://github.com/lookang/playWright/releases/download/SSOE/sls-playwright-automation-macos)**
- **[📥 Download Linux Version (53MB)](https://github.com/lookang/playWright/releases/download/SSOE/sls-playwright-automation-linux)**

---

## Quick Start

1. **Download the appropriate version** from the links above
2. **Create your data file:**
   - Copy `data-sample.csv` to `data.csv`
   - Edit `data.csv` with your teacher email addresses
   - Format: `SerialNo,Email`

3. **Run the automation:**
   - **Windows:** Double-click the downloaded `.exe` file
   - **macOS:** Double-click `sls-playwright-automation-macos`
   - **Linux:** Run `./sls-playwright-automation-linux` in terminal

## Required Files

Make sure these files are in the same folder as the executable:
- `config.json` - Configuration settings (already included)
- `data.csv` - Your teacher email list (create from data-sample.csv)

## Data File Format

Your `data.csv` should look like this:
```
SerialNo,Email
1,teacher1@moe.edu.sg
2,teacher2@moe.edu.sg
3,teacher3@moe.edu.sg
```

## What the automation does

1. Opens a browser and navigates to SLS login
2. Waits for you to login manually
3. Asks for your class group ID
4. Automatically adds each teacher from your CSV as a student to the class group
5. Generates a report of successful and failed additions

## Troubleshooting

- Make sure `config.json` and `data.csv` are in the same folder as the executable
- Ensure your CSV file uses the correct format with headers
- Check the `logs` folder for detailed error messages
- Screenshots are saved in the `screenshots` folder when errors occur

## System Requirements

- No Node.js installation required (executables are self-contained)
- Internet connection required
- Modern web browser compatibility (Chromium is bundled)
