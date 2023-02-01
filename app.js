var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session')
var FileStore =  require('session-file-store')(session)

var config = require('./config');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var packageTourRouter = require('./routes/packageTour')
var customTourRouter = require('./routes/customTour')
var blogRouter = require('./routes/blogRouter')
var promoRouter = require('./routes/promoRouter')
var userRouter = require('./routes/userRouter')
var orderPackageTourRouter = require('./routes/orderPackageTourRouter')
var orderCustomTourRouter = require('./routes/orderCustomTourRouter')

const mongoose = require('mongoose')


var passport = require('passport');
var authenticate = require('./authenticate');

// connect to mongodb
// const url = 'mongodb://localhost:27017/TourId'
const url = config.mongoUrl
const connect = mongoose.connect(url)

connect.then((db) => {
    console.log('Connected correcttly to servers')
},  (err) => {console.log(err)})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());


app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

app.use('/users', userRouter)

function auth (req, res, next) {
  console.log(req.user);

  if (!req.user) {
    var err = new Error('You are not authenticated!');
    err.status = 403;
    next(err);
  }
  else {
        next();
  }
}

app.use(auth)

app.use(express.static(path.join(__dirname, 'public')));



// app.use('/users', usersRouter);
app.use('/packageTour', packageTourRouter)
app.use('/customTour', customTourRouter)
app.use('/blog', blogRouter)
app.use('/promo', promoRouter)
app.use('/orderPackageTour', orderPackageTourRouter)
app.use('/orderCustomTour', orderCustomTourRouter)



app.use(auth)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
