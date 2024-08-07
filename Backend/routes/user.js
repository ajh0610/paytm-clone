const {Router} = require('express');
const {userSigninSchema, userSignUpSchema} = require('../schemas/user')
const {User} = require('../db/db');
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config")


const router = Router();


router.post('/signup', async (req, res)=>{
    
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

    const findUser = await User.findOne({username: username});
    if(findUser){
        return res.status(411).json({mssg: "User Already Exsist!"});
    }

    const user = new User({username, password, firstName, lastName});

    try{
        await user.save();
    
        const token = jwt.sign({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        }, JWT_SECRET);
    
        res.status(200).json({mssg: "User Created Succesfully!", token: token});
    } catch(error){

        res.status(500).json({mssg: "Internal Server Error!"});
    }
    

})

router.post('/signin', async (req, res)=>{
    
    const validation = userSigninSchema.safeParse(req.body);

    if(validation.error){
        return res.status(411).json({
            mssg:"Error while logging in!"
        })
    }

    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({username: username, password: password})

    if(!user){
        return res.json({mssg: "User Not Found!"})
    }
    const token = jwt.sign({
        userId: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    }, JWT_SECRET)

    res.status(200).json({
        token: token
    })
})

module.exports = router;