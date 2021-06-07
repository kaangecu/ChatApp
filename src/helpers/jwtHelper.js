const config = require("../config/default.json");
const jwt = require("jsonwebtoken");

const requireToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined' ){

        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else{
        res.sendStatus(403)
    }
}

const verifyToken = (token) => {
    try{
        var decoded = jwt.verify(token, config.jwtSecret);
        return {
            status:"verified",
            decoded
        };
    }
    catch(err){
        return {
            status:"unverified",
            err
        }
    }
    
}

const createToken = (user) => {
    return jwt.sign({ id: user.id },
        config.jwtSecret,
        {expiresIn: config.tokenExpires }
    )
}

module.exports= { requireToken, verifyToken, createToken }

