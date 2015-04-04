//tamtam
var Backbone = require('backbone');
var lastfmView = require('./components/lastfm');
$ = require('jquery');

Backbone.$ = $;

var App = Backbone.View.extend({
	initialize: function() {
		this.renderLastfm();
	},
	renderLastfm: function() {
		var lastfm = new lastfmView({
			el: $('.lastfm', this.$el)
		});
		lastfm.render();
	}
});

$(function(){
	var main = $('main');
	var app = new App({
		el: $(main)
	});
});
