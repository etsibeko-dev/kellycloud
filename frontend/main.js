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
                toggleLoadingSpinner('loginButton', true); // Show loading spinner
                try {
                    const response = await fetch('http://127.0.0.1:8000/api/login/', {
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
                if (password !== confirmPassword) {
                    displayMessage('Passwords do not match!', 'danger');
                    return;
                }
                toggleLoadingSpinner('registerButton', true); // Show loading spinner
                try {
                    const response = await fetch('http://127.0.0.1:8000/api/register/', {
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
                    const response = await fetch('http://127.0.0.1:8000/api/logout/', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    });
                    if (response.ok) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('username');
                        window.location.href = 'index.html';
                    }
                    else {
                        const errorData = await response.json();
                        displayMessage(errorData.error || 'Logout failed.', 'danger');
                    }
                }
                catch (error) {
                    console.error('Error during logout:', error);
                    displayMessage('An error occurred during logout.', 'danger');
                }
                finally {
                    hideLoadingIndicator(); // Hide loading indicator
                }
            });
        }
        const deleteFile = async (fileId) => {
            showLoadingIndicator(); // Show loading indicator
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/files/${fileId}/`, {
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
                const response = await fetch('http://127.0.0.1:8000/api/files/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                const files = await response.json();
                const filesTableBody = document.querySelector('#filesTableBody');
                if (filesTableBody) {
                    filesTableBody.innerHTML = ''; // Clear existing rows
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
        const uploadForm = document.querySelector('form');
        if (uploadForm) {
            uploadForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const fileNameInput = uploadForm.querySelector('#fileName');
                const fileTypeInput = uploadForm.querySelector('#fileType');
                const name = fileNameInput.value;
                const file_type = fileTypeInput.value;
                toggleLoadingSpinner('uploadButton', true); // Show loading spinner
                try {
                    const response = await fetch('http://127.0.0.1:8000/api/files/upload/', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name, file_type }),
                    });
                    if (response.ok) {
                        displayMessage('File uploaded successfully!', 'success');
                        fetchFiles(); // Refresh the file list
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
                }
            });
        }
    }
});
