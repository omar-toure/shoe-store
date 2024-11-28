const API_URL = 'http://localhost:5000/api';

// Vérifier si déjà connecté
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (token) {
        window.location.href = '/admin/dashboard.html';
    }
}

// Gérer la connexion
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Email ou mot de passe incorrect');
        }

        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminEmail', email);
        window.location.href = '/admin/dashboard.html';
    } catch (error) {
        showError(error.message);
    }
}

// Afficher les erreurs
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    document.getElementById('login-form').addEventListener('submit', handleLogin);
});
