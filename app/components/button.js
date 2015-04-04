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

    this.on('start', this.setLoading.bind(this));
    this.on('end',  this.removeLoading.bind(this));
  },
  
  fetch: function() {
    if(!this.validate()) return false;
    this.trigger('start');
  },
  setLoading: function() {
    $(this.el).addClass('loading');
  },
  removeLoading: function() {
    $(this.el).removeClass('loading');
  }
});
