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
                    const response = await fetch('http://1127.0.0.1:8000/api/login/', {
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
    }
});
