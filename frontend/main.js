"use strict";
// Main TypeScript code will go here
// Function to display a message to the user
function displayMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    if (messageContainer) {
        messageContainer.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
        // Remove scrollIntoView to prevent message being cut off
        setTimeout(() => {
            messageContainer.innerHTML = '';
        }, 5000);
    } else {
        // Fallback to console if messageContainer not found
        console.log(`${type.toUpperCase()}: ${message}`);
        alert(message); // Show alert as fallback
    }
}
// Function to show loading indicator
function showLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.classList.remove('d-none');
    }
}
// Function to hide loading indicator
function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.classList.add('d-none');
    }
}
function toggleLoadingSpinner(buttonId, show) {
    const button = document.getElementById(buttonId);
    if (button) {
        const spinner = button.querySelector('.spinner-border');
        if (spinner) {
            if (show) {
                spinner.classList.remove('d-none');
                button.disabled = true;
            }
            else {
                spinner.classList.add('d-none');
                button.disabled = false;
            }
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in and redirect accordingly
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
        // User is logged in
        if (window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('register.html')) {
            // Redirect logged-in users away from login/register pages
            window.location.href = 'dashboard.html';
            return;
        }
    } else {
        // User is not logged in
        if (window.location.pathname.endsWith('dashboard.html')) {
            // Redirect non-logged-in users away from dashboard
            window.location.href = 'login.html';
            return;
        }
    }
    
    if (window.location.pathname.endsWith('login.html')) {
        const loginForm = document.querySelector('form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const usernameInput = loginForm.querySelector('#username');
                const passwordInput = loginForm.querySelector('#password');
                const username = usernameInput.value;
                const password = passwordInput.value;
                
                if (!username || !password) {
                    displayMessage('Please fill in all fields', 'danger');
                    return;
                }
                
                toggleLoadingSpinner('loginButton', true); // Show loading spinner
                try {
                    const response = await fetch('http://localhost:8000/api/login/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, password }),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('username', data.user.username);
                        window.location.href = 'dashboard.html';
                    }
                    else {
                        displayMessage(data.error || 'Login failed', 'danger');
                    }
                }
                catch (error) {
                    console.error('Error during login:', error);
                    displayMessage('An error occurred during login.', 'danger');
                }
                finally {
                    toggleLoadingSpinner('loginButton', false); // Hide loading spinner
                }
            });
        }
    }
    else if (window.location.pathname.endsWith('register.html')) {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const usernameInput = registerForm.querySelector('#username');
                const emailInput = registerForm.querySelector('#email');
                const passwordInput = registerForm.querySelector('#password');
                const confirmPasswordInput = registerForm.querySelector('#confirm_password');
                const username = usernameInput.value.trim();
                const email = emailInput.value.trim();
                const password = passwordInput.value;
                const confirmPassword = confirmPasswordInput.value;
                
                // Basic field validation
                if (!username || !email || !password || !confirmPassword) {
                    displayMessage('All fields are required.', 'danger');
                    return;
                }

                // Username validation
                if (username.length < 3) {
                    displayMessage('Username must be at least 3 characters long.', 'danger');
                    showFieldError(usernameInput, 'Username must be at least 3 characters long');
                    return;
                }

                // Email validation
                if (!validateEmail(email)) {
                    displayMessage('Please enter a valid email address.', 'danger');
                    showFieldError(emailInput, 'Please enter a valid email address');
                    return;
                }

            // Password validation
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.isValid) {
                showFieldError(passwordInput, 'Password does not meet requirements');
                return;
            }

                // Password confirmation validation
                if (!validateConfirmPassword(password, confirmPassword)) {
                    displayMessage('Passwords do not match.', 'danger');
                    showFieldError(confirmPasswordInput, 'Passwords do not match');
                    return;
                }
                
                toggleLoadingSpinner('registerButton', true); // Show loading spinner
                try {
                    const response = await fetch('http://localhost:8000/api/register/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, email, password }),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        displayMessage('Registration successful! Please log in.', 'success');
                        window.location.href = 'login.html';
                    }
                    else {
                        displayMessage(data.error || 'Registration failed', 'danger');
                    }
                }
                catch (error) {
                    console.error('Error during registration:', error);
                    displayMessage('An error occurred during registration.', 'danger');
                }
                finally {
                    toggleLoadingSpinner('registerButton', false); // Hide loading spinner
                }
            });
        }
    }
    else if (window.location.pathname.endsWith('pricing.html')) {
        // Load subscription plans
        loadSubscriptionPlans();
        
        // Handle plan selection
        document.querySelectorAll('.pricing-card .btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const card = event.target.closest('.pricing-card');
                const planType = card.classList.contains('plan-basic') ? 'basic' : 
                               card.classList.contains('plan-standard') ? 'standard' : 'premium';
                
                await selectPlan(planType);
            });
        });
    }
    else if (window.location.pathname.endsWith('dashboard.html')) {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (!token || !username) {
            window.location.href = 'login.html';
            return;
        }
        
        // Display username in multiple places
        const usernameDisplay = document.querySelector('#usernameDisplay');
        const userDisplayName = document.querySelector('#userDisplayName');
        if (usernameDisplay) {
            usernameDisplay.textContent = username;
        }
        if (userDisplayName) {
            userDisplayName.textContent = username;
        }
        
        // Initialize navigation
        initializeNavigation();
        const logoutButton = document.querySelector('#logoutLink');
        if (logoutButton) {
            logoutButton.addEventListener('click', async (event) => {
                event.preventDefault();
                
                // Show confirmation dialog
                if (!confirm('Are you sure you want to logout?')) {
                    return;
                }
                
                const token = localStorage.getItem('token');
                if (!token) {
                    // If no token, just redirect to home
                    window.location.href = 'index.html';
                    return;
                }
                
                try {
                    // Call logout API
                    const response = await fetch('http://localhost:8000/api/logout/', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    
                    if (response.ok) {
                        console.log('Logged out successfully');
                    } else {
                        console.log('Logout API failed, but continuing with logout');
                    }
                } catch (error) {
                    console.error('Error during logout API call:', error);
                    // Continue with logout even if API fails
                }
                
                // Always clear local storage and redirect
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                
                // Show success message briefly before redirect
                if (typeof displayMessage === 'function') {
                    displayMessage('Logged out successfully!', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    window.location.href = 'index.html';
                }
            });
        }
        const deleteFile = async (fileId) => {
            showLoadingIndicator(); // Show loading indicator
            try {
                const response = await fetch(`http://localhost:8000/api/files/${fileId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                if (response.ok) {
                    displayMessage('File deleted successfully!', 'success');
                    fetchFiles(); // Refresh the file list
                    loadUserSubscription(); // Refresh storage usage
                    
                    // Refresh analytics to show updated deletion count
                    const currentSection = document.querySelector('.content-section.active');
                    if (currentSection && currentSection.id === 'analytics-section') {
                        loadAnalyticsSection();
                    }
                    
                    // Also refresh dashboard data if we're in the files section
                    if (currentSection && currentSection.id === 'files-section') {
                        loadFilesSection();
                    }
                }
                else {
                    const errorData = await response.json();
                    displayMessage(errorData.error || 'File deletion failed.', 'danger');
                }
            }
            catch (error) {
                console.error('Error during file deletion:', error);
                displayMessage('An error occurred during file deletion.', 'danger');
            }
            finally {
                hideLoadingIndicator(); // Hide loading indicator
            }
        };
        window.fetchFiles = async () => {
            showLoadingIndicator(); // Show loading indicator
            try {
                const response = await fetch('http://localhost:8000/api/files/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                
                if (response.status === 401) {
                    // Token is invalid, redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    window.location.href = 'login.html';
                    return;
                }
                
                const files = await response.json();
                const filteredByDate = filterFilesByDate(files);
                const filtered = filterFilesByQuery(filteredByDate);
                const filesTableBody = document.querySelector('#filesTableBody');
                console.log('🔍 DEBUG: filesTableBody found:', filesTableBody);
                console.log('🔍 DEBUG: filesTableBody.insertRow exists:', filesTableBody && filesTableBody.insertRow);
                
                if (filesTableBody && filesTableBody.insertRow) {
                    filesTableBody.innerHTML = ''; // Clear existing rows
                    console.log('🔍 DEBUG: About to create rows for', filtered.length, 'files');
                    
                    if (Array.isArray(filtered)) {
                        filtered.forEach((file, index) => {
                        console.log(`🔍 DEBUG: Creating row ${index + 1} for file:`, file.name);
                        const row = filesTableBody.insertRow();
                        row.insertCell().textContent = file.name;
                        row.insertCell().textContent = file.file_type;
                        row.insertCell().textContent = file.size_mb + ' MB';
                        row.insertCell().textContent = new Date(file.upload_date).toLocaleDateString();
                        const actionsCell = row.insertCell();
                        
                        // Add download button
                        const downloadButton = document.createElement('button');
                        downloadButton.textContent = 'Download';
                        downloadButton.classList.add('btn', 'btn-primary', 'btn-sm');
                        downloadButton.dataset.fileId = file.id;
                        actionsCell.appendChild(downloadButton);
                        console.log('🔍 DEBUG: Added download button for:', file.name);
                        
                        // Add delete button
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Delete';
                        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
                        deleteButton.dataset.fileId = file.id;
                        actionsCell.appendChild(deleteButton);
                        console.log('🔍 DEBUG: Added delete button for:', file.name);
                    });
                    // Add event listeners to download buttons
                    filesTableBody.querySelectorAll('.btn-primary').forEach(button => {
                        button.addEventListener('click', async (event) => {
                            const fileId = event.target.dataset.fileId;
                            if (fileId) {
                                await downloadFile(fileId);
                            }
                        });
                    });
                    
                    // Add event listeners to delete buttons
                    filesTableBody.querySelectorAll('.btn-danger').forEach(button => {
                        button.addEventListener('click', async (event) => {
                            const fileId = event.target.dataset.fileId;
                            if (fileId) {
                                await deleteFile(fileId);
                            }
                        });
                    });
                    console.log('🔍 DEBUG: Added event listeners to buttons');
                    } else {
                    console.error('Files response is not an array:', filtered);
                    }
            } else {
                console.log('filesTableBody element not found or not a table - files table might not be on this page');
                }
        } catch (error) {
                console.error('Error fetching files:', error);
        } finally {
                hideLoadingIndicator(); // Hide loading indicator
            }
        };
        window.fetchFiles();

    // Date filter controls for My Files
    const datePreset = document.getElementById('fileDatePreset');

    if (datePreset) {
        datePreset.addEventListener('change', async () => {
            await window.fetchFiles();
        });
    }

    // Search input handler with debounce
    const fileSearch = document.getElementById('fileSearch');
    if (fileSearch) {
        const debounced = debounce(async () => {
            await window.fetchFiles();
        }, 200);
        fileSearch.addEventListener('input', debounced);
    }

    // Custom range temporarily removed

        loadUserSubscription();
        const uploadForm = document.querySelector('form');
        if (uploadForm) {
            uploadForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const fileInput = uploadForm.querySelector('#fileInput');
                const fileNameInput = uploadForm.querySelector('#fileName');
                const files = fileInput.files;
                
                if (!files || files.length === 0) {
                    displayMessage('Please select at least one file to upload.', 'danger');
                    return;
                }
                
                if (files.length > 100) {
                    displayMessage('Maximum 100 files allowed per upload.', 'danger');
                    return;
                }
                
                toggleLoadingSpinner('uploadButton', true); // Show loading spinner
                
                let successCount = 0;
                let errorCount = 0;
                const errors = [];
                
                try {
                    // Upload files one by one
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const name = fileNameInput.value.trim() || file.name;
                        
                        try {
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('name', name);
                            
                            const response = await fetch('http://localhost:8000/api/files/', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Token ${token}`,
                                },
                                body: formData,
                            });
                            
                            if (response.ok) {
                                successCount++;
                            } else {
                                const errorData = await response.json();
                                errors.push(`${file.name}: ${errorData.error || 'Upload failed'}`);
                                errorCount++;
                            }
                        } catch (error) {
                            errors.push(`${file.name}: ${error.message}`);
                            errorCount++;
                        }
                    }
                    
                    // Show results
                    if (successCount > 0 && errorCount === 0) {
                        displayMessage(`Successfully uploaded ${successCount} file(s)!`, 'success');
                    } else if (successCount > 0 && errorCount > 0) {
                        displayMessage(`Uploaded ${successCount} file(s), ${errorCount} failed.`, 'warning');
                        console.log('Upload errors:', errors);
                    } else {
                        displayMessage('All uploads failed.', 'danger');
                        console.log('Upload errors:', errors);
                    }
                    
                    // Refresh the file list and storage usage
                    fetchFiles();
                    loadUserSubscription();
                    
                    // Also refresh files section if it's currently active
                    const currentSection = document.querySelector('.content-section.active');
                    if (currentSection && currentSection.id === 'files-section') {
                        loadFilesSection();
                    }
                }
                catch (error) {
                    console.error('Error during file upload:', error);
                    displayMessage('An error occurred during file upload.', 'danger');
                }
                finally {
                    toggleLoadingSpinner('uploadButton', false); // Hide loading spinner
                    fileInput.value = '';
                    fileNameInput.value = '';
                }
            });
        }
    }
    
    // Initialize password visibility toggles
    initializePasswordToggles();
    
    // Initialize navigation authentication state
    initializeNavigationAuth();
    
    // Initialize form validation
    initializeValidation();
});

