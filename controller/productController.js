const ProductModel = require('../model/ProductModel');

// add new product
exports.addProduct = async(req, res) => {
    try{

        let product = await ProductModel.create({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            count_in_stock: req.body.count_in_stock
        });
        if(!product){
        return res.status(400).json({error: "Something Went Wrong."});
        }
        return res.status(201).send(product);
    }
    catch(error){
        return res.status(400).json({error: error.message});
    }
}

// get all products
exports.getAllProducts = async (req, res) => {
    let products = await ProductModel.find().populate('category', 'category_name');
    if(!products){
        return res.status(400).json({ error: "Something went wrong" });
    }
    res.send(products);
}

// get product details
exports.getProductDetails = async (req, res) => {
    let product = await ProductModel.findById(req.params.id).populate('category');
    if(!product){
        return res.status(400).json({ error: "Something went wrong" });
    }
    res.send(product);
}

// get products by category
exports.getProductByCategory = async (req, res) => {
    let products = await ProductModel.find({category: req.params.category_id}).select('title').select('price').populate('category');
    if(!products){
        return res.status(400).json({ error: "Something went wrong" });
    }
    res.send(products);
}