const mongoose = require('mongoose')

const activitiesSchema = mongoose.Schema({
    day:{
        type: Number,
        required: false
    },
    activityTitle:{
        type:  String,
        required: false
    },
    location:{
        type: String,
        required: false
    },
    transportation:{
        type: String,
        required: true
    },
},{
    timestamps: true
})

const packageTourSchema = mongoose.Schema({
    name: {
        type: String,
        required: true, 
        unique: true
    },
    cost: {
        type: Number,
        required: true
    },
    isPriority: {
        type: Boolean,
        default: false
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    hotel:{
        type: String,
        required: true
    },
    insurance:{
        type: String,
        required: true
    },
    activities:[activitiesSchema]
},{
    timestamps: true
})

var PackageTour = mongoose.model('PackageTour', packageTourSchema)

module.exports = PackageTour