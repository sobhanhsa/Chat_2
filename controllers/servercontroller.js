const mongoose = require('mongoose')
const { authenticateTokenClient } = require('./jwt')
const usermodel = require('../schemas/user_schema')
const acitveusermodel = require('../schemas/activeusers_schema')
let users = []
let activeusers = []
mongoose.connect('mongodb://localhost/loginapp', console.log('db connected'))

userFinder()
async function userFinder() {
    users = await usermodel.find()
}
activeuserFinder()
async function activeuserFinder() {
    activeusers = await acitveusermodel.find()
}
async function activeuserAdd(room, username) {
    activeusers = await acitveusermodel.create({ name: username, room: room })
    activeusers = await acitveusermodel.find({ room: room })
    return activeusers
}
async function activeuserDc(room, username) {
    activeusers = await acitveusermodel.deleteOne({ name: username, room: room })
    activeusers = await acitveusermodel.find({ room: room })
    return activeusers
}

const mainioController = (io) => {
    io.on('connection', (socket) => {
        //listen for client response 
        socket.on('recievetoken', ({ token, userinstorage }) => {
            if (token) {
                const tokenStatus = authenticateTokenClient(token)
                if (tokenStatus == null) return socket.emit('htmlmessage', null)
                if (!tokenStatus) return socket.emit('htmlmessage', false)
                const findeduser = users.find(user => user.email === tokenStatus)
                return socket.emit('htmlmessage', findeduser)
            }
            if (!userinstorage) {
                return socket.emit('htmlmessage', undefined)
            }
            const matcheduser = users.find(user => user.name === userinstorage.split(" ")[0])
            if (!matcheduser) {
                return socket.emit('htmlmessage', null)
            }
            if (userinstorage.split(" ")[1] !== matcheduser.pass) {
                return socket.emit('htmlmessage', false)
            }
            if (userinstorage.split(" ")[1] === matcheduser.pass) {
                socket.emit('htmlmessage', matcheduser)
            }
        })
        socket.on('verifyuser', (findeduser, room) => {

            if (!findeduser) {
                return socket.emit('verifymessage', undefined)
            }
            const matcheduser = users.find(user => user.name === findeduser.split(" ")[0])
            if (!matcheduser) {
                return socket.emit('verifymessage', null)
            }
            if (findeduser.split(" ")[1] !== matcheduser.pass) {
                return socket.emit('verifymessage', false)
            }
            if (findeduser.split(" ")[1] === matcheduser.pass) {
                socket.emit('verifymessage', findeduser.split(" ")[0])
            }
            const username = findeduser.split(" ")[0]

            socket.join(room)
            function asyncrunner() {
                async function async() {
                    io.to(room).emit('roomusers', await activeuserAdd(room, username))
                }
                async()
            }
            asyncrunner()
            socket.emit('chatmessage', { name: "chatbot", msg: "wellcome to the chat" })
            socket.broadcast.to(room).emit('chatmessage',
                { name: "chatbot", msg: `${username} Joined the Chad!` }
            )
            socket.on('usermessage', ({ name, msg }) => {
                io.to(room).emit('chatmessage', { name: name, msg: msg })
            })
            socket.on('chatmessage', (obj) => {
                io.to(room).emit('chatmessage', { name: obj.name, msg: obj.msg })
            })
            socket.on('disconnect', () => {
                function asyncrunnerDc() {
                    async function async() {
                        io.to(room).emit('roomusers', await activeuserDc(room, username))
                    }
                    async()
                }
                asyncrunnerDc()
                io.to(room).emit('chatmessage',
                    { name: "chatbot", msg: `${username} disconnected` })
            })
        })
    })
}
module.exports = { mainioController }  