var express = require('express')

const bodyParser = require('body-parser')

const OrderPackageTour = require('../models/orderPackageTour')

var authenticate = require('../authenticate');

const orderPackageTourRouter = express.Router()

orderPackageTourRouter.use(bodyParser.json())


// order packagetour
orderPackageTourRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        OrderPackageTour.find({})
            .populate('user')
            .populate('orderTours.tour')
            .then((orderPackageTour) => {
                var userOrderPackageTour = orderPackageTour.filter((opt) => opt.user._id.toString() == req.user._id.toString())[0]
                console.log(`order by ${req.user._id} : ${orderPackageTour}`)
                if (userOrderPackageTour) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(userOrderPackageTour)
                } else {
                    err = new Error('User' + req.user._id + 'does not have order yet')
                    err.status = 404
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    // register to order package tour
    .post(authenticate.verifyUser, (req, res, next) => {
        OrderPackageTour.find({})
            .then((orderPackageTour) => {
                if (orderPackageTour) {
                    var userOrderPackageTour = orderPackageTour.filter((opt) => opt.user.toString() == req.user._id.toString())[0]
                    if (!userOrderPackageTour) {
                        req.body.user = req.user._id
                        req.body.orderTours = req.params.packageTourId
                        OrderPackageTour.create(req.body)
                            .then((orderPT) => {
                                res.statusCode = 200
                                res.setHeader("Content-Type", "application/json")
                                res.json(orderPT)
                            }, (err) => next(err))
                            .catch((err) => next(err))
                    } else {
                        // err = new Error(`${req.user._id} can select the package`)
                        res.send(`${req.user._id} can select the package`)
                        res.status = 200
                        // return next()
                    }
                }
                else {
                    err = new Error('You do not have order package tour yet')
                    err.status = 404
                    return next(err)
                }
            }, (err) => next(err)
            ).catch((err) => next(err))
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported in /orderPackageTour')
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        OrderPackageTour.find({})
            .then((orderPackageTour) => {
                if (orderPackageTour) {
                    var userOrderPackageTour = orderPackageTour.filter((opt) => opt.user._id.toString() == req.user._id.toString())[0]
                    userOrderPackageTour.remove()
                        .then((userOPT) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(userOPT)
                        }, (err) => next(err)
                        ).catch((err) => next(err))
                } else {
                    err = new Error(`User ${req.user._id} does not have order yet`)
                }

            }, (err) => next(err)
            ).catch((err) => next(err))
    })


// order package tour by packagetourId params
orderPackageTourRouter.route('/:packageTourId')
    .get(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`GET operation not supported in /orderPackageTour/${req.params.packageTourId}`)
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        OrderPackageTour.find({})
            .then((orderPackageTour) => {
                if (orderPackageTour) {
                    var userOrderPackageTour = orderPackageTour.filter((opt) => opt.user.toString() == req.user._id.toString())[0]
                    if (!userOrderPackageTour) {

                        err = new Error(`user ${req.user._id} please agree terms and condition`)
                        err.status = 404
                        return next(err)
                    }
                    else {
                        if (
                            // userOrderPackageTour.packageTour.indexOf(`${req.params.packageTourId.toString()}`) === -1
                            userOrderPackageTour.orderTours.some((v) => { return v.tour == req.params.packageTourId.toString() })) {
                            err = new Error(req.params.packageTourId.toString() + 'has already  exist in' + userOrderPackageTour.orderTours)
                            err.status = 404
                            return next(err)
                        } else {
                            req.body.tour = req.params.packageTourId
                            // req.body.paymentMethod = req.body.paymentMethod
                            userOrderPackageTour.orderTours.push(req.body)
                        }
                        userOrderPackageTour.save()
                            .then((orderPT) => {
                                res.statusCode = 200
                                res.setHeader("Content-Type", "application/json")
                                res.json(orderPT)
                            }, (err) => next(err))
                            .catch((err) => next(err))
                    }
                }
                else {
                    err = new Error('You do not have order package tour yet')
                    err.status = 404
                    return next(err)
                }
            }, (err) => next(err)
            ).catch((err) => next(err))
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported in /orderPackageTour/:packageTourId')
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Delete operation not supported in /orderPackageTour/orderTours/:packageTourId')
    })

