var Backbone = require('backbone');
var _ = require('underscore');
var ItemView = require('../components/track-item');
var Collection = require('../collections/tracks');

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

    var collection = new Collection({
      url: '/from/' + data.from + '/to/' + data.to + '/for/' + data.user.id
    });
  
    this.listenTo(collection, 'sync', function(data) {
      _.each(data.models, _this.renderItem.bind(_this));
      button.trigger('end');
    });

    // Render the view for the collection and then fetch it?
    collection.fetch();

  },

  renderItem: function(model) {
    var item = new ItemView({
      model: model
    });
    this.$el.append(item.el);
  } 
});
