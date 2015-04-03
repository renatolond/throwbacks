var Backbone = require('backbone');
var _ = require('underscore');
var moment = require('moment');

module.exports =  Backbone.View.extend({
  tagName: 'button',

  events: {
    'click': 'fetch'
  },

  initialize: function(options) {
    var _this = this;
    this.options = options;
    $(this.$el).text(options.label)
    this.validate = this.options.validate;
    this.getData = this.options.getData;

    this.on('start', function() {
      $(_this.el).addClass('loading');
    });

    this.on('end', function() {
      console.log('end');
      $(_this.el).removeClass('loading');
    });
  },
  
  fetch: function() {
    if(!this.validate()) return false;
    this.trigger('start');
  } 
});
