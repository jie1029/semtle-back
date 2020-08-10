const jwt = require("jsonwebtoken");
const secretKey = require("../../config/jwt");

module.exports.verifyToken = (req,res,next) =>{
    const token = req.header('token');
    // console.log(token)
    if(token == undefined) res.json({status:"tokenMissing"})
    try {
        const decoded = jwt.verify(token, secretKey.secret);
        // console.log(decoded);
        if(decoded)
        {
            res.locals.isAdmin = decoded.isAdmin
            res.locals.id = decoded.id
            next();
        }
        else{
            res.json({status:"unauthorized"});
        }
    }
    catch(err)
    {
        console.log(err);
        res.json({status:"tokenExpired"});
    }
}

