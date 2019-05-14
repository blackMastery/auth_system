/**
 * Module dependencies.
 */

var express = require('express'),
  fs = require('fs'),
  http = require('http'),
  path = require('path'),
  mongoose = require('mongoose'),
  passport = require("passport"),
  flash = require("connect-flash");
const morgan = require('morgan')

var env = process.env.NODE_ENV || 'development',
  config = require('./config/config')[env];
//Configure mongoose's promise to global promise
mongoose.Promise = global.Promise;
// mongoose.promise = global.Promise;
console.log(config.db)
mongoose.connect(config.db)
.then((r)=>console.log("connection maded"))
.catch((e) => {
//   throw e;
console.log(e)
});


var models_dir = __dirname + '/app/models';
fs.readdirSync(models_dir).forEach(function (file) {
  if(file[0] === '.') return; 
  require(models_dir+'/'+ file);
});


require('./config/passport')(passport, config)

var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.use(morgan('dev'))
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.render('500', { error: err });
});

app.use(function(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  res.type('txt').send('Not found');
});


require('./config/routes')(app, passport);


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

