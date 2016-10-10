/**!
 * fileloader - index.js
 *
 * Copyright(c) node-modules and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var debug = require('debug')('fileloader');
var fs = require('fs');
var path = require('path');
var util = require('util');
var iconv = require('iconv-lite');
var EventEmitter = require('events').EventEmitter;
var wt = require('wt');

module.exports = FileLoader;

// more stable nunjucks loader

// new FileLoader(dirs, true/false, charsets);
// new FileLoader(dirs, function, charsets);
// if watch is a function, must use this format: `function (dirs, listener)`
function FileLoader(dirs, watch, charsets) {
  // support custom charsets = { '/foo/cms': 'gbk' }
  this.charsets = charsets || {};
  this.pathsToNames = {};

  if (dirs) {
    dirs = Array.isArray(dirs) ? dirs : [dirs];
    // For windows, convert to forward slashes
    this.searchPaths = dirs.map(path.normalize);
  } else {
    this.searchPaths = [process.cwd()];
  }

  if (watch) {
    if (typeof watch === 'boolean') {
      // new FileLoader(dirs, true/false, charsets);
      watch = this._watch;
    }
    // Watch all the templates in the paths and fire an event when they change
    watch(this.searchPaths, this.update.bind(this));
  }
}

util.inherits(FileLoader, EventEmitter);

var proto = FileLoader.prototype;

proto.update = function (info) {
  debug('file %s %s', info.event, info.path);
  this.emit('update', this.pathsToNames[info.path]);
};

proto._watch = function (dirs, listener) {
  var watcher = wt.watch(dirs);
  watcher.on('file', listener);
  debug('start watch on %j', dirs);
};

proto.getSource = function (name) {
  var fullpath = null;
  var paths = this.searchPaths;
  var charset = '';

  for (var i = 0; i < paths.length; i++) {
    var root = paths[i];
    var p = path.join(root, name);

    // Only allow the current directory and anything
    // underneath it to be searched
    if (fs.existsSync(p)) {
      fullpath = p;
      charset = this.charsets[root];
      if (charset) {
        charset = charset.toLowerCase();
      }
      break;
    }
  }

  if (!fullpath) {
    debug('view %s not found in %j', name, this.searchPaths);
    return null;
  }

  this.pathsToNames[fullpath] = name;
  var content = fs.readFileSync(fullpath);
  debug('view %s mapping to %s, charset: %s, size: %d', name, fullpath, charset, content.length);
  if (charset && (charset !== 'utf8' || charset !== 'utf-8')) {
    content = iconv.decode(content, charset);
  } else {
    content = content.toString();
  }
  return {
    src: content,
    path: fullpath
  };
};
