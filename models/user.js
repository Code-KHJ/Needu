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
    username: {
        type: String,
        maxlength: 50
    },
    phonenumber: {
        type: String
    },
    email: {
        type: String,
        trim: true,
    }
//     token: {
//         type: String
//     },
//     tokenExp: {
//         type: Number
//     }
})

const User = mongoose.model('User',userSchema)

module.exports = {User};