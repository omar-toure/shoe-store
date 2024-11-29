const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();

// Configuration CORS détaillée
app.use(cors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));
app.use(express.static(path.join(__dirname, '../')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connecté à MongoDB avec succès');
})
.catch((err) => {
    console.error('Erreur de connexion à MongoDB:', err);
});

// Créer le dossier uploads s'il n'existe pas
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Une erreur est survenue !',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Routes pour le frontend
app.get('/admin', (req, res) => {
    res.redirect('/admin/login.html');
});

app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', req.path));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
