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
        const usernameDisplay = document.querySelector('#usernameDisplay');
        if (usernameDisplay) {
            usernameDisplay.textContent = username;
        }
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
                const file = fileInput.files[0];
                
                if (!file) {
                    displayMessage('Please select a file to upload.', 'danger');
                    return;
                }
                
                // Use custom name if provided, otherwise use original filename
                const name = fileNameInput.value.trim() || file.name;
                
                toggleLoadingSpinner('uploadButton', true); // Show loading spinner
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
                        displayMessage('File uploaded successfully!', 'success');
                        fetchFiles(); // Refresh the file list
                        loadUserSubscription(); // Refresh storage usage
                    }
                    else {
                        const errorData = await response.json();
                        displayMessage(errorData.error || 'File upload failed.', 'danger');
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
    
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
    progressBar.textContent = `${Math.round(percentage * 100) / 100}%`;
    
    // iCloud-style color coding based on usage
    if (percentage > 90) {
        progressBar.className = 'progress-bar';
        progressBar.style.backgroundColor = '#ff3b30'; // Red for critical usage
    } else if (percentage > 80) {
        progressBar.className = 'progress-bar';
        progressBar.style.backgroundColor = '#ff9500'; // Orange for high usage
    } else if (percentage > 60) {
        progressBar.className = 'progress-bar';
        progressBar.style.backgroundColor = '#ffcc00'; // Yellow for moderate usage
    } else if (percentage > 30) {
        progressBar.className = 'progress-bar';
        progressBar.style.backgroundColor = '#34c759'; // Green for normal usage
    } else {
        progressBar.className = 'progress-bar';
        progressBar.style.backgroundColor = '#007aff'; // Blue for low usage (iCloud style)
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
    
    storageUsed.textContent = usedDisplay;
    storageLimit.textContent = limitDisplay;
}
