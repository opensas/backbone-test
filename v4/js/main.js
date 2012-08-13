
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
    total: undefined,

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
      var that = this;
      var options = { 
        url: this.url + '/count',
        data: this.params,
        contentType: 'application/json',
        success: function(resp, status, xhr) {
          that.total = status;
          return true;
        }
      };
      return $.ajax(options);
    }

  });

  var WinesTableView = Backbone.View.extend({

    initialize: function () {
      _.bindAll(this, 'filter', 'filter_debounced', 'page', 'page_len', 'order');
    },

    el: '#wines',
    template: _.template($('#wines-template').html()),

    render: function() {
      this.$el.html(this.template());
      return this;
    },

    events: {
      'keyup #filter_text': 'filter_debounced',
      'click div.filter':   'filter',
      'click a[page]':      'page',
      'change #page_len':   'page_len',
      'click th[order]':    'order',
    },
    
    filter: function() {
      app.navigateWith({filter: $("#filter_text").val()}, {trigger: true});
    },

    filter_debounced: _.debounce(function() {
      this.filter();
    }, 500),

    page: function(e) {
      e.preventDefault();
      var a = $(e.target);

      if (a.parent().hasClass('active')) return;
      $('a[page]').each(function() {
        $(this).parent().removeClass('active');
      });
      a.parent().addClass('active');

      var page = a.attr('page');
      app.navigateWith({page: page}, {trigger: true});
    },

    page_len: function(e) {
      e.preventDefault();
      var select = e.target;
      var len = select.options[select.selectedIndex].value;
      app.navigateWith({len: len}, {trigger: true});
    },

    order: function(e) {
      var th = $(e.target);
      if (th[0].tagName!='TH') th=th.parent(); // click on the i, look for the parent th

      var order = th.attr('order');
      var direction = 'asc';
      if (th.hasClass('order-asc')) direction = 'desc';

      $('th[order]').each(function() {
        $(this).removeClass('order-asc');
        $(this).removeClass('order-desc');
      });

      if (direction === 'asc') {
        th.addClass('order-asc');
        th.removeClass('order-desc');
      } else {
        th.removeClass('order-asc');
        th.addClass('order-desc');
      }
      app.navigateWith({order: order+' '+direction}, {trigger: true});

    },

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
        year:     this.$('#year').val(),
        grapes:   this.$('#grapes').val()
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
      this.winesTableView = new WinesTableView({collection: this.wines});
      this.winesTableView.render();
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
    },

    routeWith: function(params) {
      return utils.http.addParams(Backbone.history.getHash(),params);
    },

    navigateWith: function(params, options) {
      this.navigate(this.routeWith(params), options);
    }

  })

  app = new AppRouter();
  Backbone.history.start();
  app.navigate('wines');

});