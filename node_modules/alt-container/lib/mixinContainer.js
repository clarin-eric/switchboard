/*eslint-disable*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

var mixinContainer = function mixinContainer(React) {
  var cloneElement = function cloneElement(element, props) {
    return React.createElement(element.type, (0, _objectAssign2['default'])({}, element.props, props, { children: element.props.children }));
  };

  return {
    contextTypes: {
      flux: React.PropTypes.object
    },

    childContextTypes: {
      flux: React.PropTypes.object
    },

    getChildContext: function getChildContext() {
      var flux = this.props.flux || this.context.flux;
      return flux ? { flux: flux } : {};
    },

    getInitialState: function getInitialState() {
      if (this.props.stores && this.props.store) {
        throw new ReferenceError('Cannot define both store and stores');
      }

      this.storeListeners = [];

      return this.reduceState(this.props);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      this.destroySubscriptions();
      this.setState(this.reduceState(nextProps));
      this.registerStores(nextProps);
    },

    componentDidMount: function componentDidMount() {
      this.registerStores(this.props);
      if (this.props.onMount) this.props.onMount(this.props, this.context);
    },

    componentWillUnmount: function componentWillUnmount() {
      this.destroySubscriptions();
    },

    registerStores: function registerStores(props) {
      var _this = this;

      var stores = props.stores;

      if (props.store) {
        this.addSubscription(props.store);
      } else if (props.stores) {
        if (Array.isArray(stores)) {
          stores.forEach(function (store) {
            _this.addSubscription(store);
          });
        } else {
          Object.keys(stores).forEach(function (formatter) {
            _this.addSubscription(stores[formatter]);
          });
        }
      }
    },

    destroySubscriptions: function destroySubscriptions() {
      this.storeListeners.forEach(function (storeListener) {
        return storeListener();
      });
    },

    getStateFromStores: function getStateFromStores(props) {
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
    },

    getStateFromActions: function getStateFromActions(props) {
      if (props.actions) {
        return getStateFromKey(props.actions, props);
      } else {
        return {};
      }
    },

    getInjected: function getInjected(props) {
      if (props.inject) {
        return Object.keys(props.inject).reduce(function (obj, key) {
          obj[key] = getStateFromKey(props.inject[key], props);
          return obj;
        }, {});
      } else {
        return {};
      }
    },

    reduceState: function reduceState(props) {
      return (0, _objectAssign2['default'])({}, this.getStateFromStores(props), this.getStateFromActions(props), this.getInjected(props));
    },

    addSubscription: function addSubscription(getStore) {
      var store = typeof getStore === 'function' ? getStore(this.props).store : getStore;

      this.storeListeners.push(store.listen(this.altSetState));
    },

    altSetState: function altSetState() {
      this.setState(this.reduceState(this.props));
    },

    getProps: function getProps() {
      var flux = this.props.flux || this.context.flux;
      var transform = typeof this.props.transform === 'function' ? this.props.transform : id;
      return transform((0, _objectAssign2['default'])(flux ? { flux: flux } : {}, this.state));
    },

    shouldComponentUpdate: function shouldComponentUpdate() {
      return this.props.shouldComponentUpdate ? this.props.shouldComponentUpdate(this.getProps()) : true;
    },

    altRender: function altRender(Node) {
      var _this2 = this;

      var children = this.props.children;
      // Custom rendering function
      if (typeof this.props.render === 'function') {
        return this.props.render(this.getProps());
      } else if (this.props.component) {
        return React.createElement(this.props.component, this.getProps());
      }

      // Does not wrap child in a div if we don't have to.
      if (Array.isArray(children)) {
        return React.createElement(Node, null, children.map(function (child, i) {
          return cloneElement(child, (0, _objectAssign2['default'])({ key: i }, _this2.getProps()));
        }, this));
      } else if (children) {
        return cloneElement(children, this.getProps());
      } else {
        return React.createElement(Node, this.getProps());
      }
    }
  };
};

exports['default'] = mixinContainer;
module.exports = exports['default'];