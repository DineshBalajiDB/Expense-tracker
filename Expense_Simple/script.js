// Categories for income and expense
const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'],
    expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Other']
};

// Initialize transactions array
let transactions = [];

// Load transactions from localStorage
function loadTransactions() {
    const stored = localStorage.getItem('transactions');
    if (stored) {
        transactions = JSON.parse(stored);
    }
}

// Save transactions to localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Format amount in INR
function formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
}

// Update category dropdown based on type
function updateCategoryDropdown() {
    const type = document.getElementById('type').value;
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    categories[type].forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Update filter category dropdown
function updateFilterCategory() {
    const filterCategory = document.getElementById('filterCategory');
    const allCategories = [...new Set([...categories.income, ...categories.expense])];
    
    filterCategory.innerHTML = '<option value="all">All Categories</option>';
    allCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterCategory.appendChild(option);
    });
}

// Calculate totals
function calculateTotals() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const balance = totalIncome - totalExpense;
    
    document.getElementById('totalIncome').textContent = formatINR(totalIncome);
    document.getElementById('totalExpense').textContent = formatINR(totalExpense);
    document.getElementById('balance').textContent = formatINR(balance);
    
    // Update balance color based on positive/negative
    const balanceElement = document.getElementById('balance');
    if (balance >= 0) {
        balanceElement.style.color = '#10b981';
    } else {
        balanceElement.style.color = '#ef4444';
    }
}

// Display transactions
function displayTransactions() {
    const transactionsList = document.getElementById('transactionsList');
    const filterType = document.getElementById('filterType').value;
    const filterCategory = document.getElementById('filterCategory').value;
    
    // Filter transactions
    let filteredTransactions = transactions;
    
    if (filterType !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
    }
    
    if (filterCategory !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
    }
    
    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredTransactions.length === 0) {
        transactionsList.innerHTML = '<p class="empty-state">No transactions found. Add your first transaction above!</p>';
        return;
    }
    
    transactionsList.innerHTML = filteredTransactions.map((transaction, index) => {
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        
        return `
            <div class="transaction-item ${transaction.type}">
                <div class="transaction-details">
                    <div class="transaction-date">${formattedDate}</div>
                    <div class="transaction-category">${transaction.category}</div>
                    ${transaction.description ? `<div class="transaction-description">${transaction.description}</div>` : ''}
                </div>
                <div class="transaction-amount">${transaction.type === 'income' ? '+' : '-'}${formatINR(transaction.amount)}</div>
                <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">Delete</button>
            </div>
        `;
    }).join('');
}

// Add transaction
function addTransaction(event) {
    event.preventDefault();
    
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;
    
    if (!date || !category || amount <= 0) {
        alert('Please fill in all required fields with valid values.');
        return;
    }
    
    const transaction = {
        id: Date.now(),
        date: date,
        type: type,
        category: category,
        amount: amount,
        description: description
    };
    
    transactions.push(transaction);
    saveTransactions();
    
    // Reset form
    document.getElementById('transactionForm').reset();
    updateCategoryDropdown();
    
    // Set today's date as default
    document.getElementById('date').valueAsDate = new Date();
    
    calculateTotals();
    displayTransactions();
}

// Delete transaction
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveTransactions();
        calculateTotals();
        displayTransactions();
    }
}