// Debounce utility
function debounce(fn, delay) {
    let t = null;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(null, args), delay);
    };
}

// Validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Chart mode toggle handlers
document.addEventListener('DOMContentLoaded', () => {
    const btnLine = document.getElementById('storageChartModeLine');
    const btnBar = document.getElementById('storageChartModeBar');
    const btnStacked = document.getElementById('storageChartModeStacked');
    const btnArea = document.getElementById('storageChartModeArea');
    const ma7Toggle = document.getElementById('ma7Toggle');
    const pieModeCategories = document.getElementById('pieModeCategories');
    const pieModeTopFiles = document.getElementById('pieModeTopFiles');
    if (btnLine && btnBar) {
        const setActive = (mode) => {
            btnLine.classList.toggle('active', mode === 'line');
            btnBar.classList.toggle('active', mode === 'bar');
            if (btnStacked) btnStacked.classList.toggle('active', mode === 'stacked');
            if (btnArea) btnArea.classList.toggle('active', mode === 'area');
        };
        btnLine.addEventListener('click', async () => {
            window.storageChartMode = 'line';
            setActive('line');
            // Rebuild analytics charts with current data
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const resp = await fetch('http://localhost:8000/api/files/', { headers: { 'Authorization': `Token ${token}` } });
                if (resp.ok) {
                    const files = await resp.json();
                    createStorageChart(files);
                }
            } catch (e) { console.error(e); }
        });
        btnBar.addEventListener('click', async () => {
            window.storageChartMode = 'bar';
            setActive('bar');
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const resp = await fetch('http://localhost:8000/api/files/', { headers: { 'Authorization': `Token ${token}` } });
                if (resp.ok) {
                    const files = await resp.json();
                    createStorageChart(files);
                }
            } catch (e) { console.error(e); }
        });
        if (btnStacked) {
            btnStacked.addEventListener('click', async () => {
                window.storageChartMode = 'stacked';
                setActive('stacked');
                try {
                    const token = localStorage.getItem('token');
                    if (!token) return;
                    const resp = await fetch('http://localhost:8000/api/files/', { headers: { 'Authorization': `Token ${token}` } });
                    if (resp.ok) {
                        const files = await resp.json();
                        createStorageChart(files);
                    }
                } catch (e) { console.error(e); }
            });
        }
        if (btnArea) {
            btnArea.addEventListener('click', async () => {
                window.storageChartMode = 'area';
                setActive('area');
                try {
                    const token = localStorage.getItem('token');
                    if (!token) return;
                    const resp = await fetch('http://localhost:8000/api/files/', { headers: { 'Authorization': `Token ${token}` } });
                    if (resp.ok) {
                        const files = await resp.json();
                        createStorageChart(files);
                    }
                } catch (e) { console.error(e); }
            });
        }
        if (ma7Toggle) {
            ma7Toggle.addEventListener('change', async () => {
                window.enable7DayMA = ma7Toggle.checked;
                try {
                    const token = localStorage.getItem('token');
                    if (!token) return;
                    const resp = await fetch('http://localhost:8000/api/files/', { headers: { 'Authorization': `Token ${token}` } });
                    if (resp.ok) {
                        const files = await resp.json();
                        createStorageChart(files);
                    }
                } catch (e) { console.error(e); }
            });
        }
    }
    // Pie mode toggles
    const togglePieMode = async (mode) => {
        window.filePieMode = mode; // 'categories' | 'topfiles'
        if (pieModeCategories && pieModeTopFiles) {
            pieModeCategories.classList.toggle('active', mode === 'categories');
            pieModeTopFiles.classList.toggle('active', mode === 'topfiles');
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const resp = await fetch('http://localhost:8000/api/files/', { headers: { 'Authorization': `Token ${token}` } });
            if (resp.ok) {
                const files = await resp.json();
                createFileTypesChart(files);
            }
        } catch (e) { console.error(e); }
    };
    if (pieModeCategories && pieModeTopFiles) {
        pieModeCategories.addEventListener('click', () => togglePieMode('categories'));
        pieModeTopFiles.addEventListener('click', () => togglePieMode('topfiles'));
    }
});

