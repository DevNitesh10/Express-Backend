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