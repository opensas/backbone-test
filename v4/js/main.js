/*globals $,_,Backbone,utils,confirm,alert*/

var src = {};

$(function () {
  'use strict';

  window.app = new src.routers.wine();
  Backbone.history.start();
  app.navigate('wines');

});