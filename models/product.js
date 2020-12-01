const mongoose = require('mongoose')
const User=require('./user')

const productSchema = mongoose.Schema({
    name:{
        type: String, 
        required: true
    },
    dresscode:{
        type: String,
        required: true
    },
    size:{
        type: String,
        enum: ['X-Small','Small','Medium','Large','X-Large'],
        default: 'Medium'
    },
    price:{
        type: Number,
        required: true
    },
    vendorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }
})

const Product = mongoose.model('Product',productSchema)
module.exports = Product