var Backbone = require('backbone');
var template = require('../templates/input');
var _ = require('underscore');

var input =  Backbone.View.extend({
  template: template,

  events: {
    'keyup input': 'isUsernameValid'
  },

  isReady: false,

  initialize: function(options) {
    var _this = this;
    this.$el.html(template(options));

    this.on('ready', function() {
      _this.isReady = true;
    });

  },

  resetValidation: function() {
    $('input', this.$el).removeClass('invalid');
    $('.input-error', this.$el).remove();
  },

  renderInputError: function(message) {
    var $input = $('input', this.$el);
    $input.addClass('invalid');
    $input.after('<span class="input-error">'+message+'</span>');
  },

  isKeyValid: function(key) {
    var invalid = [8, 37, 38, 39, 40, 13];
    _.each(invalid, function(nono){ 
      if(key === nono){
        return false;
      }
    });
    return true;
  },

  isUsernameValid: _.debounce(function(e){
    if (!this.isKeyValid(e.which) || $(e.currentTarget).val().length < 2) return;

    var _this = this;
    this.resetValidation();
    
    var username = $(e.currentTarget).val();
    var url = '/user/'+username+'/exists';
    
    $.get(url, function(user){
      console.log(user);
      if(user.isValid) return _this.trigger('ready', user);
      _this.renderInputError('That username doesn\'t exist!');
    });

  }, 1000)

});


module.exports = input;