function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
        isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
        length: password.length
    };
}

function validateConfirmPassword(password, confirmPassword) {
    return password === confirmPassword && password.length > 0;
}

function showFieldError(field, message) {
    // Remove existing error and speech bubble
    const existingError = field.parentNode.querySelector('.field-error');
    const existingBubble = field.parentNode.querySelector('.speech-bubble');
    if (existingError) {
        existingError.remove();
    }
    if (existingBubble) {
        existingBubble.remove();
    }
    
    // Add error styling with red border (using only our custom classes)
    field.classList.remove('is-valid', 'is-invalid');
    field.classList.add('password-invalid');
    field.classList.remove('password-valid');
}

function showFieldSuccess(field) {
    // Remove existing error and speech bubble
    const existingError = field.parentNode.querySelector('.field-error');
    const existingBubble = field.parentNode.querySelector('.speech-bubble');
    if (existingError) {
        existingError.remove();
    }
    if (existingBubble) {
        existingBubble.remove();
    }
    
    // Add success styling with green border (using only our custom classes)
    field.classList.remove('is-valid', 'is-invalid');
    field.classList.add('password-valid');
    field.classList.remove('password-invalid');
}

function showPasswordStrength(passwordField, strengthContainer) {
    const password = passwordField.value;
    const validation = validatePassword(password);
    
    if (password.length === 0) {
        strengthContainer.innerHTML = '';
        return;
    }
    
    let strengthHTML = '<div class="password-strength mt-2">';
    strengthHTML += '<div class="strength-label small mb-1">Password Strength:</div>';
    
    // Length requirement
    strengthHTML += `<div class="strength-item ${validation.minLength ? 'valid' : 'invalid'}">
        <i class="fas ${validation.minLength ? 'fa-check' : 'fa-times'}"></i>
        At least 8 characters (${validation.length}/8)
    </div>`;
    
    // Uppercase requirement
    strengthHTML += `<div class="strength-item ${validation.hasUpperCase ? 'valid' : 'invalid'}">
        <i class="fas ${validation.hasUpperCase ? 'fa-check' : 'fa-times'}"></i>
        One uppercase letter
    </div>`;
    
    // Lowercase requirement
    strengthHTML += `<div class="strength-item ${validation.hasLowerCase ? 'valid' : 'invalid'}">
        <i class="fas ${validation.hasLowerCase ? 'fa-check' : 'fa-times'}"></i>
        One lowercase letter
    </div>`;
    
    // Number requirement
    strengthHTML += `<div class="strength-item ${validation.hasNumbers ? 'valid' : 'invalid'}">
        <i class="fas ${validation.hasNumbers ? 'fa-check' : 'fa-times'}"></i>
        One number
    </div>`;
    
    // Special character requirement
    strengthHTML += `<div class="strength-item ${validation.hasSpecialChar ? 'valid' : 'invalid'}">
        <i class="fas ${validation.hasSpecialChar ? 'fa-check' : 'fa-times'}"></i>
        One special character
    </div>`;
    
    strengthHTML += '</div>';
    strengthContainer.innerHTML = strengthHTML;
}

function initializeValidation() {
    // Email validation for register page
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('input', function() {
            const email = this.value.trim();
            if (email.length > 0) {
                if (validateEmail(email)) {
                    showFieldSuccess(this);
                } else {
                    showFieldError(this, 'Please enter a valid email address');
                }
            } else {
                this.classList.remove('is-valid', 'is-invalid', 'password-valid', 'password-invalid');
                const existingError = this.parentNode.querySelector('.field-error');
                if (existingError) {
                    existingError.remove();
                }
            }
        });
    }
    
    // Password validation for register page
    const passwordField = document.getElementById('password');
    if (passwordField) {
        // Find the parent container (mb-3 div) to place strength indicator after the input group
        const parentContainer = passwordField.closest('.mb-3');
        const strengthContainer = document.createElement('div');
        strengthContainer.className = 'password-strength-container';
        // Insert after the input group, before any existing error messages
        parentContainer.appendChild(strengthContainer);
        
        passwordField.addEventListener('input', function() {
            const password = this.value;
            const validation = validatePassword(password);
            
            if (password.length > 0) {
                if (validation.isValid) {
                    showFieldSuccess(this);
                } else {
                    showFieldError(this, 'Password does not meet requirements');
                }
            } else {
                this.classList.remove('is-valid', 'is-invalid', 'password-valid', 'password-invalid');
                const existingError = this.parentNode.querySelector('.field-error');
                if (existingError) {
                    existingError.remove();
                }
            }
            
            showPasswordStrength(this, strengthContainer);
        });
    }
    
    // Confirm password validation for register page
    const confirmPasswordField = document.getElementById('confirm_password');
    if (confirmPasswordField) {
        confirmPasswordField.addEventListener('input', function() {
            const password = passwordField ? passwordField.value : '';
            const confirmPassword = this.value;
            
            if (confirmPassword.length > 0) {
                if (validateConfirmPassword(password, confirmPassword)) {
                    showFieldSuccess(this);
                } else {
                    showFieldError(this, 'Passwords do not match');
                }
            } else {
                this.classList.remove('is-valid', 'is-invalid', 'password-valid', 'password-invalid');
                const existingError = this.parentNode.querySelector('.field-error');
                if (existingError) {
                    existingError.remove();
                }
            }
        });
    }
}

// Initialize navigation based on authentication state
function initializeNavigationAuth() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    // Get navigation elements
    const loginNavItem = document.getElementById('loginNavItem');
    const registerNavItem = document.getElementById('registerNavItem');
    const dashboardNavItem = document.getElementById('dashboardNavItem');
    const logoutNavItem = document.getElementById('logoutNavItem');
    const logoutLinkNav = document.getElementById('logoutLinkNav');
    
    if (token && username) {
        // User is logged in - show dashboard and logout, hide login/register
        if (loginNavItem) loginNavItem.classList.add('d-none');
        if (registerNavItem) registerNavItem.classList.add('d-none');
        if (dashboardNavItem) dashboardNavItem.classList.remove('d-none');
        if (logoutNavItem) logoutNavItem.classList.remove('d-none');
        
        // Add logout functionality to navbar logout link
        if (logoutLinkNav) {
            logoutLinkNav.addEventListener('click', async (event) => {
                event.preventDefault();
                
                // Show confirmation dialog
                if (!confirm('Are you sure you want to logout?')) {
                    return;
                }
                
                try {
                    // Call logout API
                    const response = await fetch('http://localhost:8000/api/logout/', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    
                    if (response.ok) {
                        console.log('Logged out successfully');
                    } else {
                        console.log('Logout API failed, but continuing with logout');
                    }
                } catch (error) {
                    console.error('Error during logout API call:', error);
                    // Continue with logout even if API fails
                }
                
                // Always clear local storage and redirect
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                window.location.href = 'index.html';
            });
        }
    } else {
        // User is not logged in - show login/register, hide dashboard/logout
        if (loginNavItem) loginNavItem.classList.remove('d-none');
        if (registerNavItem) registerNavItem.classList.remove('d-none');
        if (dashboardNavItem) dashboardNavItem.classList.add('d-none');
        if (logoutNavItem) logoutNavItem.classList.add('d-none');
    }
}

