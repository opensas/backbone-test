var utils = {};

utils.http = {};

utils.http.parseParams = function(url) {

  url = url || '';
  var match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      params = {};

  while (match = search.exec(url)) {
    params[decode(match[1])] = decode(match[2]);
  }
  return params;
}

utils.http.buildParams = function(params) {
  params = params || {};
  var url = '';
  for (var prop in params) {
    if (params.hasOwnProperty(prop)) {
      url += encodeURIComponent(prop) + '=' + encodeURIComponent(params[prop]) + '&';
    }
  }
  return url.slice(0,-1); // remove last char
}

utils.http.addParams = function(source, add) {

  var base = '';
  var pos = source.indexOf('?');

  if (! source.match(/[\?&=]/)) { // no tiene ? ni & ni = asumo que es solo base sin ningun param
    base = source;
    source = '';
  } else {
    if (pos != -1) {
      base = source.substring(0,pos);
      source = source.substring(pos+1);
    }
  }

  if (typeof source === 'string') source = utils.http.parseParams(source);
  if (typeof add === 'string') add = utils.http.parseParams(add);

  for (var prop in add) {
    if (add.hasOwnProperty(prop)) {
      source[prop] = add[prop];
    }
  }
  params = utils.http.buildParams(source);

  return base + (params != '' ? '?' + params : '');
}

utils.http.parseQuery = function(url) {
  var queryString = utils.http.parseParams(url);

  var parsed = {};

  if (queryString.page)   parsed.page   = queryString.page;
  if (queryString.len)    parsed.len    = queryString.len;
  if (queryString.order)  parsed.order  = queryString.order;
  if (queryString.filter) parsed.filter = queryString.filter;

  return parsed;
}

