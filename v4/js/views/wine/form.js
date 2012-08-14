'use strict';
if (!src) {src = {};}

if (!src.views) {src.views = {};}

if (!src.views.wine) {src.views.wine = {};}

src.views.wine.FormView = Backbone.View.extend({

	el: '#wineForm',
	template: _.template($('#wineForm-template').html()),

	initialize: function() {
	  _.bindAll(this, 'save', 'cancel', 'close');
	},

	render: function() {
	  this.$el.html(this.template(this.model.toJSON()));
	  this.$el.show();
	  $('#wines').hide();
	  return this;
	},

	events: {
	  'click div.save':     'save', 
	  'click div.cancel':   'cancel'
	},

	save: function() {
	  this.model.set({
	    name:     this.$('#name').val(),
	    grapes:   this.$('#grapes').val(),
	    country:  this.$('#country').val(),
	    region:   this.$('#region').val(),
	    year:     this.$('#year').val()
	  });

	  if (this.model.isNew()) {
	    this.collection.create(this.model);
	  } else {
	    this.model.save();
	  }
	  
	  this.close();
	  app.navigate('wines', {trigger: true});
	},

	cancel: function() {
	  this.close();
	  app.navigate('wines', {trigger: false});
	},

	close: function() {
	  $('#wines').show();
	  this.$el.unbind();      
	  this.$el.empty();
	}

});