const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    product_image: {
        type: String,  // image url
    },
    rating: {
        type: Number,
        default: 1
    },
    category: {
        type: ObjectId,
        ref: 'CategoryModel'
    },
    count_in_stock: {
        type: Number,
        required: true,
    }
}, {timestamps: true})

module.exports = mongoose.model("ProductModel", productSchema);
// exporting the model so that it can be used in other files