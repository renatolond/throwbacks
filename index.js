var Throwback = require('./libs/throwback');
var tb = new Throwback();
var express = require('express');
var app = express();
var serveStatic = require('serve-static');

app.use(serveStatic('public', {
	'index': ['index.html']
}));

app.use('/from/:startDate/to/:endDate/for/:username', function(req, res) {

	console.log(req.params);
	tb.getRecentTracks(req.params.username, req.params.startDate, req.params.endDate, function(err, data) {
		if (err) {
			res.send(err);
		}
		// getTopTracks
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

app.listen(3000);