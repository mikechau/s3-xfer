'use strict';

var path = require('path');
var workerFarm = require('worker-farm');
var _isFunction = require('lodash.isfunction');

var getFilePaths = require('./getFilePaths');
var workers = workerFarm(require.resolve('./worker'));

var noop = function noop() {};

module.exports = function xfer(xferConfigs, workerConfig, cb) {
  var xferConfigsLength = xferConfigs.length;
  workerConfig = workerConfig || {};

  if (!_isFunction(cb)) {
    cb = noop;
  }

  if (xferConfigsLength <= 0) {
    throw new Error('no xfer configs found!');
  }

  function startWork(index) {
    var config = xferConfigs[index];
    var processed = 0;
    var filePaths;

    if (index <= -1) {
      throw new Error('index cannot be negative!');
    }

    if (xferConfigsLength - (index + 1) <= -1) {
      workerFarm.end(workers);

      cb(null, true);

      return null;
    }

    filePaths = getFilePaths(
      path.join(config.path, config.matcher),
      config.glob
    );

    if (filePaths.length <= 0) {
      startWork(index + 1);
    } else {
      filePaths.forEach(function(f) {
        var s3Key = path.relative(config.path, f);

        if (config.s3Prefix) {
          s3Key = path.join(config.s3Prefix, s3Key);
        }

        var input = Object.assign({}, workerConfig, {
          s3: Object.assign({}, config.s3, { Key: s3Key }),
          filePath: f
        });

        workers(input, function(err, response) {
          if (err) {
            throw err;
          }

          console.log('[' + config.name + ']:', f, 'to', response.Location);

          processed++;

          if (processed === filePaths.length) {
            startWork(index + 1);
          }
        });
      });
    }
  }

  startWork(0);
};
