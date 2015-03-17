$(document).ready(function(){

	$.fn.serializeObject = function()
	{
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
	}

	var getTracks = function(data, cb) {
		var url = 'http://192.168.1.7:3000/from/'+data.start+'/to/'+data.end+'/for/'+data.username;
		$.ajax({
			type: 'GET',
			url: url,
			success: cb,
			failure: function(err) {
				console.log(err)
			}
		})
	}

	var setDate = function(date) {
		var unix = (new Date(date).getTime()/1000);
		this._o.field.value = unix;

		// Dates not working

		if(fieldsValid()) {
			var formData = $('form').serializeObject();
			console.log(formData);
			getTracks(formData, function(res) {
				console.log(res);
				clearTracks();

				for(var i = 0; i < res.recenttracks.track.length; i++) {
					var track = res.recenttracks.track[i];
					drawTrack(track);
				}
			});
		}
	}

	var clearTracks = function() {
		$('ul').empty();
	}

	var drawTrack = function(track) {
		var loved = (track.loved == 1 ? '<em>❤</em>' : '');
		$('ul').append('<li><img src="'+track.image[0]['#text']+'">&nbsp;<strong>'+track.name+'</strong>, '+track.artist.name+' '+loved+'</li>')
	}

	var start = new Pikaday({ 
		field: $('#start')[0],
		onSelect: setDate
	 });

	var end = new Pikaday({ 
		field: $('#end')[0],
		onSelect: setDate
	 });


	$('form').on('submit', function(e){
		e.preventDefault();
		return false;
	});
});