// orderTours array 
orderPackageTourRouter.route('/orderTours/:orderToursId')
    .get(authenticate.verifyUser, (req, res, next) => {
        OrderPackageTour.find({})
            // .populate('packageTour.tour')
            .then((orderPackageTour) => {
                var userOrderPackageTour = orderPackageTour.filter((opt) => opt.user._id.toString() == req.user._id.toString())[0]
                console.log(`order by ${req.user._id} : ${orderPackageTour}`)
                if (userOrderPackageTour != null && userOrderPackageTour.orderTours.id(req.params.orderToursId) != null) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(userOrderPackageTour.orderTours.id(req.params.orderToursId))
                } else if (userOrderPackageTour == null) {
                    err = new Error('order  not found')
                    err.status = 404
                    return next(err)
                } else {
                    err = new Error(`order package tour ${req.params.orderToursId} is not found`)
                    err.status = 404
                    return next(err)
                }
            }, (err) => next(err))
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        OrderPackageTour.find({})
            .populate('orderTours.tour')
            .then((orderPackageTour) => {
                var userOrderPackageTour = orderPackageTour.filter((opt) => opt.user._id.toString() == req.user._id.toString())[0]
                console.log(`order by ${req.user._id} : ${orderPackageTour}`)
                if (userOrderPackageTour != null && userOrderPackageTour.orderTours.id(req.params.orderToursId) != null) {

                    if (req.body.status) {
                        userOrderPackageTour.orderTours.id(req.params.orderToursId).status = req.body.status
                    }

                    if (req.body.paymentMethod) {
                        userOrderPackageTour.orderTours.id(req.params.orderToursId).paymentMethod = req.body.paymentMethod
                    }

                    if (req.body.numberOfParticipants) {
                        userOrderPackageTour.orderTours.id(req.params.orderToursId).numberOfParticipants = req.body.numberOfParticipants
                    }

                    userOrderPackageTour.save()
                        .then((newUserOrderPackageTour) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json');
                            // res.send(`${req.params.orderToursId} is success updated`)
                            res.json(newUserOrderPackageTour)
                        }, (err) => next(err))

                } else if (userOrderPackageTour == null) {
                    err = new Error('order  not found')
                    err.status = 404
                    return next(err)
                } else {
                    err = new Error(`order package tour ${req.params.orderToursId} is not found`)
                    err.status = 404
                    return next(err)
                }
            }, (err) => next(err))
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        OrderPackageTour.find({})
            .populate('orderTours.tour')
            .then((orderPackageTour) => {
                var userOrderPackageTour = orderPackageTour.filter((opt) => opt.user._id.toString() == req.user._id.toString())[0]
                console.log(`order by ${req.user._id} : ${orderPackageTour}`)
                if (userOrderPackageTour != null && userOrderPackageTour.orderTours.id(req.params.orderToursId) != null) {
                    userOrderPackageTour.orderTours.id(req.params.orderToursId).remove()
                    userOrderPackageTour.save()
                        .then((newUerOrderPackageTour) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json');
                            // res.send(`deleted ${req.params.orderToursId} is success`)
                            res.json(newUerOrderPackageTour)
                        }, (err) => next(err))
                } else if (userOrderPackageTour == null) {
                    err = new Error('order  not found')
                    err.status = 404
                    return next(err)
                } else {
                    err = new Error(`order package tour ${req.params.orderToursId} is not found`)
                    err.status = 404
                    return next(err)
                }
            }, (err) => next(err))
    })


module.exports = orderPackageTourRouter

