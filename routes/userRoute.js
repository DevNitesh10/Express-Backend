const express = require('express')
const { register, verifyUser, resendVerification, forgetPassword, resetPassword, logOut, signIn, getUsersList, makeAdmin, authorizeLogin } = require('../controller/userController')
const router = express.Router();

router.post('/register', register)
router.get('/verifyemail/:token', verifyUser)
router.post('/resendverification', resendVerification)
router.post('/forgetpassword', forgetPassword)
router.post('/resetpassword/:token', resetPassword)
router.post('/signin', signIn)
router.get('/logout', logOut)
router.get('/uselist', authorizeLogin, getUsersList)
router.post('/makeadmin', makeAdmin)

module.exports = router