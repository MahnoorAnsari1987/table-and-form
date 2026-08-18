// Banking Website JavaScript

// ==================== AUTHENTICATION FUNCTIONS ====================

// Get users from localStorage
function getUsers() {
    const users = localStorage.getItem('bankUsers');
    return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('bankUsers', JSON.stringify(users));
}

// Get current logged in user
function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Save current logged in user
function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Handle Signup
function handleSignup(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('signupFullName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const errorDiv = document.getElementById('signupError');
    
    // Validate passwords match
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match!';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Check if user already exists
    const users = getUsers();
    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
        errorDiv.textContent = 'An account with this email already exists!';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        fullName: fullName,
        email: email,
        phone: phone,
        password: password, // In real app, this should be hashed
        balance: 0,
        income: 0,
        expenses: 0,
        transactions: [],
        createdAt: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    saveUsers(users);
    
    // Auto login after signup
    saveCurrentUser(newUser);
    
    alert('Account created successfully! Welcome to SecureBank!');
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    // Get users
    const users = getUsers();
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        errorDiv.textContent = 'Invalid email or password!';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Save current user
    saveCurrentUser(user);
    
    alert('Login successful! Welcome back!');
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Handle Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        alert('You have been logged out successfully!');
        window.location.href = 'index.html';
    }
}

// ==================== DASHBOARD FUNCTIONS ====================

// Get current user data
function getUserData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    
    const users = getUsers();
    const updatedUser = users.find(u => u.id === currentUser.id);
    return updatedUser || currentUser;
}

// Update user data
function updateUserData(updatedUser) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    
    if (index !== -1) {
        users[index] = updatedUser;
        saveUsers(users);
        saveCurrentUser(updatedUser);
    }
}

