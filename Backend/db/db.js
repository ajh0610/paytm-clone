const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/paytm');

const User = mongoose.model('User', {
    username: String,
    password: String,
    firstName: String,
    lastName: String,
})


module.exports = {User}