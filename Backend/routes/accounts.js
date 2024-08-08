const {Router} = require('express');

const {Accounts} = require('../db/db');
const { default: mongoose } = require('mongoose');

const router = Router();


router.get('/balance', async (req, res) => {

    const userId = req.userId;
    try{
        const balance = await Accounts.findOne({userId: userId});
        res.status(200).json({balance: balance.balance})
    } catch(e){
        res.status(500).json({mssg: "Error in fetching the balance."})
    }

})

router.post('/transfer', async (req, res)=>{
   
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
    
        const {to, amount} = req.body;
    
        const fromAccount = await Accounts.findOne({userId: req.userId}).session(session);
    
        if(!fromAccount || fromAccount.balance < amount){
            return res.status(400).json({mssg: "Insufficient Balance"});
        }
    
    
        const toAccount = await Accounts.findOne({userId: to}).session(session);
    
        if(!toAccount){
            return res.status(400).json({mssg: "Invalid to account"});
        }
    
        await Accounts.updateOne({userId: req.userId}, {$inc: {balance: -amount}}).session(session);
        await Accounts.updateOne({userId: to}, {$inc: {balance: amount}}).session(session);
    
        await session.commitTransaction();
    
        res.status(200).json({mssg: "Transfer was Succesfull!"});
    } catch(e){
        await session.abortTransaction();
        res.status(500).json({mssg: "Error while doing transaction!"})
    }

})


module.exports = router;