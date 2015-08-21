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
    this._stores = {};
    this._actions = {};
    this._writableContext = {
      stores: {},
      actions: {}
    };
    this._readOnlyContext = {
      stores: {},
      actions: {}
    };
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
      var replaceIfExists = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      for (var storeName in stores) {
        var notExisting = !this._stores.hasOwnProperty(storeName);
        if (notExisting || replaceIfExists) {
          var store = stores[storeName];

          var storeWriteContext = {};
          var storeReadContext = {};

          for (var funtionName in store.mutators) {
            storeWriteContext[funtionName] = this._createMutatorFuncWrapper(store.mutators[funtionName], storeName);
          }

          for (var funtionName in store.getters) {
            var wrappedFunction = this._createGetterFuncWrapper(store.getters[funtionName], storeName);
            storeReadContext[funtionName] = wrappedFunction;
            storeWriteContext[funtionName] = wrappedFunction;
          }

          this._writableContext.stores[storeName] = storeWriteContext;
          this._readOnlyContext.stores[storeName] = storeReadContext;
          this._stores[storeName] = store;

          if (notExisting && store.initialState) {
            this._storeStates[storeName] = store.initialState();
          }
        }
      }
    }
  }, {
    key: "loadActions",
    value: function loadActions(actions) {
      var replaceIfExists = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      for (var actionName in actions) {
        if (!this._actions.hasOwnProperty(actionName) || replaceIfExists) {
          var action = actions[actionName];

          var wrappedFunction = this._createActionFuncWrapper(action);

          this._writableContext.actions[actionName] = wrappedFunction;
          this._readOnlyContext.actions[actionName] = wrappedFunction;
          this._actions[actionName] = action;
        }
      }
    }
  }, {
    key: "listen",
    value: function listen(storeName, listener) {
      var _this = this;

      if (!this._listeners.hasOwnProperty(storeName)) {
        this._listeners[storeName] = [listener];
      } else {
        this._listeners[storeName].push(listener);
      }

      return function () {
        var index = _this._listeners[storeName].indexOf(listener);
        _this._listeners[storeName].splice(index, 1);
      };
    }
  }, {
    key: "_createMutatorFuncWrapper",
    value: function _createMutatorFuncWrapper(fn, storeName) {
      var _this2 = this;

      return function () {
        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
          params[_key] = arguments[_key];
        }

        var newData = fn.apply(_this2._stores[storeName].mutators, [_this2._readOnlyContext, _this2._storeStates[storeName]].concat(params));
        if (newData !== undefined) {
          _this2._storeStates[storeName] = newData;
          if (_this2._listeners[storeName]) {
            _this2._listeners[storeName].forEach(function (listener) {
              return listener(_this2._readOnlyContext);
            });
          }
        }
      };
    }
  }, {
    key: "_createGetterFuncWrapper",
    value: function _createGetterFuncWrapper(fn, storeName) {
      var _this3 = this;

      return function () {
        for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          params[_key2] = arguments[_key2];
        }

        return fn.apply(_this3._stores[storeName].getters, [_this3._storeStates[storeName]].concat(params));
      };
    }
  }, {
    key: "_createActionFuncWrapper",
    value: function _createActionFuncWrapper(fn) {
      var _this4 = this;

      return function () {
        for (var _len3 = arguments.length, params = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          params[_key3] = arguments[_key3];
        }

        return fn.apply(undefined, [_this4._writableContext].concat(params));
      };
    }
  }]);

  return Fluxish;
})();

exports["default"] = Fluxish;
module.exports = exports["default"];
