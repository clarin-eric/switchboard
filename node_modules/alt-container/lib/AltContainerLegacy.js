/*eslint-disable*/
/**
 * AltContainer.
 *
 * There are many ways to use AltContainer.
 *
 * Using the `stores` prop.
 *
 * <AltContainer stores={{ FooStore: FooStore }}>
 *   children get this.props.FooStore.storeData
 * </AltContainer>
 *
 * You can also pass in functions.
 *
 * <AltContainer stores={{ FooStore: function () { return { storeData: true } } }}>
 *   children get this.props.FooStore.storeData
 * </AltContainer>
 *
 * Using the `store` prop.
 *
 * <AltContainer store={FooStore}>
 *   children get this.props.storeData
 * </AltContainer>
 *
 * Passing in `flux` because you're using alt instances
 *
 * <AltContainer flux={flux}>
 *   children get this.props.flux
 * </AltContainer>
 *
 * Using a custom render function.
 *
 * <AltContainer
 *   render={function (props) {
 *     return <div />;
 *   }}
 * />
 *
 * Using the `transform` prop.
 *
 * <AltContainer
 *   stores={{ FooStore: FooStore, BarStore: BarStore }}
 *   transform={function(stores) {
 *     var FooStore = stores.FooStore;
 *     var BarStore = stores.BarStore;
 *     var products =
 *       FooStore.products
 *         .slice(0, 10)
 *         .concat(BarStore.products);
 *     return { products: products };
 *   }}
 * >
 *   children get this.props.products
 * </AltContainer>
 *
 * Full docs available at http://goatslacker.github.io/alt/
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mixinContainer = require('./mixinContainer');

var _mixinContainer2 = _interopRequireDefault(_mixinContainer);

var _objectAssign = require('object.assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var AltContainer = _react2['default'].createClass((0, _objectAssign2['default'])({
  displayName: 'AltContainer',

  render: function render() {
    return this.altRender('div');
  }
}, (0, _mixinContainer2['default'])(_react2['default'])));

exports['default'] = AltContainer;
module.exports = exports['default'];