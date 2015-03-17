// App to get info

var config = require('./config');
var request = require('superagent');
var _ = require('underscore');

module.exports = (function(){

	var app = function(){
		this.apiKey = config.apiKey;
		this.apiURL = 'http://ws.audioscrobbler.com/2.0/';
	};

	app.prototype = {
		getRecentTracks: function(username, startDate, endDate, cb) { 
			var url = this.apiURL
			request
			  .get(url)
			  .query({
			  	limit: 200, 
			  	method: 'user.getrecenttracks',
			  	user: username,
			  	api_key: this.apiKey,
			  	format: 'json',
			  	extended: 1
			  })
			  .end(cb);
		},
		getTopTracks: function(tracks) {
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
	
			loved = _.sortBy(response, function(track) {
				return -parseInt(track.loved);
			});

			return loved;
		}

	}

	return app;

}());