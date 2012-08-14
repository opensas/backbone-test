'use strict';
if (!src) {src = {};}

if (!src.views) {src.views = {};}

if (!src.views.wine) {src.views.wine = {};}

src.views.wine.RowsView = Backbone.View.extend({

  el: '#wines tbody',
  template: _.template($('#wines-template').html()),

  initialize: function() {
    this.collection.bind('reset', this.render, this);
    this.collection.bind('change', this.render, this);
  },

  render: function() {

    this.$el.empty();

    _.each(this.collection.models, function(wine) {
      var view = new src.views.wine.RowView({
        model: wine, collection: this.collection
      });
      this.$el.append(view.render().el);
    }, this);

    if (this.collection.filter) {
      utils.crud.highlightItems(this.$('td:not([class])'), this.collection.filter);
    }

    return this;      
  }

});

src.views.wine.RowView = Backbone.View.extend({
  tagName: 'tr',
  template: _.template($('#wine-template').html()),
  collection: null,

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  events: {
    'click td:not(.action)':  'edit'
  },

  edit: function() {
    app.navigate('wines/' + this.model.id, true);
  },

  initialize: function() {
    this.model.bind('destroy', this.remove, this);
    this.model.bind('change', this.render, this);
  }

});