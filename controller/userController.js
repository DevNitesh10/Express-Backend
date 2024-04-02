const UserModel = require('../model/userModel');
const TokenModel = require('../model/tokenModel');
const bcrypt = require('bcrypt')
const sendEmail = require('../utils/emailSender');

// register
exports.register = async(req, res) => {
    let {username, email, password, date_of_birth, gender, street, city, state, zipcode, country, country_code, phone } = req.body

    // check if username already exists
    let user = await UserModel.findOne({ username })
    if (user){
        return res.status(400).json({error: "Username already taken, choose another username"})

    }

    // check if email already used
    user = await UserModel.findOne({ email })
    if (user){
        return res.status(400).json({error: "Email already taken, choose another email"})

    }


    // record the address -> _id
    let address = await UserModel.create({
        street, city, state, zipcode, country, country_code, phone
    })

    if(!address){
        return res.status(400).json({ error: "Failed to register" });
    }


    // encrypt password
    let salt = await bcrypt.gensalt(10)
    let hashed_password = await bcrypt.hash(password, salt)

    // register
    let new_user = await UserModel.create({
        username, 
        email,
        password: hashed_password,
        gender,
        date_of_birth,
        address: address._id
    })







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

}