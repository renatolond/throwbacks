var Backbone = require('backbone');
var _ = require('underscore');
var ItemView = require('./track-item');
var Collection = require('../collections/tracks');
var Button = require('./button');
var Radio = require('./radio');
var spotify = require('../lib/spotify');
var date = require('../lib/date');

module.exports =  Backbone.View.extend({
  className: 'track-list',

  initialize: function(options) {
    var _this = this;
    this.options = options;
    var data = this.options.listData;
    var button = this.options.button;

    this.collection = new Collection({
      url: '/from/' + data.from + '/to/' + data.to + '/for/' + data.user.id
    });

    this.listenTo(this.collection, 'sync', this.showElements.bind(this));
  },

  showElements: function(data) {
    this.options.button.trigger('end');

    if(data.length === 0) { 
      return this.renderError('No tracks were found');
    }
    _.each(data.models, this.renderItem.bind(this));
    this.renderSorting();
    this.renderSendButton();
  },

  render: function() {
    this.collection.fetch();
  },

  renderError: function(message) {
    this.$el.html('<span class="track-error">'+message+'</span>');
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

    this.listenTo(send, 'start', _this.sendToSpotify.bind(this));
    $(this.$el).append(send.el);
  },

  makeRadio: function(opts) {
    var view = new Radio(opts);
    return view;
  },

  renderSorting: function() {
    var _this = this;

    var radios = _.map(this.sortOptions, function(options){
      var view = _this.makeRadio(options);
      _this.$el.append(view.el);
      view.render();
    });
  },

  sendToSpotify: function() {
    var sortVal = this.getSortValue();
    var items = this.sortMethods[sortVal](this.collection.toJSON());
    var start = new Date($('[name="from"]').val());
    var end =  new Date($('[name="to"]').val());
    var name = spotify.makePlaylistName(sortVal, start, end);
    var trackset = this.makeTrackset(name, items);
  },

  makeTrackset: function(name, tracks) {
    var _this = this;
    $.ajax({
      url: window.apiURL+"/make/playlist",
      contentType: 'application/json',
      data: JSON.stringify({
        tracks: tracks,
        name: name
      }),
      type: 'POST',
      dataType: 'json'
    }).done(function(data) {
      _this.renderPlaylist(data.uri, name);
    });
  },

  renderPlaylist: function(uri, name) {
    if(!uri) return;
    var string = '<h3 class="playlist-name">'+name+'</h3><iframe src="https://embed.spotify.com/?uri='+uri+'" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>';
      this.$el.html(string);
  },


  renderItem: function(model) {
    var item = new ItemView({
      model: model
    });
    this.$el.append(item.el);
  },

  getSortValue: function() {
    return $('[name="sort"]:checked').val()
  },

  sortOptions:  [
    {
      label: 'Top',
      value: 'top'
    },
    {
      label: 'Random',
      value: 'random'
    }],

  sortMethods: {
    top: function(tracks) {
      tracks = _.filter(tracks, function(track){
        return !!track.uri;
      });
      tracks = _.pluck(tracks, 'uri');

      if(tracks.length > 20) {
        return tracks.slice(0, 20);
      }else {
        return tracks;
      }
    },
    random: function(tracks) {
      var random = _.filter(tracks, function(track){
        return !!track.uri;
      });
      random = _.sample(_.pluck(random, 'uri'), 20);
      return random;
    }
  }


});
