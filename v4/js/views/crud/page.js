'use strict';
if (!src) {src = {};}

if (!src.views) {src.views = {};}

if (!src.views.crud) {src.views.crud = {};}

src.views.crud.PaginationView = Backbone.View.extend({

	template: _.template($('#winePagination-template').html()),

	paginate: undefined,

	initialize: function() {
	  this.collection.bind('reset', this.render, this);
	  this.collection.bind('change', this.render, this);
	},

	render: function() {
	  this.paginate = utils.crud.paginate(this.collection);
	  this.$el.html(this.template(this.paginate));
	  this.addAll();
	  return this;
	},

	addAll: function() {
	  _.each(this.paginate.pages, function(page) {
	    this.addOne(page);
	  }, this);
	},

	addOne: function(page) {
	  var view = new src.views.crud.PageView({model: page});
	  this.$('ul').append(view.render().el);
	}

	});

src.views.crud.PageView = Backbone.View.extend({
	template: _.template($('#winePage-template').html()),
	tagName: 'li',
	render: function() {
	  this.$el.html(this.template(this.model));
	  return this;
	}
});