//tamtam
var Backbone = require('backbone');
var template = require('./templates/index');
var lastfmView = require('./components/lastfm');
$ = require('jquery');

Backbone.$ = $;

var App = Backbone.View.extend({
	initialize: function() {
		console.log('initialize app');
		this.renderLastfm();
	},
	render: function(){
		console.log('render app test');
	},
	renderLastfm: function() {
		var $container = $('.lastfm', this.$el);
		if( $container.length > 0 ) {
			lastfm = new lastfmView({
				el: $container.get(0)
			});

			lastfm.render();
		}
	}
});

console.log(App);


$(function(){
	console.log('start app');
	var main = $('main');
	var app = new App({
		el: $(main)
	});
	console.log(app);
})
