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
  var parsed = utils.http.parseQueryString(url);
  return {
    page:   parseInt(parsed.page || 1),
    len:    parseInt(parsed.len || 10),
    sort:   (parsed.sort || '').toString(),
    filter: (parsed.filter || '').toString()
  }/*

  defaults = defaults || {
    page:   1,
    len:    10,
    sort:   "",
    filter: "", 
  };
  return _.defaults(utils.http.parseQueryString(url), defaults);
  */
}