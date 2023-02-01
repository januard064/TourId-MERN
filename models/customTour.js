const mongoose = require('mongoose')

const tourismSiteSchema = mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    cost: {
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    }
},{
    timeStamps: true
})

const customTourSchema = mongoose.Schema({
    name: {
        type: String,
        required: true, 
        unique: true
    },
    city: {
        type: String,
        required: true, 
    },
    province: {
        type: String,
        required: true, 
    },
    tourismSite: [tourismSiteSchema]
}, {
    timeStamps: true
})

var customTour = mongoose.model('CustomTour', customTourSchema)


module.exports = customTour
