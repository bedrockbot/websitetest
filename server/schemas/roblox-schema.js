const mongoose = require("mongoose")
const { required } = require("nodemon/lib/config")

const prefixSchema = mongoose.Schema({

    _id: {
        type: String,
        required: true
    },
    robloxid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        required: true
    }

})

module.exports = mongoose.model('roblox-verification', prefixSchema)