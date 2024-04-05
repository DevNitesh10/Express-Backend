const {validationResult, check} = require('express-validator')

exports.categoryCheck = [
    check('category_name', 'Category Name is required').notEmpty().isLength({min:3})
    .withMessage('Category Name must be at least 3 characters'),
]

exports.validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg })
        // return res.status(400).json({ errors: errors.array().map(err => err.msg) })
    }
    next()
}

exports.productCheck = [
    check('title', 'Product title is required').notEmpty()
    .isLength({min:3}).withMessage('Product name must be at least 3 characters'),

    check('price', 'Product price is required').notEmpty()
    .isNumeric().withMessage('Price must be a Number'),

    check('description', 'Product description is required').notEmpty()
    .isLength({ min:20 }).withMessage('Description must be at least 10 characters'),

    check('count_in_stock', 'Count in stock is required').notEmpty()
    .isNumeric().withMessage('Count must be a number')

]

exports.userCheck = [
    check('username', 'Username is required').notEmpty()
    .isLength({min:3}).withMessage('Username must be at least 3 characters'),

    check('email', 'Email is required').notEmpty()
    .isEmail().withMessage('Email must be a valid email'),
    
    check('password','Password is required').notEmpty()
    .not().matches('as').withMessage('Ignore Common Word')
    .matches(/[a-z]/).withMessage('Password must contain at least 1 lowercase alphabet')
    .matches(/[A-Z]/).withMessage('Password must contain at least 1 Upper case alphabet')
    .matches(/[0-9]/).withMessage('Password must contain at least 1 Number')
    .matches(/[!@#$\-]/).withMessage('Password must contain at least 1 Special Character')
    .isLength({min:6}).withMessage('Password must be at least 6 characters'),

    check('gender')
    .isIn(['male','female']).withMessage('Gender must be either male or female')
]