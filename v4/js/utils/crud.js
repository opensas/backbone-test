var utils = utils || {};

utils.crud = utils.crud || {};

utils.crud.paginate = function(collection) {

  /*
  var info = {
    page:   undefined,
    len:    undefined,
    from:   undefined,
    to:     undefined,
    total:  undefined,
    last:   undefined,
    pages: [{page: 1 , text: "1", active: true, enabled: true}]
  }
  */

  var params = collection.params;
  var info = {};

  info.page   = parseInt(params.page);
  info.len    = parseInt(params.len);
  info.from   = ((info.page-1)*info.len)+1;
  info.to     = info.from+collection.length-1;
  info.total  = collection.total;
  info.last   = Math.ceil(info.total/info.len);

  var pages = [];

  //first page
  pages.push({page: 1 , text: "««", active: false, enabled: info.page > 1})
  //previous page
  pages.push({page: info.page + 1 , text: "«", active: false, enabled: info.page > 1})

  // allways show 4 pages before the current and 4 pages after the current
  var begin_page = info.page - 4;
  if (begin_page<0) begin_page=0;

  for(var c=1; c<=9; c++) {
    pages.push({page: c, text:c.toString(), active: (c===info.page), enabled: c<info.last})
  }

  //next page
  pages.push({page: info.page + 1, text:"»", active: false, enabled: info.page<info.last})
  //last page
  pages.push({page: info.last, text:"»»", active: false, enabled: info.page<info.last})

  info.pages = pages;

  return info;
}