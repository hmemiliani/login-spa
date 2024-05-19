document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const token = localStorage.getItem('token');

    window.showLogin = () => {
        app.innerHTML = `
            <div class="container">
                <h2>Login</h2>
                <input type="text" id="username" placeholder="Username" required>
                <input type="password" id="password" placeholder="Password" required>
                <button id="loginButton">Login</button>
                <button id="showRegisterButton">Register</button>
            </div>
        `;

        document.getElementById('loginButton').addEventListener('click', async () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                location.hash = '/dashboard';
            } else {
                alert('Login failed');
            }
        });

        document.getElementById('showRegisterButton').addEventListener('click', () => {
            location.hash = '/register';
        });
    };

    window.showRegister = () => {
        app.innerHTML = `
            <div class="container">
                <h2>Register</h2>
                <input type="text" id="username" placeholder="Username" required>
                <input type="password" id="password" placeholder="Password" required>
                <input type="password" id="confirmPassword" placeholder="Confirm Password" required>
                <button id="registerButton">Register</button>
                <button id="showLoginButton">Login</button>
            </div>
        `;
        document.getElementById('registerButton').addEventListener('click', async () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) {
                alert('Passwords do not match');
            } else {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                if (response.ok) {
                    alert('Registration successful');
                    location.hash = '/';
                } else {
                    alert('Registration failed');
                }
            }
        });

        document.getElementById('showLoginButton').addEventListener('click', () => {
            location.hash = '/';
        });
    };

    window.showDashboard = () => {
        if (!token) {
            location.hash = '/';
            return;
        }

        app.innerHTML = `
            <nav>
                <a href="#/dashboard/home">Home</a>
                <a href="#/dashboard/user">User</a>
                <button id="logoutButton">Logout</button>
            </nav>
            <div id="dashboardContent"></div>
        `;

        document.getElementById('logoutButton').addEventListener('click', () => {
            localStorage.removeItem('token');
            location.hash = '/';
        });

        showHome();
    };

    window.showHome = () => {
        document.getElementById('dashboardContent').innerHTML = `
            <h2>Home</h2>
            <p>Welcome to the Home page!</p>
        `;
    };

    window.showUser = () => {
        document.getElementById('dashboardContent').innerHTML = `
            <h2>User</h2>
            <p>Welcome to the User page!</p>
        `;
    };

    // Initialize view based on the hash
    const hash = location.hash;
    if (hash === '#/register') {
        showRegister();
    } else if (hash.startsWith('#/dashboard')) {
        showDashboard();
    } else {
        showLogin();
    }

    // Handle hash changes
    window.addEventListener('hashchange', () => {
        const hash = location.hash;
        if (hash === '#/register') {
            showRegister();
        } else if (hash.startsWith('#/dashboard')) {
            showDashboard();
        } else {
            showLogin();
        }
    });
});
