// Main TypeScript code will go here

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
                        window.location.href = 'dashboard.html';
                    } else {
                        alert(data.error || 'Login failed');
                    }
                } catch (error) {
                    console.error('Error during login:', error);
                    alert('An error occurred during login.');
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
                    alert('Passwords do not match!');
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
                        alert('Registration successful! Please log in.');
                        window.location.href = 'login.html';
                    } else {
                        alert(data.error || 'Registration failed');
                    }
                } catch (error) {
                    console.error('Error during registration:', error);
                    alert('An error occurred during registration.');
                }
            });
        }
    } else if (window.location.pathname.endsWith('dashboard.html')) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
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

                try {
                    const response = await fetch('http://127.0.0.1:8000/api/files/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${token}`,
                        },
                        body: JSON.stringify({ name, file_type }),
                    });

                    if (response.ok) {
                        fileNameInput.value = '';
                        fileTypeInput.value = '';
                        fetchFiles(); // Refresh file list
                    } else {
                        alert('File upload failed');
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                    alert('An error occurred during file upload.');
                }
            });
        }

        const logoutLink = document.querySelector('a[href="index.html"]');
        if (logoutLink) {
            logoutLink.addEventListener('click', async (event) => {
                event.preventDefault();
                try {
                    await fetch('http://127.0.0.1:8000/api/logout/', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    });
                } catch (error) {
                    console.error('Error during logout:', error);
                } finally {
                    localStorage.removeItem('token');
                    window.location.href = 'index.html';
                }
            });
        }
    }
});