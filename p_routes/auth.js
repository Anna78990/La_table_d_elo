const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} =require('../validation');
const { ConnectionStates } = require('mongoose');
// const DOMAIN = 'sandbox59cbfc8dc4be4c73be930c3caf2bcc81.mailgun.org';
// var FormData = require('form-data');
// const Mailgun = require('mailgun.js');
// const mailgun = new Mailgun(FormData);
// const mg = mailgun.client({apikey: process.env.MAUKGUN_APIKEY, domain: DOMAIN});

router.post('/register',async (req,res) => {

    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({ user: user._id});
    }catch(err){
        res.status(400).json({ err })
    }
});

router.post('/login', async (req,res) => {
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
        const user = await User.findOne({ email: req.body.email});
        if(!user) return res.status(400).send('Email is wrong.');
        const validPass = await bcrypt.compareSync(req.body.password, user.password);
        if(!validPass) return res.status(400).send('Invalid password');
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);
});

// router.put('/forfot-password', async (req, res) => {
//     const {email} = req.body;
//     User.findOne({email}, (err, user) => {
//         if(err || !user) {
//             return res.status(400).json({error: "User with this email does not axists."});
//         }

//         const token = jwt.sign({_id: user._id}, process.env.JWT_PASS_FORGOT, {expiresIn: '20m'});
//         const data = {
//             from: 'noreply@la_table_delo.com',
//             to: email,
//             subject: "[La Table d'Elo] Link to change the password",
//             html:`
//                 <h2>Please click on given link to change the password</h2>
//                 <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
//                 `
//         };

    
//         return user.updateOne({resetLink: token}, function (err, success){
//             if(err){
//                 return res.status(400).json({error: "reset password link error."});;
//             }
//         });
//    })
// });

module.exports = router;