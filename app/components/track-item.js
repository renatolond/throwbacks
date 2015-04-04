var Backbone = require('backbone');
var _ = require('underscore');
var template = require('../templates/track-item');


module.exports =  Backbone.View.extend({
  template: template,
  className: 'track-item',
  
  initialize: function(options) {
    this.$el.html(template(options));

    if(!this.model.get('uri')) {
      this.$el.addClass('track-fade');
    }
  }
});
