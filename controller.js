const mongoose = require('mongoose')

const usermodel = require('./user-schema')

mongoose.connect('mongodb://localhost/loginapp', () => {
    console.log("db connected")
})

let users = []

userFinder()

async function userFinder() {
    users = await usermodel.find()
    console.log(users)
}
async function increate(tuser) {
    try {
        users = await usermodel.create({ name: tuser.name, pass: tuser.pass, email: tuser.email })
    } catch (e) {
        console.log(e.message)
    } 
}
let emailCheck = (temail) => {
    let truthemail = ""
    if (!temail) {
        return 1
    } truthemail = temail.search("@")
    if (truthemail === -1) {
        return false
    } else if (truthemail === 0) {
        return false
    } else if (truthemail + 1 === temail.length) {
        return false
    }
    return true
} 
const apLogin = (req, res) => {
    const muser = req.body
    if (!muser.name) {
        return res.send("please enter the name")
    }
    if (!muser.pass) {
        return res.send("please enter the pass")
    }
    for (let i = 0; i < users.length; i++) {
        if (users[i].name === muser.name) {
            if (users[i].pass === muser.pass) {
                return res.send(`welcome ${users[i].name} with pass = ${users[i].pass}`)
            }
            return res.send(`incorrect pass for ${users[i].name} user`)
        }
    }
    res.send("the considered name not found")
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
    emailCheck = emailCheck(muser.email)
    if (emailCheck === 1) {
        return res.send("email is required")
    } else if (emailCheck === false) {
        return res.send("email is incorrect")
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

module.exports = {
    apLogin,
    apSign
}  
