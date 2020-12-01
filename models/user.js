const mongoose = require('mongoose')
const {roles} =require('../config/roles')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password:{
        type: String,
        required:true
    },
    phoneNumber:{
        type: Number,
        unique: true,
        minlength: 10
    },
    address:{
        type: String,
        required: true
    },
    role:{
        type:String,
        enum: roles,
        default: 'user'
    }
})

const User = mongoose.model('User',userSchema)
module.exports = User