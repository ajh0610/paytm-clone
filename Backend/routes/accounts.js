const {Router} = require('express');

const {Accounts} = require('../db/db');
const { default: mongoose } = require('mongoose');
const { authmiddleware } = require('../authentication/middlewares');

const router = Router();


router.get('/balance', authmiddleware, async (req, res) => {

    const userId = req.userId;
    try{
        const balance = await Accounts.findOne({userId: userId});
        res.status(200).json({balance: balance.balance})
    } catch(e){
        res.status(500).json({mssg: "Error in fetching the balance."})
    }

})

router.post('/transfer', authmiddleware, async (req, res)=>{


    const {to, amount} = req.body;

    const fromAccount = await Accounts.findOne({userId: req.userId});

    if(!fromAccount || fromAccount.balance < amount){
        return res.status(400).json({mssg: "Insufficient Balance"});
    }


    const toAccount = await Accounts.findOne({userId: to});

    if(!toAccount){
        return res.status(400).json({mssg: "Invalid to account"});
    }

    await Accounts.updateOne({userId: req.userId}, {$inc: {balance: -amount}});
    await Accounts.updateOne({userId: to}, {$inc: {balance: amount}});
    
    res.status(200).json({mssg: "Transfer was Succesfull!"});
    
})


module.exports = router;