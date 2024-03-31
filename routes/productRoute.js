const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, getProductDetails, getProductByCategory } = require('../controller/productController');

router.post('/addnewproduct', addProduct);
router.get('/getallproducts', getAllProducts);
router.get('/getproductdetails/:id', getProductDetails);
router.get('/getproductbycategory/:category_id', getProductByCategory);
module.exports = router;
