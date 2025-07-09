# SLS Teacher Addition Automation

This project automates the process of adding teachers as students in the Singapore Learning Space (SLS) using Playwright. It's designed to replace the TagUI script with a more robust, reliable automation solution.

## Features

- ✅ **Cross-platform compatibility** (Windows, macOS, Linux)
- ✅ **No additional software installation** required (just Node.js)
- ✅ **CSV data processing** with error handling
- ✅ **Comprehensive logging** and progress tracking
- ✅ **Screenshot capture** on errors for debugging
- ✅ **Automatic report generation**
- ✅ **Configurable timeouts and delays**
- ✅ **Resume capability** if interrupted
- ✅ **Headless or visible browser** operation

## Prerequisites

- **Node.js** (version 16 or higher)
- **Internet connection**
- **Valid SLS account** with appropriate permissions

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd SLS-Playwright-Automation
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npm run install-browsers
   ```

## Setup

### 1. Prepare Your Data File

Ensure your `data.csv` file has the following format:
```csv
SerialNo,Email
1,teacher1@moe.edu.sg
2,teacher2@moe.edu.sg
3,teacher3@moe.edu.sg
```

### 2. Configure Settings (Optional)

Edit `config.json` to customize:
- **Timeouts**: Adjust waiting times for different operations
- **Delays**: Control the speed of automation
- **Selectors**: Update if SLS interface changes
- **Browser settings**: Enable/disable headless mode

```json
{
  "settings": {
    "headless": false,        // Set to true for background operation
    "slowMo": 500,           // Milliseconds between actions
    "screenshotOnError": true // Capture screenshots on errors
  }
}
```

## Usage

### Basic Usage

1. **Start the automation:**
   ```bash
   npm start
   ```
   or
   ```bash
   node addTeachersPlaywright.js
   ```

2. **Follow the prompts:**
   - The browser will open to the SLS login page
   - Complete the login process manually
   - Press Enter in the terminal when ready
   - Enter your class group ID when prompted

3. **Monitor progress:**
   - Watch the console output for real-time progress
   - Check the `logs/` folder for detailed logs
   - Screenshots of errors are saved in `screenshots/`

### Advanced Usage

**Run in headless mode:**
Edit `config.json` and set `"headless": true`, then run:
```bash
npm start
```

**Test run (dry run):**
```bash
npm test
```

## File Structure

```
SLS-Playwright-Automation/
├── addTeachersPlaywright.js    # Main automation script
├── package.json                # Node.js dependencies
├── config.json                 # Configuration settings
├── data.csv                    # Teacher email data
├── README.md                   # This file
├── logs/                       # Log files and reports
│   ├── automation-YYYY-MM-DD.log
│   └── report-YYYY-MM-DD.json
└── screenshots/                # Error screenshots
    └── error-*.png
```

## Configuration Options

### URLs
- `login`: SLS login page URL
- `baseClassGroup`: Base URL for class groups

### Selectors
All CSS/XPath selectors used to interact with the SLS interface. Update these if the interface changes.

### Timeouts
- `default`: General timeout for operations (30 seconds)
- `navigation`: Page navigation timeout (60 seconds)
- `search`: Teacher search timeout (10 seconds)

### Delays
- `afterClick`: Wait time after clicking elements
- `afterType`: Wait time after typing text
- `afterSearch`: Wait time after searching for teachers

## Troubleshooting

### Common Issues

1. **"Teacher not found" errors:**
   - Verify email addresses in CSV are correct
   - Check if teachers exist in the system
   - Ensure school selection is correct

2. **Timeout errors:**
   - Increase timeout values in `config.json`
   - Check internet connection stability
   - Verify SLS system is accessible

3. **Element not found errors:**
   - SLS interface may have changed
   - Update selectors in `config.json`
   - Check screenshots in `screenshots/` folder

4. **Login issues:**
   - Ensure you have valid SLS credentials
   - Complete 2FA if required
   - Wait for page to fully load before pressing Enter

### Debug Mode

1. **Enable visible browser:**
   Set `"headless": false` in `config.json`

2. **Slow down automation:**
   Increase `"slowMo"` value in `config.json`

3. **Check logs:**
   ```bash
   tail -f logs/automation-$(date +%Y-%m-%d).log
   ```

4. **View screenshots:**
   Check the `screenshots/` folder for error images

## Logs and Reports

### Log Files
- **Location**: `logs/automation-YYYY-MM-DD.log`
- **Content**: Detailed step-by-step execution log
- **Levels**: INFO, WARN, ERROR

### Reports
- **Location**: `logs/report-YYYY-MM-DD.json`
- **Content**: Summary of automation results
- **Format**: JSON with statistics and error details

Example report:
```json
{
  "timestamp": "2025-01-07T03:16:33.000Z",
  "processed": 10,
  "successful": 8,
  "failed": 2,
  "errors": [
    {
      "email": "invalid@moe.edu.sg",
      "error": "Teacher not found"
    }
  ]
}
```

## Security Notes

- **Never commit credentials** to version control
- **Use environment variables** for sensitive data if needed
- **Run on trusted networks** only
- **Keep logs secure** as they may contain email addresses

## Performance Tips

1. **Batch processing**: Process teachers in smaller batches if needed
2. **Network stability**: Ensure stable internet connection
3. **System resources**: Close unnecessary applications
4. **Timing**: Run during off-peak hours for better performance

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review log files for detailed error information
3. Examine screenshots for visual debugging
4. Verify your CSV data format
5. Ensure SLS system accessibility

## Version History

- **v1.0.0**: Initial release with full automation capabilities
- Converted from TagUI script to Playwright
- Added comprehensive error handling and logging
- Implemented CSV processing and reporting

## License

MIT License - See package.json for details
