const { addCategory, getAllCategories, getCategoryDetails, updateCategory, deleteCategory } = require('../controller/categoryController');
const router = require('express').Router();

// endpoints
router.post('/addcategory', addCategory)

router.get('/category:id', getCategoryDetails)
router.get('/getallcategories', getAllCategories);

router.put('/updatecategory/:id', updateCategory)

router.delete('/deletecategory/:id', deleteCategory);

module.exports = router;

