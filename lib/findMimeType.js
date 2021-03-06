'use strict';

var mime = require('mime-types');

var DEFAULT_CONTENT_TYPE = 'application/octet-stream';

module.exports = function findMimeType(path, fallbackOption) {
  var fallbackType =
    fallbackOption === undefined ? DEFAULT_CONTENT_TYPE : fallbackOption;

  return mime.lookup(path) || fallbackType;
};
