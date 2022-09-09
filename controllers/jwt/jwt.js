require('dotenv').config()


const jwt = require('jsonwebtoken') 
let accessToken = (usert) => {return jwt.sign(usert, process.env.SECRET_TOKEN_ACCESS)}
let authenticateToken = (req, res, next) =>  {    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] 
    if (token == null) return res.status(401).send("please login")
    jwt.verify(token, process.env.SECRET_TOKEN_ACCESS, (err, usert) => {
        if (err) return res.status(403).send("please login again")
        req.user = usert  
        next()
    })  
}

module.exports = { 
    accessToken,  
    authenticateToken
}