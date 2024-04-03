const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, getProductDetails, getProductByCategory, updateProduct, deleteProduct } = require('../controller/productController');

router.post('/addnewproduct', addProduct);
router.get('/getallproducts', getAllProducts);
router.get('/getproductdetails/:id', getProductDetails);
router.get('/getproductbycategory/:category_id', getProductByCategory); 
router.put('/updateproduct/:id', upload.single('product_image'), updateProduct)
router.delete('/deleteproduct/:id', deleteProduct)


module.exports = router;  
