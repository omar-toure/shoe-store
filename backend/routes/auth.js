const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Route de connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Ici, vous ajouterez plus tard la vérification avec la base de données
        // Pour l'instant, on utilise un compte admin par défaut
        const adminEmail = 'admin@shoestore.com';
        const adminPassword = 'admin123';

        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign(
                { userId: 'admin', isAdmin: true },
                process.env.JWT_SECRET || 'ShoeStore2023SecretKey',
                { expiresIn: '24h' }
            );
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Vérification du token
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token non fourni' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ShoeStore2023SecretKey');
        res.json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
});

module.exports = router;
