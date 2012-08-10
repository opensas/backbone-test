var utils = {};

utils.http = {};

utils.http.parseQueryString = function(url) {

  url = url || '';

  var match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      //query  = (pos = url.indexOf('?')) == -1 ? '' : url.substring(pos+1);
      query  = url,
      urlParams = {};

  while (match = search.exec(query)) {
    urlParams[match[1]] = match[2];
  }
  return urlParams;
}

utils.http.parseQuery = function(url, defaults) {
  var queryString = utils.http.parseQueryString(url);

  var parsed = {};

  if (queryString.page)   parsed.page   = queryString.page;
  if (queryString.len)    parsed.len    = queryString.len;
  if (queryString.order)  parsed.order  = queryString.order;
  if (queryString.filter) parsed.filter = queryString.filter;

  return parsed;
}