// Subscription management functions
async function loadSubscriptionPlans() {
    try {
        const response = await fetch('http://localhost:8000/api/subscriptions/?t=' + Date.now());
        const plans = await response.json();
        
        // Update pricing cards with dynamic data
        plans.forEach(plan => {
            const card = document.querySelector(`.plan-${plan.plan_type}`);
            if (card) {
                const priceElement = card.querySelector('.card-title');
                const storageElement = card.querySelector('li:first-child');
                
                if (priceElement) {
                    priceElement.textContent = `R${plan.price_monthly} / month`;
                }
                if (storageElement) {
                    // Format storage display - show TB for large values
                    let storageText;
                    if (plan.storage_limit_gb >= 1024) {
                        const tb = plan.storage_limit_gb / 1024;
                        storageText = `${tb} TB Storage`;
                    } else {
                        storageText = `${plan.storage_limit_gb} GB Storage`;
                    }
                    storageElement.textContent = storageText;
                }
            }
        });
    } catch (error) {
        console.error('Error loading subscription plans:', error);
    }
}

async function selectPlan(planType) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        displayMessage('Please log in to select a plan', 'danger');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await fetch('http://localhost:8000/api/user-subscription/?t=' + Date.now(), {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ plan_type: planType }),
        });
        
        if (response.ok) {
            const data = await response.json();
            displayMessage(`Successfully upgraded to ${data.plan_type} plan!`, 'success');
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            const errorData = await response.json();
            displayMessage(errorData.error || 'Failed to upgrade plan', 'danger');
        }
    } catch (error) {
        console.error('Error selecting plan:', error);
        displayMessage('An error occurred while selecting the plan', 'danger');
    }
}

async function loadUserSubscription() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch('http://localhost:8000/api/user-subscription/?t=' + Date.now(), {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        
        if (response.status === 401) {
            // Token is invalid, redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            window.location.href = 'login.html';
            return;
        }
        
        if (response.ok) {
            const data = await response.json();
            updateStorageDisplay(data.storage_info);
        }
    } catch (error) {
        console.error('Error loading user subscription:', error);
    }
}

function updateStorageDisplay(storageInfo) {
    // Update iCloud-style storage visualization
    updateICloudStorageDisplay(storageInfo, 'dashboard');
    
    // Also update upload section storage display
    updateICloudStorageDisplay(storageInfo, 'upload');
}

function updateICloudStorageDisplay(storageInfo, section) {
        const usedBytes = storageInfo.current_usage_bytes;
        const limitBytes = storageInfo.limit_bytes;
        const percentage = Math.min((usedBytes / limitBytes) * 100, 100);
        
    // Get the appropriate elements based on section
    const storageBar = document.getElementById(section === 'dashboard' ? 'storageBar' : 'uploadStorageBar');
    const storageSummary = document.getElementById(section === 'dashboard' ? 'storageSummary' : 'uploadStorageSummary');
    const storagePercentage = document.getElementById(section === 'dashboard' ? 'storagePercentage' : 'uploadStoragePercentage');
    const storageLegend = document.getElementById(section === 'dashboard' ? 'storageLegend' : null);
    const storageBreakdown = document.getElementById(section === 'dashboard' ? 'storageBreakdown' : null);
    
    if (storageBar && storageSummary && storagePercentage) {
        // Generate file type breakdown (simulated based on uploaded files)
        const fileBreakdown = generateFileTypeBreakdown(usedBytes);
        
        // Clear and rebuild storage bar
        storageBar.innerHTML = '';
        
        // Add segments to the storage bar
        fileBreakdown.forEach(category => {
            if (category.percentage > 0) {
                const segment = document.createElement('div');
                segment.className = `storage-segment ${category.type}`;
                segment.style.width = `${category.percentage}%`;
                segment.title = `${category.name}: ${category.displaySize}`;
                storageBar.appendChild(segment);
            }
        });
        
        // Update summary text
        let usedDisplay, limitDisplay;
        
        if (usedBytes >= 1024 * 1024 * 1024) { // GB or more
            usedDisplay = `${Math.round(usedBytes / (1024 * 1024 * 1024) * 100) / 100} GB`;
        } else if (usedBytes >= 1024 * 1024) { // MB
            usedDisplay = `${Math.round(usedBytes / (1024 * 1024) * 100) / 100} MB`;
        } else if (usedBytes >= 1024) { // KB
            usedDisplay = `${Math.round(usedBytes / 1024 * 100) / 100} KB`;
        } else { // Bytes
            usedDisplay = `${usedBytes} bytes`;
        }
        
        if (storageInfo.limit_gb >= 1024) { // TB
            limitDisplay = `${Math.round(storageInfo.limit_gb / 1024 * 100) / 100} TB`;
        } else { // GB
            limitDisplay = `${storageInfo.limit_gb} GB`;
        }
        
        storageSummary.textContent = `${usedDisplay} of ${limitDisplay} Used`;
        storagePercentage.textContent = `${Math.round(percentage * 100) / 100}%`;
        
        // Update legend for dashboard section
        if (section === 'dashboard' && storageLegend) {
            updateStorageLegend(storageLegend, fileBreakdown);
        }
    }
}

function generateFileTypeBreakdown(totalBytes) {
    // Define file type categories based on user specifications
    const fileCategories = {
        documents: {
            name: 'Documents',
            extensions: [
                // Text / Word Processing
                'txt', 'doc', 'docx', 'odt', 'rtf', 'wps',
                // Portable Formats
                'pdf', 'epub', 'mobi',
                // Spreadsheets
                'xls', 'xlsx', 'ods', 'csv', 'tsv',
                // Presentations
                'ppt', 'pptx', 'odp', 'key',
                // Other Structured Docs
                'xml', 'json', 'yaml', 'md', 'tex'
            ]
        },
        photos: {
            name: 'Photos',
            extensions: [
                // Common Raster
                'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'heif', 'heic',
                // Raw Image Formats
                'raw', 'cr2', 'nef', 'arw', 'orf', 'sr2', 'dng',
                // Vector
                'svg', 'ai', 'eps',
                // Web Formats
                'webp', 'avif'
            ]
        },
        videos: {
            name: 'Videos',
            extensions: [
                // Standard Video Files
                'mp4', 'mov', 'avi', 'wmv', 'flv', 'f4v', 'mkv',
                // Modern/Streaming Formats
                'webm', 'm4v', '3gp', 'ts',
                // Professional/Raw
                'mxf', 'r3d', 'cine', 'yuv', 'vob'
            ]
        },
        others: {
            name: 'Others',
            extensions: [
                // Executables
                'appimage', 'exe', 'msi', 'deb', 'rpm', 'dmg', 'pkg',
                // Archives
                'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz',
                // Audio
                'mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a',
                // Code/Development
                'py', 'js', 'html', 'css', 'cpp', 'c', 'java', 'php', 'rb', 'go',
                // System Files
                'iso', 'img', 'bin', 'dat', 'log', 'tmp'
            ]
        }
    };

    // Get actual files from the uploaded files to calculate real distribution
    const uploadedFiles = getUploadedFiles();
    
    if (uploadedFiles.length === 0 || totalBytes === 0) {
        // Return empty breakdown if no files
        return [
            { type: 'documents', name: 'Documents', percentage: 0, bytes: 0, displaySize: '0 MB' },
            { type: 'photos', name: 'Photos', percentage: 0, bytes: 0, displaySize: '0 MB' },
            { type: 'videos', name: 'Videos', percentage: 0, bytes: 0, displaySize: '0 MB' },
            { type: 'others', name: 'Others', percentage: 0, bytes: 0, displaySize: '0 MB' }
        ];
    }

    // Calculate actual file distribution based on uploaded files
    const categoryBytes = {
        documents: 0,
        photos: 0,
        videos: 0,
        others: 0
    };

    // Categorize each uploaded file
    uploadedFiles.forEach(file => {
        const extension = (file.file_type || getFileExtension(file.name)).toLowerCase();
        const fileSize = file.file_size || file.size || 0;
        let categorized = false;

        console.log(`Processing file: ${file.name}, extension: ${extension}, size: ${fileSize} bytes`);

        // Check each category
        for (const [categoryKey, categoryData] of Object.entries(fileCategories)) {
            if (categoryKey === 'others') continue; // Skip others for now
            
            if (categoryData.extensions.includes(extension)) {
                categoryBytes[categoryKey] += fileSize;
                console.log(`Categorized ${file.name} as ${categoryKey}`);
                categorized = true;
                break;
            }
        }

        // If not categorized, add to others
        if (!categorized) {
            categoryBytes.others += fileSize;
            console.log(`Categorized ${file.name} as others`);
        }
    });

    console.log('Final category breakdown:', categoryBytes);

    // Create breakdown array - always show all categories
    const breakdown = [];
    for (const [categoryKey, bytes] of Object.entries(categoryBytes)) {
        const percentage = totalBytes > 0 ? (bytes / totalBytes) * 100 : 0;
        const categoryData = fileCategories[categoryKey];
        
        // Always show all categories, even if they have 0 bytes
        breakdown.push({
            type: categoryKey,
            name: categoryData.name,
            percentage: percentage,
            bytes: bytes,
            displaySize: formatFileSize(bytes)
        });
    }

    // Sort by size (largest first)
    breakdown.sort((a, b) => b.bytes - a.bytes);

    return breakdown;
}

