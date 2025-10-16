const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
require('dotenv').config();
require("./config/db").sync();
const app = express();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const structureRouter = require('./routes/structure');
const provinceRouter = require('./routes/province');
const domaineRouter = require('./routes/domaine');
const registerRouter = require('./routes/register');
const candidatureRouter = require('./routes/candidature');
const directionRouter = require('./routes/direction');
const dossierRouter = require('./routes/dossier');
const filterdossierRouter = require('./routes/filterdossier');
const projetRouter = require('./routes/projet');
const dashboardRouter = require('./routes/dashboard');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);  
app.use('/auth', authRouter);
app.use('/provinces', provinceRouter);
app.use('/domaines', domaineRouter);
app.use('/structures', structureRouter);
app.use('/register', registerRouter);
app.use('/candidatures', candidatureRouter);
app.use('/directions', directionRouter);
app.use('/dossiers', dossierRouter);
app.use('/filterdossier', filterdossierRouter);
app.use('/projets', projetRouter);
app.use('/dashboard', dashboardRouter);

app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
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
