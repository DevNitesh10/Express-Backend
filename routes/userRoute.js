const express = require('express')
const { register, verifyUser, resendVerification, forgetPassword } = require('../controller/userController')
const router = express.Router();

router.post('/register', register)
router.get('/verifyemail/:token', verifyUser)
route.post('/resendverification', resendVerification)
router.post('/forgetpassword', forgetPassword)

module.exports = router