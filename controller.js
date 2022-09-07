const mongoose = require('mongoose')

const usermodel = require('./user_schema')

mongoose.connect('mongodb://localhost/loginapp', () => {
    console.log("db connected")
})

let users = []

userFinder() 

async function userFinder() {
    users = await usermodel.find()
    console.log(users)
}
async function passChanger(n, npass) {
    tuserid = users[n]._id
    users = await usermodel.find({_id : tuserid}).update({pass: npass})
    console.log(users) 
}
async function increate(tuser) {
    try {
        users = await usermodel.create({ name: tuser.name, pass: tuser.pass, email: tuser.email })
    } catch (e) {
        console.log(e.message)
    }
}
//email validate
let emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
let isEmailValid = (email) => {
    if (!email)
        return 1;

    if (email.length > 254)
        return false;

    let valid = emailRegex.test(email);
    if (!valid)
        return false;


    let parts = email.split("@");
    if (parts[0].length > 64)
        return false;

    let domainParts = parts[1].split(".");
    if (domainParts.some(function (part) { return part.length > 63; }))
        return false;

    return true;
}
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
                return res.send(`welcome ${users[i].name} with pass = ${users[i].pass}, 
                with email : ${uesr[i].email}`)
            }
            return res.send(`incorrect pass for ${users[i].name} user`)
        }
    }
    res.send("the considered email not found")
}
const apSign = (req, res) => {
    const muser = req.body
    let truthemail = ""
    if (!muser.name) {
        return res.send("please enter the name")
    }
    if (!muser.pass) {
        return res.send("please enter the pass")
    }
    isEmailValid = isEmailValid(muser.email)
    if (isEmailValid === 1) {
        res.send("please enter the email")
    } else if (isEmailValid === false) {
        res.sedn("incorrect email")
    }
    const repetitive = users.find(element => element.name === muser.name)
    if (!repetitive) {
        increate(muser)
        return res.send(` user succesfully created with name : ${muser.name},
            , pass: ${muser.pass}`)
    } else {
        return res.send("repetitive name")
    }
}
const apChange = (req, res) => {
    const muser = req.body
    if (!muser.email) {
        return res.send("please enter the email")
    }
    if (!muser.pass) {
        return res.send("please enter the pass")
    }
    if (!muser.newpass){
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
module.exports = {
    apLogin,
    apSign,
    apChange
}  
