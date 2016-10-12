'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _immutable = require('immutable');

var _lodash = require('lodash');

var uniqueEventId = _lodash.uniqueId.bind(null, 'active_event_');

if (typeof document != 'undefined') {
  document.addEventListener('click', onEvent.bind(null, 'click'), true);
  document.addEventListener('keydown', onEvent.bind(null, 'keydown'));
  document.addEventListener('keyup', onEvent.bind(null, 'keyup'));
}

var listenables = (0, _immutable.OrderedMap)();

function onEvent(type, event) {
  var listenable = listenables.last();
  if (listenable) {
    var handler = listenable.get(type);
    if (typeof handler == 'function') {
      handler(event);
    }
  }
};

var EventStack = {
  addListenable: function addListenable(listenArray) {
    /* ex: [['click', clickHandler], ['keydown', keydownHandler]] */
    var id = uniqueEventId();
    var listenable = (0, _immutable.Map)(listenArray);
    listenables = listenables.set(id, listenable);
    return id;
  },
  removeListenable: function removeListenable(id) {
    listenables = listenables['delete'](id);
  }
};

exports['default'] = EventStack;
module.exports = exports['default'];