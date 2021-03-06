'use strict';

var path = require('path');

module.exports = [
  {
    name: 'General Assets',
    glob: {
      nodir: true,
      allowEmpty: true,
      ignore: [
        '**/*.html',
        '**/asset-manifest.json',
        '**/favicon.ico',
        '**/manifest.json',
        '**/service-worker.js'
      ]
    },
    path: path.join(__dirname, '..', 'test', 'sample', 'build'),
    matcher: '**/*',
    s3: {
      Bucket: 'test'
    },
    s3Prefix: 'moo/v1'
  },
  {
    name: 'Fixed Assets',
    glob: {
      nodir: true,
      allowEmpty: true
    },
    path: path.join(__dirname, '..', 'test', 'sample', 'build'),
    matcher:
      '{asset-manifest.json,favicon.ico,manifest.json,service-worker.js}',
    s3: {
      Bucket: 'test'
    }
  },
  {
    name: 'HTML',
    glob: {
      nodir: true,
      allowEmpty: true
    },
    path: path.join(__dirname, '..', 'test', 'sample', 'build'),
    matcher: '**/*.html',
    s3: {
      Bucket: 'test'
    }
  }
];
