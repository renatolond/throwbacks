var Backbone = require('backbone');
var Input = require('../components/input');
var template = require('../templates/lastfm');

console.log(Backbone);

module.exports = Backbone.View.extend({
  template: template,

  render: function() {
    var _this = this;
    var username = new Input({
      placeholder: 'Last.fm username',
      name: 'lastfm',
      value: ''
    });

    this.$el.html(username.el);
    username.on('ready', this.renderDatepickers);

  },

  renderDatepickers: function(username) {

  }

});
