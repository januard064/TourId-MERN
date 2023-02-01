const mongoose = require('mongoose')

const promoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true, 
        unique: true
    },
    totalDiscount: {
        type: Number,
        required: true, 
    },
    isOpen: {
        type: Boolean,
        default: false
    },
},{
    timestamps:  true
})

var promo = mongoose.model('promo', promoSchema)

module.exports = promo

