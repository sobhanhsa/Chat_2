require('dotenv').config()
const jwt = require('jsonwebtoken')
let accessToken = (useremailt) => { return jwt.sign(useremailt, process.env.SECRET_TOKEN_ACCESS) }
let authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send("please login")
    console.log(token)
    jwt.verify(token, process.env.SECRET_TOKEN_ACCESS, (err, emailt) => {
        if (err) return res.status(403).send("please login again")
        req.user = emailt
        next()
    })
}
function authenticateTokenClient(token) {
    let finalresult
    if (!token) {
        return null
    }
    jwt.verify(token, process.env.SECRET_TOKEN_ACCESS, (err, emailt) => {
        if (err) {
            finalresult =  false
            return false
        }
        finalresult = emailt.email
    })
    return finalresult
}
module.exports = {
    accessToken,
    authenticateToken,
    authenticateTokenClient
}
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvYmhhbkBnbWFpbC5jb20iLCJpYXQiOjE2NjMxNzI3MTN9.3bz58xJ8YqYmNfGf6z9y6GfMcGlDxfKazvLgHGVTdHc
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvYmhhbkBnbWFpbC5jb20iLCJpYXQiOjE2NjMxNzI3MTN9.3bz58xJ8YqYmNfGf6z9y6GfMcGlDxfKazvLgHGVTdHc
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvYmhhbkBnbWFpbC5jb20iLCJpYXQiOjE2NjMxNzI3MTN9.3bz58xJ8YqYmNfGf6z9y6GfMcGlDxfKazvLgHGVTdHc
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvYmhhbkBnbWFpbC5jb20iLCJpYXQiOjE2NjMxNzI3MTN9.3bz58xJ8YqYmNfGf6z9y6GfMcGlDxfKazvLgHGVTdHc