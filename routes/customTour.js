var express = require('express')

const CustomTour = require('../models/customTour')

var authenticate = require('../authenticate');

const customTourRouter = express.Router()

// API for /customTour
customTourRouter.route('/')
    .get((req, res, next) => {
        CustomTour.find({})
            .then((cTours) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(cTours)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        CustomTour.create(req.body)
            .then((cTours) => {
                console.log('Custom Tour Data is created', cTours)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(cTours)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403
        res.end('Update operation is not supported on /customTour')
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        CustomTour.remove({})
            .then((resp) => {
                console.log('delete custom tour', resp)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, (err) => next(err))
            .catch((err) => next(err))
    })

// API for /customTour/:customId
customTourRouter.route('/:customId')
    .get((req, res, next) => {
        CustomTour.findById(req.params.customId)
            .then((cTour) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(cTour)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403
        res.end(`Post operation is not supported on /customId/${req.params.customId}`)
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        CustomTour.findByIdAndUpdate(req.params.customId, { $set: req.body }, { new: true })
            .then((cTour) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(cTour)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        CustomTour.findByIdAndRemove(req.params.customId)
            .then((resp) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, (err) => next(err))
            .catch((err) => next(err))
    })

// API for /customTour/:customId/tourisSite
customTourRouter.route('/:customId/tourismSite')
    .get((req, res, next) => {
        CustomTour.findById(req.params.customId)
            .then((cTour) => {
                if (cTour != null) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(cTour.tourismSite)
                } else {
                    err = new Error(`tourismSite in ${req.params.customId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        CustomTour.findById(req.params.customId)
            .then((cTour) => {
                if (cTour != null) {
                    cTour.tourismSite.push(req.body)
                    cTour.save()
                        .then((newCTour) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(newCTour.tourismSite)
                        }, (err) => next(err))
                } else {
                    err = new Error(`tourismSite in ${req.params.customId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403
        res.end(`Update operation is not supported on /tourismSite/${req.params.tourismSite}/tourismSite`)
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        CustomTour.findById(req.params.customId)
            .then((cTour) => {
                if (cTour != null) {

                    for (var i = cTour.tourismSite.length - 1; i >= 0; i--) {
                        cTour.tourismSite.id(cTour.tourismSite[i]._id).remove()
                    }
                    // console.log(pTour.activities.id('637cef29083b5e4476dd304b'))
                    cTour.save()
                        .then((newCTour) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(newCTour)
                        })

                } else {
                    err = new Error(`tourismSite in ${req.params.customId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })

// API for /customTour/:customId/tourismSite/:tourismSiteId
customTourRouter.route('/:customId/tourismSite/:tourismSiteId')
    .get((req, res, next) => {
        CustomTour.findById(req.params.customId)
            .then((cTour) => {
                if (cTour != null && cTour.tourismSite.id(req.params.tourismSiteId) != null) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(cTour.tourismSite.id(req.params.tourismSiteId))
                } else if (cTour == null) {
                    err = new Error(`custom tour  ${req.params.customId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
                else {
                    err = new Error(`tourismSite in ${req.params.tourismSiteId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403
        res.end(`Post operation is not supported on /customTour/${req.params.customId}/tourismSite/${req.params.tourismSiteId}`)
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        CustomTour.findById(req.params.customId)
            .then((cTour) => {
                if (cTour != null && cTour.tourismSite.id(req.params.tourismSiteId) != null) {
                    if (req.body.name) {
                        cTour.tourismSite.id(req.params.tourismSiteId).name = req.body.name
                    }
                    if (req.body.cost) {
                        cTour.tourismSite.id(req.params.tourismSiteId).name = req.body.cost
                    }
                    cTour.save()
                        .then((newCTour) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(newCTour.tourismSite.id(req.params.tourismSiteId))
                        })

                } else if (cTour == null) {
                    err = new Error(`Custom Tour  ${req.params.customId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
                else {
                    err = new Error(`Toursm Site in ${req.params.customId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        CustomTour.findById(req.params.customId)
            .then((cTour) => {
                if (cTour != null && cTour.tourismSite.id(req.params.tourismSiteId) != null) {
                    cTour.tourismSite.id(req.params.tourismSiteId).remove()
                    cTour.save()
                        .then((newCTour) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(newCTour.tourismSite)
                        })

                } else if (cTour == null) {
                    err = new Error(`custom Tour  ${req.params.customId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
                else {
                    err = new Error(`tourism site in ${req.params.customId} not found`)
                    err.statusCode = 400
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
module.exports = customTourRouter