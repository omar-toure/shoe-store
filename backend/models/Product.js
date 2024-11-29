const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['homme', 'femme', 'enfant']
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    sizes: {
        type: [Number],
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
