
$(function() {

  var Wine = Backbone.Model.extend({
    defaults: {
      'id': null,
      'name': 'new wine',
      'grapes': '',
      'country': '',
      'region': '',
      'year': 2000
    }
  });

  var Wines = Backbone.Collection.extend({
    model: Wine,
    url: 'http://localhost:8080/cellar/rest/wines',
    comparator: function(wine) {
      return wine.get('year');
    }
  });

  var WinesView = Backbone.View.extend({

    el: '#wines',

    initialize:function () {
      this.model.bind('reset', this.render, this);
      this.model.bind('change', this.render, this);
    },

    render: function() {
      this.$el.html($('#wines-template').html());
      var tbody = this.$('tbody');

      _.each(this.model.models, function(wine) {
        var view = new WineView({model: wine});
        tbody.append(view.render().el);
      }, this);

      return this;      
    },

  });

  var WineView = Backbone.View.extend({
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
    },

  });

  var WineFormView = Backbone.View.extend({
    el: '#wineForm',
    template: _.template($('#wineForm-template').html()),

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
        name:     $('#name').val(),
        grapes:   $('#grapes').val(),
        country:  $('#country').val(),
        year:     $('#year').val(),
        grapes:   $('#grapes').val()
      });

      if (this.model.isNew()) {
        this.collection.create(this.model);
      } else {
        this.model.save();
      }
      
      this.close();
    },

    cancel: function() {
      app.navigate('wines', {trigger: true});
    },

    close: function() {
      $('#wines').show();
      this.$el.unbind();      
      this.$el.empty();
    }

  })

  var AppRouter = Backbone.Router.extend({

    routes: {
      '':               'list',
      'wines':          'list',
      'wines/new':      'add',
      'wines/del/:id':  'del',
      'wines/:id':      'edit'
    },

    initialize: function() {
      $('#navbar').html($('#navbar-template').html());
      $('#breadcrumb').html($('#breadcrumb-template').html());
    },

    list: function() {
      if (this.wineFormView) this.wineFormView.close();
      this.wines = new Wines();
      this.winesView = new WinesView({model: this.wines});
      this.wines.fetch();
      $('#wines').show();
    },

    edit: function(id) {
      this.wine = this.wines.get(id);
      if (this.wineFormView) this.wineFormView.close();
      this.wineFormView = new WineFormView({model: this.wine}).render();
    },
    
    del: function(id) {
      this.wine = this.wines.get(id);
      if (this.wine) {
        if (confirm('are you sure you want to delete the current record?')) {
          this.wine.destroy();  
        }
      } else {
        alert('Item not found');
      }
      this.navigate('wines');
    },

    add: function() {
      this.wine = new Wine();
      if (this.wineFormView) this.wineFormView.close();
      this.wineFormView = new WineFormView({model: this.wine, collection: this.wines}).render();
    }

  })

  var app = new AppRouter();
  Backbone.history.start();
  app.navigate('wines');

});