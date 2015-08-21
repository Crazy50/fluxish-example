"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Fluxish = (function () {
  function Fluxish() {
    _classCallCheck(this, Fluxish);

    this._storeStates = {};
    this._writableContext = { stores: {}, actions: {} };
    this._readOnlyContext = { stores: {}, actions: {} };
    this._listeners = {};
  }

  _createClass(Fluxish, [{
    key: "getContext",
    value: function getContext() {
      return this._readOnlyContext;
    }
  }, {
    key: "loadStores",
    value: function loadStores(stores) {
      for (var storeName in stores) {
        var store = stores[storeName];

        var storeWriteContext = {};
        var storeReadContext = {};

        for (var funtionName in store.mutators) {
          storeWriteContext[funtionName] = _wrapMutator.call(this, store.mutators[funtionName], storeName, store.mutators);
        }

        for (var funtionName in store.getters) {
          var wrappedFunction = _wrapGetter.call(this, store.getters[funtionName], storeName, store.getters);
          storeWriteContext[funtionName] = storeReadContext[funtionName] = wrappedFunction;
        }

        this._writableContext.stores[storeName] = storeWriteContext;
        this._readOnlyContext.stores[storeName] = storeReadContext;

        if (!this._storeStates.hasOwnProperty(storeName)) {
          this._listeners[storeName] = [];

          if (store.initialState) {
            this._storeStates[storeName] = store.initialState();
          }
        }
      }
    }
  }, {
    key: "loadActions",
    value: function loadActions(actions) {
      for (var actionName in actions) {
        var action = actions[actionName];

        var wrappedFunction = _wrapAction.call(this, action);

        this._writableContext.actions[actionName] = this._readOnlyContext.actions[actionName] = wrappedFunction;
      }
    }
  }, {
    key: "listen",
    value: function listen(storeName, listener) {
      var storeListeners = this._listeners[storeName];
      if (storeListeners.indexOf(listener) === -1) {
        storeListeners.push(listener);
      }

      return function () {
        storeListeners.splice(storeListeners.indexOf(listener), 1);
      };
    }
  }]);

  return Fluxish;
})();

exports["default"] = Fluxish;

function _wrapMutator(fn, storeName, ctx) {
  var _this = this;

  return function () {
    for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    var newData = fn.apply(ctx, [_this._readOnlyContext, _this._storeStates[storeName]].concat(params));
    if (newData !== undefined) {
      _this._storeStates[storeName] = newData;
      _this._listeners[storeName].forEach(function (listener) {
        return listener(_this._readOnlyContext);
      });
    }
  };
}

function _wrapGetter(fn, storeName, ctx) {
  var _this2 = this;

  return function () {
    for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      params[_key2] = arguments[_key2];
    }

    return fn.apply(ctx, [_this2._storeStates[storeName]].concat(params));
  };
}

function _wrapAction(fn) {
  var _this3 = this;

  return function () {
    for (var _len3 = arguments.length, params = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      params[_key3] = arguments[_key3];
    }

    return fn.apply(undefined, [_this3._writableContext].concat(params));
  };
}
module.exports = exports["default"];