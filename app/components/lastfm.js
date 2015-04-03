var Backbone = require('backbone');
var Input = require('../components/input');
var DateInput = require('../components/dateinput');
var template = require('../templates/lastfm');

console.log(Backbone);

module.exports = Backbone.View.extend({
  template: template,
  initialize: function(options) {
    this.$el.html(template(options));
  },

  render: function() {
    var _this = this;
    var username = new Input({
      placeholder: 'Last.fm username',
      name: 'lastfm',
      value: ''
    });

    $('.lastfm-input', this.$el).html(username.el); 
    
    username.on('ready', function() {
      _this.renderDatepickers();
    });
  },

  renderDatepickers: function(user) {
    var from = new DateInput({
      name: 'from'
    });
    var to = new DateInput({
      name: 'to'
    });

    var els = $(from.el).add(to.el);
    $('.lastfm-dates', this.$el).html(els);
  }

});
