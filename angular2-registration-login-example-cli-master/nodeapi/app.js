var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var connection = require('express-myconnection');
var auth = require('./routes/auth');
var users = require('./routes/users');
var coupons = require('./routes/coupons');
var products = require('./routes/products');
var categories = require('./routes/categories');
var roles = require('./routes/roles');
var items = require('./routes/items');
var async = require('async');
var cors=require('cors');
// var jwt = require('jsonwebtoken');
var app = express();

//Create SQL Connection
app.use(connection(mysql,{
  /*  host:'sql11.freemysqlhosting.net',
    user:'sql11231112',
    password:'CPkLBJaT2M',
    database:'sql11231112'*/
	
	host:'localhost',
    user:'root',
    password:'',
    database:'test'
	
},'request'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
/*app.use(function(req,res,next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE, PUT');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials',true);
});*/
app.use('/', auth);
app.use('/', users);

app.use('/', products);
app.use('/', categories);
app.use('/',coupons);
app.use('/',roles);
app.use('/',items);
// catch 404 and forward to error handler
app.use(function(req, res, next) {	
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
