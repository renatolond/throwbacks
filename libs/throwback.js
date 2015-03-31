// App to get info

var config = require('./config');
var request = require('superagent');
var _ = require('underscore');
var async = require('async');

module.exports = (function(){

	var app = function(){
		this.apiKey = config.apiKey;
		this.host = config.host;
		this.apiURL = 'http://ws.audioscrobbler.com/2.0/';
	};

	app.prototype = {
		getRecentTracks: function(username, startDate, endDate, cb) { 
			var url = this.apiURL;
			request
			  .get(url)
			  .query({
			  	limit: 200, 
			  	method: 'user.getrecenttracks',
			  	user: username,
			  	api_key: this.apiKey,
			  	format: 'json',
			  	extended: 1,
			  	from: startDate,
			  	to: endDate
			  })
			  .end(cb);
		},
		// Get spotify uris from tracks
		getSpotifyURI: function(track, cb) {
			request.get('https://api.spotify.com/v1/search')
			.query({
				q: track.name,
				type: 'track',
				limit: 1,
			})
			.end(function(err, data) {
				data = JSON.parse(data.text);
				var item = { uri: null }
				if(data.tracks.items && data.tracks.items.length > 0) {
					item = data.tracks.items[0]
				}
				track.uri = item.uri;
				cb(null, track);
			});
		},

		getTopTracks: function(tracks, cb) {
			// var data = this.dummy.recenttracks.track;
			var data = tracks;
			var counted = _.chain(data)
			   .countBy('url')
			   .pairs()
			   .sortBy(1).reverse()
			   .value();

			var response = [];

			 _.each(counted, function(track) {
			 	var obj = _.findWhere(data, {url: track[0]});
			 	obj.count = track[1];
			 	response.push(obj);
			 });
	
			var loved = _.sortBy(response, function(track) {
				return -parseInt(track.loved);
			});

			async.map(loved, this.getSpotifyURI, function(err, results){
				if(err) return [];
				console.log(results);
				cb(results);
			});

		}

	};

	return app;

}());