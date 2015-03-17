// App to get info

var config = require('./config');
var request = require('superagent');

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
			  	limit: 100, 
			  	method: 'user.getrecenttracks',
			  	user: username,
			  	api_key: this.apiKey,
			  	format: 'json',
			  	extended: 1
			  })
			  .end(cb);
		},
		validateUnix: function() {

		}

	}

	return app;

}());