const jwt = requrie("jsonwebtoken");
const {JWT_SECRET} = require("../config");

function authmiddleware(req, res, next){
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];

    try{
        
        const decodedUser = jwt.verify(token, JWT_SECRET);

        req.userId = decodedUser.userId;

        next();

    } catch(error){
        res.status(401).json({mssg: "Error Occured while signing in!"})
    }
}

module.exports = {
    authmiddleware
}

