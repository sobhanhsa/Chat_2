const mongoose = require('mongoose')

const activeusersSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Activeuser", activeusersSchema)