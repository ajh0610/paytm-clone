const {Router} = require('express');
const {userSigninSchema, userSignUpSchema, updateUserSchema} = require('../schemas/user')
const {User} = require('../db/db');
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config")
const {authMiddleware} = require('../authentication/middlewares');


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

router.put('/', authMiddleware, async (req, res)=>{
    const body = req.body;
    const userId = req.userId;

    const parsedResult = updateUserSchema.safeParse(body);

    if(parsedResult.error){
        return res.status(411).json({mssg: "Error while updating the records!"});
    }


    await User.updateOne({
        _id: userId
    }, req.body);

    res.status(200).send("Update was succesfull");
})


router.get('/user/bulk', authMiddleware, async (req, res)=>{
    const qName = req.query.filter;
    
    try{
        const users = await User.find({ $or: [{ firstName: {"$regex": qName}}, { lastName:  {"$regex": qName}}]});
    
        res.send(200).json({
            users: users.map((ele)=>{
                return {
                    firstName: ele.firstName,
                    lastName: ele.lastName,
                    username: ele.username,
                    userId: ele._id
                }
            })
        })
    } catch(e){
        res.send(500).send("Internal Server Error!")
    }
})
module.exports = router;