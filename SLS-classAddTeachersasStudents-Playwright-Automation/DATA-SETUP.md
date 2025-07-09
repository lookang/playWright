# 📊 Data Setup Guide

This guide helps you prepare your teacher email data for the automation.

## Step 1: Create Your CSV File 📝

You need to create a file called `data.csv` in the `SLS-Playwright-Automation` folder.

### Method A: Using Excel or Google Sheets (Recommended for Beginners)

1. **Open Excel or Google Sheets**
2. **Create two columns:**
   - Column A: `SerialNo`
   - Column B: `Email`

3. **Add your data:**
   ```
   SerialNo | Email
   1        | john.doe@moe.edu.sg
   2        | jane.smith@moe.edu.sg
   3        | bob.wilson@moe.edu.sg
   ```

4. **Save as CSV:**
   - **Excel**: File → Save As → Choose "CSV (Comma delimited)" → Name it `data.csv`
   - **Google Sheets**: File → Download → Comma Separated Values (.csv) → Rename to `data.csv`

5. **Move the file** to your `SLS-Playwright-Automation` folder

### Method B: Using Text Editor (Advanced Users)

1. **Open any text editor** (Notepad, TextEdit, VS Code, etc.)
2. **Type your data** in this exact format:
   ```csv
   SerialNo,Email
   1,teacher1@moe.edu.sg
   2,teacher2@moe.edu.sg
   3,teacher3@moe.edu.sg
   ```
3. **Save as `data.csv`** in the `SLS-Playwright-Automation` folder

### Method C: Copy and Modify Sample

1. **Copy the sample file:**
   ```bash
   cp data-sample.csv data.csv
   ```
2. **Edit `data.csv`** with your actual teacher emails

## Step 2: Verify Your CSV Format ✅

Your `data.csv` file should look exactly like this:

```csv
SerialNo,Email
1,alice.teacher@moe.edu.sg
2,bob.instructor@moe.edu.sg
3,carol.educator@moe.edu.sg
4,david.professor@moe.edu.sg
```

### ⚠️ Important Rules:

- **First line must be:** `SerialNo,Email` (exactly as shown)
- **Email format:** Must be `@moe.edu.sg` domain for SLS to find teachers
- **No spaces** around commas
- **Each email** on a new line
- **No empty lines** at the end
- **File must be named** `data.csv` (not `data.csv.txt`)

## Step 3: Common Mistakes to Avoid ❌

### ❌ Wrong Format:
```csv
Serial No, Email Address
1, teacher@moe.edu.sg
```

### ❌ Extra Spaces:
```csv
SerialNo , Email
1 , teacher@moe.edu.sg
```

### ❌ Missing Header:
```csv
1,teacher@moe.edu.sg
2,teacher2@moe.edu.sg
```

### ✅ Correct Format:
```csv
SerialNo,Email
1,teacher@moe.edu.sg
2,teacher2@moe.edu.sg
```

## Step 4: Test Your File 🧪

Before running the automation, you can test if your CSV is valid:

```bash
node -e "
const csv = require('csv-parser');
const fs = require('fs');
let count = 0;
fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (row) => {
    count++;
    console.log(\`Row \${count}: \${row.Email}\`);
  })
  .on('end', () => console.log(\`✅ Found \${count} teachers\`))
  .on('error', (err) => console.log('❌ Error:', err.message));
"
```

## Step 5: File Location Check 📁

Make sure your file structure looks like this:

```
SLS-Playwright-Automation/
├── data.csv                    ← Your file goes here
├── data-sample.csv             ← Sample for reference
├── addTeachersPlaywright.js
├── package.json
└── ... (other files)
```

## Troubleshooting 🔧

### Problem: "Cannot find data.csv"
- **Solution**: Make sure the file is named exactly `data.csv` and is in the `SLS-Playwright-Automation` folder

### Problem: "No email found in row"
- **Solution**: Check that your header row is exactly `SerialNo,Email`

### Problem: "CSV parsing error"
- **Solution**: 
  1. Open your CSV in a text editor
  2. Make sure there are no special characters
  3. Save with UTF-8 encoding

### Problem: File shows as "data.csv.txt"
- **Solution**: 
  - **Windows**: Show file extensions in Explorer, then rename
  - **Mac**: Remove the `.txt` extension in Finder

## Need Help? 🆘

1. **Check the sample file**: Look at `data-sample.csv` for the correct format
2. **Use Excel/Google Sheets**: Easier for beginners than text editors
3. **Test with small data first**: Try with 2-3 teachers before running the full list
4. **Ask for help**: If you're still stuck, ask someone familiar with CSV files

---

**Once your `data.csv` is ready, you can run the automation with `npm start`! 🚀**