// Generate PDF report
function generatePDF() {
    if (transactions.length === 0) {
        alert('No transactions to export. Please add some transactions first.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Calculate totals
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const balance = totalIncome - totalExpense;
    
    // Set up colors
    const primaryColor = [102, 126, 234];
    const incomeColor = [16, 185, 129];
    const expenseColor = [239, 68, 68];
    const textColor = [51, 51, 51];
    const lightGray = [243, 244, 246];
    
    let yPos = 20;
    
    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Income & Expense Tracker', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Financial Report', 105, 30, { align: 'center' });
    
    yPos = 50;
    
    // Summary Section
    doc.setTextColor(...textColor);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 14, yPos);
    yPos += 10;
    
    // Summary boxes
    const boxWidth = 58;
    const boxHeight = 30;
    const startX = 14;
    const spacing = 4;
    
    // Balance box
    doc.setFillColor(...primaryColor);
    doc.roundedRect(startX, yPos, boxWidth, boxHeight, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('BALANCE', startX + boxWidth/2, yPos + 8, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(formatINR(balance), startX + boxWidth/2, yPos + 20, { align: 'center' });
    
    // Income box
    doc.setFillColor(...incomeColor);
    doc.roundedRect(startX + boxWidth + spacing, yPos, boxWidth, boxHeight, 3, 3, 'F');
    doc.text('TOTAL INCOME', startX + boxWidth + spacing + boxWidth/2, yPos + 8, { align: 'center' });
    doc.setFontSize(14);
    doc.text(formatINR(totalIncome), startX + boxWidth + spacing + boxWidth/2, yPos + 20, { align: 'center' });
    
    // Expense box
    doc.setFillColor(...expenseColor);
    doc.roundedRect(startX + (boxWidth + spacing) * 2, yPos, boxWidth, boxHeight, 3, 3, 'F');
    doc.text('TOTAL EXPENSES', startX + (boxWidth + spacing) * 2 + boxWidth/2, yPos + 8, { align: 'center' });
    doc.setFontSize(14);
    doc.text(formatINR(totalExpense), startX + (boxWidth + spacing) * 2 + boxWidth/2, yPos + 20, { align: 'center' });
    
    yPos += boxHeight + 15;
    
    // Transactions Section
    doc.setTextColor(...textColor);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Transaction History', 14, yPos);
    yPos += 8;
    
    // Table header
    doc.setFillColor(...lightGray);
    doc.rect(14, yPos, 182, 8, 'F');
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Date', 18, yPos + 6);
    doc.text('Type', 50, yPos + 6);
    doc.text('Category', 75, yPos + 6);
    doc.text('Description', 120, yPos + 6);
    doc.text('Amount', 180, yPos + 6, { align: 'right' });
    
    yPos += 12;
    
    // Sort transactions by date (oldest first for PDF)
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Transaction rows
    sortedTransactions.forEach((transaction, index) => {
        // Check if we need a new page
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
            
            // Redraw header on new page
            doc.setFillColor(...primaryColor);
            doc.rect(0, 0, 210, 30, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Transaction History (continued)', 105, 20, { align: 'center' });
            yPos = 35;
            
            // Redraw table header
            doc.setFillColor(...lightGray);
            doc.rect(14, yPos, 182, 8, 'F');
            doc.setTextColor(...textColor);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('Date', 18, yPos + 6);
            doc.text('Type', 50, yPos + 6);
            doc.text('Category', 75, yPos + 6);
            doc.text('Description', 120, yPos + 6);
            doc.text('Amount', 180, yPos + 6, { align: 'right' });
            yPos += 12;
        }
        
        // Alternate row colors
        if (index % 2 === 0) {
            doc.setFillColor(255, 255, 255);
        } else {
            doc.setFillColor(...lightGray);
        }
        doc.rect(14, yPos - 4, 182, 8, 'F');
        
        // Transaction data
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textColor);
        doc.text(formattedDate, 18, yPos + 2);
        
        doc.setFont('helvetica', 'bold');
        doc.text(transaction.type.toUpperCase(), 50, yPos + 2);
        
        doc.setFont('helvetica', 'normal');
        doc.text(transaction.category, 75, yPos + 2);
        
        const description = transaction.description || '-';
        const maxDescWidth = 60;
        let descText = description;
        if (doc.getTextWidth(description) > maxDescWidth) {
            descText = doc.splitTextToSize(description, maxDescWidth)[0] + '...';
        }
        doc.text(descText, 120, yPos + 2);
        
        // Amount with color
        const amountText = (transaction.type === 'income' ? '+' : '-') + formatINR(transaction.amount);
        if (transaction.type === 'income') {
            doc.setTextColor(...incomeColor);
        } else {
            doc.setTextColor(...expenseColor);
        }
        doc.text(amountText, 180, yPos + 2, { align: 'right' });
        
        yPos += 8;
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
            `Page ${i} of ${pageCount}`,
            105,
            285,
            { align: 'center' }
        );
        const currentDate = new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        doc.text(
            `Generated on ${currentDate}`,
            105,
            290,
            { align: 'center' }
        );
    }
    
    // Generate filename
    const today = new Date();
    const filename = `expense-report-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}.pdf`;
    
    // Save PDF
    doc.save(filename);
}

// Initialize app
function init() {
    // Set today's date as default
    document.getElementById('date').valueAsDate = new Date();
    
    // Update category dropdown
    updateCategoryDropdown();
    updateFilterCategory();
    
    // Load transactions
    loadTransactions();
    
    // Calculate and display totals
    calculateTotals();
    
    // Display transactions
    displayTransactions();
    
    // Event listeners
    document.getElementById('transactionForm').addEventListener('submit', addTransaction);
    document.getElementById('type').addEventListener('change', updateCategoryDropdown);
    document.getElementById('filterType').addEventListener('change', displayTransactions);
    document.getElementById('filterCategory').addEventListener('change', displayTransactions);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

