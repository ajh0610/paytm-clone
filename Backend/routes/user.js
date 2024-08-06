const {Router} = require('express');
const {userSigninSchema, userSignUpSchema} = require('../schemas/user')
const {User} = require('../db/db');
const jwt = require("jsonwebtoken");


const router = Router();


router.post('/signup', (req, res)=>{
    
    const validation = userSignUpSchema.safeParse(req.body);

    if(validation.error){
        return res.json({
            mssg:"Error"
        })
    }

    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const user = new User({username, password, firstName, lastName});
    user.save().then(()=>{
        res.json({mssg :"User Saved Succesfully!"});
    }).catch((error)=>{
        res.json(error);
    })
})

router.post('/signin', async (req, res)=>{
    
    const validation = userSigninSchema.safeParse(req.body);

    if(validation.error){
        return res.json({
            mssg:"Error"
        })
    }

    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({username: username, password: password})

    if(!user){
        return res.json({mssg: "User Not Found!"})
    }
    console.log(user);
    const token = jwt.sign({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    }, "secret")

    res.json({
        token: token
    })
})

module.exports = router;