
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
    params: {},
    total: 0,
    initialize: function(options) {
      options || (options = {});
      if (options.params) this.params = options.params;

      _.bindAll(this, 'fetch', 'fetch_total');
    },

    fetch: function() {
      options = { data: this.params };
      this.fetch_total();
      return Backbone.Collection.prototype.fetch.call(this, options);
    },

    fetch_total: function() {
      var options = { 
        url: this.url + '/count',
        data: this.params,
        contentType: 'application/json',
        success: function(resp, status, xhr) {
          console.log('back from count');
          console.log(resp);
          console.log(status);
          return true;
        }
      };
      return $.ajax(options);
    }

  });

  var WinesTable = Backbone.View.extend({
    el: '#wines',
    template: _.template($('#wines-template').html()),

    render: function() {
      this.$el.html(this.template());
      return this;
    },

    events: {
      'keyup #filter_text': 'filter_debounced',
      'click div.filter':   'filter',
      'click a.page_2':     'go_page'
    },
    
    filter: function() {
      this.collection.params.filter = $("#filter_text").val();
      this.collection.fetch();
    },

    filter_debounced: _.debounce(function() {
      this.collection.params.filter = $("#filter_text").val();
      this.collection.fetch();
    }, 500),

    go_page: function(e) {
      app.navigate('wines?page=2&len=5', {trigger: true});
    }

  })

  var WinesView = Backbone.View.extend({

    el: '#wines tbody',
    template: _.template($('#wines-template').html()),

    initialize: function() {
      this.collection.bind('reset', this.render, this);
      this.collection.bind('change', this.render, this);
    },

    render: function() {

      this.$el.empty();

      _.each(this.collection.models, function(wine) {
        var view = new WineView({model: wine});
        this.$el.append(view.render().el);
      }, this);

      return this;      
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
      app.navigate('#wines', {trigger: true});
    },

    close: function() {
      $('#wines').show();
      this.$el.unbind();      
      this.$el.empty();
    }

  })

  var AppRouter = Backbone.Router.extend({

    routes: {
      '':                         'list',
      'wines':                    'list',
      'wines?*url':               'list',
      'wines/new':                'add',
      'wines/del/:id':            'del',
      'wines/:id':                'edit'
    },

    initialize: function() {
      $('#navbar').html($('#navbar-template').html());
      $('#breadcrumb').html($('#breadcrumb-template').html());

      this.wines = new Wines();
      this.winesTable = new WinesTable({collection: this.wines});
      this.winesTable.render();
    },

    list: function(query) {
      if (this.wineFormView) this.wineFormView.close();
      this.wines.params = utils.http.parseQuery(query);

      this.winesView = new WinesView({collection: this.wines});
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