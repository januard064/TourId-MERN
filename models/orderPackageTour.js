const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PackageTour',
    },
    status: {
        type: String,
        default: 'new'
    },
    paymentMethod: {
        type: String,
        required: true
    },
    numberOfParticipants: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
}
)


const orderPackageTourSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderTours: [orderSchema]
}, {
    timestamps: true
})


var OrderPackageTour = mongoose.model('OrderPackageTour', orderPackageTourSchema);
module.exports = OrderPackageTour;