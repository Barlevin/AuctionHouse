var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var cron = require('node-cron');
var fs = require('fs');
var path = require('path');

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

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', itemsRouter);

// Daily cleanup at 07:00 local time: remove items older than 14 days
const dataPath = path.join(__dirname, 'data.json');
function cleanupOldItems() {
  try {
    if (!fs.existsSync(dataPath)) return;
    const raw = fs.readFileSync(dataPath, 'utf8');
    const json = JSON.parse(raw || '{"items":[]}');
    const items = Array.isArray(json.items) ? json.items : [];
    const now = Date.now();
    const twoWeeksMs = 14 * 24 * 60 * 60 * 1000;
    const filtered = items.filter((it) => {
      const created = Date.parse(it.createdAt || 0) || 0;
      return now - created <= twoWeeksMs;
    });
    if (filtered.length !== items.length) {
      const updated = { ...json, items: filtered };
      fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2), 'utf8');
      // eslint-disable-next-line no-console
      console.log(`[cleanup] Removed ${items.length - filtered.length} expired items`);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[cleanup] Failed:', e);
  }
}

// Schedule: every day at 07:00 local time
cron.schedule('0 7 * * *', cleanupOldItems);

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
