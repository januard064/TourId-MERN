const express = require('express')

const Promo = require('../models/promo')

var authenticate = require('../authenticate');

const promoRouter = express.Router()

// API for /promoTour
promoRouter.route('/')
    .get((req, res, next) => {
        Promo.find({})
            .then((promo) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(promo)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        Promo.create(req.body)
            .then((promo) => {
                console.log('Promo is created', promo)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(promo)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403
        res.end('Update operation is not supported on /promo')
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        Promo.remove({})
            .then((resp) => {
                console.log('delete promo', resp)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, (err) => next(err))
            .catch((err) => next(err))
    })

// API for /promoTour/:promoId
promoRouter.route('/:promoId')
    .get((req, res, next) => {
        Promo.findById(req.params.promoId)
            .then((promo) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(promo)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403
        res.end(`Post operation is not supported on /promo/${req.params.promoId}`)
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        Promo.findByIdAndUpdate(req.params.promoId, { $set: req.body }, { new: true })
            .then((promo) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(promo)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        Promo.findByIdAndRemove(req.params.promoId)
            .then((resp) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, (err) => next(err))
            .catch((err) => next(err))
    })

module.exports = promoRouter