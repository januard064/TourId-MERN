const mongoose = require('mongoose')

const Schema = mongoose.Schema

var passportLocalMongoose = require('passport-local-mongoose')


const User = new Schema({
    username : {
        type: String,
        default:''
    },
    password : {
        type: String,
        default:''
    },
    admin : {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User)