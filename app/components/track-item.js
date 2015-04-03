var Backbone = require('backbone');
var _ = require('underscore');
var template = require('../templates/track-item');


module.exports =  Backbone.View.extend({
  template: template,

  // events: {
  //   'click': 'fetch'
  // },

  initialize: function(options) {
    console.log('initialize', options.model);
    this.$el.html(template(options));
  },
  render: function() {
    console.log('render');
  }
});
