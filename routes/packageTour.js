var express = require('express')

const PackageTour = require('../models/packageTour')

var authenticate = require('../authenticate');

const packageTourRouter = express.Router()

// API for /packageTour
packageTourRouter.route('/')
    .get((req, res, next) => {
        PackageTour.find({})
            .then((pTours) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(pTours)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post( authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        PackageTour.create(req.body)
            .then((pTours) => {
                console.log('Package Tour is created', pTours)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(pTours)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put( authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403
        res.end('Update operation is not supported on /packageTour')
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        PackageTour.remove({})
            .then((resp) => {
                console.log('delete pTour', resp)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(pTour)
            }, (err) => next(err))
            .catch((err) => next(err))
    })

// API for /packageTour/:packageTourId
packageTourRouter.route('/:packageTourId')
    .get((req, res, next) => {
        PackageTour.findById(req.params.packageTourId)
            .then((pTour) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(pTour)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403
        res.end(`Post operation is not supported on /packageTour/${req.params.packageTourId}`)
    })
    .put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        PackageTour.findByIdAndUpdate(req.params.packageTourId, { $set: req.body }, { new: true })
            .then((pTour) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(pTour)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        PackageTour.findByIdAndRemove(req.params.packageTourId)
            .then((resp) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, (err) => next(err))
            .catch((err) => next(err))
    })

// API for /packageTour/:packageTourId/activities
packageTourRouter.route('/:packageTourId/activities')
    .get((req, res, next) => {
        PackageTour.findById(req.params.packageTourId)
            .then((pTour) => {
                if (pTour != null) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(pTour.activities)
                } else {
                    err = new Error(`Activites in ${req.params.packageTourId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        PackageTour.findById(req.params.packageTourId)
            .then((pTour) => {
                if (pTour != null) {
                    pTour.activities.push(req.body)
                    pTour.save()
                        .then((newPTour) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(newPTour.activities)
                        }, (err) => next(err))
                } else {
                    err = new Error(`Activites in ${req.params.packageTourId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403
        res.end(`Update operation is not supported on /packageTour/${req.params.packageTourId}/activities`)
    })
    .delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        PackageTour.findById(req.params.packageTourId)
            .then((pTour) => {
                if (pTour != null) {

                    for (var i = pTour.activities.length - 1; i >= 0; i--) {
                        pTour.activities.id(pTour.activities[i]._id).remove()
                    }
                    // console.log(pTour.activities.id('637cef29083b5e4476dd304b'))
                    pTour.save()
                        .then((newPTour) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(newPTour)
                        })

                } else {
                    err = new Error(`Activites in ${req.params.packageTourId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })

// API for /packageTour/:packageTourId/activities:/activityId
packageTourRouter.route('/:packageTourId/activities/:activityId')
    .get((req, res, next) => {
        PackageTour.findById(req.params.packageTourId)
            .then((pTour) => {
                if (pTour != null && pTour.activities.id(req.params.activityId) != null) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(pTour.activities.id(req.params.activityId))
                } else if (pTour == null) {
                    err = new Error(`Pacakage Tour  ${req.params.packageTourId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
                else {
                    err = new Error(`Activites in ${req.params.packageTourId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403
        res.end(`Post operation is not supported on /packageTour/${req.params.packageTourId}/activities/${req.params.activityId}`)
    })
    .put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        PackageTour.findById(req.params.packageTourId)
            .then((pTour) => {
                if (pTour != null && pTour.activities.id(req.params.activityId) != null) {
                    if (req.body.day) {
                        pTour.activities.id(req.params.activityId).day = req.body.day
                    }
                    if (req.body.activityTitle) {
                        pTour.activities.id(req.params.activityId).activityTitle = req.body.activityTitle
                    }
                    if (req.body.location) {
                        pTour.activities.id(req.params.activityId).location = req.body.location
                    }
                    if (req.body.transportation) {
                        pTour.activities.id(req.params.activityId).transportation = req.body.transportation
                    }
                    pTour.save()
                        .then((newPTour) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(pTour.activities.id(req.params.activityId))
                        })

                } else if (pTour == null) {
                    err = new Error(`Pacakage Tour  ${req.params.packageTourId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
                else {
                    err = new Error(`Activites in ${req.params.packageTourId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        PackageTour.findById(req.params.packageTourId)
            .then((pTour) => {
                if (pTour != null && pTour.activities.id(req.params.activityId) != null) {
                    pTour.activities.id(req.params.activityId).remove()
                    pTour.save()
                        .then((newPTour) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(pTour.activities)
                        })

                } else if (pTour == null) {
                    err = new Error(`Pacakage Tour  ${req.params.packageTourId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
                else {
                    err = new Error(`Activites in ${req.params.packageTourId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })

module.exports = packageTourRouter;