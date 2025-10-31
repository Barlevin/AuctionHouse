var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var itemsRouter = require('./routes/items');

var app = express();

// Enable CORS for all routes
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API routes (must come before static file serving)
app.use('/api', itemsRouter);
// Note: Not using indexRouter as it would override React routing
app.use('/users', usersRouter);

// Serve static files from React build folder
const buildPath = path.join(__dirname, "../client/build");
console.log('Build path:', buildPath);
console.log('Build path exists:', require('fs').existsSync(buildPath));
if (require('fs').existsSync(buildPath)) {
  console.log('Build directory contents:', require('fs').readdirSync(buildPath));
}
app.use(express.static(buildPath));

app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "../client/build", "index.html");
  console.log('Serving index.html from:', indexPath);
  console.log('Index file exists:', require('fs').existsSync(indexPath));
  res.sendFile(indexPath);
});
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
