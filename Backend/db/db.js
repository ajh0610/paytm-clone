const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/paytm');

const User = mongoose.model('User', {
    username: String,
    password: String,
    firstName: String,
    lastName: String,
})

const Accounts = mongoose.model('Account', {
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})


module.exports = {User, Accounts}