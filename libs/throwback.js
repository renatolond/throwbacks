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
		makePlaylist: function(name, tracks, userid, token, res) {
			var _this = this;
			console.log('POST TO', 'https://api.spotify.com/v1/users/{user_id}/playlists')
			console.log('POST TO ', 'https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks?uris={uris}');
			console.log(name, userid, token);
			console.log('')
			console.log('http://api.spotify.com/v1/users/'+userid+'/playlists')
			
			var data = JSON.stringify({
			  	name: name,
			  	"public": false
			  });
				
			request
			  .post( 'https://api.spotify.com/v1/users/'+userid+'/playlists')
			  .send(data)
			  .set('content-type', 'application/json')
			  .set('Authorization', 'Bearer '+token)
			  .end(function(err, data){
			  	_this.addSongsToPlaylist(data.body, tracks, userid, res, token);
			  });
			
		},

		addSongsToPlaylist: function(playlist, tracks, userid, res, token) {
			var trackList = tracks.join();
			res.json(playlist);

			request
			  .post('https://api.spotify.com/v1/users/'+userid+'/playlists/'+playlist.id+'/tracks?uris='+trackList)
			  .set('Authorization', 'Bearer '+token)
			  .end(function(err, data){
			  	console.log(err, data);
			  	//res.json(data)
			  });
		},

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
			console.log('track:'+track.name+' artist:'+track.artist.name);
			request.get('https://api.spotify.com/v1/search')
			.query({
				// Pass in the artist name too here!
				q: 'track:'+track.name.toString()+' artist:'+track.artist.name.toString(),
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

		},
		userValid: function(res) {
			console.log(res);
			if(res.user) return true;
			if(res.error) return false;
			return false;
		},
		userExists: function(username, cb) {
			var _this = this;
			var url = 'http://ws.audioscrobbler.com/2.0/?method=user.getinfo';
			request
			  .get(url)
			  .query({
			  	format: 'json',
			  	user: username,
			  	api_key: this.apiKey,
			  })
			  .end(function(err, data) {
			  	if(err) return cb(false);
			  	var isValid = _this.userValid(data.body);
			  	return cb(isValid, data.body);
			  });
		}

	};

	return app;

}());