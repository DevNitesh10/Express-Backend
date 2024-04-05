const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, getProductDetails, getProductByCategory, updateProduct, deleteProduct } = require('../controller/productController');
const { register, checkAdmin } = require('../controller/userController');
const upload = require('../utils/fileUpload');
const { productCheck, validate } = require('../validation');

router.post('/addnewproduct', checkAdmin, upload.single('product_image'), productCheck, validate ,addProduct);
router.get('/getallproducts', getAllProducts);
router.get('/getproductdetails/:id', getProductDetails);
router.get('/getproductbycategory/:category_id', getProductByCategory); 
router.put('/updateproduct/:id', upload.single('product_image'), checkAdmin ,updateProduct)
router.delete('/deleteproduct/:id', checkAdmin, deleteProduct)


module.exports = router;  
