var Backbone = require('backbone');
var _ = require('underscore');
var date = require('../lib/date');
var Input = require('../components/input');
var DateInput = require('../components/dateinput');
var Button = require('../components/button');
var List = require('../components/track-list');

var template = require('../templates/lastfm');

module.exports = Backbone.View.extend({
  template: template,
  ui: {
    form: '.lastfm-dates',
    dates: '.lastfm-dates input'
  },
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
    
    username.on('ready', function(user) {
      _this.renderDatepickers();
      _this.renderFetchButton(user);
    });
  },

  renderDatepickers: function() {
    var from = new DateInput({
      name: 'from'
    });
    var to = new DateInput({
      name: 'to'
    });

    var els = $('<span class="form-info">Fetch tracks from </span>').add(from.el).add('<span class="form-info">to</span>').add(to.el);
    $('.lastfm-dates', this.$el).html(els);
  },

  // Pass in a custom validate function
  renderFetchButton: function(user) {
    var _this = this;
    var fetch = new Button({
      className: 'fetch-tracks',
      label: 'Fetch',
      pickers: $(this.ui.dates),
      validate: this.validatePickers.bind(this)
    });

    fetch.on('start', function() {
      _this.getListens(user, fetch);
    });

    $('.lastfm-fetch', this.$el).html(fetch.el);
  },

  validatePickers: function() {
    var vals = [];
    $(this.ui.dates).each(function(){
      if($(this).val().length > 0) {
        vals.push(true);
      }
    });
    return vals.length === 2;
  },


  getPickerValues: function() {
    var items = $(this.ui.form).serializeArray();
    var values = {};
    _.each(items, function(item){
      values[item.name] = date.getUnixTime(item.value);
    });
    return values;
  },

  getListens: function(user, button) {
    var data = this.getPickerValues() || {};
    data = _.extend(data, user);

    var tracks = new List({
      className: 'track-list',
      listData: data,
      button: button
    });

    $('.lastfm-list', this.$el).html(tracks.el);
    tracks.render();
  }

});
