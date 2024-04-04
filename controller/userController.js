const UserModel = require('../model/userModel');
const TokenModel = require('../model/tokenModel');

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const sendEmail = require('../utils/emailSender');
// const uuidv1 = require('uuidv1')

const jwt = require('jsonwebtoken')

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
    let salt = await bcrypt.genSalt(10)
    let hashed_password = await bcrypt.hash(password, salt)
    // let salt = uuidv1()
    // let hashed_password = crypto.createHmac('sha256', salt).update('password').digest('hex')

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

const url = `http://localhost:5000.api/verifyemail/${token.token}`

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

// reset password

exports.resetPassword = async (req, res) => {
    // check token if valid or not
    let token = await TokenModel.findOne({ token: req.params.token })
    if(!token){
        return res.status(400).json({ error: "Invalid token or token expired" });
    }else{
        // find user
        let user = await UserModel.findById( token.user );
        if(!user){
            return res.status(400).json({ error: "User associated with this token not found" });
        }else{
            // check if already verified
            if(user.isVerified){
                return res.status(400).json({ error: "User already verified" });
            }
            
            // update new password and remove the token
            // user.password = req.body.password;
            // user.isVerified = true;
            // delete user.tokens;

            // change password
            let salt_rounds = await bcrypt.genSalt(10)
            let hashed_password = await bcrypt.hash(req.body.password, salt_rounds)

            // save the user
            user = await user.save();

            if(!user){
                return res.status(400).json({ error: "Something went wrong." });
            }

            // create a new token for the user and send it in an email
            const newToken = crypto.randomBytes(24).toString('hex');
            await TokenModel.create({
                token: newToken,
                user: user._id
            });

            // create a new token for the user and send it in an email
            // const tokenObject = user.generateToken();
            // user.tokens = user.tokens.concat(tokenObject);
            // await user.save()
    
            sendEmail({
                from: "noreply@something.com",
                to: user.email,
                subject: "Password Reset Successful",
                text: "Your password has been reset successfully",
                html: "<h1>Your password has been reset successfully</h1>"
            })
    
            res.status(200).json({ message: "Password reset successfully" });
        }
        
    }
}

// login
exports.signIn = async (req, res) => {

    let {email, password} = req.body;


    // check if email is registered or not
    let user = await UserModel.findOne({email})
    if(!user){
        return res.status(400).json({error: "Email not registered"})
    }

    // check if password is correct or not
    let passwordCheck = await bcrypt.compare(password, user.password)
    if(!passwordCheck){
        return res.status(400).json({error: "Invalid Email or Password"})
    }

    // check if verified or not
    if(!user.isVerified){
        return res.status(400).json({error: "User not Verified. Please verify your email first."})
    }

    // generate token
    let {username, role, _id} = user;
    let token = jwt.sign({username, email, role, _id}, process.env.JWT_SECRET);


    // send data to frontend
    res.cookie("myCookie", token, {expiresIn: 86400});
    res.send({token, user: {username, email, role, _id}});

}   

// logout
exports.logOut = async (req, res) => {
    res.clearCookie("myCookie");
  res.send({message: "Logged out successfully"});
}

// userlist
exports.getUsersList = async (req, res) => {
    let users = await UserModel.find();
    if(!users){
        return res.status(400).json({ error: "Something went wrong" });
    }
    res.send(users);
}

// make admin
exports.makeAdmin = async (req, res) => {
    let user = await UserModel.findOne({email: req.body.email});
    if(!user){
        return res.status(400).json({ error: "User not found" });
    }
    user.role = "admin";
    user = await user.save();
    if(!user){
        return res.status(400).json({ error: "Something went wrong" });
    }
    res.send(user);
}
