fileloader
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]
[![David deps][david-image]][david-url]
[![iojs version][iojs-image]][iojs-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/fileloader.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fileloader
[travis-image]: https://img.shields.io/travis/node-modules/fileloader.svg?style=flat-square
[travis-url]: https://travis-ci.org/node-modules/fileloader
[coveralls-image]: https://img.shields.io/coveralls/node-modules/fileloader.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/node-modules/fileloader?branch=master
[gittip-image]: https://img.shields.io/gittip/fengmk2.svg?style=flat-square
[gittip-url]: https://www.gittip.com/fengmk2/
[david-image]: https://img.shields.io/david/node-modules/fileloader.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/fileloader
[iojs-image]: https://img.shields.io/badge/io.js-%3E=_1.0-yellow.svg?style=flat-square
[iojs-url]: http://iojs.org/
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/fileloader.svg?style=flat-square
[download-url]: https://npmjs.org/package/fileloader

more stable file loader for nunjucks, and support charsets like `gbk`.

## Install

```bash
$ npm install fileloader
```

## Usage

```js
var nunjucks = require('nunjucks');
var FileLoader = require('fileloader');

var watch = true;
if (cluster.isWorker) {
  watch = function (dirs, listener) {
    process.on('message', function (msg) {
      if (msg && msg.action === 'watch-file') {
        console.warn('got master file change message: %j', msg.info);
        listener(msg.info);
      }
    });
  };
}

var dirs = ['/foo', '/bar/cms'];
var charsets = {
  '/bar/cms': 'gbk'
};

var fileloader = new FileLoader(dirs, watch, charsets);
var env = new nunjucks.Environment(fileloader);
```

## License

[MIT](LICENSE.txt)
