var Throwback = require('./libs/throwback');
var tb = new Throwback();
var serveStatic = require('serve-static');
var config = require('./libs/config');

var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    swig = require('swig'),
    SpotifyStrategy = require('passport-spotify').Strategy;

var consolidate = require('consolidate');

var appKey = config.appKey;
var appSecret = config.appSecret;


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SpotifyStrategy({
  clientID: appKey,
  clientSecret: appSecret,
  callbackURL: 'http://localhost:8888/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;
      return done(null, profile);
    });
  }));

var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(serveStatic(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['playlist-read-private', 'playlist-modify-public', 'playlist-modify-private']
  }),
  function(req, res){
});


app.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.use('/from/:startDate/to/:endDate/for/:username', function(req, res) {

  tb.getRecentTracks(req.params.username, req.params.startDate, req.params.endDate, function(err, data) {
    if (err) {
      res.send(err);
    }
  

    data = JSON.parse(data.text);
    data = tb.getTopTracks(data.recenttracks.track);

    res.json({
      recenttracks: {
        track: data
      }
    });
  });


});

app.use('/get/:track_title', function(req, res){
  var title = req.params.track_title;
  tb.getSpotifyURI(title, function(err, data){
    if(err) {
      res.send(err);
    }
    res.json(JSON.parse(data.text));
  });
});

app.listen(8888);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
