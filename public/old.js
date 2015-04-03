$(document).ready(function() {

	$.fn.serializeObject = function() {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

	var fieldsValid = function() {
		return ($('#start').val().length > 0 && $('#end').val().length > 0);
	};

	var getTracks = function(data, cb) {
		var url = 'http://localhost:8888/from/' + data.start + '/to/' + data.end + '/for/' + data.username;
		$.ajax({
			type: 'GET',
			url: url,
			success: cb,
			failure: function(err) {
				console.log(err);
			}
		});
	};

	var setDate = function(date) {
		console.log(date);
		var unix = (new Date(date).getTime() / 1000);
		this._o.field.value = unix;

		// Dates not working

		if (fieldsValid()) {
			var formData = $('form').serializeObject();
			console.log(formData);
			getTracks(formData, function(res) {
				console.log(res);
				clearTracks();
				window.tracks = res;

				for (var i = 0; i < res.recenttracks.track.length; i++) {
					var track = res.recenttracks.track[i];
					drawTrack(track);
				}
			});
		}
	};

	var clearTracks = function() {
		$('ul').empty();
	};

	var drawTrack = function(track) {
		var loved = (track.loved == 1 ? '<em>❤</em>' : '');
		$('ul').append('<li><img src="' + track.image[0]['#text'] + '">&nbsp;<strong>' + track.name + '</strong>, ' + track.artist.name + ' ' + loved + '</li>');
	};

	var start = new Pikaday({
		field: $('#start')[0],
		onSelect: setDate
	});

	var end = new Pikaday({
		field: $('#end')[0],
		onSelect: setDate
	});

	var chooseRandomTracks = function(tracks) {
		tracks = tracks.recenttracks.track;
		var random = _.filter(tracks, function(track){
			return !!track.uri;
		});
		random = _.sample(_.pluck(random, 'uri'), 20);
		return random;
	}

	var chooseTopTracks = function(tracks) {
		console.log('chooseTopTracks', tracks)
		tracks = tracks.recenttracks.track;
		tracks = _.filter(tracks, function(track){
			return !!track.uri;
		});
		tracks = _.pluck(tracks, 'uri');

		if(tracks.length > 20) {
			return tracks.slice(0, 20);
		}else {
			return tracks;
		}
	}

	var getMonth = function(date) {
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		return months[new Date(parseInt(date)*1000).getMonth()];
	}

	var getYear = function(date) {
		return new Date(parseInt(date)*1000).getFullYear();
	}

	var makePlaylistName = function(type) {
		var startVal = $('#start').val();
		var endVal = $('#end').val();
		var dates = {
			fromMonth: getMonth(startVal),
			toMonth: getMonth(endVal),
			fromYear: getYear(startVal),
			toYear: getYear(endVal)
		}

		var yearIsSame = (dates.fromYear === dates.toYear);
		var monthIsSame = (dates.fromMonth === dates.toMonth);

		var fromMonth = (yearIsSame ? dates.fromMonth : dates.fromMonth + ' ' + dates.fromYear);
		var toMonth = (yearIsSame ? dates.toMonth : dates.toMonth + ' ' + dates.toYear);

		var dateString = (monthIsSame ? fromMonth : fromMonth + ' to ' + toMonth) + ' ' + (yearIsSame ? dates.fromYear : '');
		var name = 'Throwbacks - ' + dateString + ' ('+type+')';
		return name;
	}

	var makePlaylist = function(tracks, name) {
		console.log(tracks, name);
		$.ajax({
		  url: "http://localhost:8888/make/playlist",
		  contentType: 'application/json',
		  data: JSON.stringify({
		  	tracks: tracks,
		  	name: name
		  }),
		  type: 'POST',
		  dataType: 'json'
		}).done(function(data) {
			console.log(data);
			renderPlaylist(data.uri);
		});

		// ajax post to server, server returns the code and the playlist ID
	}

	var renderPlaylist = function(uri) {
		if(!uri) return;
		var string = '<iframe src="https://embed.spotify.com/?uri='+uri+'" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>';
		$('.playlist').html(string);
		// get the playlist ID and embed it in the page
	}


	$('form').on('submit', function(e) {
		e.preventDefault();
		return false;
	});

	$('button').on('click', function(e){
		e.preventDefault();
		if($(e.currentTarget).hasClass('random')) {
			var tracks = chooseRandomTracks(window.tracks);
			var name = makePlaylistName('random');

			makePlaylist(tracks, name)
		}else {
			var tracks = chooseTopTracks(window.tracks);
			var name = makePlaylistName('top');
			makePlaylist(tracks, name)
		}
	})
});