/*globals $,_,Backbone,utils,src:true*/

'use strict';
if (!src) {src = {};}

if (!src.views) {src.views = {};}

if (!src.views.crud) {src.views.crud = {};}

src.views.crud.TableView = Backbone.View.extend({

  initialize: function () {
    _.bindAll(this, 'filter', 'filter_debounced', 'page', 'page_len', 'order');
  },

  template: _.template($('#wines-template').html()),

  render: function() {
    this.$el.html(this.template());

    this.$('input#filter_text').val(this.collection.filter);
    this.$('select#page_len').val(this.collection.len);
    return this;
  },

  events: {
    'keyup #filter_text': 'filter_debounced',
    'click div.filter':   'filter',
    'click a[page]':      'page',
    'change #page_len':   'page_len',
    'click th[order]':    'order'
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

    if (a.parent().hasClass('active')) { return; }
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
    if (th[0].tagName!=='TH') {th=th.parent();} // click on the i, look for the parent th

    var order = th.attr('order');
    var direction = 'asc';
    if (th.hasClass('order-asc')) {direction = 'desc';}

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

  }

});