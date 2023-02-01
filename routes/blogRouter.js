const express = require('express')

const Blog = require('../models/blog')

var authenticate = require('../authenticate');

const blogRouter = express.Router()

// API for /blogRouter
blogRouter.route('/')
    .get((req, res, next) => {
        Blog.find({})
            .then((blog) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(blog)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Blog.create(req.body)
            .then((blog) => {
                console.log('Custom Tour Data is created', blog)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(blog)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403
        res.end('Update operation is not supported on /blogRouter')
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Blog.remove({})
            .then((resp) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, (err) => next(err))
            .catch((err) => next(err))
    })

// API for /blogRouter:/blogId
blogRouter.route('/:blogId')
    .get((req, res, next) => {
        Blog.findById(req.params.blogId)
            .then((blog) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(blog)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403
        res.end(`Post operation is not supported on /customId/${req.params.customId}`)
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Blog.findByIdAndUpdate(req.params.blogId, { $set: req.body }, { new: true })
            .then((blog) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(blog)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Blog.findByIdAndRemove(req.params.blogId)
            .then((resp) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, (err) => next(err))
            .catch((err) => next(err))
    })

module.exports = blogRouter