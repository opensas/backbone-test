'use strict';
if (!src) {src = {};}

if (!src.routers) {src.routers = {};}

src.routers.wine = Backbone.Router.extend({

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

	  this.wines = new src.models.Wines();
	  this.winesTableView = new src.views.crud.TableView({
	  	el: '#wines', collection: this.wines
	  });
	  this.winesTableView.render();
	},

	list: function(query) {
	  if (this.wineFormView) {this.wineFormView.close();}
	  this.wines.setParams(utils.http.parseQuery(query));

	  this.winesView = new src.views.wine.RowsView({
	  	el: '#wines tbody', collection: this.wines
	  });
	  
	  this.PaginationView = new src.views.crud.PaginationView({
	    collection: this.wines, el: $('#winePagination')
	  });

	  this.wines.fetch();
	  $('#wines').show();

	},

	edit: function(id) {
	  this.wine = this.wines.get(id);
	  if (this.wineFormView) {this.wineFormView.close();}
	  this.wineFormView = new src.views.wine.FormView({
	  	el: '#wineForm', model: this.wine
	  }).render();
	},

	del: function(id) {
	  this.wine = this.wines.get(id);
	  if (this.wine) {
	    if (confirm('are you sure you want to delete the current record?')) {
	      this.wine.destroy();
	      this.navigate('wines', {trigger: true});
	      return;
	    }
	  } else {
	    alert('Item not found');
	  }
	  this.navigate('wines');
	},

	add: function() {
	  this.wine = new src.model.Wine();
	  if (this.wineFormView) {this.wineFormView.close();}
	  this.wineFormView = new src.views.wine.FormView({
	    el: '#wineForm', model: this.wine, collection: this.wines
	  }).render();
	},

	routeWith: function(params) {
	  return utils.http.addParams(Backbone.history.getHash(),params);
	},

	navigateWith: function(params, options) {
	  this.navigate(this.routeWith(params), options);
	}

});