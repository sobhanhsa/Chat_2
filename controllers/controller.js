const mongoose = require('mongoose')
const usermodel = require('../schemas/user_schema')
let {accessToken} = require('./jwt')
let emailValidator = require('./validator')
let users = []
mongoose.connect('mongodb://localhost/loginapp')

userFinder()
async function userFinder() {
    users = await usermodel.find()
}
async function passChanger(n, npass) {
    tuserid = users[n]._id
    users = await usermodel.find({ _id: tuserid }).update({ pass: npass })
}
async function increate(tuser) {
    try {
        users = await usermodel.create({ name: tuser.name, pass: tuser.pass, email: tuser.email })
    } catch (e) {
        console.log(e.message)
    }
}
//login  fuction
const apLogin = (req, res) => {
    const muser = req.body
    if (!muser.email) {
        return res.send("please enter the email")
    }
    if (!muser.pass) {
        return res.send("please enter the pass")
    }
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === muser.email) { 
            if (users[i].pass === muser.pass) {
                let usert = { email : req.body.email }
                let iac = accessToken(usert)
                return res.json({email : muser.email, token : iac})
            }
            return res.send(`incorrect pass for ${users[i].name} user`)
        }
    }
    res.status(200).send("the considered email not found")
}
//sing up function 
const apSign = (req, res) => {
    const muser = req.body
    if (!muser.name) {
        return res.send("please enter the name")
    }
    if (!muser.pass) {
        return res.send("please enter the pass")
    }
    const eValidate = emailValidator(muser.email)
    if (eValidate === 1) {
        return res.send("please enter the email")
    } else if (eValidate === false) {
        return res.send("incorrect email")
    }
    const repetitive = users.find(element => element.name === muser.name)
    const repetitiveEmail = users.find(element => element.email === muser.email)
    if (!repetitive && !repetitiveEmail) {
        increate(muser)
        return res.status(201).send(` user succesfully created with name : ${muser.name},
            , pass: ${muser.pass}`)
    } else {
        return res.send("repetitive name or email")
    }
}
// pass change fucntion
const apChange = (req, res) => {
    const muser = req.body
    if (!muser.email) {
        return res.send("please enter the email")
    }
    if (!muser.pass) {
        return res.send("please enter the pass")
    }
    if (!muser.newpass) {
        return res.send("please enter the new pass")
    }
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === muser.email) {
            if (users[i].pass === muser.pass) {
                passChanger(i, muser.newpass)
                return res.send(`welcome ${users[i].name} your pass changed to 
                 ${muser.newpass}`)
            }
            return res.send(`incorrect pass for ${users[i].name} user`)
        }
    }
    res.send("the considered email not found")
}
//main page that recieve the token ...
const apProfile = (req, res,) => {
    userFinder()
    const fuser = users.filter(user => user.email === req.user.email)
    res.send(`wellcome back ${fuser[0].name}`)
}
module.exports = {
    apLogin,
    apSign,
    apChange,
    apProfile
}  
