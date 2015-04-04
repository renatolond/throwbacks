// Pass and sort the collection
var Backbone = require('backbone');
var _ = require('underscore');
var moment = require('moment');

module.exports =  Backbone.View.extend({
  tagName: 'input',
  className: 'track-radio',
  attributes: {
    type: 'radio',
    name: 'sort'
  },
  events: {
  	'change': 'sort'
  },
  initialize: function(options) {
  	this.options = options;
    this.$el.attr('value', options.value);
  },
  render: function() {
  	this.$el.after('<label">'+this.options.label+'</label>');
  }
});
