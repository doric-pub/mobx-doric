if (Environment.platform === "iOS") {
  var version = -1;
  try {
    version = parseInt(Environment.platformVersion.split(".")[0]);
  } catch (e) {}
  if (version <= 12) {
    var commonjsGlobal =
      typeof globalThis !== "undefined"
        ? globalThis
        : typeof window !== "undefined"
        ? window
        : typeof global !== "undefined"
        ? global
        : typeof self !== "undefined"
        ? self
        : {};

    function createCommonjsModule(fn, basedir, module) {
      return (
        (module = {
          path: basedir,
          exports: {},
          require: function (path, base) {
            return commonjsRequire(
              path,
              base === undefined || base === null ? module.path : base
            );
          },
        }),
        fn(module, module.exports),
        module.exports
      );
    }

    function commonjsRequire() {
      throw new Error(
        "Dynamic requires are not currently supported by @rollup/plugin-commonjs"
      );
    }

    var check = function (it) {
      return it && it.Math == Math && it;
    };

    // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
    var global_1 =
      // eslint-disable-next-line es/no-global-this -- safe
      check(typeof globalThis == "object" && globalThis) ||
      check(typeof window == "object" && window) ||
      // eslint-disable-next-line no-restricted-globals -- safe
      check(typeof self == "object" && self) ||
      check(typeof commonjsGlobal == "object" && commonjsGlobal) ||
      // eslint-disable-next-line no-new-func -- fallback
      (function () {
        return this;
      })() ||
      Function("return this")();

    var fails = function (exec) {
      try {
        return !!exec();
      } catch (error) {
        return true;
      }
    };

    // Detect IE8's incomplete defineProperty implementation
    var descriptors = !fails(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return (
        Object.defineProperty({}, 1, {
          get: function () {
            return 7;
          },
        })[1] != 7
      );
    });

    var functionBindNative = !fails(function () {
      // eslint-disable-next-line es/no-function-prototype-bind -- safe
      var test = function () {
        /* empty */
      }.bind();
      // eslint-disable-next-line no-prototype-builtins -- safe
      return typeof test != "function" || test.hasOwnProperty("prototype");
    });

    var call$2 = Function.prototype.call;

    var functionCall = functionBindNative
      ? call$2.bind(call$2)
      : function () {
          return call$2.apply(call$2, arguments);
        };

    var $propertyIsEnumerable$1 = {}.propertyIsEnumerable;
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

    // Nashorn ~ JDK8 bug
    var NASHORN_BUG =
      getOwnPropertyDescriptor$1 && !$propertyIsEnumerable$1.call({ 1: 2 }, 1);

    // `Object.prototype.propertyIsEnumerable` method implementation
    // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
    var f$7 = NASHORN_BUG
      ? function propertyIsEnumerable(V) {
          var descriptor = getOwnPropertyDescriptor$1(this, V);
          return !!descriptor && descriptor.enumerable;
        }
      : $propertyIsEnumerable$1;

    var objectPropertyIsEnumerable = {
      f: f$7,
    };

    var createPropertyDescriptor = function (bitmap, value) {
      return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value: value,
      };
    };

    var FunctionPrototype$2 = Function.prototype;
    var call$1 = FunctionPrototype$2.call;
    var uncurryThisWithBind =
      functionBindNative && FunctionPrototype$2.bind.bind(call$1, call$1);

    var functionUncurryThis = functionBindNative
      ? uncurryThisWithBind
      : function (fn) {
          return function () {
            return call$1.apply(fn, arguments);
          };
        };

    var toString$1 = functionUncurryThis({}.toString);
    var stringSlice$1 = functionUncurryThis("".slice);

    var classofRaw = function (it) {
      return stringSlice$1(toString$1(it), 8, -1);
    };

    var $Object$4 = Object;
    var split = functionUncurryThis("".split);

    // fallback for non-array-like ES3 and non-enumerable old V8 strings
    var indexedObject = fails(function () {
      // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
      // eslint-disable-next-line no-prototype-builtins -- safe
      return !$Object$4("z").propertyIsEnumerable(0);
    })
      ? function (it) {
          return classofRaw(it) == "String" ? split(it, "") : $Object$4(it);
        }
      : $Object$4;

    // we can't use just `it == null` since of `document.all` special case
    // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
    var isNullOrUndefined = function (it) {
      return it === null || it === undefined;
    };

    var $TypeError$9 = TypeError;

    // `RequireObjectCoercible` abstract operation
    // https://tc39.es/ecma262/#sec-requireobjectcoercible
    var requireObjectCoercible = function (it) {
      if (isNullOrUndefined(it))
        throw $TypeError$9("Can't call method on " + it);
      return it;
    };

    // toObject with fallback for non-array-like ES3 strings

    var toIndexedObject = function (it) {
      return indexedObject(requireObjectCoercible(it));
    };

    var documentAll$2 = typeof document == "object" && document.all;

    // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
    // eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
    var IS_HTMLDDA =
      typeof documentAll$2 == "undefined" && documentAll$2 !== undefined;

    var documentAll_1 = {
      all: documentAll$2,
      IS_HTMLDDA: IS_HTMLDDA,
    };

    var documentAll$1 = documentAll_1.all;

    // `IsCallable` abstract operation
    // https://tc39.es/ecma262/#sec-iscallable
    var isCallable = documentAll_1.IS_HTMLDDA
      ? function (argument) {
          return typeof argument == "function" || argument === documentAll$1;
        }
      : function (argument) {
          return typeof argument == "function";
        };

    var documentAll = documentAll_1.all;

    var isObject = documentAll_1.IS_HTMLDDA
      ? function (it) {
          return typeof it == "object"
            ? it !== null
            : isCallable(it) || it === documentAll;
        }
      : function (it) {
          return typeof it == "object" ? it !== null : isCallable(it);
        };

    var aFunction = function (argument) {
      return isCallable(argument) ? argument : undefined;
    };

    var getBuiltIn = function (namespace, method) {
      return arguments.length < 2
        ? aFunction(global_1[namespace])
        : global_1[namespace] && global_1[namespace][method];
    };

    var objectIsPrototypeOf = functionUncurryThis({}.isPrototypeOf);

    var engineUserAgent =
      (typeof navigator != "undefined" && String(navigator.userAgent)) || "";

    var process = global_1.process;
    var Deno = global_1.Deno;
    var versions = (process && process.versions) || (Deno && Deno.version);
    var v8 = versions && versions.v8;
    var match, version;

    if (v8) {
      match = v8.split(".");
      // in old Chrome, versions of V8 isn't V8 = Chrome / 10
      // but their correct versions are not interesting for us
      version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
    }

    // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
    // so check `userAgent` even if `.v8` exists, but 0
    if (!version && engineUserAgent) {
      match = engineUserAgent.match(/Edge\/(\d+)/);
      if (!match || match[1] >= 74) {
        match = engineUserAgent.match(/Chrome\/(\d+)/);
        if (match) version = +match[1];
      }
    }

    var engineV8Version = version;

    /* eslint-disable es/no-symbol -- required for testing */

    // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
    var symbolConstructorDetection =
      !!Object.getOwnPropertySymbols &&
      !fails(function () {
        var symbol = Symbol();
        // Chrome 38 Symbol has incorrect toString conversion
        // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
        return (
          !String(symbol) ||
          !(Object(symbol) instanceof Symbol) ||
          // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
          (!Symbol.sham && engineV8Version && engineV8Version < 41)
        );
      });

    /* eslint-disable es/no-symbol -- required for testing */

    var useSymbolAsUid =
      symbolConstructorDetection &&
      !Symbol.sham &&
      typeof Symbol.iterator == "symbol";

    var $Object$3 = Object;

    var isSymbol = useSymbolAsUid
      ? function (it) {
          return typeof it == "symbol";
        }
      : function (it) {
          var $Symbol = getBuiltIn("Symbol");
          return (
            isCallable($Symbol) &&
            objectIsPrototypeOf($Symbol.prototype, $Object$3(it))
          );
        };

    var $String$4 = String;

    var tryToString = function (argument) {
      try {
        return $String$4(argument);
      } catch (error) {
        return "Object";
      }
    };

    var $TypeError$8 = TypeError;

    // `Assert: IsCallable(argument) is true`
    var aCallable = function (argument) {
      if (isCallable(argument)) return argument;
      throw $TypeError$8(tryToString(argument) + " is not a function");
    };

    // `GetMethod` abstract operation
    // https://tc39.es/ecma262/#sec-getmethod
    var getMethod = function (V, P) {
      var func = V[P];
      return isNullOrUndefined(func) ? undefined : aCallable(func);
    };

    var $TypeError$7 = TypeError;

    // `OrdinaryToPrimitive` abstract operation
    // https://tc39.es/ecma262/#sec-ordinarytoprimitive
    var ordinaryToPrimitive = function (input, pref) {
      var fn, val;
      if (
        pref === "string" &&
        isCallable((fn = input.toString)) &&
        !isObject((val = functionCall(fn, input)))
      )
        return val;
      if (
        isCallable((fn = input.valueOf)) &&
        !isObject((val = functionCall(fn, input)))
      )
        return val;
      if (
        pref !== "string" &&
        isCallable((fn = input.toString)) &&
        !isObject((val = functionCall(fn, input)))
      )
        return val;
      throw $TypeError$7("Can't convert object to primitive value");
    };

    // eslint-disable-next-line es/no-object-defineproperty -- safe
    var defineProperty$4 = Object.defineProperty;

    var defineGlobalProperty = function (key, value) {
      try {
        defineProperty$4(global_1, key, {
          value: value,
          configurable: true,
          writable: true,
        });
      } catch (error) {
        global_1[key] = value;
      }
      return value;
    };

    var SHARED = "__core-js_shared__";
    var store$1 = global_1[SHARED] || defineGlobalProperty(SHARED, {});

    var sharedStore = store$1;

    var shared = createCommonjsModule(function (module) {
      (module.exports = function (key, value) {
        return (
          sharedStore[key] ||
          (sharedStore[key] = value !== undefined ? value : {})
        );
      })("versions", []).push({
        version: "3.30.0",
        mode: "global",
        copyright: "© 2014-2023 Denis Pushkarev (zloirock.ru)",
        license: "https://github.com/zloirock/core-js/blob/v3.30.0/LICENSE",
        source: "https://github.com/zloirock/core-js",
      });
    });

    var $Object$2 = Object;

    // `ToObject` abstract operation
    // https://tc39.es/ecma262/#sec-toobject
    var toObject = function (argument) {
      return $Object$2(requireObjectCoercible(argument));
    };

    var hasOwnProperty = functionUncurryThis({}.hasOwnProperty);

    // `HasOwnProperty` abstract operation
    // https://tc39.es/ecma262/#sec-hasownproperty
    // eslint-disable-next-line es/no-object-hasown -- safe
    var hasOwnProperty_1 =
      Object.hasOwn ||
      function hasOwn(it, key) {
        return hasOwnProperty(toObject(it), key);
      };

    var id = 0;
    var postfix = Math.random();
    var toString = functionUncurryThis((1.0).toString);

    var uid = function (key) {
      return (
        "Symbol(" +
        (key === undefined ? "" : key) +
        ")_" +
        toString(++id + postfix, 36)
      );
    };

    var Symbol$3 = global_1.Symbol;
    var WellKnownSymbolsStore$2 = shared("wks");
    var createWellKnownSymbol = useSymbolAsUid
      ? Symbol$3["for"] || Symbol$3
      : (Symbol$3 && Symbol$3.withoutSetter) || uid;

    var wellKnownSymbol = function (name) {
      if (!hasOwnProperty_1(WellKnownSymbolsStore$2, name)) {
        WellKnownSymbolsStore$2[name] =
          symbolConstructorDetection && hasOwnProperty_1(Symbol$3, name)
            ? Symbol$3[name]
            : createWellKnownSymbol("Symbol." + name);
      }
      return WellKnownSymbolsStore$2[name];
    };

    var $TypeError$6 = TypeError;
    var TO_PRIMITIVE = wellKnownSymbol("toPrimitive");

    // `ToPrimitive` abstract operation
    // https://tc39.es/ecma262/#sec-toprimitive
    var toPrimitive = function (input, pref) {
      if (!isObject(input) || isSymbol(input)) return input;
      var exoticToPrim = getMethod(input, TO_PRIMITIVE);
      var result;
      if (exoticToPrim) {
        if (pref === undefined) pref = "default";
        result = functionCall(exoticToPrim, input, pref);
        if (!isObject(result) || isSymbol(result)) return result;
        throw $TypeError$6("Can't convert object to primitive value");
      }
      if (pref === undefined) pref = "number";
      return ordinaryToPrimitive(input, pref);
    };

    // `ToPropertyKey` abstract operation
    // https://tc39.es/ecma262/#sec-topropertykey
    var toPropertyKey = function (argument) {
      var key = toPrimitive(argument, "string");
      return isSymbol(key) ? key : key + "";
    };

    var document$1 = global_1.document;
    // typeof document.createElement is 'object' in old IE
    var EXISTS$1 = isObject(document$1) && isObject(document$1.createElement);

    var documentCreateElement = function (it) {
      return EXISTS$1 ? document$1.createElement(it) : {};
    };

    // Thanks to IE8 for its funny defineProperty
    var ie8DomDefine =
      !descriptors &&
      !fails(function () {
        // eslint-disable-next-line es/no-object-defineproperty -- required for testing
        return (
          Object.defineProperty(documentCreateElement("div"), "a", {
            get: function () {
              return 7;
            },
          }).a != 7
        );
      });

    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var $getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

    // `Object.getOwnPropertyDescriptor` method
    // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
    var f$6 = descriptors
      ? $getOwnPropertyDescriptor$2
      : function getOwnPropertyDescriptor(O, P) {
          O = toIndexedObject(O);
          P = toPropertyKey(P);
          if (ie8DomDefine)
            try {
              return $getOwnPropertyDescriptor$2(O, P);
            } catch (error) {
              /* empty */
            }
          if (hasOwnProperty_1(O, P))
            return createPropertyDescriptor(
              !functionCall(objectPropertyIsEnumerable.f, O, P),
              O[P]
            );
        };

    var objectGetOwnPropertyDescriptor = {
      f: f$6,
    };

    // V8 ~ Chrome 36-
    // https://bugs.chromium.org/p/v8/issues/detail?id=3334
    var v8PrototypeDefineBug =
      descriptors &&
      fails(function () {
        // eslint-disable-next-line es/no-object-defineproperty -- required for testing
        return (
          Object.defineProperty(
            function () {
              /* empty */
            },
            "prototype",
            {
              value: 42,
              writable: false,
            }
          ).prototype != 42
        );
      });

    var $String$3 = String;
    var $TypeError$5 = TypeError;

    // `Assert: Type(argument) is Object`
    var anObject = function (argument) {
      if (isObject(argument)) return argument;
      throw $TypeError$5($String$3(argument) + " is not an object");
    };

    var $TypeError$4 = TypeError;
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    var $defineProperty$1 = Object.defineProperty;
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
    var ENUMERABLE = "enumerable";
    var CONFIGURABLE$1 = "configurable";
    var WRITABLE = "writable";

    // `Object.defineProperty` method
    // https://tc39.es/ecma262/#sec-object.defineproperty
    var f$5 = descriptors
      ? v8PrototypeDefineBug
        ? function defineProperty(O, P, Attributes) {
            anObject(O);
            P = toPropertyKey(P);
            anObject(Attributes);
            if (
              typeof O === "function" &&
              P === "prototype" &&
              "value" in Attributes &&
              WRITABLE in Attributes &&
              !Attributes[WRITABLE]
            ) {
              var current = $getOwnPropertyDescriptor$1(O, P);
              if (current && current[WRITABLE]) {
                O[P] = Attributes.value;
                Attributes = {
                  configurable:
                    CONFIGURABLE$1 in Attributes
                      ? Attributes[CONFIGURABLE$1]
                      : current[CONFIGURABLE$1],
                  enumerable:
                    ENUMERABLE in Attributes
                      ? Attributes[ENUMERABLE]
                      : current[ENUMERABLE],
                  writable: false,
                };
              }
            }
            return $defineProperty$1(O, P, Attributes);
          }
        : $defineProperty$1
      : function defineProperty(O, P, Attributes) {
          anObject(O);
          P = toPropertyKey(P);
          anObject(Attributes);
          if (ie8DomDefine)
            try {
              return $defineProperty$1(O, P, Attributes);
            } catch (error) {
              /* empty */
            }
          if ("get" in Attributes || "set" in Attributes)
            throw $TypeError$4("Accessors not supported");
          if ("value" in Attributes) O[P] = Attributes.value;
          return O;
        };

    var objectDefineProperty = {
      f: f$5,
    };

    var createNonEnumerableProperty = descriptors
      ? function (object, key, value) {
          return objectDefineProperty.f(
            object,
            key,
            createPropertyDescriptor(1, value)
          );
        }
      : function (object, key, value) {
          object[key] = value;
          return object;
        };

    var FunctionPrototype$1 = Function.prototype;
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var getDescriptor = descriptors && Object.getOwnPropertyDescriptor;

    var EXISTS = hasOwnProperty_1(FunctionPrototype$1, "name");
    // additional protection from minified / mangled / dropped function names
    var PROPER =
      EXISTS &&
      function something() {
        /* empty */
      }.name === "something";
    var CONFIGURABLE =
      EXISTS &&
      (!descriptors ||
        (descriptors &&
          getDescriptor(FunctionPrototype$1, "name").configurable));

    var functionName = {
      EXISTS: EXISTS,
      PROPER: PROPER,
      CONFIGURABLE: CONFIGURABLE,
    };

    var functionToString = functionUncurryThis(Function.toString);

    // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
    if (!isCallable(sharedStore.inspectSource)) {
      sharedStore.inspectSource = function (it) {
        return functionToString(it);
      };
    }

    var inspectSource = sharedStore.inspectSource;

    var WeakMap$1 = global_1.WeakMap;

    var weakMapBasicDetection =
      isCallable(WeakMap$1) && /native code/.test(String(WeakMap$1));

    var keys = shared("keys");

    var sharedKey = function (key) {
      return keys[key] || (keys[key] = uid(key));
    };

    var hiddenKeys$1 = {};

    var OBJECT_ALREADY_INITIALIZED = "Object already initialized";
    var TypeError$2 = global_1.TypeError;
    var WeakMap = global_1.WeakMap;
    var set, get, has;

    var enforce = function (it) {
      return has(it) ? get(it) : set(it, {});
    };

    var getterFor = function (TYPE) {
      return function (it) {
        var state;
        if (!isObject(it) || (state = get(it)).type !== TYPE) {
          throw TypeError$2("Incompatible receiver, " + TYPE + " required");
        }
        return state;
      };
    };

    if (weakMapBasicDetection || sharedStore.state) {
      var store = sharedStore.state || (sharedStore.state = new WeakMap());
      /* eslint-disable no-self-assign -- prototype methods protection */
      store.get = store.get;
      store.has = store.has;
      store.set = store.set;
      /* eslint-enable no-self-assign -- prototype methods protection */
      set = function (it, metadata) {
        if (store.has(it)) throw TypeError$2(OBJECT_ALREADY_INITIALIZED);
        metadata.facade = it;
        store.set(it, metadata);
        return metadata;
      };
      get = function (it) {
        return store.get(it) || {};
      };
      has = function (it) {
        return store.has(it);
      };
    } else {
      var STATE = sharedKey("state");
      hiddenKeys$1[STATE] = true;
      set = function (it, metadata) {
        if (hasOwnProperty_1(it, STATE))
          throw TypeError$2(OBJECT_ALREADY_INITIALIZED);
        metadata.facade = it;
        createNonEnumerableProperty(it, STATE, metadata);
        return metadata;
      };
      get = function (it) {
        return hasOwnProperty_1(it, STATE) ? it[STATE] : {};
      };
      has = function (it) {
        return hasOwnProperty_1(it, STATE);
      };
    }

    var internalState = {
      set: set,
      get: get,
      has: has,
      enforce: enforce,
      getterFor: getterFor,
    };

    var makeBuiltIn_1 = createCommonjsModule(function (module) {
      var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;

      var enforceInternalState = internalState.enforce;
      var getInternalState = internalState.get;
      var $String = String;
      // eslint-disable-next-line es/no-object-defineproperty -- safe
      var defineProperty = Object.defineProperty;
      var stringSlice = functionUncurryThis("".slice);
      var replace = functionUncurryThis("".replace);
      var join = functionUncurryThis([].join);

      var CONFIGURABLE_LENGTH =
        descriptors &&
        !fails(function () {
          return (
            defineProperty(
              function () {
                /* empty */
              },
              "length",
              { value: 8 }
            ).length !== 8
          );
        });

      var TEMPLATE = String(String).split("String");

      var makeBuiltIn = (module.exports = function (value, name, options) {
        if (stringSlice($String(name), 0, 7) === "Symbol(") {
          name = "[" + replace($String(name), /^Symbol\(([^)]*)\)/, "$1") + "]";
        }
        if (options && options.getter) name = "get " + name;
        if (options && options.setter) name = "set " + name;
        if (
          !hasOwnProperty_1(value, "name") ||
          (CONFIGURABLE_FUNCTION_NAME && value.name !== name)
        ) {
          if (descriptors)
            defineProperty(value, "name", { value: name, configurable: true });
          else value.name = name;
        }
        if (
          CONFIGURABLE_LENGTH &&
          options &&
          hasOwnProperty_1(options, "arity") &&
          value.length !== options.arity
        ) {
          defineProperty(value, "length", { value: options.arity });
        }
        try {
          if (
            options &&
            hasOwnProperty_1(options, "constructor") &&
            options.constructor
          ) {
            if (descriptors)
              defineProperty(value, "prototype", { writable: false });
            // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
          } else if (value.prototype) value.prototype = undefined;
        } catch (error) {
          /* empty */
        }
        var state = enforceInternalState(value);
        if (!hasOwnProperty_1(state, "source")) {
          state.source = join(TEMPLATE, typeof name == "string" ? name : "");
        }
        return value;
      });

      // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
      // eslint-disable-next-line no-extend-native -- required
      Function.prototype.toString = makeBuiltIn(function toString() {
        return (
          (isCallable(this) && getInternalState(this).source) ||
          inspectSource(this)
        );
      }, "toString");
    });

    var defineBuiltIn = function (O, key, value, options) {
      if (!options) options = {};
      var simple = options.enumerable;
      var name = options.name !== undefined ? options.name : key;
      if (isCallable(value)) makeBuiltIn_1(value, name, options);
      if (options.global) {
        if (simple) O[key] = value;
        else defineGlobalProperty(key, value);
      } else {
        try {
          if (!options.unsafe) delete O[key];
          else if (O[key]) simple = true;
        } catch (error) {
          /* empty */
        }
        if (simple) O[key] = value;
        else
          objectDefineProperty.f(O, key, {
            value: value,
            enumerable: false,
            configurable: !options.nonConfigurable,
            writable: !options.nonWritable,
          });
      }
      return O;
    };

    var ceil = Math.ceil;
    var floor = Math.floor;

    // `Math.trunc` method
    // https://tc39.es/ecma262/#sec-math.trunc
    // eslint-disable-next-line es/no-math-trunc -- safe
    var mathTrunc =
      Math.trunc ||
      function trunc(x) {
        var n = +x;
        return (n > 0 ? floor : ceil)(n);
      };

    // `ToIntegerOrInfinity` abstract operation
    // https://tc39.es/ecma262/#sec-tointegerorinfinity
    var toIntegerOrInfinity = function (argument) {
      var number = +argument;
      // eslint-disable-next-line no-self-compare -- NaN check
      return number !== number || number === 0 ? 0 : mathTrunc(number);
    };

    var max$1 = Math.max;
    var min$1 = Math.min;

    // Helper for a popular repeating case of the spec:
    // Let integer be ? ToInteger(index).
    // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
    var toAbsoluteIndex = function (index, length) {
      var integer = toIntegerOrInfinity(index);
      return integer < 0 ? max$1(integer + length, 0) : min$1(integer, length);
    };

    var min = Math.min;

    // `ToLength` abstract operation
    // https://tc39.es/ecma262/#sec-tolength
    var toLength = function (argument) {
      return argument > 0
        ? min(toIntegerOrInfinity(argument), 0x1fffffffffffff)
        : 0; // 2 ** 53 - 1 == 9007199254740991
    };

    // `LengthOfArrayLike` abstract operation
    // https://tc39.es/ecma262/#sec-lengthofarraylike
    var lengthOfArrayLike = function (obj) {
      return toLength(obj.length);
    };

    // `Array.prototype.{ indexOf, includes }` methods implementation
    var createMethod$1 = function (IS_INCLUDES) {
      return function ($this, el, fromIndex) {
        var O = toIndexedObject($this);
        var length = lengthOfArrayLike(O);
        var index = toAbsoluteIndex(fromIndex, length);
        var value;
        // Array#includes uses SameValueZero equality algorithm
        // eslint-disable-next-line no-self-compare -- NaN check
        if (IS_INCLUDES && el != el)
          while (length > index) {
            value = O[index++];
            // eslint-disable-next-line no-self-compare -- NaN check
            if (value != value) return true;
            // Array#indexOf ignores holes, Array#includes - not
          }
        else
          for (; length > index; index++) {
            if ((IS_INCLUDES || index in O) && O[index] === el)
              return IS_INCLUDES || index || 0;
          }
        return !IS_INCLUDES && -1;
      };
    };

    var arrayIncludes = {
      // `Array.prototype.includes` method
      // https://tc39.es/ecma262/#sec-array.prototype.includes
      includes: createMethod$1(true),
      // `Array.prototype.indexOf` method
      // https://tc39.es/ecma262/#sec-array.prototype.indexof
      indexOf: createMethod$1(false),
    };

    var indexOf = arrayIncludes.indexOf;

    var push$3 = functionUncurryThis([].push);

    var objectKeysInternal = function (object, names) {
      var O = toIndexedObject(object);
      var i = 0;
      var result = [];
      var key;
      for (key in O)
        !hasOwnProperty_1(hiddenKeys$1, key) &&
          hasOwnProperty_1(O, key) &&
          push$3(result, key);
      // Don't enum bug & hidden keys
      while (names.length > i)
        if (hasOwnProperty_1(O, (key = names[i++]))) {
          ~indexOf(result, key) || push$3(result, key);
        }
      return result;
    };

    // IE8- don't enum bug keys
    var enumBugKeys = [
      "constructor",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "toLocaleString",
      "toString",
      "valueOf",
    ];

    var hiddenKeys = enumBugKeys.concat("length", "prototype");

    // `Object.getOwnPropertyNames` method
    // https://tc39.es/ecma262/#sec-object.getownpropertynames
    // eslint-disable-next-line es/no-object-getownpropertynames -- safe
    var f$4 =
      Object.getOwnPropertyNames ||
      function getOwnPropertyNames(O) {
        return objectKeysInternal(O, hiddenKeys);
      };

    var objectGetOwnPropertyNames = {
      f: f$4,
    };

    // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
    var f$3 = Object.getOwnPropertySymbols;

    var objectGetOwnPropertySymbols = {
      f: f$3,
    };

    var concat = functionUncurryThis([].concat);

    // all object keys, includes non-enumerable and symbols
    var ownKeys =
      getBuiltIn("Reflect", "ownKeys") ||
      function ownKeys(it) {
        var keys = objectGetOwnPropertyNames.f(anObject(it));
        var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
        return getOwnPropertySymbols
          ? concat(keys, getOwnPropertySymbols(it))
          : keys;
      };

    var copyConstructorProperties = function (target, source, exceptions) {
      var keys = ownKeys(source);
      var defineProperty = objectDefineProperty.f;
      var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (
          !hasOwnProperty_1(target, key) &&
          !(exceptions && hasOwnProperty_1(exceptions, key))
        ) {
          defineProperty(target, key, getOwnPropertyDescriptor(source, key));
        }
      }
    };

    var replacement = /#|\.prototype\./;

    var isForced = function (feature, detection) {
      var value = data[normalize(feature)];
      return value == POLYFILL
        ? true
        : value == NATIVE
        ? false
        : isCallable(detection)
        ? fails(detection)
        : !!detection;
    };

    var normalize = (isForced.normalize = function (string) {
      return String(string).replace(replacement, ".").toLowerCase();
    });

    var data = (isForced.data = {});
    var NATIVE = (isForced.NATIVE = "N");
    var POLYFILL = (isForced.POLYFILL = "P");

    var isForced_1 = isForced;

    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

    /*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
    var _export = function (options, source) {
      var TARGET = options.target;
      var GLOBAL = options.global;
      var STATIC = options.stat;
      var FORCED, target, key, targetProperty, sourceProperty, descriptor;
      if (GLOBAL) {
        target = global_1;
      } else if (STATIC) {
        target = global_1[TARGET] || defineGlobalProperty(TARGET, {});
      } else {
        target = (global_1[TARGET] || {}).prototype;
      }
      if (target)
        for (key in source) {
          sourceProperty = source[key];
          if (options.dontCallGetSet) {
            descriptor = getOwnPropertyDescriptor(target, key);
            targetProperty = descriptor && descriptor.value;
          } else targetProperty = target[key];
          FORCED = isForced_1(
            GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key,
            options.forced
          );
          // contained in target
          if (!FORCED && targetProperty !== undefined) {
            if (typeof sourceProperty == typeof targetProperty) continue;
            copyConstructorProperties(sourceProperty, targetProperty);
          }
          // add a flag to not completely full polyfills
          if (options.sham || (targetProperty && targetProperty.sham)) {
            createNonEnumerableProperty(sourceProperty, "sham", true);
          }
          defineBuiltIn(target, key, sourceProperty, options);
        }
    };

    // `IsArray` abstract operation
    // https://tc39.es/ecma262/#sec-isarray
    // eslint-disable-next-line es/no-array-isarray -- safe
    var isArray =
      Array.isArray ||
      function isArray(argument) {
        return classofRaw(argument) == "Array";
      };

    var $TypeError$3 = TypeError;
    var MAX_SAFE_INTEGER = 0x1fffffffffffff; // 2 ** 53 - 1 == 9007199254740991

    var doesNotExceedSafeInteger = function (it) {
      if (it > MAX_SAFE_INTEGER)
        throw $TypeError$3("Maximum allowed index exceeded");
      return it;
    };

    var createProperty = function (object, key, value) {
      var propertyKey = toPropertyKey(key);
      if (propertyKey in object)
        objectDefineProperty.f(
          object,
          propertyKey,
          createPropertyDescriptor(0, value)
        );
      else object[propertyKey] = value;
    };

    var TO_STRING_TAG$3 = wellKnownSymbol("toStringTag");
    var test = {};

    test[TO_STRING_TAG$3] = "z";

    var toStringTagSupport = String(test) === "[object z]";

    var TO_STRING_TAG$2 = wellKnownSymbol("toStringTag");
    var $Object$1 = Object;

    // ES3 wrong here
    var CORRECT_ARGUMENTS =
      classofRaw(
        (function () {
          return arguments;
        })()
      ) == "Arguments";

    // fallback for IE11 Script Access Denied error
    var tryGet = function (it, key) {
      try {
        return it[key];
      } catch (error) {
        /* empty */
      }
    };

    // getting tag from ES6+ `Object.prototype.toString`
    var classof = toStringTagSupport
      ? classofRaw
      : function (it) {
          var O, tag, result;
          return it === undefined
            ? "Undefined"
            : it === null
            ? "Null"
            : // @@toStringTag case
            typeof (tag = tryGet((O = $Object$1(it)), TO_STRING_TAG$2)) ==
              "string"
            ? tag
            : // builtinTag case
            CORRECT_ARGUMENTS
            ? classofRaw(O)
            : // ES3 arguments fallback
            (result = classofRaw(O)) == "Object" && isCallable(O.callee)
            ? "Arguments"
            : result;
        };

    var noop = function () {
      /* empty */
    };
    var empty = [];
    var construct = getBuiltIn("Reflect", "construct");
    var constructorRegExp = /^\s*(?:class|function)\b/;
    var exec$1 = functionUncurryThis(constructorRegExp.exec);
    var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

    var isConstructorModern = function isConstructor(argument) {
      if (!isCallable(argument)) return false;
      try {
        construct(noop, empty, argument);
        return true;
      } catch (error) {
        return false;
      }
    };

    var isConstructorLegacy = function isConstructor(argument) {
      if (!isCallable(argument)) return false;
      switch (classof(argument)) {
        case "AsyncFunction":
        case "GeneratorFunction":
        case "AsyncGeneratorFunction":
          return false;
      }
      try {
        // we can't check .prototype since constructors produced by .bind haven't it
        // `Function#toString` throws on some built-it function in some legacy engines
        // (for example, `DOMQuad` and similar in FF41-)
        return (
          INCORRECT_TO_STRING ||
          !!exec$1(constructorRegExp, inspectSource(argument))
        );
      } catch (error) {
        return true;
      }
    };

    isConstructorLegacy.sham = true;

    // `IsConstructor` abstract operation
    // https://tc39.es/ecma262/#sec-isconstructor
    var isConstructor =
      !construct ||
      fails(function () {
        var called;
        return (
          isConstructorModern(isConstructorModern.call) ||
          !isConstructorModern(Object) ||
          !isConstructorModern(function () {
            called = true;
          }) ||
          called
        );
      })
        ? isConstructorLegacy
        : isConstructorModern;

    var SPECIES$1 = wellKnownSymbol("species");
    var $Array$1 = Array;

    // a part of `ArraySpeciesCreate` abstract operation
    // https://tc39.es/ecma262/#sec-arrayspeciescreate
    var arraySpeciesConstructor = function (originalArray) {
      var C;
      if (isArray(originalArray)) {
        C = originalArray.constructor;
        // cross-realm fallback
        if (isConstructor(C) && (C === $Array$1 || isArray(C.prototype)))
          C = undefined;
        else if (isObject(C)) {
          C = C[SPECIES$1];
          if (C === null) C = undefined;
        }
      }
      return C === undefined ? $Array$1 : C;
    };

    // `ArraySpeciesCreate` abstract operation
    // https://tc39.es/ecma262/#sec-arrayspeciescreate
    var arraySpeciesCreate = function (originalArray, length) {
      return new (arraySpeciesConstructor(originalArray))(
        length === 0 ? 0 : length
      );
    };

    var SPECIES = wellKnownSymbol("species");

    var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
      // We can't use this feature detection in V8 since it causes
      // deoptimization and serious performance degradation
      // https://github.com/zloirock/core-js/issues/677
      return (
        engineV8Version >= 51 ||
        !fails(function () {
          var array = [];
          var constructor = (array.constructor = {});
          constructor[SPECIES] = function () {
            return { foo: 1 };
          };
          return array[METHOD_NAME](Boolean).foo !== 1;
        })
      );
    };

    var IS_CONCAT_SPREADABLE = wellKnownSymbol("isConcatSpreadable");

    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/679
    var IS_CONCAT_SPREADABLE_SUPPORT =
      engineV8Version >= 51 ||
      !fails(function () {
        var array = [];
        array[IS_CONCAT_SPREADABLE] = false;
        return array.concat()[0] !== array;
      });

    var isConcatSpreadable = function (O) {
      if (!isObject(O)) return false;
      var spreadable = O[IS_CONCAT_SPREADABLE];
      return spreadable !== undefined ? !!spreadable : isArray(O);
    };

    var FORCED$1 =
      !IS_CONCAT_SPREADABLE_SUPPORT || !arrayMethodHasSpeciesSupport("concat");

    // `Array.prototype.concat` method
    // https://tc39.es/ecma262/#sec-array.prototype.concat
    // with adding support of @@isConcatSpreadable and @@species
    _export(
      { target: "Array", proto: true, arity: 1, forced: FORCED$1 },
      {
        // eslint-disable-next-line no-unused-vars -- required for `.length`
        concat: function concat(arg) {
          var O = toObject(this);
          var A = arraySpeciesCreate(O, 0);
          var n = 0;
          var i, k, length, len, E;
          for (i = -1, length = arguments.length; i < length; i++) {
            E = i === -1 ? O : arguments[i];
            if (isConcatSpreadable(E)) {
              len = lengthOfArrayLike(E);
              doesNotExceedSafeInteger(n + len);
              for (k = 0; k < len; k++, n++)
                if (k in E) createProperty(A, n, E[k]);
            } else {
              doesNotExceedSafeInteger(n + 1);
              createProperty(A, n++, E);
            }
          }
          A.length = n;
          return A;
        },
      }
    );

    // `Object.prototype.toString` method implementation
    // https://tc39.es/ecma262/#sec-object.prototype.tostring
    var objectToString = toStringTagSupport
      ? {}.toString
      : function toString() {
          return "[object " + classof(this) + "]";
        };

    // `Object.prototype.toString` method
    // https://tc39.es/ecma262/#sec-object.prototype.tostring
    if (!toStringTagSupport) {
      defineBuiltIn(Object.prototype, "toString", objectToString, {
        unsafe: true,
      });
    }

    var $String$2 = String;

    var toString_1 = function (argument) {
      if (classof(argument) === "Symbol")
        throw TypeError("Cannot convert a Symbol value to a string");
      return $String$2(argument);
    };

    // `Object.keys` method
    // https://tc39.es/ecma262/#sec-object.keys
    // eslint-disable-next-line es/no-object-keys -- safe
    var objectKeys =
      Object.keys ||
      function keys(O) {
        return objectKeysInternal(O, enumBugKeys);
      };

    // `Object.defineProperties` method
    // https://tc39.es/ecma262/#sec-object.defineproperties
    // eslint-disable-next-line es/no-object-defineproperties -- safe
    var f$2 =
      descriptors && !v8PrototypeDefineBug
        ? Object.defineProperties
        : function defineProperties(O, Properties) {
            anObject(O);
            var props = toIndexedObject(Properties);
            var keys = objectKeys(Properties);
            var length = keys.length;
            var index = 0;
            var key;
            while (length > index)
              objectDefineProperty.f(O, (key = keys[index++]), props[key]);
            return O;
          };

    var objectDefineProperties = {
      f: f$2,
    };

    var html = getBuiltIn("document", "documentElement");

    /* global ActiveXObject -- old IE, WSH */

    var GT = ">";
    var LT = "<";
    var PROTOTYPE$1 = "prototype";
    var SCRIPT = "script";
    var IE_PROTO$1 = sharedKey("IE_PROTO");

    var EmptyConstructor = function () {
      /* empty */
    };

    var scriptTag = function (content) {
      return LT + SCRIPT + GT + content + LT + "/" + SCRIPT + GT;
    };

    // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
    var NullProtoObjectViaActiveX = function (activeXDocument) {
      activeXDocument.write(scriptTag(""));
      activeXDocument.close();
      var temp = activeXDocument.parentWindow.Object;
      activeXDocument = null; // avoid memory leak
      return temp;
    };

    // Create object with fake `null` prototype: use iframe Object with cleared prototype
    var NullProtoObjectViaIFrame = function () {
      // Thrash, waste and sodomy: IE GC bug
      var iframe = documentCreateElement("iframe");
      var JS = "java" + SCRIPT + ":";
      var iframeDocument;
      iframe.style.display = "none";
      html.appendChild(iframe);
      // https://github.com/zloirock/core-js/issues/475
      iframe.src = String(JS);
      iframeDocument = iframe.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(scriptTag("document.F=Object"));
      iframeDocument.close();
      return iframeDocument.F;
    };

    // Check for document.domain and active x support
    // No need to use active x approach when document.domain is not set
    // see https://github.com/es-shims/es5-shim/issues/150
    // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
    // avoid IE GC bug
    var activeXDocument;
    var NullProtoObject = function () {
      try {
        activeXDocument = new ActiveXObject("htmlfile");
      } catch (error) {
        /* ignore */
      }
      NullProtoObject =
        typeof document != "undefined"
          ? document.domain && activeXDocument
            ? NullProtoObjectViaActiveX(activeXDocument) // old IE
            : NullProtoObjectViaIFrame()
          : NullProtoObjectViaActiveX(activeXDocument); // WSH
      var length = enumBugKeys.length;
      while (length--) delete NullProtoObject[PROTOTYPE$1][enumBugKeys[length]];
      return NullProtoObject();
    };

    hiddenKeys$1[IE_PROTO$1] = true;

    // `Object.create` method
    // https://tc39.es/ecma262/#sec-object.create
    // eslint-disable-next-line es/no-object-create -- safe
    var objectCreate =
      Object.create ||
      function create(O, Properties) {
        var result;
        if (O !== null) {
          EmptyConstructor[PROTOTYPE$1] = anObject(O);
          result = new EmptyConstructor();
          EmptyConstructor[PROTOTYPE$1] = null;
          // add "__proto__" for Object.getPrototypeOf polyfill
          result[IE_PROTO$1] = O;
        } else result = NullProtoObject();
        return Properties === undefined
          ? result
          : objectDefineProperties.f(result, Properties);
      };

    var $Array = Array;
    var max = Math.max;

    var arraySliceSimple = function (O, start, end) {
      var length = lengthOfArrayLike(O);
      var k = toAbsoluteIndex(start, length);
      var fin = toAbsoluteIndex(end === undefined ? length : end, length);
      var result = $Array(max(fin - k, 0));
      for (var n = 0; k < fin; k++, n++) createProperty(result, n, O[k]);
      result.length = n;
      return result;
    };

    /* eslint-disable es/no-object-getownpropertynames -- safe */

    var $getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;

    var windowNames =
      typeof window == "object" && window && Object.getOwnPropertyNames
        ? Object.getOwnPropertyNames(window)
        : [];

    var getWindowNames = function (it) {
      try {
        return $getOwnPropertyNames$1(it);
      } catch (error) {
        return arraySliceSimple(windowNames);
      }
    };

    // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
    var f$1 = function getOwnPropertyNames(it) {
      return windowNames && classofRaw(it) == "Window"
        ? getWindowNames(it)
        : $getOwnPropertyNames$1(toIndexedObject(it));
    };

    var objectGetOwnPropertyNamesExternal = {
      f: f$1,
    };

    var defineBuiltInAccessor = function (target, name, descriptor) {
      if (descriptor.get) makeBuiltIn_1(descriptor.get, name, { getter: true });
      if (descriptor.set) makeBuiltIn_1(descriptor.set, name, { setter: true });
      return objectDefineProperty.f(target, name, descriptor);
    };

    var f = wellKnownSymbol;

    var wellKnownSymbolWrapped = {
      f: f,
    };

    var path = global_1;

    var defineProperty$3 = objectDefineProperty.f;

    var wellKnownSymbolDefine = function (NAME) {
      var Symbol = path.Symbol || (path.Symbol = {});
      if (!hasOwnProperty_1(Symbol, NAME))
        // defineProperty$3(Symbol, NAME, {
        //   value: wellKnownSymbolWrapped.f(NAME),
        // });
        Object.defineProperty(Symbol, NAME, wellKnownSymbolWrapped.f(NAME))
    };

    var symbolDefineToPrimitive = function () {
      var Symbol = getBuiltIn("Symbol");
      var SymbolPrototype = Symbol && Symbol.prototype;
      var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
      var TO_PRIMITIVE = wellKnownSymbol("toPrimitive");

      if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
        // `Symbol.prototype[@@toPrimitive]` method
        // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
        // eslint-disable-next-line no-unused-vars -- required for .length
        defineBuiltIn(
          SymbolPrototype,
          TO_PRIMITIVE,
          function (hint) {
            return functionCall(valueOf, this);
          },
          { arity: 1 }
        );
      }
    };

    var defineProperty$2 = objectDefineProperty.f;

    var TO_STRING_TAG$1 = wellKnownSymbol("toStringTag");

    var setToStringTag = function (target, TAG, STATIC) {
      if (target && !STATIC) target = target.prototype;
      if (target && !hasOwnProperty_1(target, TO_STRING_TAG$1)) {
        defineProperty$2(target, TO_STRING_TAG$1, {
          configurable: true,
          value: TAG,
        });
      }
    };

    var functionUncurryThisClause = function (fn) {
      // Nashorn bug:
      //   https://github.com/zloirock/core-js/issues/1128
      //   https://github.com/zloirock/core-js/issues/1130
      if (classofRaw(fn) === "Function") return functionUncurryThis(fn);
    };

    var bind = functionUncurryThisClause(functionUncurryThisClause.bind);

    // optional / simple context binding
    var functionBindContext = function (fn, that) {
      aCallable(fn);
      return that === undefined
        ? fn
        : functionBindNative
        ? bind(fn, that)
        : function (/* ...args */) {
            return fn.apply(that, arguments);
          };
    };

    var push$2 = functionUncurryThis([].push);

    // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
    var createMethod = function (TYPE) {
      var IS_MAP = TYPE == 1;
      var IS_FILTER = TYPE == 2;
      var IS_SOME = TYPE == 3;
      var IS_EVERY = TYPE == 4;
      var IS_FIND_INDEX = TYPE == 6;
      var IS_FILTER_REJECT = TYPE == 7;
      var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
      return function ($this, callbackfn, that, specificCreate) {
        var O = toObject($this);
        var self = indexedObject(O);
        var boundFunction = functionBindContext(callbackfn, that);
        var length = lengthOfArrayLike(self);
        var index = 0;
        var create = specificCreate || arraySpeciesCreate;
        var target = IS_MAP
          ? create($this, length)
          : IS_FILTER || IS_FILTER_REJECT
          ? create($this, 0)
          : undefined;
        var value, result;
        for (; length > index; index++)
          if (NO_HOLES || index in self) {
            value = self[index];
            result = boundFunction(value, index, O);
            if (TYPE) {
              if (IS_MAP) target[index] = result; // map
              else if (result)
                switch (TYPE) {
                  case 3:
                    return true; // some
                  case 5:
                    return value; // find
                  case 6:
                    return index; // findIndex
                  case 2:
                    push$2(target, value); // filter
                }
              else
                switch (TYPE) {
                  case 4:
                    return false; // every
                  case 7:
                    push$2(target, value); // filterReject
                }
            }
          }
        return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
      };
    };

    var arrayIteration = {
      // `Array.prototype.forEach` method
      // https://tc39.es/ecma262/#sec-array.prototype.foreach
      forEach: createMethod(0),
      // `Array.prototype.map` method
      // https://tc39.es/ecma262/#sec-array.prototype.map
      map: createMethod(1),
      // `Array.prototype.filter` method
      // https://tc39.es/ecma262/#sec-array.prototype.filter
      filter: createMethod(2),
      // `Array.prototype.some` method
      // https://tc39.es/ecma262/#sec-array.prototype.some
      some: createMethod(3),
      // `Array.prototype.every` method
      // https://tc39.es/ecma262/#sec-array.prototype.every
      every: createMethod(4),
      // `Array.prototype.find` method
      // https://tc39.es/ecma262/#sec-array.prototype.find
      find: createMethod(5),
      // `Array.prototype.findIndex` method
      // https://tc39.es/ecma262/#sec-array.prototype.findIndex
      findIndex: createMethod(6),
      // `Array.prototype.filterReject` method
      // https://github.com/tc39/proposal-array-filtering
      filterReject: createMethod(7),
    };

    var $forEach = arrayIteration.forEach;

    var HIDDEN = sharedKey("hidden");
    var SYMBOL = "Symbol";
    var PROTOTYPE = "prototype";

    var setInternalState$1 = internalState.set;
    var getInternalState$1 = internalState.getterFor(SYMBOL);

    var ObjectPrototype$1 = Object[PROTOTYPE];
    var $Symbol = global_1.Symbol;
    var SymbolPrototype$1 = $Symbol && $Symbol[PROTOTYPE];
    var TypeError$1 = global_1.TypeError;
    var QObject = global_1.QObject;
    var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    var nativeDefineProperty = objectDefineProperty.f;
    var nativeGetOwnPropertyNames = objectGetOwnPropertyNamesExternal.f;
    var nativePropertyIsEnumerable = objectPropertyIsEnumerable.f;
    var push$1 = functionUncurryThis([].push);

    var AllSymbols = shared("symbols");
    var ObjectPrototypeSymbols = shared("op-symbols");
    var WellKnownSymbolsStore$1 = shared("wks");

    // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
    var USE_SETTER =
      !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

    // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
    var setSymbolDescriptor =
      descriptors &&
      fails(function () {
        return (
          objectCreate(
            nativeDefineProperty({}, "a", {
              get: function () {
                return nativeDefineProperty(this, "a", { value: 7 }).a;
              },
            })
          ).a != 7
        );
      })
        ? function (O, P, Attributes) {
            var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(
              ObjectPrototype$1,
              P
            );
            if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[P];
            nativeDefineProperty(O, P, Attributes);
            if (ObjectPrototypeDescriptor && O !== ObjectPrototype$1) {
              nativeDefineProperty(
                ObjectPrototype$1,
                P,
                ObjectPrototypeDescriptor
              );
            }
          }
        : nativeDefineProperty;

    var wrap = function (tag, description) {
      var symbol = (AllSymbols[tag] = objectCreate(SymbolPrototype$1));
      setInternalState$1(symbol, {
        type: SYMBOL,
        tag: tag,
        description: description,
      });
      if (!descriptors) symbol.description = description;
      return symbol;
    };

    var $defineProperty = function defineProperty(O, P, Attributes) {
      if (O === ObjectPrototype$1)
        $defineProperty(ObjectPrototypeSymbols, P, Attributes);
      anObject(O);
      var key = toPropertyKey(P);
      anObject(Attributes);
      if (hasOwnProperty_1(AllSymbols, key)) {
        if (!Attributes.enumerable) {
          if (!hasOwnProperty_1(O, HIDDEN))
            nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
          O[HIDDEN][key] = true;
        } else {
          if (hasOwnProperty_1(O, HIDDEN) && O[HIDDEN][key])
            O[HIDDEN][key] = false;
          Attributes = objectCreate(Attributes, {
            enumerable: createPropertyDescriptor(0, false),
          });
        }
        return setSymbolDescriptor(O, key, Attributes);
      }
      return nativeDefineProperty(O, key, Attributes);
    };

    var $defineProperties = function defineProperties(O, Properties) {
      anObject(O);
      var properties = toIndexedObject(Properties);
      var keys = objectKeys(properties).concat(
        $getOwnPropertySymbols(properties)
      );
      $forEach(keys, function (key) {
        if (
          !descriptors ||
          functionCall($propertyIsEnumerable, properties, key)
        )
          $defineProperty(O, key, properties[key]);
      });
      return O;
    };

    var $create = function create(O, Properties) {
      return Properties === undefined
        ? objectCreate(O)
        : $defineProperties(objectCreate(O), Properties);
    };

    var $propertyIsEnumerable = function propertyIsEnumerable(V) {
      var P = toPropertyKey(V);
      var enumerable = functionCall(nativePropertyIsEnumerable, this, P);
      if (
        this === ObjectPrototype$1 &&
        hasOwnProperty_1(AllSymbols, P) &&
        !hasOwnProperty_1(ObjectPrototypeSymbols, P)
      )
        return false;
      return enumerable ||
        !hasOwnProperty_1(this, P) ||
        !hasOwnProperty_1(AllSymbols, P) ||
        (hasOwnProperty_1(this, HIDDEN) && this[HIDDEN][P])
        ? enumerable
        : true;
    };

    var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
      var it = toIndexedObject(O);
      var key = toPropertyKey(P);
      if (
        it === ObjectPrototype$1 &&
        hasOwnProperty_1(AllSymbols, key) &&
        !hasOwnProperty_1(ObjectPrototypeSymbols, key)
      )
        return;
      var descriptor = nativeGetOwnPropertyDescriptor(it, key);
      if (
        descriptor &&
        hasOwnProperty_1(AllSymbols, key) &&
        !(hasOwnProperty_1(it, HIDDEN) && it[HIDDEN][key])
      ) {
        descriptor.enumerable = true;
      }
      return descriptor;
    };

    var $getOwnPropertyNames = function getOwnPropertyNames(O) {
      var names = nativeGetOwnPropertyNames(toIndexedObject(O));
      var result = [];
      $forEach(names, function (key) {
        if (
          !hasOwnProperty_1(AllSymbols, key) &&
          !hasOwnProperty_1(hiddenKeys$1, key)
        )
          push$1(result, key);
      });
      return result;
    };

    var $getOwnPropertySymbols = function (O) {
      var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$1;
      var names = nativeGetOwnPropertyNames(
        IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O)
      );
      var result = [];
      $forEach(names, function (key) {
        if (
          hasOwnProperty_1(AllSymbols, key) &&
          (!IS_OBJECT_PROTOTYPE || hasOwnProperty_1(ObjectPrototype$1, key))
        ) {
          push$1(result, AllSymbols[key]);
        }
      });
      return result;
    };

    // `Symbol` constructor
    // https://tc39.es/ecma262/#sec-symbol-constructor
    if (!symbolConstructorDetection) {
      $Symbol = function Symbol() {
        if (objectIsPrototypeOf(SymbolPrototype$1, this))
          throw TypeError$1("Symbol is not a constructor");
        var description =
          !arguments.length || arguments[0] === undefined
            ? undefined
            : toString_1(arguments[0]);
        var tag = uid(description);
        var setter = function (value) {
          if (this === ObjectPrototype$1)
            functionCall(setter, ObjectPrototypeSymbols, value);
          if (
            hasOwnProperty_1(this, HIDDEN) &&
            hasOwnProperty_1(this[HIDDEN], tag)
          )
            this[HIDDEN][tag] = false;
          setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
        };
        if (descriptors && USE_SETTER)
          setSymbolDescriptor(ObjectPrototype$1, tag, {
            configurable: true,
            set: setter,
          });
        return wrap(tag, description);
      };

      SymbolPrototype$1 = $Symbol[PROTOTYPE];

      defineBuiltIn(SymbolPrototype$1, "toString", function toString() {
        return getInternalState$1(this).tag;
      });

      defineBuiltIn($Symbol, "withoutSetter", function (description) {
        return wrap(uid(description), description);
      });

      objectPropertyIsEnumerable.f = $propertyIsEnumerable;
      objectDefineProperty.f = $defineProperty;
      objectDefineProperties.f = $defineProperties;
      objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
      objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f =
        $getOwnPropertyNames;
      objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

      wellKnownSymbolWrapped.f = function (name) {
        return wrap(wellKnownSymbol(name), name);
      };

      if (descriptors) {
        // https://github.com/tc39/proposal-Symbol-description
        defineBuiltInAccessor(SymbolPrototype$1, "description", {
          configurable: true,
          get: function description() {
            return getInternalState$1(this).description;
          },
        });
        {
          defineBuiltIn(
            ObjectPrototype$1,
            "propertyIsEnumerable",
            $propertyIsEnumerable,
            { unsafe: true }
          );
        }
      }
    }

    _export(
      {
        global: true,
        constructor: true,
        wrap: true,
        forced: !symbolConstructorDetection,
        sham: !symbolConstructorDetection,
      },
      {
        Symbol: $Symbol,
      }
    );

    $forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
      wellKnownSymbolDefine(name);
    });

    _export(
      { target: SYMBOL, stat: true, forced: !symbolConstructorDetection },
      {
        useSetter: function () {
          USE_SETTER = true;
        },
        useSimple: function () {
          USE_SETTER = false;
        },
      }
    );

    _export(
      {
        target: "Object",
        stat: true,
        forced: !symbolConstructorDetection,
        sham: !descriptors,
      },
      {
        // `Object.create` method
        // https://tc39.es/ecma262/#sec-object.create
        create: $create,
        // `Object.defineProperty` method
        // https://tc39.es/ecma262/#sec-object.defineproperty
        defineProperty: $defineProperty,
        // `Object.defineProperties` method
        // https://tc39.es/ecma262/#sec-object.defineproperties
        defineProperties: $defineProperties,
        // `Object.getOwnPropertyDescriptor` method
        // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
        getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
      }
    );

    _export(
      { target: "Object", stat: true, forced: !symbolConstructorDetection },
      {
        // `Object.getOwnPropertyNames` method
        // https://tc39.es/ecma262/#sec-object.getownpropertynames
        getOwnPropertyNames: $getOwnPropertyNames,
      }
    );

    // `Symbol.prototype[@@toPrimitive]` method
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
    symbolDefineToPrimitive();

    // `Symbol.prototype[@@toStringTag]` property
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
    setToStringTag($Symbol, SYMBOL);

    hiddenKeys$1[HIDDEN] = true;

    /* eslint-disable es/no-symbol -- safe */
    var symbolRegistryDetection =
      symbolConstructorDetection && !!Symbol["for"] && !!Symbol.keyFor;

    var StringToSymbolRegistry = shared("string-to-symbol-registry");
    var SymbolToStringRegistry$1 = shared("symbol-to-string-registry");

    // `Symbol.for` method
    // https://tc39.es/ecma262/#sec-symbol.for
    _export(
      { target: "Symbol", stat: true, forced: !symbolRegistryDetection },
      {
        for: function (key) {
          var string = toString_1(key);
          if (hasOwnProperty_1(StringToSymbolRegistry, string))
            return StringToSymbolRegistry[string];
          var symbol = getBuiltIn("Symbol")(string);
          StringToSymbolRegistry[string] = symbol;
          SymbolToStringRegistry$1[symbol] = string;
          return symbol;
        },
      }
    );

    var SymbolToStringRegistry = shared("symbol-to-string-registry");

    // `Symbol.keyFor` method
    // https://tc39.es/ecma262/#sec-symbol.keyfor
    _export(
      { target: "Symbol", stat: true, forced: !symbolRegistryDetection },
      {
        keyFor: function keyFor(sym) {
          if (!isSymbol(sym))
            throw TypeError(tryToString(sym) + " is not a symbol");
          if (hasOwnProperty_1(SymbolToStringRegistry, sym))
            return SymbolToStringRegistry[sym];
        },
      }
    );

    var FunctionPrototype = Function.prototype;
    var apply = FunctionPrototype.apply;
    var call = FunctionPrototype.call;

    // eslint-disable-next-line es/no-reflect -- safe
    var functionApply =
      (typeof Reflect == "object" && Reflect.apply) ||
      (functionBindNative
        ? call.bind(apply)
        : function () {
            return call.apply(apply, arguments);
          });

    var arraySlice = functionUncurryThis([].slice);

    var push = functionUncurryThis([].push);

    var getJsonReplacerFunction = function (replacer) {
      if (isCallable(replacer)) return replacer;
      if (!isArray(replacer)) return;
      var rawLength = replacer.length;
      var keys = [];
      for (var i = 0; i < rawLength; i++) {
        var element = replacer[i];
        if (typeof element == "string") push(keys, element);
        else if (
          typeof element == "number" ||
          classofRaw(element) == "Number" ||
          classofRaw(element) == "String"
        )
          push(keys, toString_1(element));
      }
      var keysLength = keys.length;
      var root = true;
      return function (key, value) {
        if (root) {
          root = false;
          return value;
        }
        if (isArray(this)) return value;
        for (var j = 0; j < keysLength; j++) if (keys[j] === key) return value;
      };
    };

    var $String$1 = String;
    var $stringify = getBuiltIn("JSON", "stringify");
    var exec = functionUncurryThis(/./.exec);
    var charAt = functionUncurryThis("".charAt);
    var charCodeAt = functionUncurryThis("".charCodeAt);
    var replace$1 = functionUncurryThis("".replace);
    var numberToString = functionUncurryThis((1.0).toString);

    var tester = /[\uD800-\uDFFF]/g;
    var low = /^[\uD800-\uDBFF]$/;
    var hi = /^[\uDC00-\uDFFF]$/;

    var WRONG_SYMBOLS_CONVERSION =
      !symbolConstructorDetection ||
      fails(function () {
        var symbol = getBuiltIn("Symbol")();
        // MS Edge converts symbol values to JSON as {}
        return (
          $stringify([symbol]) != "[null]" ||
          // WebKit converts symbol values to JSON as null
          $stringify({ a: symbol }) != "{}" ||
          // V8 throws on boxed symbols
          $stringify(Object(symbol)) != "{}"
        );
      });

    // https://github.com/tc39/proposal-well-formed-stringify
    var ILL_FORMED_UNICODE = fails(function () {
      return (
        $stringify("\uDF06\uD834") !== '"\\udf06\\ud834"' ||
        $stringify("\uDEAD") !== '"\\udead"'
      );
    });

    var stringifyWithSymbolsFix = function (it, replacer) {
      var args = arraySlice(arguments);
      var $replacer = getJsonReplacerFunction(replacer);
      if (!isCallable($replacer) && (it === undefined || isSymbol(it))) return; // IE8 returns string on undefined
      args[1] = function (key, value) {
        // some old implementations (like WebKit) could pass numbers as keys
        if (isCallable($replacer))
          value = functionCall($replacer, this, $String$1(key), value);
        if (!isSymbol(value)) return value;
      };
      return functionApply($stringify, null, args);
    };

    var fixIllFormed = function (match, offset, string) {
      var prev = charAt(string, offset - 1);
      var next = charAt(string, offset + 1);
      if (
        (exec(low, match) && !exec(hi, next)) ||
        (exec(hi, match) && !exec(low, prev))
      ) {
        return "\\u" + numberToString(charCodeAt(match, 0), 16);
      }
      return match;
    };

    if ($stringify) {
      // `JSON.stringify` method
      // https://tc39.es/ecma262/#sec-json.stringify
      _export(
        {
          target: "JSON",
          stat: true,
          arity: 3,
          forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE,
        },
        {
          // eslint-disable-next-line no-unused-vars -- required for `.length`
          stringify: function stringify(it, replacer, space) {
            var args = arraySlice(arguments);
            var result = functionApply(
              WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify,
              null,
              args
            );
            return ILL_FORMED_UNICODE && typeof result == "string"
              ? replace$1(result, tester, fixIllFormed)
              : result;
          },
        }
      );
    }

    // V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
    // https://bugs.chromium.org/p/v8/issues/detail?id=3443
    var FORCED =
      !symbolConstructorDetection ||
      fails(function () {
        objectGetOwnPropertySymbols.f(1);
      });

    // `Object.getOwnPropertySymbols` method
    // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
    _export(
      { target: "Object", stat: true, forced: FORCED },
      {
        getOwnPropertySymbols: function getOwnPropertySymbols(it) {
          var $getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
          return $getOwnPropertySymbols
            ? $getOwnPropertySymbols(toObject(it))
            : [];
        },
      }
    );

    // `Symbol.asyncIterator` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.asynciterator
    wellKnownSymbolDefine("asyncIterator");

    var NativeSymbol = global_1.Symbol;
    var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

    if (
      descriptors &&
      isCallable(NativeSymbol) &&
      (!("description" in SymbolPrototype) ||
        // Safari 12 bug
        NativeSymbol().description !== undefined)
    ) {
      var EmptyStringDescriptionStore = {};
      // wrap Symbol constructor for correct work with undefined description
      var SymbolWrapper = function Symbol() {
        var description =
          arguments.length < 1 || arguments[0] === undefined
            ? undefined
            : toString_1(arguments[0]);
        var result = objectIsPrototypeOf(SymbolPrototype, this)
          ? new NativeSymbol(description)
          : // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
          description === undefined
          ? NativeSymbol()
          : NativeSymbol(description);
        if (description === "") EmptyStringDescriptionStore[result] = true;
        return result;
      };

      copyConstructorProperties(SymbolWrapper, NativeSymbol);
      SymbolWrapper.prototype = SymbolPrototype;
      SymbolPrototype.constructor = SymbolWrapper;

      var NATIVE_SYMBOL = String(NativeSymbol("test")) == "Symbol(test)";
      var thisSymbolValue$2 = functionUncurryThis(SymbolPrototype.valueOf);
      var symbolDescriptiveString = functionUncurryThis(
        SymbolPrototype.toString
      );
      var regexp = /^Symbol\((.*)\)[^)]+$/;
      var replace = functionUncurryThis("".replace);
      var stringSlice = functionUncurryThis("".slice);

      defineBuiltInAccessor(SymbolPrototype, "description", {
        configurable: true,
        get: function description() {
          var symbol = thisSymbolValue$2(this);
          if (hasOwnProperty_1(EmptyStringDescriptionStore, symbol)) return "";
          var string = symbolDescriptiveString(symbol);
          var desc = NATIVE_SYMBOL
            ? stringSlice(string, 7, -1)
            : replace(string, regexp, "$1");
          return desc === "" ? undefined : desc;
        },
      });

      _export(
        { global: true, constructor: true, forced: true },
        {
          Symbol: SymbolWrapper,
        }
      );
    }

    // `Symbol.hasInstance` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.hasinstance
    wellKnownSymbolDefine("hasInstance");

    // `Symbol.isConcatSpreadable` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.isconcatspreadable
    wellKnownSymbolDefine("isConcatSpreadable");

    // `Symbol.iterator` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.iterator
    wellKnownSymbolDefine("iterator");

    // `Symbol.match` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.match
    wellKnownSymbolDefine("match");

    // `Symbol.matchAll` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.matchall
    wellKnownSymbolDefine("matchAll");

    // `Symbol.replace` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.replace
    wellKnownSymbolDefine("replace");

    // `Symbol.search` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.search
    wellKnownSymbolDefine("search");

    // `Symbol.species` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.species
    wellKnownSymbolDefine("species");

    // `Symbol.split` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.split
    wellKnownSymbolDefine("split");

    // `Symbol.toPrimitive` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.toprimitive
    wellKnownSymbolDefine("toPrimitive");

    // `Symbol.prototype[@@toPrimitive]` method
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
    symbolDefineToPrimitive();

    // `Symbol.toStringTag` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.tostringtag
    wellKnownSymbolDefine("toStringTag");

    // `Symbol.prototype[@@toStringTag]` property
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
    setToStringTag(getBuiltIn("Symbol"), "Symbol");

    // `Symbol.unscopables` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.unscopables
    wellKnownSymbolDefine("unscopables");

    // JSON[@@toStringTag] property
    // https://tc39.es/ecma262/#sec-json-@@tostringtag
    setToStringTag(global_1.JSON, "JSON", true);

    // Math[@@toStringTag] property
    // https://tc39.es/ecma262/#sec-math-@@tostringtag
    setToStringTag(Math, "Math", true);

    _export({ global: true }, { Reflect: {} });

    // Reflect[@@toStringTag] property
    // https://tc39.es/ecma262/#sec-reflect-@@tostringtag
    setToStringTag(global_1.Reflect, "Reflect", true);

    path.Symbol;

    // iterable DOM collections
    // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
    var domIterables = {
      CSSRuleList: 0,
      CSSStyleDeclaration: 0,
      CSSValueList: 0,
      ClientRectList: 0,
      DOMRectList: 0,
      DOMStringList: 0,
      DOMTokenList: 1,
      DataTransferItemList: 0,
      FileList: 0,
      HTMLAllCollection: 0,
      HTMLCollection: 0,
      HTMLFormElement: 0,
      HTMLSelectElement: 0,
      MediaList: 0,
      MimeTypeArray: 0,
      NamedNodeMap: 0,
      NodeList: 1,
      PaintRequestList: 0,
      Plugin: 0,
      PluginArray: 0,
      SVGLengthList: 0,
      SVGNumberList: 0,
      SVGPathSegList: 0,
      SVGPointList: 0,
      SVGStringList: 0,
      SVGTransformList: 0,
      SourceBufferList: 0,
      StyleSheetList: 0,
      TextTrackCueList: 0,
      TextTrackList: 0,
      TouchList: 0,
    };

    // in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`

    var classList = documentCreateElement("span").classList;
    var DOMTokenListPrototype =
      classList && classList.constructor && classList.constructor.prototype;

    var domTokenListPrototype =
      DOMTokenListPrototype === Object.prototype
        ? undefined
        : DOMTokenListPrototype;

    var defineProperty$1 = objectDefineProperty.f;

    var UNSCOPABLES = wellKnownSymbol("unscopables");
    var ArrayPrototype$1 = Array.prototype;

    // Array.prototype[@@unscopables]
    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
      defineProperty$1(ArrayPrototype$1, UNSCOPABLES, {
        configurable: true,
        value: objectCreate(null),
      });
    }

    // add a key to Array.prototype[@@unscopables]
    var addToUnscopables = function (key) {
      ArrayPrototype$1[UNSCOPABLES][key] = true;
    };

    var iterators = {};

    var correctPrototypeGetter = !fails(function () {
      function F() {
        /* empty */
      }
      F.prototype.constructor = null;
      // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
      return Object.getPrototypeOf(new F()) !== F.prototype;
    });

    var IE_PROTO = sharedKey("IE_PROTO");
    var $Object = Object;
    var ObjectPrototype = $Object.prototype;

    // `Object.getPrototypeOf` method
    // https://tc39.es/ecma262/#sec-object.getprototypeof
    // eslint-disable-next-line es/no-object-getprototypeof -- safe
    var objectGetPrototypeOf = correctPrototypeGetter
      ? $Object.getPrototypeOf
      : function (O) {
          var object = toObject(O);
          if (hasOwnProperty_1(object, IE_PROTO)) return object[IE_PROTO];
          var constructor = object.constructor;
          if (isCallable(constructor) && object instanceof constructor) {
            return constructor.prototype;
          }
          return object instanceof $Object ? ObjectPrototype : null;
        };

    var ITERATOR$4 = wellKnownSymbol("iterator");
    var BUGGY_SAFARI_ITERATORS$1 = false;

    // `%IteratorPrototype%` object
    // https://tc39.es/ecma262/#sec-%iteratorprototype%-object
    var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

    /* eslint-disable es/no-array-prototype-keys -- safe */
    if ([].keys) {
      arrayIterator = [].keys();
      // Safari 8 has buggy iterators w/o `next`
      if (!("next" in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
      else {
        PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(
          objectGetPrototypeOf(arrayIterator)
        );
        if (PrototypeOfArrayIteratorPrototype !== Object.prototype)
          IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
      }
    }

    var NEW_ITERATOR_PROTOTYPE =
      !isObject(IteratorPrototype$2) ||
      fails(function () {
        var test = {};
        // FF44- legacy iterators case
        return IteratorPrototype$2[ITERATOR$4].call(test) !== test;
      });

    if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

    // `%IteratorPrototype%[@@iterator]()` method
    // https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
    if (!isCallable(IteratorPrototype$2[ITERATOR$4])) {
      defineBuiltIn(IteratorPrototype$2, ITERATOR$4, function () {
        return this;
      });
    }

    var iteratorsCore = {
      IteratorPrototype: IteratorPrototype$2,
      BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1,
    };

    var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;

    var returnThis$1 = function () {
      return this;
    };

    var iteratorCreateConstructor = function (
      IteratorConstructor,
      NAME,
      next,
      ENUMERABLE_NEXT
    ) {
      var TO_STRING_TAG = NAME + " Iterator";
      IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, {
        next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next),
      });
      setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
      iterators[TO_STRING_TAG] = returnThis$1;
      return IteratorConstructor;
    };

    var functionUncurryThisAccessor = function (object, key, method) {
      try {
        // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
        return functionUncurryThis(
          aCallable(Object.getOwnPropertyDescriptor(object, key)[method])
        );
      } catch (error) {
        /* empty */
      }
    };

    var $String = String;
    var $TypeError$2 = TypeError;

    var aPossiblePrototype = function (argument) {
      if (typeof argument == "object" || isCallable(argument)) return argument;
      throw $TypeError$2("Can't set " + $String(argument) + " as a prototype");
    };

    /* eslint-disable no-proto -- safe */

    // `Object.setPrototypeOf` method
    // https://tc39.es/ecma262/#sec-object.setprototypeof
    // Works with __proto__ only. Old v8 can't work with null proto objects.
    // eslint-disable-next-line es/no-object-setprototypeof -- safe
    var objectSetPrototypeOf =
      Object.setPrototypeOf ||
      ("__proto__" in {}
        ? (function () {
            var CORRECT_SETTER = false;
            var test = {};
            var setter;
            try {
              setter = functionUncurryThisAccessor(
                Object.prototype,
                "__proto__",
                "set"
              );
              setter(test, []);
              CORRECT_SETTER = test instanceof Array;
            } catch (error) {
              /* empty */
            }
            return function setPrototypeOf(O, proto) {
              anObject(O);
              aPossiblePrototype(proto);
              if (CORRECT_SETTER) setter(O, proto);
              else O.__proto__ = proto;
              return O;
            };
          })()
        : undefined);

    var PROPER_FUNCTION_NAME = functionName.PROPER;
    var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
    var IteratorPrototype = iteratorsCore.IteratorPrototype;
    var BUGGY_SAFARI_ITERATORS = iteratorsCore.BUGGY_SAFARI_ITERATORS;
    var ITERATOR$3 = wellKnownSymbol("iterator");
    var KEYS = "keys";
    var VALUES = "values";
    var ENTRIES = "entries";

    var returnThis = function () {
      return this;
    };

    var iteratorDefine = function (
      Iterable,
      NAME,
      IteratorConstructor,
      next,
      DEFAULT,
      IS_SET,
      FORCED
    ) {
      iteratorCreateConstructor(IteratorConstructor, NAME, next);

      var getIterationMethod = function (KIND) {
        if (KIND === DEFAULT && defaultIterator) return defaultIterator;
        if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype)
          return IterablePrototype[KIND];
        switch (KIND) {
          case KEYS:
            return function keys() {
              return new IteratorConstructor(this, KIND);
            };
          case VALUES:
            return function values() {
              return new IteratorConstructor(this, KIND);
            };
          case ENTRIES:
            return function entries() {
              return new IteratorConstructor(this, KIND);
            };
        }
        return function () {
          return new IteratorConstructor(this);
        };
      };

      var TO_STRING_TAG = NAME + " Iterator";
      var INCORRECT_VALUES_NAME = false;
      var IterablePrototype = Iterable.prototype;
      var nativeIterator =
        IterablePrototype[ITERATOR$3] ||
        IterablePrototype["@@iterator"] ||
        (DEFAULT && IterablePrototype[DEFAULT]);
      var defaultIterator =
        (!BUGGY_SAFARI_ITERATORS && nativeIterator) ||
        getIterationMethod(DEFAULT);
      var anyNativeIterator =
        NAME == "Array"
          ? IterablePrototype.entries || nativeIterator
          : nativeIterator;
      var CurrentIteratorPrototype, methods, KEY;

      // fix native
      if (anyNativeIterator) {
        CurrentIteratorPrototype = objectGetPrototypeOf(
          anyNativeIterator.call(new Iterable())
        );
        if (
          CurrentIteratorPrototype !== Object.prototype &&
          CurrentIteratorPrototype.next
        ) {
          if (
            objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype
          ) {
            if (objectSetPrototypeOf) {
              objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
            } else if (!isCallable(CurrentIteratorPrototype[ITERATOR$3])) {
              defineBuiltIn(CurrentIteratorPrototype, ITERATOR$3, returnThis);
            }
          }
          // Set @@toStringTag to native iterators
          setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
        }
      }

      // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
      if (
        PROPER_FUNCTION_NAME &&
        DEFAULT == VALUES &&
        nativeIterator &&
        nativeIterator.name !== VALUES
      ) {
        if (CONFIGURABLE_FUNCTION_NAME) {
          createNonEnumerableProperty(IterablePrototype, "name", VALUES);
        } else {
          INCORRECT_VALUES_NAME = true;
          defaultIterator = function values() {
            return functionCall(nativeIterator, this);
          };
        }
      }

      // export additional methods
      if (DEFAULT) {
        methods = {
          values: getIterationMethod(VALUES),
          keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
          entries: getIterationMethod(ENTRIES),
        };
        if (FORCED)
          for (KEY in methods) {
            if (
              BUGGY_SAFARI_ITERATORS ||
              INCORRECT_VALUES_NAME ||
              !(KEY in IterablePrototype)
            ) {
              defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
            }
          }
        else
          _export(
            {
              target: NAME,
              proto: true,
              forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME,
            },
            methods
          );
      }

      // define iterator
      if (IterablePrototype[ITERATOR$3] !== defaultIterator) {
        defineBuiltIn(IterablePrototype, ITERATOR$3, defaultIterator, {
          name: DEFAULT,
        });
      }
      iterators[NAME] = defaultIterator;

      return methods;
    };

    // `CreateIterResultObject` abstract operation
    // https://tc39.es/ecma262/#sec-createiterresultobject
    var createIterResultObject = function (value, done) {
      return { value: value, done: done };
    };

    var defineProperty = objectDefineProperty.f;

    var ARRAY_ITERATOR = "Array Iterator";
    var setInternalState = internalState.set;
    var getInternalState = internalState.getterFor(ARRAY_ITERATOR);

    // `Array.prototype.entries` method
    // https://tc39.es/ecma262/#sec-array.prototype.entries
    // `Array.prototype.keys` method
    // https://tc39.es/ecma262/#sec-array.prototype.keys
    // `Array.prototype.values` method
    // https://tc39.es/ecma262/#sec-array.prototype.values
    // `Array.prototype[@@iterator]` method
    // https://tc39.es/ecma262/#sec-array.prototype-@@iterator
    // `CreateArrayIterator` internal method
    // https://tc39.es/ecma262/#sec-createarrayiterator
    var es_array_iterator = iteratorDefine(
      Array,
      "Array",
      function (iterated, kind) {
        setInternalState(this, {
          type: ARRAY_ITERATOR,
          target: toIndexedObject(iterated), // target
          index: 0, // next index
          kind: kind, // kind
        });
        // `%ArrayIteratorPrototype%.next` method
        // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
      },
      function () {
        var state = getInternalState(this);
        var target = state.target;
        var kind = state.kind;
        var index = state.index++;
        if (!target || index >= target.length) {
          state.target = undefined;
          return createIterResultObject(undefined, true);
        }
        if (kind == "keys") return createIterResultObject(index, false);
        if (kind == "values")
          return createIterResultObject(target[index], false);
        return createIterResultObject([index, target[index]], false);
      },
      "values"
    );

    // argumentsList[@@iterator] is %ArrayProto_values%
    // https://tc39.es/ecma262/#sec-createunmappedargumentsobject
    // https://tc39.es/ecma262/#sec-createmappedargumentsobject
    var values = (iterators.Arguments = iterators.Array);

    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    addToUnscopables("keys");
    addToUnscopables("values");
    addToUnscopables("entries");

    // V8 ~ Chrome 45- bug
    if (descriptors && values.name !== "values")
      try {
        defineProperty(values, "name", { value: "values" });
      } catch (error) {
        /* empty */
      }

    var ITERATOR$2 = wellKnownSymbol("iterator");
    var TO_STRING_TAG = wellKnownSymbol("toStringTag");
    var ArrayValues = es_array_iterator.values;

    var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
      if (CollectionPrototype) {
        // some Chrome versions have non-configurable methods on DOMTokenList
        if (CollectionPrototype[ITERATOR$2] !== ArrayValues)
          try {
            createNonEnumerableProperty(
              CollectionPrototype,
              ITERATOR$2,
              ArrayValues
            );
          } catch (error) {
            CollectionPrototype[ITERATOR$2] = ArrayValues;
          }
        if (!CollectionPrototype[TO_STRING_TAG]) {
          createNonEnumerableProperty(
            CollectionPrototype,
            TO_STRING_TAG,
            COLLECTION_NAME
          );
        }
        if (domIterables[COLLECTION_NAME])
          for (var METHOD_NAME in es_array_iterator) {
            // some Chrome versions have non-configurable methods on DOMTokenList
            if (
              CollectionPrototype[METHOD_NAME] !==
              es_array_iterator[METHOD_NAME]
            )
              try {
                createNonEnumerableProperty(
                  CollectionPrototype,
                  METHOD_NAME,
                  es_array_iterator[METHOD_NAME]
                );
              } catch (error) {
                CollectionPrototype[METHOD_NAME] =
                  es_array_iterator[METHOD_NAME];
              }
          }
      }
    };

    for (var COLLECTION_NAME in domIterables) {
      handlePrototype(
        global_1[COLLECTION_NAME] && global_1[COLLECTION_NAME].prototype,
        COLLECTION_NAME
      );
    }

    handlePrototype(domTokenListPrototype, "DOMTokenList");

    // `Symbol.dispose` well-known symbol
    // https://github.com/tc39/proposal-explicit-resource-management
    wellKnownSymbolDefine("dispose");

    // `Symbol.asyncDispose` well-known symbol
    // https://github.com/tc39/proposal-async-explicit-resource-management
    wellKnownSymbolDefine("asyncDispose");

    var Symbol$2 = getBuiltIn("Symbol");
    var keyFor = Symbol$2.keyFor;
    var thisSymbolValue$1 = functionUncurryThis(Symbol$2.prototype.valueOf);

    // `Symbol.isRegistered` method
    // https://tc39.es/proposal-symbol-predicates/#sec-symbol-isregistered
    _export(
      { target: "Symbol", stat: true },
      {
        isRegistered: function isRegistered(value) {
          try {
            return keyFor(thisSymbolValue$1(value)) !== undefined;
          } catch (error) {
            return false;
          }
        },
      }
    );

    var Symbol$1 = getBuiltIn("Symbol");
    var $isWellKnown = Symbol$1.isWellKnown;
    var getOwnPropertyNames = getBuiltIn("Object", "getOwnPropertyNames");
    var thisSymbolValue = functionUncurryThis(Symbol$1.prototype.valueOf);
    var WellKnownSymbolsStore = shared("wks");

    for (
      var i = 0,
        symbolKeys = getOwnPropertyNames(Symbol$1),
        symbolKeysLength = symbolKeys.length;
      i < symbolKeysLength;
      i++
    ) {
      // some old engines throws on access to some keys like `arguments` or `caller`
      try {
        var symbolKey = symbolKeys[i];
        if (isSymbol(Symbol$1[symbolKey])) wellKnownSymbol(symbolKey);
      } catch (error) {
        /* empty */
      }
    }

    // `Symbol.isWellKnown` method
    // https://tc39.es/proposal-symbol-predicates/#sec-symbol-iswellknown
    // We should patch it for newly added well-known symbols. If it's not required, this module just will not be injected
    _export(
      { target: "Symbol", stat: true, forced: true },
      {
        isWellKnown: function isWellKnown(value) {
          if ($isWellKnown && $isWellKnown(value)) return true;
          try {
            var symbol = thisSymbolValue(value);
            for (
              var j = 0,
                keys = getOwnPropertyNames(WellKnownSymbolsStore),
                keysLength = keys.length;
              j < keysLength;
              j++
            ) {
              if (WellKnownSymbolsStore[keys[j]] == symbol) return true;
            }
          } catch (error) {
            /* empty */
          }
          return false;
        },
      }
    );

    // `Symbol.matcher` well-known symbol
    // https://github.com/tc39/proposal-pattern-matching
    wellKnownSymbolDefine("matcher");

    // `Symbol.metadataKey` well-known symbol
    // https://github.com/tc39/proposal-decorator-metadata
    wellKnownSymbolDefine("metadataKey");

    // `Symbol.observable` well-known symbol
    // https://github.com/tc39/proposal-observable
    wellKnownSymbolDefine("observable");

    // TODO: Remove from `core-js@4`

    // `Symbol.metadata` well-known symbol
    // https://github.com/tc39/proposal-decorators
    wellKnownSymbolDefine("metadata");

    // TODO: remove from `core-js@4`

    // `Symbol.patternMatch` well-known symbol
    // https://github.com/tc39/proposal-pattern-matching
    wellKnownSymbolDefine("patternMatch");

    // TODO: remove from `core-js@4`

    wellKnownSymbolDefine("replaceAll");

    var ITERATOR$1 = wellKnownSymbol("iterator");
    var ArrayPrototype = Array.prototype;

    // check on default Array iterator
    var isArrayIteratorMethod = function (it) {
      return (
        it !== undefined &&
        (iterators.Array === it || ArrayPrototype[ITERATOR$1] === it)
      );
    };

    var ITERATOR = wellKnownSymbol("iterator");

    var getIteratorMethod = function (it) {
      if (!isNullOrUndefined(it))
        return (
          getMethod(it, ITERATOR) ||
          getMethod(it, "@@iterator") ||
          iterators[classof(it)]
        );
    };

    var $TypeError$1 = TypeError;

    var getIterator = function (argument, usingIterator) {
      var iteratorMethod =
        arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
      if (aCallable(iteratorMethod))
        return anObject(functionCall(iteratorMethod, argument));
      throw $TypeError$1(tryToString(argument) + " is not iterable");
    };

    var iteratorClose = function (iterator, kind, value) {
      var innerResult, innerError;
      anObject(iterator);
      try {
        innerResult = getMethod(iterator, "return");
        if (!innerResult) {
          if (kind === "throw") throw value;
          return value;
        }
        innerResult = functionCall(innerResult, iterator);
      } catch (error) {
        innerError = true;
        innerResult = error;
      }
      if (kind === "throw") throw value;
      if (innerError) throw innerResult;
      anObject(innerResult);
      return value;
    };

    var $TypeError = TypeError;

    var Result = function (stopped, result) {
      this.stopped = stopped;
      this.result = result;
    };

    var ResultPrototype = Result.prototype;

    var iterate = function (iterable, unboundFunction, options) {
      var that = options && options.that;
      var AS_ENTRIES = !!(options && options.AS_ENTRIES);
      var IS_RECORD = !!(options && options.IS_RECORD);
      var IS_ITERATOR = !!(options && options.IS_ITERATOR);
      var INTERRUPTED = !!(options && options.INTERRUPTED);
      var fn = functionBindContext(unboundFunction, that);
      var iterator, iterFn, index, length, result, next, step;

      var stop = function (condition) {
        if (iterator) iteratorClose(iterator, "normal", condition);
        return new Result(true, condition);
      };

      var callFn = function (value) {
        if (AS_ENTRIES) {
          anObject(value);
          return INTERRUPTED
            ? fn(value[0], value[1], stop)
            : fn(value[0], value[1]);
        }
        return INTERRUPTED ? fn(value, stop) : fn(value);
      };

      if (IS_RECORD) {
        iterator = iterable.iterator;
      } else if (IS_ITERATOR) {
        iterator = iterable;
      } else {
        iterFn = getIteratorMethod(iterable);
        if (!iterFn)
          throw $TypeError(tryToString(iterable) + " is not iterable");
        // optimisation for array iterators
        if (isArrayIteratorMethod(iterFn)) {
          for (
            index = 0, length = lengthOfArrayLike(iterable);
            length > index;
            index++
          ) {
            result = callFn(iterable[index]);
            if (result && objectIsPrototypeOf(ResultPrototype, result))
              return result;
          }
          return new Result(false);
        }
        iterator = getIterator(iterable, iterFn);
      }

      next = IS_RECORD ? iterable.next : iterator.next;
      while (!(step = functionCall(next, iterator)).done) {
        try {
          result = callFn(step.value);
        } catch (error) {
          iteratorClose(iterator, "throw", error);
        }
        if (
          typeof result == "object" &&
          result &&
          objectIsPrototypeOf(ResultPrototype, result)
        )
          return result;
      }
      return new Result(false);
    };

    // `Object.fromEntries` method
    // https://github.com/tc39/proposal-object-from-entries
    Object.fromEntries = undefined;
    _export(
      { target: "Object", stat: true },
      {
        fromEntries: function fromEntries(iterable) {
          var obj = {};
          if (iterable instanceof Map) {
            iterable.forEach((v, k) => {
              obj[k] = v;
            });
          } else {
            iterate(
              iterable,
              function (k, v) {
                createProperty(obj, k, v);
              },
              { AS_ENTRIES: true }
            );
          }
          return obj;
        },
      }
    );
    global_1.window = global_1;
  }
}
