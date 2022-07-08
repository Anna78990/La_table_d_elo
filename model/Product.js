const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    description: {
        type: String,
        required: true,
        max: 1400,
        min: 6
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    photo1: {
        type: Buffer
    },
    photo2: {
        type: Buffer
    },
    photo3: {
        type: Buffer
    },
    photo4: {
        type: Buffer
    },
    photo5: {
        type: Buffer
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
