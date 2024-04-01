const UserModel = require('../models/userModel');
const TokenModel = require('../models/tokenModel');
const sendEmail = require('../utils/emailSender');

// 

// generate token
let token = await TokenModel.create({
    token: crypto.randomBytes(24).toString('hex'),
    user: new_user._id
})

// send verification link(generate token) in email

sendEmail({
    from: "noreply@something.com",
    to: email,
    subject: "Verification Email",
    text: `Copy Paste the link in the browser to verify your account. ${token.token}`,
    html: `<a href='/verify/${token.token}'><button>Verify Account</button></a>`
})

if(!new_user){
    return res.status(400).json({ error: "Failed to register" });
}
res.send(new_user)