# SLS Playwright Automation - Executable Distribution

## Quick Start

1. **Create your data file:**
   - Copy `data-sample.csv` to `data.csv`
   - Edit `data.csv` with your teacher email addresses
   - Format: `SerialNo,Email`

2. **Run the automation:**
   - **Windows:** Double-click `sls-playwright-automation-win.exe`
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
