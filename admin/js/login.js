const API_URL = window.location.origin + '/api';

// Vérifier si déjà connecté
async function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.valid) {
                window.location.href = '/admin/dashboard.html';
            }
        }
    } catch (error) {
        console.error('Erreur de vérification:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
    }
}

// Gérer la connexion
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error-message');
    errorDiv.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Email ou mot de passe incorrect');
        }

        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminEmail', data.user.email);
        window.location.replace('/admin/dashboard.html');
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
