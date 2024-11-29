const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Middleware de vérification du token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ valid: false, message: 'Token non fourni' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ShoeStore2023SecretKey');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ valid: false, message: 'Token invalide' });
    }
};

// Route de connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Compte admin par défaut
        const adminEmail = 'admin@shoestore.com';
        const adminPassword = 'admin123';

        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign(
                { 
                    userId: 'admin',
                    email: adminEmail,
                    isAdmin: true 
                },
                process.env.JWT_SECRET || 'ShoeStore2023SecretKey',
                { expiresIn: '24h' }
            );
            res.json({ 
                token,
                user: {
                    email: adminEmail,
                    isAdmin: true
                }
            });
        } else {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Vérification du token
router.get('/verify', verifyToken, (req, res) => {
    res.json({ 
        valid: true, 
        user: {
            email: req.user.email,
            isAdmin: req.user.isAdmin
        }
    });
});

// Déconnexion (optionnel côté serveur)
router.post('/logout', (req, res) => {
    res.json({ message: 'Déconnexion réussie' });
});

module.exports = router;
