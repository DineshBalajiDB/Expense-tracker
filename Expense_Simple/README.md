# Income & Expense Tracker

A modern, responsive web application for tracking your income and expenses in Indian Rupees (INR).

## Features

- ✅ **Date Tracking**: Record transactions with specific dates
- ✅ **Categories**: Organize transactions by categories (Income: Salary, Freelance, Investment, etc. | Expense: Food, Transport, Shopping, etc.)
- ✅ **Amount Tracking**: Track all amounts in INR with proper currency formatting
- ✅ **Total Calculations**: 
  - Total Income
  - Total Expenses
  - Balance (Income - Expenses)
- ✅ **Transaction History**: View all your transactions with filtering options
- ✅ **PDF Export**: Download comprehensive financial reports as PDF with summary and all transactions
- ✅ **Local Storage**: Data persists in your browser's local storage
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile devices
- ✅ **Modern UI**: Beautiful gradient design with smooth animations

## How to Use

### Local Development

1. **Clone or download** this repository
2. **Open** `index.html` in your web browser
   - Simply double-click the file, or
   - Right-click and select "Open with" → your preferred browser
3. **Start tracking** your income and expenses!

### Hosting on a Website

#### Option 1: Static Web Hosting (Recommended)

You can host this application on any static web hosting service:

- **GitHub Pages**: 
  1. Create a new repository on GitHub
  2. Upload all files (index.html, styles.css, script.js)
  3. Go to Settings → Pages → Select main branch
  4. Your site will be live at `https://yourusername.github.io/repository-name`

- **Netlify**:
  1. Drag and drop the folder to [Netlify Drop](https://app.netlify.com/drop), or
  2. Connect your GitHub repository to Netlify
  3. The `netlify.toml` configuration file is already included
  4. Your site will be live instantly

- **Vercel**:
  1. Install Vercel CLI: `npm i -g vercel`
  2. Run `vercel` in the project directory
  3. The `vercel.json` configuration file is already included
  4. Follow the prompts

- **Other Hosting Services**: 
  - Upload all files to your web hosting provider's public_html or www directory
  - Ensure index.html is in the root directory

#### Option 2: Using a Web Server

If you have Node.js installed:

```bash
# Install a simple HTTP server
npm install -g http-server

# Navigate to project directory
cd Expense_Tracker

# Start server
http-server

# Open browser to http://localhost:8080
```

## File Structure

```
Expense_Tracker/
├── index.html      # Main HTML structure
├── styles.css      # Styling and responsive design
├── script.js       # Application logic and functionality
├── netlify.toml    # Netlify deployment configuration
├── vercel.json     # Vercel deployment configuration
├── .gitignore      # Git ignore file
└── README.md       # This file
```

## Usage Instructions

1. **Add a Transaction**:
   - Select the date
   - Choose transaction type (Income or Expense)
   - Select a category
   - Enter the amount
   - (Optional) Add a description
   - Click "Add Transaction"

2. **View Summary**:
   - Balance: Shows your current balance (Income - Expenses)
   - Total Income: Sum of all income transactions
   - Total Expenses: Sum of all expense transactions

3. **Filter Transactions**:
   - Use the filter dropdowns to view:
     - All transactions
     - Income only
     - Expense only
     - By specific category

4. **Delete Transactions**:
   - Click the "Delete" button on any transaction to remove it

5. **Export to PDF**:
   - Click the "Download PDF" button in the Transaction History section
   - A comprehensive PDF report will be generated including:
     - Summary cards (Balance, Total Income, Total Expenses)
     - Complete transaction history with all details
     - Formatted in INR currency
     - Filename includes the current date (e.g., expense-report-2024-01-15.pdf)

## Data Storage

All data is stored locally in your browser's localStorage. This means:
- ✅ No server required
- ✅ Data persists between sessions
- ⚠️ Data is specific to the browser/device
- ⚠️ Clearing browser data will delete transactions

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge
- Opera

## Customization

### Adding New Categories

Edit the `categories` object in `script.js`:

```javascript
const categories = {
    income: ['Salary', 'Freelance', 'Your New Category'],
    expense: ['Food', 'Transport', 'Your New Category']
};
```

### Changing Currency

The app is configured for INR. To change currency, modify the `formatINR` function in `script.js`:

```javascript
function formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR', // Change to your currency code
        minimumFractionDigits: 2
    }).format(amount);
}
```

## License

Free to use and modify for personal or commercial purposes.

## Support

For issues or questions, please check the code comments or modify as needed for your requirements.

