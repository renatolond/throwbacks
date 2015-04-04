var Backbone = require('backbone');
var _ = require('underscore');
var moment = require('moment');
var utils = require('../lib/date');

module.exports =  Backbone.View.extend({
  tagName: 'input',
  className: 'date-picker',
  attributes: {
    type: 'date'
  },

  events: {
    'change': 'setDate'
  },

  initialize: function(options) {
    this.$el.attr('name', options.name);
  },

  // Hide the datepicker and translate it to a label with a cross
  setDate: function(e) {
    var date = $(e.currentTarget).val();
    // Settext as a property
    // this.setText(date);
  },

  getMonth: utils.getMonth, 

  humaniseDate: function(dateString) {
    var date = moment(dateString);
    return '';
  }

});
