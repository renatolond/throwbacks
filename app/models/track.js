var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  // defaults: {
  //     name: "Not specified",
  //     artist: "Not specified"
  // },
  initialize: function(){
    console.log('model', this);
  }
});