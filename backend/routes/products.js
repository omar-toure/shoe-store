const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Product = require('../models/Product');

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Seules les images (jpeg, jpg, png, webp) sont autorisées!'));
    }
});

// Créer un produit
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const productData = {
            name: req.body.name,
            price: parseFloat(req.body.price),
            category: req.body.category,
            description: req.body.description,
            sizes: req.body.sizes.split(',').map(size => size.trim()),
            stock: parseInt(req.body.stock),
            image: req.file ? `/uploads/${req.file.filename}` : null
        };

        const product = new Product(productData);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Erreur création produit:', error);
        res.status(400).json({ message: error.message });
    }
});

// Obtenir tous les produits
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir un produit par ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour un produit
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const productData = {
            name: req.body.name,
            price: parseFloat(req.body.price),
            category: req.body.category,
            description: req.body.description,
            sizes: req.body.sizes.split(',').map(size => size.trim()),
            stock: parseInt(req.body.stock)
        };

        if (req.file) {
            productData.image = `/uploads/${req.file.filename}`;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            productData,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un produit
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json({ message: 'Produit supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
