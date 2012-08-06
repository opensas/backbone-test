
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
    url: 'http://localhost:9000/wines',
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

    events: {
      'click div.add': 'add'
    },
    
    add: function() {
      new WineFormView({model: new Wine(), collection: this.model}).render();
    }

  });

  var WineView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#wine-template').html()),
    collection: null,

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    initialize: function() {
      this.model.bind('destroy', this.remove, this);
      this.model.bind('change', this.render, this);
    },

    events: {
      'click div.delete':       'delete',
      'click div.edit':         'edit',
      'click td:not(.action)':  'edit'
    },

    delete: function() {
      if (confirm('are you sure you want to delete the current record?')) {
        this.model.destroy();  
      }
    },

    edit: function() {
      new WineFormView({model: this.model}).render();
    }

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
      this.close();
    },

    close: function() {
      $('#wines').show();
      this.$el.unbind();      
      this.$el.empty();
    }

  })

  this.wines = new Wines();
  this.winesView = new WinesView({model: this.wines});
  this.wines.fetch();

  $('#navbar').html($('#navbar-template').html());
  $('#breadcrumb').html($('#breadcrumb-template').html());

});