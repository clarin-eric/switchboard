'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jss = require('jss');

var _jss2 = _interopRequireDefault(_jss);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

var _jssVendorPrefixer = require('jss-vendor-prefixer');

var _jssVendorPrefixer2 = _interopRequireDefault(_jssVendorPrefixer);

var _jssPx = require('jss-px');

var _jssPx2 = _interopRequireDefault(_jssPx);

var _jssCamelCase = require('jss-camel-case');

var _jssCamelCase2 = _interopRequireDefault(_jssCamelCase);

var _jssNested = require('jss-nested');

var _jssNested2 = _interopRequireDefault(_jssNested);

var jss = _jss2['default'].create();
jss.use((0, _jssVendorPrefixer2['default'])());
jss.use((0, _jssPx2['default'])());
jss.use((0, _jssCamelCase2['default'])());
jss.use((0, _jssNested2['default'])());

exports['default'] = (0, _reactJss2['default'])(jss);
module.exports = exports['default'];