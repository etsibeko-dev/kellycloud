"use strict";
// Main TypeScript code will go here
// Function to display a message to the user
function displayMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    if (messageContainer) {
        messageContainer.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
        setTimeout(() => {
            messageContainer.innerHTML = '';
        }, 5000);
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
                    const response = await fetch('http://0.0.0.0:8000/api/login/', {
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
        const registerForm = document.querySelector('form');
        if (registerForm) {
            registerForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const usernameInput = registerForm.querySelector('#username');
                const emailInput = registerForm.querySelector('#email');
                const passwordInput = registerForm.querySelector('#password');
                const confirmPasswordInput = registerForm.querySelector('#confirm_password');
                const username = usernameInput.value;
                const email = emailInput.value;
                const password = passwordInput.value;
                const confirmPassword = confirmPasswordInput.value;
                
                if (!username || !email || !password || !confirmPassword) {
                    displayMessage('Please fill in all fields', 'danger');
                    return;
                }
                
                if (password !== confirmPassword) {
                    displayMessage('Passwords do not match!', 'danger');
                    return;
                }
                
                toggleLoadingSpinner('registerButton', true); // Show loading spinner
                try {
                    const response = await fetch('http://0.0.0.0:8000/api/register/', {
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
        const logoutButton = document.querySelector('#logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', async (event) => {
                event.preventDefault();
                showLoadingIndicator(); // Show loading indicator
                try {
                    const response = await fetch('http://0.0.0.0:8000/api/logout/', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    });
                    // Always clear local storage and redirect, regardless of API response
                        localStorage.removeItem('token');
                        localStorage.removeItem('username');
                        window.location.href = 'index.html';
                }
                catch (error) {
                    console.error('Error during logout:', error);
                    // Even if API fails, clear local storage and redirect
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    window.location.href = 'index.html';
                }
                finally {
                    hideLoadingIndicator(); // Hide loading indicator
                }
            });
        }
        const deleteFile = async (fileId) => {
            showLoadingIndicator(); // Show loading indicator
            try {
                const response = await fetch(`http://0.0.0.0:8000/api/files/${fileId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                if (response.ok) {
                    displayMessage('File deleted successfully!', 'success');
                    fetchFiles(); // Refresh the file list
                    loadUserSubscription(); // Refresh storage usage
                    // Also refresh dashboard data if we're in the files section
                    const currentSection = document.querySelector('.content-section.active');
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
        const fetchFiles = async () => {
            showLoadingIndicator(); // Show loading indicator
            try {
                const response = await fetch('http://0.0.0.0:8000/api/files/', {
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
                const filesTableBody = document.querySelector('#filesTableBody');
                if (filesTableBody) {
                    filesTableBody.innerHTML = ''; // Clear existing rows
                    if (Array.isArray(files)) {
                    files.forEach((file) => {
                        const row = filesTableBody.insertRow();
                        row.insertCell().textContent = file.name;
                        row.insertCell().textContent = file.file_type;
                        row.insertCell().textContent = new Date(file.upload_date).toLocaleDateString();
                        const actionsCell = row.insertCell();
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Delete';
                        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
                        deleteButton.dataset.fileId = file.id; // Assuming file has an 'id' property
                        actionsCell.appendChild(deleteButton);
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
                    } else {
                        console.error('Files response is not an array:', files);
                    }
                }
            }
            catch (error) {
                console.error('Error fetching files:', error);
            }
            finally {
                hideLoadingIndicator(); // Hide loading indicator
            }
        };
        fetchFiles();
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
                            
                            const response = await fetch('http://0.0.0.0:8000/api/files/', {
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
});

// Subscription management functions
async function loadSubscriptionPlans() {
    try {
        const response = await fetch('http://0.0.0.0:8000/api/subscriptions/?t=' + Date.now());
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
        const response = await fetch('http://0.0.0.0:8000/api/user-subscription/?t=' + Date.now(), {
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
        const response = await fetch('http://0.0.0.0:8000/api/user-subscription/?t=' + Date.now(), {
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
    // Update dashboard storage display
    const progressBar = document.getElementById('storageProgressBar');
    const storageText = document.getElementById('storageText');
    const storagePercentage = document.getElementById('storagePercentage');
    
    if (progressBar && storageText && storagePercentage) {
        const usedBytes = storageInfo.current_usage_bytes;
        const limitBytes = storageInfo.limit_bytes;
        const percentage = Math.min((usedBytes / limitBytes) * 100, 100);
        
        // Ensure minimum width for very low percentages
        const minWidth = percentage < 0.001 ? 0.1 : percentage;
        progressBar.style.width = `${minWidth}%`;
        
        // iCloud-style color coding based on usage
        if (percentage > 90) {
            progressBar.style.setProperty('background-color', '#ff3b30', 'important'); // Red for critical usage
        } else if (percentage > 80) {
            progressBar.style.setProperty('background-color', '#ff9500', 'important'); // Orange for high usage
        } else if (percentage > 60) {
            progressBar.style.setProperty('background-color', '#ffcc00', 'important'); // Yellow for moderate usage
        } else if (percentage > 30) {
            progressBar.style.setProperty('background-color', '#34c759', 'important'); // Green for normal usage
        } else {
            progressBar.style.setProperty('background-color', '#007aff', 'important'); // Blue for low usage (iCloud style)
        }
        
        // Format storage display with appropriate units
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
        
        storageText.textContent = `${usedDisplay} of ${limitDisplay} used`;
        storagePercentage.textContent = `${Math.round(percentage * 100) / 100}%`;
    }
    
    // Also update upload section storage display
    updateUploadStorageDisplay(storageInfo);
}

function updateUploadStorageDisplay(storageInfo) {
    const uploadProgressBar = document.getElementById('uploadStorageProgressBar');
    const uploadStorageText = document.getElementById('uploadStorageText');
    const uploadStoragePercentage = document.getElementById('uploadStoragePercentage');
    
    if (!uploadProgressBar || !uploadStorageText || !uploadStoragePercentage) {
        return; // Elements not found, skip update
    }
    
    const usedBytes = storageInfo.current_usage_bytes;
    const limitBytes = storageInfo.limit_bytes;
    const percentage = Math.min((usedBytes / limitBytes) * 100, 100);
    
    // Ensure minimum width for very low percentages
    const minWidth = percentage < 0.001 ? 0.1 : percentage;
    uploadProgressBar.style.width = `${minWidth}%`;
    
    // iCloud-style color coding based on usage
    if (percentage > 90) {
        uploadProgressBar.style.setProperty('background-color', '#ff3b30', 'important'); // Red for critical usage
    } else if (percentage > 80) {
        uploadProgressBar.style.setProperty('background-color', '#ff9500', 'important'); // Orange for high usage
    } else if (percentage > 60) {
        uploadProgressBar.style.setProperty('background-color', '#ffcc00', 'important'); // Yellow for moderate usage
    } else if (percentage > 30) {
        uploadProgressBar.style.setProperty('background-color', '#34c759', 'important'); // Green for normal usage
    } else {
        uploadProgressBar.style.setProperty('background-color', '#007aff', 'important'); // Blue for low usage (iCloud style)
    }
    
    // Format storage display with appropriate units
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
    
    uploadStorageText.textContent = `${usedDisplay} of ${limitDisplay} used`;
    uploadStoragePercentage.textContent = `${Math.round(percentage * 100) / 100}%`;
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
        const subscriptionResponse = await fetch('http://0.0.0.0:8000/api/user-subscription/?t=' + Date.now(), {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        
        if (subscriptionResponse.ok) {
            const subscriptionData = await subscriptionResponse.json();
            updateDashboardStats(subscriptionData);
        }
        
        // Load files for recent files
        const filesResponse = await fetch('http://0.0.0.0:8000/api/files/', {
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
    
    // Update storage progress bar
    const progressBar = document.getElementById('storageProgressBar');
    const storageText = document.getElementById('storageText');
    const storagePercentage = document.getElementById('storagePercentage');
    
    if (progressBar && storageText && storagePercentage) {
        const usedBytes = storageInfo.current_usage_bytes;
        const limitBytes = storageInfo.limit_bytes;
        const percentage = Math.min((usedBytes / limitBytes) * 100, 100);
        
        // Update progress bar
        const minWidth = percentage < 0.001 ? 0.1 : percentage;
        progressBar.style.width = `${minWidth}%`;
        
        // Apply iCloud-style colors
        if (percentage > 90) {
            progressBar.style.setProperty('background-color', '#ff3b30', 'important');
        } else if (percentage > 80) {
            progressBar.style.setProperty('background-color', '#ff9500', 'important');
        } else if (percentage > 60) {
            progressBar.style.setProperty('background-color', '#ffcc00', 'important');
        } else if (percentage > 30) {
            progressBar.style.setProperty('background-color', '#34c759', 'important');
        } else {
            progressBar.style.setProperty('background-color', '#007aff', 'important');
        }
        
        // Update text
        let usedDisplay, limitDisplay;
        if (usedBytes >= 1024 * 1024 * 1024) {
            usedDisplay = `${Math.round(usedBytes / (1024 * 1024 * 1024) * 100) / 100} GB`;
        } else if (usedBytes >= 1024 * 1024) {
            usedDisplay = `${Math.round(usedBytes / (1024 * 1024) * 100) / 100} MB`;
        } else if (usedBytes >= 1024) {
            usedDisplay = `${Math.round(usedBytes / 1024 * 100) / 100} KB`;
        } else {
            usedDisplay = `${usedBytes} bytes`;
        }
        
        if (storageInfo.limit_gb >= 1024) {
            limitDisplay = `${Math.round(storageInfo.limit_gb / 1024 * 100) / 100} TB`;
        } else {
            limitDisplay = `${storageInfo.limit_gb} GB`;
        }
        
        storageText.textContent = `${usedDisplay} of ${limitDisplay} used`;
        storagePercentage.textContent = `${Math.round(percentage * 100) / 100}%`;
    }
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
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch('http://0.0.0.0:8000/api/files/', {
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
        const filesTableBody = document.querySelector('#filesTableBody');
        if (filesTableBody) {
            filesTableBody.innerHTML = ''; // Clear existing content
            
            if (Array.isArray(files) && files.length > 0) {
                // Create table structure
                filesTableBody.innerHTML = `
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Size</th>
                                <th>Uploaded On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="filesTableRows">
                        </tbody>
                    </table>
                `;
                
                const filesTableRows = document.getElementById('filesTableRows');
                files.forEach((file) => {
                    const row = filesTableRows.insertRow();
                    row.innerHTML = `
                        <td>
                            <div class="d-flex align-items-center">
                                <i class="fas fa-file me-2 text-muted"></i>
                                <span>${file.name}</span>
                            </div>
                        </td>
                        <td><span class="badge bg-secondary">${file.file_type}</span></td>
                        <td>${file.size_mb} MB</td>
                        <td>${new Date(file.upload_date).toLocaleDateString()}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" data-file-id="${file.id}">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    `;
                });
                
                // Add event listeners to delete buttons
                filesTableRows.querySelectorAll('.btn-danger').forEach(button => {
                    button.addEventListener('click', async (event) => {
                        const fileId = event.target.closest('button').dataset.fileId;
                        if (fileId) {
                            await deleteFile(fileId);
                        }
                    });
                });
            } else {
                filesTableBody.innerHTML = `
                    <div class="text-center py-5">
                        <i class="fas fa-folder-open fs-1 text-muted mb-3"></i>
                        <h5 class="text-muted">No files uploaded yet</h5>
                        <p class="text-muted">Upload your first file to get started</p>
                        <button class="btn btn-primary" data-section="upload">
                            <i class="fas fa-upload me-2"></i>Upload Files
                        </button>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error fetching files:', error);
        const filesTableBody = document.querySelector('#filesTableBody');
        if (filesTableBody) {
            filesTableBody.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Error loading files. Please try again.
                </div>
            `;
        }
    }
}

async function loadPlansSection() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch('http://0.0.0.0:8000/api/subscriptions/?t=' + Date.now());
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
        const response = await fetch('http://0.0.0.0:8000/api/user-subscription/?t=' + Date.now(), {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            updateProfileInfo(data);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

function updateProfileInfo(subscriptionData) {
    const profileCurrentPlan = document.getElementById('profileCurrentPlan');
    const profileStorageUsed = document.getElementById('profileStorageUsed');
    const profileMemberSince = document.getElementById('profileMemberSince');
    
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
}

// Global deleteFile function for use in new dashboard sections
async function deleteFile(fileId) {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch(`http://0.0.0.0:8000/api/files/${fileId}/`, {
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

// Analytics functionality
async function loadAnalyticsSection() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        // Load files data for analytics
        const filesResponse = await fetch('http://0.0.0.0:8000/api/files/', {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        
        if (filesResponse.ok) {
            const files = await filesResponse.json();
            updateAnalyticsData(files);
            createAnalyticsCharts(files);
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

function updateAnalyticsData(files) {
    // Update analytics overview cards
    const analyticsFilesUploaded = document.getElementById('analyticsFilesUploaded');
    const analyticsFilesDownloaded = document.getElementById('analyticsFilesDownloaded');
    const analyticsFilesDeleted = document.getElementById('analyticsFilesDeleted');
    const analyticsActiveDays = document.getElementById('analyticsActiveDays');
    
    if (analyticsFilesUploaded) {
        analyticsFilesUploaded.textContent = files.length;
    }
    
    // For demo purposes, simulate some data
    if (analyticsFilesDownloaded) {
        analyticsFilesDownloaded.textContent = Math.floor(files.length * 0.3); // 30% of uploads
    }
    
    if (analyticsFilesDeleted) {
        analyticsFilesDeleted.textContent = Math.floor(files.length * 0.1); // 10% deleted
    }
    
    if (analyticsActiveDays) {
        // Calculate unique days from file upload dates
        const uniqueDays = new Set(files.map(file => 
            new Date(file.upload_date).toDateString()
        )).size;
        analyticsActiveDays.textContent = uniqueDays;
    }
    
    // Update recent activity
    updateRecentActivity(files);
    
    // Update storage breakdown
    updateStorageBreakdown(files);
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

function updateStorageBreakdown(files) {
    const storageBreakdown = document.getElementById('storageBreakdown');
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

function createAnalyticsCharts(files) {
    // Create storage usage over time chart
    createStorageChart(files);
    
    // Create file types distribution chart
    createFileTypesChart(files);
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
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last7Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Calculate storage used on this specific day only
        const dayFiles = files.filter(file => {
            const fileDate = new Date(file.upload_date);
            const fileDateOnly = new Date(fileDate.getFullYear(), fileDate.getMonth(), fileDate.getDate());
            const targetDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return fileDateOnly.getTime() === targetDateOnly.getTime();
        });
        
        const dayStorage = dayFiles.reduce((total, file) => total + (file.file_size || 0), 0);
        storageData.push(dayStorage / (1024 * 1024)); // Convert to MB
    }
    
    window.storageChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
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
            }]
        },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        display: false
                    }
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
}

function createFileTypesChart(files) {
    const ctx = document.getElementById('fileTypesChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (window.fileTypesChartInstance) {
        window.fileTypesChartInstance.destroy();
    }
    
    // Calculate file types distribution
    const typeCount = {};
    files.forEach(file => {
        const type = file.file_type || 'unknown';
        typeCount[type] = (typeCount[type] || 0) + 1;
    });
    
    const labels = Object.keys(typeCount);
    const data = Object.values(typeCount);
    const colors = [
        '#007aff', '#34c759', '#ff9500', '#ff3b30', '#af52de',
        '#ff2d92', '#5ac8fa', '#ffcc00', '#8e8e93', '#30d158'
    ];
    
    window.fileTypesChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.map(label => label.toUpperCase()),
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 0,
                cutout: '60%'
            }]
        },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 1,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
    });
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
