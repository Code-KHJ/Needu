const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    id: {
        type: String,
        unique: 1
    },
    password: {
        type: String,
        minlength: 8
    },
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

const User = mongoose.model('User',userSchema)

module.exports = {User};