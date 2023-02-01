const mongoose = require('mongoose')

const Schema = mongoose.Schema

const activitisOrderCustom = new Schema({
    // tour: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'TourismSite'
    // },
    orderedDay: {
        type: Number,
        required: true
    },
    additionNote: {
        type: String,
        required: false
    }
}, {
    timestamps: true
}
)


const orderCustomTourSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderCustomTour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CustomTour'
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        default:'open'
    },
    activities:[activitisOrderCustom]
}, {
    timestamps: true
})


var OrderCustomTour = mongoose.model('OrderCustomTour', orderCustomTourSchema);
module.exports = OrderCustomTour;