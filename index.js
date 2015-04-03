var Throwback = require('./libs/throwback');
var tb = new Throwback();
var serveStatic = require('serve-static');
var config = require('./libs/config');
var livereload = require('express-livereload');

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
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(serveStatic(__dirname + '/public'));


var lr = livereload(app, {watchDir: __dirname + '/public'});
console.log(lr);

lr.on('changed', function() {
  console.log('LR Changed public folder')
})

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
    
    // Pass in errors as well
    tb.getTopTracks(data.recenttracks.track, function(results) {
    	res.json({
    	  recenttracks: {
    	    track: results
    	  }
    	});
    });

  });


});

app.use('/get/:track_title', function(req, res){
  var title = req.params.track_title;
  tb.getSpotifyURI(title, function(err, data){
  	console.log('Getting URI for ', title)
    if(err) {
      res.send(err);
    }
    res.json(JSON.parse(data.text));
  });
});

app.use('/make/playlist', function(req, res) {
	if(!req.user) res.send('No user');
	console.log(req.user.id);

	var name = req.body.name;
	var tracks = req.body.tracks;
	var userid = req.user.id;
	var token = req.user.accessToken;


	tb.makePlaylist(name, tracks, userid, token, res);
	// Make playlist from tracks
	// Return id of the playlist
})

app.listen(8888);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
