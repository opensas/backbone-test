$(function() {

  app = {};

  app.updateValue = function() {
    var value = utils.parseToken($("#url").val(),$("#token").val())
    if (value) {
      console.log(value);
      $("#value").html(value);
    } else {
      $("#value").html('no match');
    }
  }

  $("#token").keyup( function(event){
    app.updateValue();
  })

  $("#url").keyup( function(event){
    app.updateValue();
    params = utils.parseUrl($("#url").val());
    console.log(params);
  })

  utils = {};

  utils.parseToken = function(url, token) {
    var regExp = '[&?]'+token+'=(.*?)(&|$)';
    var re = new RegExp(regExp);
    var res = re.exec(url);
    if (!res || res.length < 2) return '';
    return decodeURIComponent(res[1]) || '';
  }

  utils.parseUrl = function(url) {

    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = (pos = url.indexOf('?')) == -1 ? '' : url.substring(pos+1);
        urlParams = {};

    while (match = search.exec(query)) {
      urlParams[match[1]] = match[2];
    }
    return urlParams;
  }

});



