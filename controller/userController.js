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

const url = `http://localhost:5000.api.verifyemail/${token.token}`

sendEmail({
    from: "noreply@something.com",
    to: email,
    subject: "Verification Email",
    text: `Copy Paste the link in the browser to verify your account. ${url}`,
    html: `<a href='/verify/${token.token}'><button>Verify Account</button></a>`
})

if(!new_user){
    return res.status(400).json({ error: "Failed to register" });
}
res.send(new_user)

}

// to verify user
exports.verifyUser = async (req, res) => {
    // check token if valid or not
    let token = await TokenModel.findOne({ token: req.params.token })
    if(!token){
        return res.status(400).json({ error: "Invalid token or token expired" });
    }

    // find user
    let user = await UserModel.findById( token.user );
    if(!user){
        return res.status(400).json({ error: "User associated with this token not found" });
    }

    // check if already verified
    if(user.isVerified){
        return res.status(400).json({ error: "User already verified" });
    }

    // verify user
    user.isVerified = true;
    user = await user.save();
    if(!user){
        return res.status(400).json({ error: "Failed to verify user" });
    }
    res.send({message: "User Verified Successfully"})
}


// resend verification
exports.resendVerification = async (req, res) => {

    // find if email is registered or not
    let user = await UserModel.findOne({ email: req.body.email })
    if(!user){
        return res.status(400).json({ error: "Email not registered" });
    }

    // check if password is valid or not

    let password = await bcrypt.compare(req.body.password, user.password)
    if(!password){
        return res.status(400).json({ error: "Invalid password" });
    }

    // check if user is already verified
    if(user.isVerified){
        return res.status(400).json({ error: "User already verified" });
    }

    // generate token and send it(verification link) on the users email id
    let token = await TokenModel.create({
        token: crypto.randomBytes(24).toString('hex'),
        user: user._id
    })
    if(!token){
        return res.status(400).json({ error: "Something went wrong" });
    }
    const url = `http://localhost:5000/api/verifyemail/${token.token}`;
    sendEmail({
        from: "noreply@something.com",
        to: req.body.email,
        subject: "Verification Email",
        text: `Please Click on the link or Copy Paste the link in the browser to verify your account. ${url}`,
        html: `<a href='${url}'><button>Verify Account</button></a>`
    })
    res.send({message: "Verification link has been sent to your email"})
}

// forget password
exports.forgetPassword = async (req, res) => {
    // find if email is registered or not
    let user = await UserModel.findOne({ email: req.body.email })
    if(!user){
        return res.status(400).json({ error: "Email not registered" });
    }
    
    // create reset token and send it(reset link) on the users email id
    let resetToken = await TokenModel.create({
        token: crypto.randomBytes(24).toString('hex'),
        user: user._id
    })
    
    const url = `http://localhost:5000/api/resetpassword/${resetToken.token}`;
    try{
        sendEmail({
            from: "noreply@something.com",
            to: req.body.email,
            subject: "Reset Password Email",
            text: `Please Click on the link or Copy Paste the link in the browser to reset your password. ${url}`,
            html: `<a href='${url}'><button>Reset Password</button></a>`
        })
        res.send({ message: "A link to reset your password has been sent to your email" });
    }catch(err){
        return res.status(400).json({ error: "Something went wrong" });
    }

    res.send({ message: "Password reset successfully"})
}
