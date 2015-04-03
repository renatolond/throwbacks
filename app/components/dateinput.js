var Backbone = require('backbone');
var _ = require('underscore');

module.exports =  Backbone.View.extend({
  tagName: 'input',
  className: 'date-picker',
  attributes: {
    type: 'date'
  },

  events: {
    'change input': 'setDate'
  },

  initialize: function(options) {
    this.attributes.name = options.name;
  },

  setDate: function(e) {
    console.log(e);
  },

  parseDate: function() {

  },

  humaniseDate: function() {

  }

});
