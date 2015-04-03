var Backbone = require('backbone');
var Track = require('../models/track');

module.exports = Backbone.Collection.extend({
  model: Track,
  initialize: function(options) {
  	this.url = options.url;
  },

  parse: function(res) {
  	return res.recenttracks.track;
  }
});