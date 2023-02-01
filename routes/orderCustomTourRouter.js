var express = require('express')

const bodyParser = require('body-parser')

const OrderCustomTour = require('../models/orderCustomTour')

var authenticate = require('../authenticate')

const orderCustomTourRouter = express.Router()

orderCustomTourRouter.use(bodyParser.json())


// order Custom tour

orderCustomTourRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        OrderCustomTour.find({})
            .populate('user')
            .populate('orderCustomTour')
            .then((orderCT) => {
                var userOrderCustomTour = orderCT.filter((opt) => opt.user._id.toString() == req.user._id.toString())
                if (userOrderCustomTour) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(userOrderCustomTour)
                }
                else {
                    err = new Error('User' + req.user._id + 'does not have order yet')
                    err.status = 404
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))

    })
    .post(authenticate.verifyUser, (req, res, next) => {
        OrderCustomTour.find({})
            .then((orderCustomTour) => {
                // var userOrderCustomTour = orderCustomTour.filter((opt) => opt.user.toString() == req.user._id.toString())
                req.body.user = req.user._id
                OrderCustomTour.create(req.body)
                    .then((orderCT) => {
                        res.statusCode = 200
                        res.setHeader("Content-Type", "application/json")
                        res.json(orderCT)
                    }, (err) => next(err))
                    .catch((err) => next(err))

            }, (err) => next(err)
            ).catch((err) => next(err))
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported in /orderCustomTourRouter')
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        OrderCustomTour.find({})
            .then((orderCT) => {
                if (orderCT) {
                    var userOrderCustomTour = orderCT.filter((opt) => opt.user._id.toString() == req.user._id.toString())
                    for (i = (userOrderCustomTour.length - 1); i >= 0; i--) {
                        userOrderCustomTour[i].remove()
                        // console.log(userOrderCustomTour[i]._id)
                        // console.log(userOrderCustomTour)
                    }

                    res.statusCode = 200
                    res.setHeader("Content-Type", "application/json")
                    res.json(orderCT)

                }
                else {
                    err = new Error(`User ${req.user._id} does not have order yet`)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })

// order Custom tour -> cancel custom tour -> orderCustomTour:/orderCustomTourId
orderCustomTourRouter.route('/:orderCustomTourId')
    .get(authenticate.verifyUser, (req, res, next) => {
        OrderCustomTour.findById(req.params.orderCustomTourId)
            .then((orderCT) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(orderCT)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported in /orderCustomTourRouter:/orderCustomTourId')
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        OrderCustomTour.findById(req.params.orderCustomTourId)
            .then((orderCT) => {
                if (req.body.status) {
                    orderCT.status = req.body.status
                }
                orderCT.save()
                    .then((newOrderCT) => {
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(newOrderCT)
                    })
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        OrderCustomTour.findByIdAndRemove(req.params.orderCustomTourId)
            .then((orderCT) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(orderCT)
            }, (err) => next(err))
            .catch((err) => next(err))
    })


module.exports = orderCustomTourRouter

