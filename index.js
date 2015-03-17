var Throwback = require('./libs/throwback');
var tb = new Throwback();
var express = require('express')
var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/from/:startDate/to/:endDate/for/:username', function(req, res) {
	console.log(req.params);
	tb.getRecentTracks(req.params.username, req.params.start, req.params.end, function(err, data){
		if(err) {
		 	res.send(err);
		}
		data = JSON.parse(data.text);
		res.json(data);
	});
});

app.listen(3000);