function getUploadedFiles() {
    // Fetch actual uploaded files from the API for real categorization
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('🔍 STORAGE VISUALIZATION: No token found, using sample data');
            return getSampleFiles();
        }

        // Make synchronous request to get files (in a real app, this would be async)
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:8000/api/files/', false); // Synchronous for now
        xhr.setRequestHeader('Authorization', `Token ${token}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();

        console.log('API Response Status:', xhr.status);
        
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log('🔍 STORAGE VISUALIZATION: Using real uploaded files from API');
            console.log('API Response:', response);
            console.log('Number of files:', response.length);
            console.log('File details:', response.map(f => ({ name: f.name, size: f.file_size, type: f.file_type })));
            return response || [];
    } else {
            console.log('🔍 STORAGE VISUALIZATION: API failed with status', xhr.status, 'using sample data');
            return getSampleFiles();
        }
    } catch (error) {
        console.error('Error fetching uploaded files:', error);
        console.log('🔍 STORAGE VISUALIZATION: Exception occurred, using sample data');
        return getSampleFiles();
    }
}

function getSampleFiles() {
    return [
        { name: 'batman.jpg', size: 2500000 }, // 2.5MB photo
        { name: 'document.pdf', size: 1500000 }, // 1.5MB document
        { name: 'video.mp4', size: 5000000 }, // 5MB video
        { name: 'music.mp3', size: 800000 }, // 800KB audio (others)
    ];
}

function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    if (bytes >= 1024 * 1024 * 1024) {
        return `${Math.round(bytes / (1024 * 1024 * 1024) * 100) / 100} GB`;
    } else if (bytes >= 1024 * 1024) {
        return `${Math.round(bytes / (1024 * 1024) * 100) / 100} MB`;
    } else if (bytes >= 1024) {
        return `${Math.round(bytes / 1024 * 100) / 100} KB`;
    } else {
        return `${bytes} B`;
    }
}

function updateStorageLegend(legendContainer, fileBreakdown) {
    legendContainer.innerHTML = '';
    
    fileBreakdown.forEach(category => {
        // Always show all categories, even if they have 0 bytes
        const legendItem = document.createElement('div');
        legendItem.className = 'col-md-6 mb-2';
        legendItem.innerHTML = `
            <div class="legend-item">
                <div class="legend-color ${category.type}"></div>
                <div class="legend-text">${category.name}</div>
                <div class="legend-size">${category.displaySize}</div>
            </div>
        `;
        legendContainer.appendChild(legendItem);
    });
}

function updateStorageBreakdown(breakdownContainer, fileBreakdown) {
    breakdownContainer.innerHTML = '';
    
    // Add header
    const header = document.createElement('div');
    header.className = 'breakdown-item';
    header.style.borderBottom = '2px solid var(--kelly-gray-300)';
    header.style.fontWeight = '600';
    header.innerHTML = `
        <div class="breakdown-name">
            <i class="fas fa-folder-open" style="color: var(--kelly-primary); margin-right: 8px;"></i>
            File Categories
        </div>
        <div class="breakdown-size">Size</div>
    `;
    breakdownContainer.appendChild(header);
    
    // Add breakdown items - always show all categories
    fileBreakdown.forEach(category => {
            const breakdownItem = document.createElement('div');
            breakdownItem.className = 'breakdown-item';
            
            // Get appropriate icon for each category
            let icon = 'fas fa-file';
            switch (category.type) {
                case 'documents':
                    icon = 'fas fa-file-alt';
                    break;
                case 'photos':
                    icon = 'fas fa-images';
                    break;
                case 'videos':
                    icon = 'fas fa-video';
                    break;
                case 'others':
                    icon = 'fas fa-folder';
                    break;
            }
            
            breakdownItem.innerHTML = `
                <div class="breakdown-name">
                    <div class="breakdown-icon ${category.type}">
                        <i class="${icon}"></i>
                    </div>
                    ${category.name}
                </div>
                <div class="breakdown-size">${category.displaySize}</div>
            `;
            breakdownContainer.appendChild(breakdownItem);
    });
}


// Navigation functionality for new dashboard
function initializeNavigation() {
    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('[data-section]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.closest('[data-section]').dataset.section;
            showSection(section);
        });
    });
    
    // Initialize dashboard data
    loadDashboardData();
    
    // Profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', updateProfile);
    }
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionName) {
            link.classList.add('active');
        }
    });
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const titles = {
            'dashboard': 'Dashboard',
            'files': 'My Files',
            'upload': 'Upload Files',
            'analytics': 'Analytics',
            'plans': 'Subscription Plans',
            'profile': 'Profile Settings',
            'settings': 'Account Settings'
        };
        pageTitle.textContent = titles[sectionName] || 'Dashboard';
    }
    
    // Load section-specific data
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'files':
            loadFilesSection();
            break;
        case 'plans':
            loadPlansSection();
            break;
        case 'analytics':
            loadAnalyticsSection();
            break;
        case 'profile':
            loadProfileSection();
            break;
    }
}

async function loadDashboardData() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        // Load user subscription data
        const subscriptionResponse = await fetch('http://localhost:8000/api/user-subscription/?t=' + Date.now(), {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        
        if (subscriptionResponse.ok) {
            const subscriptionData = await subscriptionResponse.json();
            updateDashboardStats(subscriptionData);
        }
        
        // Load files for recent files
        const filesResponse = await fetch('http://localhost:8000/api/files/', {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        
        if (filesResponse.ok) {
            const files = await filesResponse.json();
            updateRecentFiles(files);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function updateDashboardStats(subscriptionData) {
    const storageInfo = subscriptionData.storage_info;
    
    // Update storage used display
    const storageUsedDisplay = document.getElementById('storageUsedDisplay');
    if (storageUsedDisplay) {
        let usedDisplay;
        const usedBytes = storageInfo.current_usage_bytes;
        if (usedBytes >= 1024 * 1024 * 1024) {
            usedDisplay = `${Math.round(usedBytes / (1024 * 1024 * 1024) * 100) / 100} GB`;
        } else if (usedBytes >= 1024 * 1024) {
            usedDisplay = `${Math.round(usedBytes / (1024 * 1024) * 100) / 100} MB`;
        } else if (usedBytes >= 1024) {
            usedDisplay = `${Math.round(usedBytes / 1024 * 100) / 100} KB`;
        } else {
            usedDisplay = `${usedBytes} bytes`;
        }
        storageUsedDisplay.textContent = usedDisplay;
    }
    
    // Update current plan display
    const currentPlanDisplay = document.getElementById('currentPlanDisplay');
    if (currentPlanDisplay) {
        currentPlanDisplay.textContent = subscriptionData.plan_type.charAt(0).toUpperCase() + subscriptionData.plan_type.slice(1);
    }
    
    // Storage visualization is now handled by updateICloudStorageDisplay function
}

function updateRecentFiles(files) {
    const recentFilesList = document.getElementById('recentFilesList');
    if (!recentFilesList) return;
    
    if (!Array.isArray(files) || files.length === 0) {
        recentFilesList.innerHTML = '<p class="text-muted text-center py-4">No files uploaded yet</p>';
        return;
    }
    
    // Show last 5 files
    const recentFiles = files.slice(-5).reverse();
    recentFilesList.innerHTML = recentFiles.map(file => `
        <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
            <div class="d-flex align-items-center">
                <i class="fas fa-file me-2 text-muted"></i>
                <div>
                    <div class="fw-medium">${file.name}</div>
                    <small class="text-muted">${new Date(file.upload_date).toLocaleDateString()}</small>
                </div>
            </div>
            <span class="badge bg-secondary">${file.file_type}</span>
        </div>
    `).join('');
    
    // Update total files count
    const totalFilesDisplay = document.getElementById('totalFilesDisplay');
    if (totalFilesDisplay) {
        totalFilesDisplay.textContent = files.length;
    }
}

async function loadFilesSection() {
    // Use the working fetchFiles function instead of duplicating logic
    await fetchFiles();
}

async function loadPlansSection() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch('http://localhost:8000/api/subscriptions/?t=' + Date.now());
        if (response.ok) {
            const plans = await response.json();
            displayPlans(plans);
        }
    } catch (error) {
        console.error('Error loading plans:', error);
    }
}

function displayPlans(plans) {
    const plansContainer = document.getElementById('plansContainer');
    if (!plansContainer) return;
    
    plansContainer.innerHTML = plans.map(plan => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 pricing-card plan-${plan.plan_type}">
                <div class="card-header text-center">
                    <h3>${plan.plan_display}</h3>
                </div>
                <div class="card-body text-center">
                    <h4 class="card-title">R${plan.price_monthly} / month</h4>
                    <ul class="list-unstyled mt-3 mb-4">
                        <li><strong>${plan.storage_limit_gb >= 1024 ? Math.round(plan.storage_limit_gb / 1024 * 100) / 100 + ' TB' : plan.storage_limit_gb + ' GB'} Storage</strong></li>
                        <li>${plan.features.features || 'Essential Cloud Features'}</li>
                        <li>${plan.features.security || 'Basic Data Protection'}</li>
                        <li>${plan.features.speed || 'Standard Access Speed'}</li>
                        <li>${plan.features.support || 'Email Support'}</li>
                        <li>${plan.features.versioning || 'Limited File Versioning'}</li>
                    </ul>
                    <button class="btn btn-primary" onclick="selectPlan('${plan.plan_type}')">Choose ${plan.plan_display}</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function loadProfileSection() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        // Load user profile data
        const username = localStorage.getItem('username');
        const profileUsername = document.getElementById('profileUsername');
        if (profileUsername) {
            profileUsername.value = username;
        }
        
        // Load subscription data for profile
        const subscriptionResponse = await fetch('http://localhost:8000/api/user-subscription/?t=' + Date.now(), {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        
        // Load files data for total count
        const filesResponse = await fetch('http://localhost:8000/api/files/', {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        
        if (subscriptionResponse.ok && filesResponse.ok) {
            const subscriptionData = await subscriptionResponse.json();
            const filesData = await filesResponse.json();
            updateProfileInfo(subscriptionData, filesData);
        }
        
        // Load current user data for form
        await loadCurrentUserData();
        
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

function updateProfileInfo(subscriptionData, filesData) {
    const profileCurrentPlan = document.getElementById('profileCurrentPlan');
    const profileStorageUsed = document.getElementById('profileStorageUsed');
    const profileMemberSince = document.getElementById('profileMemberSince');
    const profileTotalFiles = document.getElementById('profileTotalFiles');
    
    if (profileCurrentPlan) {
        profileCurrentPlan.textContent = subscriptionData.plan_type.charAt(0).toUpperCase() + subscriptionData.plan_type.slice(1);
    }
    
    if (profileStorageUsed) {
        const usedBytes = subscriptionData.storage_info.current_usage_bytes;
        let usedDisplay;
        if (usedBytes >= 1024 * 1024 * 1024) {
            usedDisplay = `${Math.round(usedBytes / (1024 * 1024 * 1024) * 100) / 100} GB`;
        } else if (usedBytes >= 1024 * 1024) {
            usedDisplay = `${Math.round(usedBytes / (1024 * 1024) * 100) / 100} MB`;
        } else if (usedBytes >= 1024) {
            usedDisplay = `${Math.round(usedBytes / 1024 * 100) / 100} KB`;
        } else {
            usedDisplay = `${usedBytes} bytes`;
        }
        profileStorageUsed.textContent = usedDisplay;
    }
    
    if (profileMemberSince) {
        profileMemberSince.textContent = new Date(subscriptionData.start_date).getFullYear();
    }
    
    if (profileTotalFiles && filesData) {
        const totalFiles = Array.isArray(filesData) ? filesData.length : 0;
        profileTotalFiles.textContent = totalFiles;
    }
}

async function loadCurrentUserData() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch('http://localhost:8000/api/profile/', {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        
        if (response.ok) {
            const userData = await response.json();
            populateProfileForm(userData);
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function populateProfileForm(userData) {
    const profileEmail = document.getElementById('profileEmail');
    const profileFirstName = document.getElementById('profileFirstName');
    const profileLastName = document.getElementById('profileLastName');
    
    if (profileEmail) {
        profileEmail.value = userData.email || '';
    }
    if (profileFirstName) {
        profileFirstName.value = userData.first_name || '';
    }
    if (profileLastName) {
        profileLastName.value = userData.last_name || '';
    }
}

async function updateProfile(event) {
    event.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const profileEmail = document.getElementById('profileEmail');
    const profileFirstName = document.getElementById('profileFirstName');
    const profileLastName = document.getElementById('profileLastName');
    
    const updateData = {
        email: profileEmail.value,
        first_name: profileFirstName.value,
        last_name: profileLastName.value
    };
    
    try {
        const response = await fetch('http://localhost:8000/api/profile/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
            alert('Profile updated successfully!');
            // Reload profile data to show updated information
            await loadCurrentUserData();
        } else {
            const errorData = await response.json();
            alert('Error updating profile: ' + (errorData.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please try again.');
    }
}

// Global deleteFile function for use in new dashboard sections
async function deleteFile(fileId) {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch(`http://localhost:8000/api/files/${fileId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        
        if (response.ok) {
            displayMessage('File deleted successfully!', 'success');
            
            // Refresh dashboard data
            loadDashboardData();
            
            // Refresh files section if it's currently active
            const currentSection = document.querySelector('.content-section.active');
            if (currentSection && currentSection.id === 'files-section') {
                loadFilesSection();
            }
        } else {
            const errorData = await response.json();
            displayMessage(errorData.error || 'File deletion failed.', 'danger');
        }
    } catch (error) {
        console.error('Error during file deletion:', error);
        displayMessage('An error occurred during file deletion.', 'danger');
    }
}

