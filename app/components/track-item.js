var Backbone = require('backbone');
var _ = require('underscore');
var template = require('../templates/track-item');


module.exports =  Backbone.View.extend({
  template: template,
  tagName: 'li',
  className: 'track-item',

  // events: {
  //   'click': 'fetch'
  // },

  initialize: function(options) {
    console.log('initialize', options.model);
    this.$el.html(template(options));

    if(!this.model.get('uri')) {
      this.$el.addClass('track-fade');
    }
  },
  render: function() {
    console.log('render');
  }
});
