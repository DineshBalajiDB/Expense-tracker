// Initialize date input to today
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    
    // Load expenses from localStorage
    loadExpenses();
});

// Get expenses from localStorage
function getExpenses() {
    const expenses = localStorage.getItem('expenses');
    return expenses ? JSON.parse(expenses) : [];
}

// Save expenses to localStorage
function saveExpenses(expenses) {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Add new expense
document.getElementById('expenseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value.trim();
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value.trim();
    
    if (amount <= 0) {
        alert('Please enter a valid amount greater than 0');
        return;
    }
    
    const expense = {
        id: Date.now(),
        amount: amount,
        description: description,
        date: date,
        category: category
    };
    
    const expenses = getExpenses();
    expenses.push(expense);
    saveExpenses(expenses);
    
    // Reset form
    document.getElementById('expenseForm').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    // Refresh display
    loadExpenses();
});

// Load and display expenses
function loadExpenses() {
    const expenses = getExpenses();
    const expensesList = document.getElementById('expensesList');
    const totalAmount = document.getElementById('totalAmount');
    
    // Calculate total
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmount.textContent = formatCurrency(total);
    
    // Display expenses
    if (expenses.length === 0) {
        expensesList.innerHTML = '<p class="empty-message">No expenses yet. Add your first expense above!</p>';
        return;
    }
    
    expensesList.innerHTML = expenses.map(expense => `
        <div class="expense-item">
            <div class="expense-details">
                <div class="expense-amount">${formatCurrency(expense.amount)}</div>
                <div class="expense-description">${escapeHtml(expense.description)}</div>
                <div class="expense-meta">
                    <span>📅 ${formatDate(expense.date)}</span>
                    <span>🏷️ ${escapeHtml(expense.category)}</span>
                </div>
            </div>
            <button class="btn-delete" onclick="deleteExpense(${expense.id})">Delete</button>
        </div>
    `).join('');
}

// Delete expense
function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        const expenses = getExpenses();
        const filteredExpenses = expenses.filter(expense => expense.id !== id);
        saveExpenses(filteredExpenses);
        loadExpenses();
    }
}

// Format currency
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

