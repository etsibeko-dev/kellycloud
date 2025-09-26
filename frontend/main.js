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
    // Create or update storage info display
    let storageDisplay = document.querySelector('#storageInfo');
    if (!storageDisplay) {
        storageDisplay = document.createElement('div');
        storageDisplay.id = 'storageInfo';
        storageDisplay.className = 'card mb-4';
        storageDisplay.innerHTML = `
            <div class="card-header">
                <h5>Storage Usage</h5>
            </div>
            <div class="card-body">
                <div class="progress mb-2" style="height: 8px; border-radius: 4px; background-color: #f0f0f0;">
                    <div class="progress-bar" role="progressbar" style="width: 0%; border-radius: 4px; transition: all 0.3s ease;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <small class="text-muted">
                    <span id="storageUsed">0 MB</span> of <span id="storageLimit">${storageInfo.limit_gb} GB</span> used
                </small>
            </div>
        `;
        
        // Insert before the upload form
        const uploadForm = document.querySelector('form');
        if (uploadForm) {
            uploadForm.parentNode.insertBefore(storageDisplay, uploadForm);
        }
    }
    
    // Update progress bar and text
    const progressBar = storageDisplay.querySelector('.progress-bar');
    const storageUsed = storageDisplay.querySelector('#storageUsed');
    const storageLimit = storageDisplay.querySelector('#storageLimit');
    
    const usedBytes = storageInfo.current_usage_bytes;
    const limitBytes = storageInfo.limit_bytes;
    const percentage = Math.min((usedBytes / limitBytes) * 100, 100);
    
    // Ensure minimum width for very low percentages
    const minWidth = percentage < 0.001 ? 0.1 : percentage;
    progressBar.style.width = `${minWidth}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
    progressBar.textContent = `${Math.round(percentage * 100) / 100}%`;
    
    // iCloud-style color coding based on usage
    console.log('Storage percentage:', percentage); // Debug log
    console.log('Progress bar element:', progressBar); // Debug log
    
    // Remove any existing color classes first
    progressBar.className = 'progress-bar';
    
    if (percentage > 90) {
        progressBar.style.setProperty('background-color', '#ff3b30', 'important'); // Red for critical usage
        console.log('Applied RED color for critical usage');
    } else if (percentage > 80) {
        progressBar.style.setProperty('background-color', '#ff9500', 'important'); // Orange for high usage
        console.log('Applied ORANGE color for high usage');
    } else if (percentage > 60) {
        progressBar.style.setProperty('background-color', '#ffcc00', 'important'); // Yellow for moderate usage
        console.log('Applied YELLOW color for moderate usage');
    } else if (percentage > 30) {
        progressBar.style.setProperty('background-color', '#34c759', 'important'); // Green for normal usage
        console.log('Applied GREEN color for normal usage');
    } else {
        progressBar.style.setProperty('background-color', '#007aff', 'important'); // Blue for low usage (iCloud style)
        console.log('Applied BLUE color for low usage');
    }
    
    // Force a style refresh
    progressBar.style.display = 'none';
    progressBar.offsetHeight; // Trigger reflow
    progressBar.style.display = '';
    
    console.log('Final applied color:', progressBar.style.backgroundColor); // Debug log
    
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
    
    storageUsed.textContent = usedDisplay;
    storageLimit.textContent = limitDisplay;
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
    // This will be called when files section is shown
    // The existing fetchFiles function will handle the loading
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
            <div class="card h-100">
                <div class="card-header text-center">
                    <h5>${plan.plan_display}</h5>
                </div>
                <div class="card-body text-center">
                    <h4 class="card-title">R${plan.price_monthly} / month</h4>
                    <ul class="list-unstyled mt-3 mb-4">
                        <li><strong>${plan.storage_limit_gb >= 1024 ? Math.round(plan.storage_limit_gb / 1024 * 100) / 100 + ' TB' : plan.storage_limit_gb + ' GB'} Storage</strong></li>
                        <li>${plan.features.core_features}</li>
                        <li>${plan.features.data_protection}</li>
                        <li>${plan.features.access_speed}</li>
                        <li>${plan.features.support}</li>
                        <li>${plan.features.file_versioning}</li>
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
