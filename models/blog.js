const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true, 
    },
    blog: {
        type: String,
        required: true, 
    },
    images: {
        type: String,
        required: true, 
    },
},{
    timestamps:  true
})

var blog =  mongoose.model('blog', blogSchema)

module.exports = blog

