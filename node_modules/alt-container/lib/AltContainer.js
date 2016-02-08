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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _objectAssign = require('object.assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var id = function id(it) {
  return it;
};
var getStateFromStore = function getStateFromStore(store, props) {
  return typeof store === 'function' ? store(props).value : store.getState();
};
var getStateFromKey = function getStateFromKey(actions, props) {
  return typeof actions === 'function' ? actions(props) : actions;
};

var getStateFromActions = function getStateFromActions(props) {
  if (props.actions) {
    return getStateFromKey(props.actions, props);
  } else {
    return {};
  }
};

var getInjected = function getInjected(props) {
  if (props.inject) {
    return Object.keys(props.inject).reduce(function (obj, key) {
      obj[key] = getStateFromKey(props.inject[key], props);
      return obj;
    }, {});
  } else {
    return {};
  }
};

var reduceState = function reduceState(props) {
  return (0, _objectAssign2['default'])({}, getStateFromStores(props), getStateFromActions(props), getInjected(props));
};

var getStateFromStores = function getStateFromStores(props) {
  var stores = props.stores;
  if (props.store) {
    return getStateFromStore(props.store, props);
  } else if (props.stores) {
    // If you pass in an array of stores then we are just listening to them
    // it should be an object then the state is added to the key specified
    if (!Array.isArray(stores)) {
      return Object.keys(stores).reduce(function (obj, key) {
        obj[key] = getStateFromStore(stores[key], props);
        return obj;
      }, {});
    }
  } else {
    return {};
  }
};

// TODO need to copy some other contextTypes maybe?
// what about propTypes?

var AltContainer = (function (_React$Component) {
  _inherits(AltContainer, _React$Component);

  _createClass(AltContainer, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var flux = this.props.flux || this.context.flux;
      return flux ? { flux: flux } : {};
    }
  }], [{
    key: 'contextTypes',
    value: {
      flux: _react2['default'].PropTypes.object
    },
    enumerable: true
  }, {
    key: 'childContextTypes',
    value: {
      flux: _react2['default'].PropTypes.object
    },
    enumerable: true
  }]);

  function AltContainer(props) {
    var _this = this;

    _classCallCheck(this, AltContainer);

    _get(Object.getPrototypeOf(AltContainer.prototype), 'constructor', this).call(this, props);

    this.altSetState = function () {
      _this.setState(reduceState(_this.props));
    };

    if (props.stores && props.store) {
      throw new ReferenceError('Cannot define both store and stores');
    }

    this.storeListeners = [];

    this.state = reduceState(props);
  }

  _createClass(AltContainer, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this._destroySubscriptions();
      this.setState(reduceState(nextProps));
      this._registerStores(nextProps);
      if (this.props.onWillReceiveProps) {
        this.props.onWillReceiveProps(nextProps, this.props, this.context);
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._registerStores(this.props);
      if (this.props.onMount) this.props.onMount(this.props, this.context);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._destroySubscriptions();
      if (this.props.onWillUnmount) {
        this.props.onWillUnmount(this.props, this.context);
      }
    }
  }, {
    key: '_registerStores',
    value: function _registerStores(props) {
      var _this2 = this;

      var stores = props.stores;

      if (props.store) {
        this._addSubscription(props.store);
      } else if (props.stores) {
        if (Array.isArray(stores)) {
          stores.forEach(function (store) {
            return _this2._addSubscription(store);
          });
        } else {
          Object.keys(stores).forEach(function (formatter) {
            _this2._addSubscription(stores[formatter]);
          });
        }
      }
    }
  }, {
    key: '_destroySubscriptions',
    value: function _destroySubscriptions() {
      this.storeListeners.forEach(function (storeListener) {
        return storeListener();
      });
    }
  }, {
    key: '_addSubscription',
    value: function _addSubscription(getStore) {
      var store = typeof getStore === 'function' ? getStore(this.props).store : getStore;

      this.storeListeners.push(store.listen(this.altSetState));
    }
  }, {
    key: 'getProps',
    value: function getProps() {
      var flux = this.props.flux || this.context.flux;
      var transform = typeof this.props.transform === 'function' ? this.props.transform : id;
      return transform((0, _objectAssign2['default'])(flux ? { flux: flux } : {}, this.state));
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.props.shouldComponentUpdate ? this.props.shouldComponentUpdate(this.getProps(), nextProps, nextState) : true;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var Node = 'div';
      var children = this.props.children;

      // Custom rendering function
      if (typeof this.props.render === 'function') {
        return this.props.render(this.getProps());
      } else if (this.props.component) {
        return _react2['default'].createElement(this.props.component, this.getProps());
      }

      // Does not wrap child in a div if we don't have to.
      if (Array.isArray(children)) {
        return _react2['default'].createElement(Node, null, children.map(function (child, i) {
          return _react2['default'].cloneElement(child, (0, _objectAssign2['default'])({ key: i }, _this3.getProps()));
        }));
      } else if (children) {
        return _react2['default'].cloneElement(children, this.getProps());
      } else {
        return _react2['default'].createElement(Node, this.getProps());
      }
    }
  }]);

  return AltContainer;
})(_react2['default'].Component);

exports['default'] = AltContainer;
module.exports = exports['default'];