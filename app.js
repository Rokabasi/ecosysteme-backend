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
const exportdossierRouter = require('./routes/exportdossier');
const projetRouter = require('./routes/projet');
const dashboardRouter = require('./routes/dashboard');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Configuration CORS détaillée pour permettre les requêtes entre sous-domaines
const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (comme les appels API directs)
    if (!origin) return callback(null, true);

    // Liste des domaines autorisés
    const allowedOrigins = [
      "https://fonarev.mazaya.io",
      "https://public.mazaya.io",
      "https://ecoapi.mazaya.io/",
      "http://46.202.194.100:3011",
      "http://46.202.194.100:3010",
      "http://46.202.194.100:3014",
      "http://localhost:5173",
      "http://localhost:5174",
      // Ajoutez d'autres domaines si nécessaire
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith("mazaya.io")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "x-access-token",
  ],
  credentials: true, // Pour permettre les cookies dans les requêtes cross-origin
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Appliquer CORS globalement
app.use(cors(corsOptions));

// Assurer que OPTIONS répond correctement pour les requêtes préflight
app.options("*", cors(corsOptions));

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
app.use('/exportdossier', exportdossierRouter);
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
