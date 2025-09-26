// Main TypeScript code will go here

function displayMessage(containerId: string, message: string, type: 'success' | 'danger') {
    const container = document.getElementById(containerId);
    if (container) {
        container.textContent = message;
        container.classList.remove('d-none', 'alert-success', 'alert-danger');
        container.classList.add(`alert-${type}`);
        setTimeout(() => {
            container.classList.add('d-none');
            container.textContent = '';
        }, 5000); // Hide message after 5 seconds
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('login.html')) {
        const loginForm = document.querySelector('form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const usernameInput = loginForm.querySelector('#username') as HTMLInputElement;
                const passwordInput = loginForm.querySelector('#password') as HTMLInputElement;

                const username = usernameInput.value;
                const password = passwordInput.value;

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
                    } else {
                        displayMessage('messageContainer', data.error || 'Login failed', 'danger');
                    }
                } catch (error) {
                    console.error('Error during login:', error);
                    displayMessage('messageContainer', 'An error occurred during login.', 'danger');
                }
            });
        }
    } else if (window.location.pathname.endsWith('register.html')) {
        const registerForm = document.querySelector('form');
        if (registerForm) {
            registerForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const usernameInput = registerForm.querySelector('#username') as HTMLInputElement;
                const emailInput = registerForm.querySelector('#email') as HTMLInputElement;
                const passwordInput = registerForm.querySelector('#password') as HTMLInputElement;
                const confirmPasswordInput = registerForm.querySelector('#confirm_password') as HTMLInputElement;

                const username = usernameInput.value;
                const email = emailInput.value;
                const password = passwordInput.value;
                const confirmPassword = confirmPasswordInput.value;

                if (password !== confirmPassword) {
                    displayMessage('messageContainer', 'Passwords do not match!', 'danger');
                    return;
                }

                try {
                    const response = await fetch('http://127.0.0.1:8000/api/register/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON_stringify({ username, email, password }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        displayMessage('messageContainer', 'Registration successful! Please log in.', 'success');
                        window.location.href = 'login.html';
                    } else {
                        displayMessage('messageContainer', data.error || 'Registration failed', 'danger');
                    }
                } catch (error) {
                    console.error('Error during registration:', error);
                    displayMessage('messageContainer', 'An error occurred during registration.', 'danger');
                }
            });
        }
    } else if (window.location.pathname.endsWith('dashboard.html')) {
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

        const fetchFiles = async () => {
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
                    files.forEach((file: any) => {
                        const row = filesTableBody.insertRow();
                        row.insertCell().textContent = file.name;
                        row.insertCell().textContent = file.file_type;
                        row.insertCell().textContent = new Date(file.upload_date).toLocaleDateString();
                    });
                }
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };

        fetchFiles();

        const uploadForm = document.querySelector('form');
        if (uploadForm) {
            uploadForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const fileNameInput = uploadForm.querySelector('#fileName') as HTMLInputElement;
                const fileTypeInput = uploadForm.querySelector('#fileType') as HTMLInputElement;

                const name = fileNameInput.value;
                const file_type = fileTypeInput.value;

                displayMessage('messageContainer', 'Error fetching files.', 'danger');