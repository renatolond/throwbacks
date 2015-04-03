var Backbone = require('backbone');
var _ = require('underscore');
var ItemView = require('./track-item');
var Collection = require('../collections/tracks');
var Button = require('./button');

module.exports =  Backbone.View.extend({
  tagName: 'ul',
  className: 'track-list',

  // events: {
  //   'click': 'fetch'
  // },

  // Pass the username
  initialize: function(options) {
    this.options = options;
  },

  render: function() {
    var _this = this;
    var data = this.options.listData;
    var button = this.options.button;

    this.collection = new Collection({
      url: '/from/' + data.from + '/to/' + data.to + '/for/' + data.user.id
    });
  
    this.listenTo(this.collection, 'sync', function(data) {
      _.each(data.models, _this.renderItem.bind(_this));
      this.renderSendButton();
      button.trigger('end');
    });

    this.collection.fetch();
  },

  makeTrackset: function() {
    console.log('Make trackset', this.collection);
  },

  renderSendButton: function() {
    var _this = this;
    var send = new Button({
      className: 'send-tracks',
      label: 'Send playlist to Spotify',
      validate: function() {
        // If the collection has models!
        return true;
      }
    });

    send.on('start', function() {
      _this.sendToSpotify();
    });

    $(this.$el).append(send.el);
  },

  sendToSpotify: function() {
    console.log('sendToSpotify');
    // Get trackset
    var trackset = this.makeTrackset();

  },

  renderItem: function(model) {
    var item = new ItemView({
      model: model
    });
    this.$el.append(item.el);
  }


});