async function downloadFile(fileId) {
    const token = localStorage.getItem('token');
    if (!token) {
        displayMessage('Please log in to download files.', 'danger');
        return;
    }
    
    try {
        showLoadingIndicator();
        
        const response = await fetch(`http://localhost:8000/api/files/${fileId}/download/`, {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        
        if (response.ok) {
            // Get filename from Content-Disposition header or use a default
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'download';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }
            
            // Create blob and download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            displayMessage('File downloaded successfully!', 'success');
            
            // Refresh analytics to show updated download count
            const currentSection = document.querySelector('.content-section.active');
            if (currentSection && currentSection.id === 'analytics-section') {
                loadAnalyticsSection();
            }
        } else {
            const errorData = await response.json();
            displayMessage(errorData.error || 'Download failed.', 'danger');
        }
    } catch (error) {
        console.error('Error downloading file:', error);
        displayMessage('An error occurred during file download.', 'danger');
    } finally {
        hideLoadingIndicator();
    }
}

// Analytics functionality
async function loadAnalyticsSection() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        // Load analytics data from dedicated endpoint
        const analyticsResponse = await fetch('http://localhost:8000/api/analytics/', {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        
        if (analyticsResponse.ok) {
            const analyticsData = await analyticsResponse.json();
            updateAnalyticsData(analyticsData);
            
            // Also load files for charts
        const filesResponse = await fetch('http://localhost:8000/api/files/', {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        
        if (filesResponse.ok) {
            const files = await filesResponse.json();
            createAnalyticsCharts(files);
                // Populate Recent Activity and Storage Breakdown panels
                updateRecentActivity(files);
                updateFilesStorageBreakdown(files);
            }
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

function updateAnalyticsData(analyticsData) {
    // Update analytics overview cards with real data
    const analyticsFilesUploaded = document.getElementById('analyticsFilesUploaded');
    const analyticsFilesDownloaded = document.getElementById('analyticsFilesDownloaded');
    const analyticsFilesDeleted = document.getElementById('analyticsFilesDeleted');
    const analyticsActiveDays = document.getElementById('analyticsActiveDays');
    
    if (analyticsFilesUploaded) {
        analyticsFilesUploaded.textContent = analyticsData.uploaded;
    }
    
    if (analyticsFilesDownloaded) {
        analyticsFilesDownloaded.textContent = analyticsData.downloaded;
    }
    
    if (analyticsFilesDeleted) {
        analyticsFilesDeleted.textContent = analyticsData.deleted;
    }
    
    if (analyticsActiveDays) {
        analyticsActiveDays.textContent = analyticsData.active_days;
    }
    
    console.log('Analytics updated with real data:', analyticsData);
}

function updateRecentActivity(files) {
    const recentActivityList = document.getElementById('recentActivityList');
    if (!recentActivityList) return;
    
    if (files.length === 0) {
        recentActivityList.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="fas fa-history fs-1 mb-3"></i>
                <p>No recent activity</p>
            </div>
        `;
        return;
    }
    
    // Sort files by upload date (most recent first)
    const sortedFiles = files.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
    
    // Show last 5 activities
    const recentFiles = sortedFiles.slice(0, 5);
    
    recentActivityList.innerHTML = recentFiles.map(file => {
        const timeAgo = getTimeAgo(new Date(file.upload_date));
        return `
            <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
                <div class="d-flex align-items-center">
                    <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="fas fa-upload text-white"></i>
                    </div>
                    <div>
                        <div class="fw-medium">Uploaded ${file.name}</div>
                        <small class="text-muted">${file.size_mb} MB • ${file.file_type}</small>
                    </div>
                </div>
                <small class="text-muted">${timeAgo}</small>
            </div>
        `;
    }).join('');
}

function updateFilesStorageBreakdown(files) {
    // Prefer analytics panel container if present; otherwise fall back to dashboard breakdown
    const storageBreakdown = document.getElementById('analyticsStorageBreakdown')
        || document.getElementById('storageBreakdown');
    if (!storageBreakdown) return;
    
    if (files.length === 0) {
        storageBreakdown.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="fas fa-hdd fs-1 mb-3"></i>
                <p>No files to analyze</p>
            </div>
        `;
        return;
    }
    
    // Calculate storage by file type
    const storageByType = {};
    let totalSize = 0;
    
    files.forEach(file => {
        const type = file.file_type || 'unknown';
        const size = file.file_size || 0;
        
        if (!storageByType[type]) {
            storageByType[type] = 0;
        }
        storageByType[type] += size;
        totalSize += size;
    });
    
    // Sort by size (largest first)
    const sortedTypes = Object.entries(storageByType)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5); // Show top 5 file types
    
    if (sortedTypes.length === 0) {
        storageBreakdown.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="fas fa-hdd fs-1 mb-3"></i>
                <p>No storage data available</p>
            </div>
        `;
        return;
    }
    
    storageBreakdown.innerHTML = sortedTypes.map(([type, size]) => {
        const percentage = totalSize > 0 ? (size / totalSize * 100) : 0;
        const sizeMB = (size / (1024 * 1024)).toFixed(2);
        
        return `
            <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
                <div class="d-flex align-items-center">
                    <div class="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 32px; height: 32px;">
                        <i class="fas fa-file text-white" style="font-size: 12px;"></i>
                    </div>
                    <div>
                        <div class="fw-medium">${type.toUpperCase()}</div>
                        <small class="text-muted">${sizeMB} MB</small>
                    </div>
                </div>
                <div class="text-end">
                    <div class="fw-medium">${percentage.toFixed(1)}%</div>
                    <div class="progress" style="width: 60px; height: 4px;">
                        <div class="progress-bar bg-primary" style="width: ${percentage}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterFilesByDate(files) {
    try {
        const datePreset = document.getElementById('fileDatePreset');
        if (!datePreset) return files;

        const preset = datePreset.value || 'all';
        if (preset === 'all') return files;

        const now = new Date();
        let startDate = null;
        let endDate = null;

        switch (preset) {
            case '7d':
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '6m':
                startDate = new Date(now);
                startDate.setMonth(startDate.getMonth() - 6);
                break;
            case '1y':
                startDate = new Date(now);
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            // custom removed for now
        }

        return files.filter(f => {
            const uploaded = new Date(f.upload_date);
            if (startDate && uploaded < startDate) return false;
            if (endDate && uploaded > endDate) return false;
            return true;
        });
    } catch (e) {
        console.error('Date filtering error:', e);
        return files;
    }
}

function filterFilesByQuery(files) {
    try {
        const input = document.getElementById('fileSearch');
        if (!input) return files;
        const q = (input.value || '').trim().toLowerCase();
        if (!q) return files;

        return files.filter(f => {
            const name = (f.name || '').toLowerCase();
            const type = (f.file_type || '').toLowerCase();
            return name.includes(q) || type.includes(q);
        });
    } catch (e) {
        console.error('Search filtering error:', e);
        return files;
    }
}
function createAnalyticsCharts(files) {
    // Create storage usage over time chart
    createStorageChart(files);
    
    // Create storage composition pie
    createFileTypesChart(files);
    // Create weekly uploads heatmap
    createUploadsHeatmap(files);
}

function createStorageChart(files) {
    const ctx = document.getElementById('storageChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (window.storageChartInstance) {
        window.storageChartInstance.destroy();
    }
    
    // Generate daily storage usage data (last 7 days)
    const last7Days = [];
    const storageData = [];
    const storageByTypePerDay = {};
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        last7Days.push(label);
        
        // Calculate storage used on this specific day only
        const dayFiles = files.filter(file => {
            const fileDate = new Date(file.upload_date);
            const fileDateOnly = new Date(fileDate.getFullYear(), fileDate.getMonth(), fileDate.getDate());
            const targetDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return fileDateOnly.getTime() === targetDateOnly.getTime();
        });
        
        const dayStorage = dayFiles.reduce((total, file) => total + (file.file_size || 0), 0);
        storageData.push(dayStorage / (1024 * 1024)); // Convert to MB

        // Build per-type buckets for stacked mode
        const bucket = {};
        dayFiles.forEach(f => {
            const t = (f.file_type || 'unknown').toUpperCase();
            bucket[t] = (bucket[t] || 0) + (f.file_size || 0);
        });
        storageByTypePerDay[label] = bucket;
    }
    
    const mode = (window.storageChartMode || 'line');
    const datasets = [];
    if (mode === 'line') {
        // Base line data
        datasets.push({
                label: 'Daily Storage Added (MB)',
                data: storageData,
                borderColor: '#007aff',
                backgroundColor: 'rgba(0, 122, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#007aff',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6
        });
        // 3-day moving average overlay
        const ma = storageData.map((_, idx, arr) => {
            const a = Math.max(0, idx - 1);
            const b = Math.min(arr.length - 1, idx + 1);
            let sum = 0, count = 0;
            for (let i = a; i <= b; i++) { sum += arr[i]; count++; }
            return +(sum / count).toFixed(2);
        });
        datasets.push({
            label: '3‑day Avg (MB)',
            data: ma,
            borderColor: '#34c759',
            backgroundColor: 'transparent',
            borderDash: [6, 6],
            borderWidth: 2,
            fill: false,
            tension: 0.2,
            pointRadius: 0
        });
        // Optional 7-day moving average
        if (window.enable7DayMA) {
            const ma7 = storageData.map((_, idx, arr) => {
                const a = Math.max(0, idx - 3);
                const b = Math.min(arr.length - 1, idx + 3);
                let sum = 0, count = 0;
                for (let i = a; i <= b; i++) { sum += arr[i]; count++; }
                return +(sum / count).toFixed(2);
            });
            datasets.push({
                label: '7‑day Avg (MB)',
                data: ma7,
                borderColor: '#af52de',
                backgroundColor: 'transparent',
                borderDash: [4, 4],
                borderWidth: 2,
                fill: false,
                tension: 0.2,
                pointRadius: 0
            });
        }
    } else if (mode === 'bar') {
        // Bar mode
        datasets.push({
            label: 'Daily Storage Added (MB)',
            data: storageData,
            backgroundColor: 'rgba(0, 122, 255, 0.7)',
            borderColor: '#007aff',
            borderWidth: 1,
            borderRadius: 0
        });
    } else if (mode === 'stacked') {
        // Stacked by high-level category per day (Documents, Photos, Videos, Others)
        const toCategory = (t) => {
            const x = (t || '').toLowerCase();
            if (['jpg','jpeg','png','gif','bmp','tiff','heif','heic','webp','avif'].includes(x)) return 'Photos';
            if (['mp4','mov','avi','wmv','flv','f4v','mkv','webm','m4v','3gp','ts'].includes(x)) return 'Videos';
            if (['pdf','doc','docx','odt','rtf','wps','epub','mobi','xls','xlsx','ods','csv','tsv','ppt','pptx','odp','key','xml','json','yaml','md','tex'].includes(x)) return 'Documents';
            return 'Others';
        };
        const categories = ['Documents','Photos','Videos','Others'];
        const colors = ['#007aff','#ffcc00','#ff3b30','#8e8e93'];
        categories.forEach((cat, idx) => {
            const data = last7Days.map(label => {
                const bucket = storageByTypePerDay[label] || {};
                const bytes = Object.entries(bucket).reduce((sum, [type, b]) => sum + (toCategory(type) === cat ? b : 0), 0);
                return +(bytes / (1024*1024)).toFixed(2);
            });
            datasets.push({ type: 'bar', label: cat, data, backgroundColor: colors[idx], stack: 'cats', borderWidth: 0 });
        });
    } else if (mode === 'area') {
        // Cumulative area chart
        const cumulative = storageData.reduce((arr, v) => {
            const prev = arr.length ? arr[arr.length-1] : 0;
            arr.push(+(prev + v).toFixed(2));
            return arr;
        }, []);
        datasets.push({
            label: 'Cumulative Storage (MB)',
            data: cumulative,
            borderColor: '#007aff',
            backgroundColor: 'rgba(0, 122, 255, 0.25)',
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            pointRadius: 0
        });
    }

    window.storageChartInstance = new Chart(ctx, {
        type: (mode === 'bar' || mode === 'stacked') ? 'bar' : 'line',
        data: {
            labels: last7Days,
            datasets
        },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 2,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + ' MB';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
    });
    // Enable stacked scales dynamically
    if (mode === 'stacked' && window.storageChartInstance && window.storageChartInstance.options) {
        window.storageChartInstance.options.scales.x.stacked = true;
        window.storageChartInstance.options.scales.y.stacked = true;
        window.storageChartInstance.update();
    }
}

function createUploadsHeatmap(files) {
    const container = document.getElementById('uploadsHeatmap');
    if (!container) return;
    container.innerHTML = '';
    // GitHub-like 52 weeks columns, each column is a week (Sun..Sat)
    const weeks = 52;
    const today = new Date();
    // Start from the last Sunday
    const start = new Date(today);
    start.setDate(start.getDate() - ((start.getDay() + 7) % 7));
    // Map yyyy-mm-dd -> count
    const byDay = {};
    files.forEach(f => {
        const key = (f.upload_date || '').slice(0,10);
        if (key) byDay[key] = (byDay[key] || 0) + 1;
    });
    let max = 1;
    Object.values(byDay).forEach(v => { if (v > max) max = v; });
    for (let w = weeks - 1; w >= 0; w--) {
        const weekCol = document.createElement('div');
        weekCol.className = 'gh-week';
        for (let d = 0; d < 7; d++) {
            const cellDate = new Date(start);
            cellDate.setDate(cellDate.getDate() - (weeks - 1 - w) * 7 + d);
            const key = cellDate.toISOString().slice(0,10);
            const c = byDay[key] || 0;
            const ratio = c / max;
            const lv = c === 0 ? 0 : ratio < 0.25 ? 1 : ratio < 0.5 ? 2 : ratio < 0.75 ? 3 : 4;
            const cell = document.createElement('div');
            cell.className = `gh-cell gh-lv${lv}`;
            cell.title = `${c} upload${c===1?'':'s'} on ${cellDate.toDateString()}`;
            weekCol.appendChild(cell);
        }
        container.appendChild(weekCol);
    }
}

function createFileTypesChart(files) {
    const ctx = document.getElementById('fileTypesChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (window.fileTypesChartInstance) {
        window.fileTypesChartInstance.destroy();
    }

    const mode = window.filePieMode || 'categories';
    if (mode === 'categories') {
        const toCategory = (t) => {
            const x = (t || '').toLowerCase();
            if (['jpg','jpeg','png','gif','bmp','tiff','heif','heic','webp','avif'].includes(x)) return 'Photos';
            if (['mp4','mov','avi','wmv','flv','f4v','mkv','webm','m4v','3gp','ts'].includes(x)) return 'Videos';
            if (['pdf','doc','docx','odt','rtf','wps','epub','mobi','xls','xlsx','ods','csv','tsv','ppt','pptx','odp','key','xml','json','yaml','md','tex'].includes(x)) return 'Documents';
            return 'Others';
        };
        const bytesByCat = { Documents: 0, Photos: 0, Videos: 0, Others: 0 };
        files.forEach(f => {
            const cat = toCategory((f.file_type || 'unknown'));
            bytesByCat[cat] += (f.file_size || 0);
        });
        const labels = Object.keys(bytesByCat);
        const data = labels.map(k => +(bytesByCat[k] / (1024*1024)).toFixed(2));
        const colors = ['#007aff','#ffcc00','#ff3b30','#8e8e93'];
        window.fileTypesChartInstance = new Chart(ctx, {
            type: 'pie',
            data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, aspectRatio: 1, plugins: { legend: { position: 'bottom' } } }
        });
    } else {
        // Top 10 file TYPES by total size (pie)
        const bytesByType = {};
        files.forEach(f => {
            const t = (f.file_type || 'unknown').toUpperCase();
            bytesByType[t] = (bytesByType[t] || 0) + (f.file_size || 0);
        });
        const top = Object.entries(bytesByType)
            .map(([t, bytes]) => [t, +(bytes / (1024*1024)).toFixed(2)])
            .sort((a,b) => b[1] - a[1])
            .slice(0, 10);
        const labels = top.map(([t]) => t);
        const data = top.map(([,mb]) => mb);
        const colors = ['#007aff','#34c759','#ff9500','#ff3b30','#af52de','#5ac8fa','#ffcc00','#8e8e93','#30d158','#ff2d92'];
        window.fileTypesChartInstance = new Chart(ctx, {
            type: 'pie',
            data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
            options: {
                responsive: true, maintainAspectRatio: false, aspectRatio: 1,
                plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed} MB` } } }
            }
        });
    }
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Password visibility toggle functionality
function initializePasswordToggles() {
    // Toggle for login page
    const loginToggle = document.getElementById('togglePassword');
    const loginPassword = document.getElementById('password');
    const loginIcon = document.getElementById('togglePasswordIcon');
    
    if (loginToggle && loginPassword && loginIcon) {
        loginToggle.addEventListener('click', function() {
            togglePasswordVisibility(loginPassword, loginIcon);
        });
    }
    
    // Toggle for register page password
    const registerToggle = document.getElementById('toggleRegisterPassword');
    const registerPassword = document.getElementById('password');
    const registerIcon = document.getElementById('toggleRegisterPasswordIcon');
    
    if (registerToggle && registerPassword && registerIcon) {
        registerToggle.addEventListener('click', function() {
            togglePasswordVisibility(registerPassword, registerIcon);
        });
    }
    
    // Toggle for register page confirm password
    const confirmToggle = document.getElementById('toggleConfirmPassword');
    const confirmPassword = document.getElementById('confirm_password');
    const confirmIcon = document.getElementById('toggleConfirmPasswordIcon');
    
    if (confirmToggle && confirmPassword && confirmIcon) {
        confirmToggle.addEventListener('click', function() {
            togglePasswordVisibility(confirmPassword, confirmIcon);
        });
    }
    
    // Toggles for dashboard settings
    const currentPasswordToggle = document.getElementById('toggleCurrentPassword');
    const currentPassword = document.getElementById('currentPassword');
    const currentPasswordIcon = document.getElementById('toggleCurrentPasswordIcon');
    
    if (currentPasswordToggle && currentPassword && currentPasswordIcon) {
        currentPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility(currentPassword, currentPasswordIcon);
        });
    }
    
    const newPasswordToggle = document.getElementById('toggleNewPassword');
    const newPassword = document.getElementById('newPassword');
    const newPasswordIcon = document.getElementById('toggleNewPasswordIcon');
    
    if (newPasswordToggle && newPassword && newPasswordIcon) {
        newPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility(newPassword, newPasswordIcon);
        });
    }
    
    const dashboardConfirmToggle = document.getElementById('toggleConfirmPassword');
    const dashboardConfirmPassword = document.getElementById('confirmPassword');
    const dashboardConfirmIcon = document.getElementById('toggleConfirmPasswordIcon');
    
    if (dashboardConfirmToggle && dashboardConfirmPassword && dashboardConfirmIcon) {
        dashboardConfirmToggle.addEventListener('click', function() {
            togglePasswordVisibility(dashboardConfirmPassword, dashboardConfirmIcon);
        });
    }
}

function togglePasswordVisibility(passwordInput, iconElement) {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        iconElement.classList.remove('fa-eye');
        iconElement.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        iconElement.classList.remove('fa-eye-slash');
        iconElement.classList.add('fa-eye');
    }
}
