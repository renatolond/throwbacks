var Backbone = require('backbone');
var _ = require('underscore');
var ItemView = require('./track-item');
var Collection = require('../collections/tracks');
var Button = require('./button');
var Radio = require('./radio');
var spotify = require('../lib/spotify');
var date = require('../lib/date');

module.exports =  Backbone.View.extend({
  tagName: 'ul',
  className: 'track-list',

  // events: {
  //   'click': 'fetch'
  // },

  // Pass the username
  initialize: function(options) {
    var _this = this;
    this.options = options;
    var data = this.options.listData;
    var button = this.options.button;

    this.collection = new Collection({
      url: '/from/' + data.from + '/to/' + data.to + '/for/' + data.user.id
    });

    this.listenTo(this.collection, 'sync', function(data) {
      _.each(data.models, _this.renderItem.bind(_this));
      this.renderSorting();
      this.renderSendButton();
      button.trigger('end');
    });
    
    // collection sort event should wipe and re-render the models
  },

  render: function() {
    this.collection.fetch();
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
    console.log('Make trackset', this.collection);

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
      console.log(data);
      _this.renderPlaylist(data.uri);
    });
  },

  renderPlaylist: function(uri) {
    if(!uri) return;
    var string = '<iframe src="https://embed.spotify.com/?uri='+uri+'" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>';
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
      value: 'top',
      sort: function() {

        console.log('sort top')
      }
    },
    {
      label: 'Random',
      value: 'random',
      sort: function() {
        console.log('sort random');
      }
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
      console.log('Sort these', tracks);
      var random = _.filter(tracks, function(track){
        return !!track.uri;
      });
      random = _.sample(_.pluck(random, 'uri'), 20);
      console.log('random', random);
      return random;
    }
  }


});
