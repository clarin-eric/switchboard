/*eslint-disable*/
/**
 * AltNativeContainer.
 *
 * @see AltContainer
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactNative = require('react-native');

var _reactNative2 = _interopRequireDefault(_reactNative);

var _mixinContainer = require('./mixinContainer');

var _mixinContainer2 = _interopRequireDefault(_mixinContainer);

var _objectAssign = require('object.assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var AltNativeContainer = _reactNative2['default'].createClass((0, _objectAssign2['default'])({
  displayName: 'AltNativeContainer',

  render: function render() {
    return this.altRender(_reactNative2['default'].View);
  }
}, (0, _mixinContainer2['default'])(_reactNative2['default'])));

exports['default'] = AltNativeContainer;
module.exports = exports['default'];