// Format number with commas
function formatNumber(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Update dashboard UI
function updateDashboardUI() {
    const userData = getUserData();
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update user name
    document.getElementById('userName').textContent = userData.fullName;
    
    // Update balance cards
    document.getElementById('totalBalance').textContent = formatNumber(userData.balance);
    document.getElementById('totalIncome').textContent = formatNumber(userData.income);
    document.getElementById('totalExpenses').textContent = formatNumber(userData.expenses);
    
    // Render transactions
    renderTransactions(userData.transactions);
}

// Render transactions table
function renderTransactions(transactions) {
    const transactionList = document.getElementById('transactionList');
    const noTransactions = document.getElementById('noTransactions');
    
    if (!transactions || transactions.length === 0) {
        transactionList.innerHTML = '';
        noTransactions.style.display = 'block';
        return;
    }
    
    noTransactions.style.display = 'none';
    transactionList.innerHTML = '';
    
    transactions.slice(0, 10).forEach(transaction => {
        const row = document.createElement('tr');
        row.className = 'border-b hover:bg-gray-50';
        
        const amountClass = transaction.type === 'credit' ? 'amount-credit' : 'amount-debit';
        const amountPrefix = transaction.type === 'credit' ? '+' : '-';
        const typeClass = transaction.type === 'credit' ? 'type-credit' : 'type-debit';
        const typeText = transaction.type === 'credit' ? 'Income' : 'Expense';
        
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td><span class="transaction-type ${typeClass}">${typeText}</span></td>
            <td class="${amountClass}">${amountPrefix}$${formatNumber(transaction.amount)}</td>
        `;
        
        transactionList.appendChild(row);
    });
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Handle Transfer
function handleTransfer(event) {
    event.preventDefault();
    
    const userData = getUserData();
    if (!userData) return;
    
    const account = document.getElementById('transferAccount').value;
    const amount = parseFloat(document.getElementById('transferAmount').value);
    const description = document.getElementById('transferDescription').value || `Transfer to ${account}`;
    
    if (amount > userData.balance) {
        alert('Insufficient balance!');
        return;
    }
    
    userData.balance -= amount;
    userData.expenses += amount;
    
    const newTransaction = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        description: description,
        type: 'debit',
        amount: amount
    };
    
    userData.transactions.unshift(newTransaction);
    updateUserData(userData);
    updateDashboardUI();
    closeModal('transferModal');
    
    // Reset form
    document.getElementById('transferAccount').value = '';
    document.getElementById('transferAmount').value = '';
    document.getElementById('transferDescription').value = '';
    
    alert('Transfer successful!');
}

// Handle Deposit
function handleDeposit(event) {
    event.preventDefault();
    
    const userData = getUserData();
    if (!userData) return;
    
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const source = document.getElementById('depositSource').value;
    
    userData.balance += amount;
    userData.income += amount;
    
    const newTransaction = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        description: `${source} Deposit`,
        type: 'credit',
        amount: amount
    };
    
    userData.transactions.unshift(newTransaction);
    updateUserData(userData);
    updateDashboardUI();
    closeModal('depositModal');
    
    // Reset form
    document.getElementById('depositAmount').value = '';
    
    alert('Deposit successful!');
}

// Handle Withdraw
function handleWithdraw(event) {
    event.preventDefault();
    
    const userData = getUserData();
    if (!userData) return;
    
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const method = document.getElementById('withdrawMethod').value;
    
    if (amount > userData.balance) {
        alert('Insufficient balance!');
        return;
    }
    
    userData.balance -= amount;
    userData.expenses += amount;
    
    const newTransaction = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        description: `${method} Withdrawal`,
        type: 'debit',
        amount: amount
    };
    
    userData.transactions.unshift(newTransaction);
    updateUserData(userData);
    updateDashboardUI();
    closeModal('withdrawModal');
    
    // Reset form
    document.getElementById('withdrawAmount').value = '';
    
    alert('Withdrawal successful!');
}

// Handle Pay Bill
function handlePayBill(event) {
    event.preventDefault();
    
    const userData = getUserData();
    if (!userData) return;
    
    const billType = document.getElementById('billType').value;
    const amount = parseFloat(document.getElementById('billAmount').value);
    const reference = document.getElementById('billReference').value;
    
    if (amount > userData.balance) {
        alert('Insufficient balance!');
        return;
    }
    
    userData.balance -= amount;
    userData.expenses += amount;
    
    const description = reference ? `${billType} Bill (Ref: ${reference})` : `${billType} Bill`;
    
    const newTransaction = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        description: description,
        type: 'debit',
        amount: amount
    };
    
    userData.transactions.unshift(newTransaction);
    updateUserData(userData);
    updateDashboardUI();
    closeModal('payBillModal');
    
    // Reset form
    document.getElementById('billAmount').value = '';
    document.getElementById('billReference').value = '';
    
    alert('Bill payment successful!');
}

// Clear all transactions
function clearTransactions() {
    if (confirm('Are you sure you want to clear all transactions? This cannot be undone.')) {
        const userData = getUserData();
        if (userData) {
            userData.transactions = [];
            userData.balance = 0;
            userData.income = 0;
            userData.expenses = 0;
            updateUserData(userData);
            updateDashboardUI();
            alert('All transactions cleared!');
        }
    }
}

// ==================== NAVIGATION & UI FUNCTIONS ====================

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Update navigation based on authentication state
function updateNavigation() {
    const currentUser = getCurrentUser();
    const authButtons = document.querySelector('.auth-buttons');
    
    if (currentUser && authButtons) {
        // User is logged in - show welcome and logout
        authButtons.innerHTML = `
            <span class="welcome-text">Welcome, <span id="userName">${currentUser.fullName}</span></span>
            <button onclick="logout()" class="btn btn-secondary logout-btn">Logout</button>
        `;
    } else if (authButtons) {
        // User is not logged in - show login and signup
        authButtons.innerHTML = `
            <a href="login.html" class="btn btn-secondary">Login</a>
            <a href="signup.html" class="btn btn-primary">Sign Up</a>
        `;
    }
}

// Loan Calculator
function calculateLoan() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTerm = parseFloat(document.getElementById('loanTerm').value);
    
    if (!loanAmount || !interestRate || !loanTerm) {
        alert('Please fill in all fields');
        return;
    }
    
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Calculate monthly payment using loan amortization formula
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
    
    const resultDiv = document.getElementById('loanResult');
    resultDiv.innerHTML = `
        <h3>Loan Calculation Results</h3>
        <p><strong>Monthly Payment:</strong> $${monthlyPayment.toFixed(2)}</p>
        <p><strong>Total Payment:</strong> $${totalPayment.toFixed(2)}</p>
        <p><strong>Total Interest:</strong> $${totalInterest.toFixed(2)}</p>
    `;
}

// Handle Account Opening Form Submission
function handleAccountSubmit(event) {
    event.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dob: document.getElementById('dob').value,
        address: document.getElementById('address').value,
        accountType: document.getElementById('accountType').value,
        idType: document.getElementById('idType').value,
        idNumber: document.getElementById('idNumber').value
    };
    
    // In a real application, this would send data to a server
    console.log('Account Application Submitted:', formData);
    
    alert('Thank you for your application! We will contact you within 24-48 hours to process your account opening.');
    
    // Reset form
    document.getElementById('accountForm').reset();
}

// Handle Contact Form Submission
function handleContactSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // In a real application, this would send data to a server
    console.log('Contact Form Submitted:', formData);
    
    alert('Thank you for your message! We will get back to you within 24 hours.');
    
    // Reset form
    document.getElementById('contactForm').reset();
}

// ==================== INITIALIZATION ====================

// Add event listeners and initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Set active navigation link
    setActiveNavLink();
    
    // Update navigation based on auth state
    updateNavigation();
    
    // If on dashboard page, initialize dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        if (!isLoggedIn()) {
            window.location.href = 'login.html';
        } else {
            updateDashboardUI();
        }
    }
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to navigation
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (nav && window.scrollY > 50) {
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else if (nav) {
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});
