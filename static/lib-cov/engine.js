// instrument by jscoverage, do not modifly this file
(function () {
  var BASE;
  if (typeof global === 'object') {
    BASE = global;
  } else if (typeof window === 'object') {
    BASE = window;
  } else {
    throw new Error('[jscoverage] unknow ENV!');
  }
  if (!BASE._$jscoverage) {
    BASE._$jscoverage = {};
    BASE._$jscoverage_cond = {};
    BASE._$jscoverage_done = function (file, line, express) {
      if (arguments.length === 2) {
        BASE._$jscoverage[file][line] ++;
      } else {
        BASE._$jscoverage_cond[file][line] ++;
        return express;
      }
    };
    BASE._$jscoverage_init = function (base, file, lines) {
      var tmp = [];
      for (var i = 0; i < lines.length; i ++) {
        tmp[lines[i]] = 0;
      }
      base[file] = tmp;
    };
  }
})();
_$jscoverage_init(_$jscoverage, "lib/engine.js",[28,29,33,81,82,85,94,96,98,99,102,104,112,150,155,155,156,157,173,174,175,178,180,181,182,183,189,190,191,192,193,196,197,198,199,200,210,211,213,214,217,218,219,223,224,225,247,248,250,253,256,261,262,266,267,268,270,274,275,276,278,282,283,285,285,286,286,287,288,289,292,293,298,299,303,304,307,308,309,310,315,316,319,320,320,322,323,326,329,330,332,333,335,336,337,339,342,343,345,346,348,349,351,352,354,355,357,358,360,363,364,365,367,369,370,372,373,375,376,378,379,380,380,381,384,386,390,391,393,405,408,408,412,413,414,419,424,432,438,440,441,444,462,473]);
_$jscoverage_init(_$jscoverage_cond, "lib/engine.js",[28,81,178,181,189,192,197,199,210,217,217,223,223,250,261,261,266,267,267,274,275,275,282,282,285,286,287,288,292,298,298,303,303,307,309,315,320,380,390,390,390,408,414]);
_$jscoverage["lib/engine.js"].source = ["/**"," * Schema Validation"," *"," * Validators the target Object based on the Schema."," *"," * Required JavaScript capabilities:"," * - Array.isArray"," * - Object.defineProperties"," *"," * @module object-validation"," * @submodule engine"," *"," * @param target {Object}"," * @param schema {Object}"," * @param options {Object}"," * @param options.validateFormats {Object}"," * @param options.validateFormatsStrict {Object}"," * @param options.validateFormatExtensions {Object}"," *"," * @author potanin@UD"," * @date 6/15/13"," *"," * @return {{target: *, valid: boolean, errors: Array}}"," */","function Validator( target, schema, options ) {","","  // Force own context","  if( !( this instanceof Validator ) ) {","    return new Validator( target, schema, options );","  }","","  // new Instance properties","  Object.defineProperties( this, {","    target: {","      value: target || {},","      configurable: true,","      enumerable: true,","      writable: true","    },","    options: {","      value: options || {},","      configurable: true,","      enumerable: false,","      writable: true","    },","    targetedProps: {","      value: [],","      enumerable: true,","      configurable: true,","      enumerable: false,","      writable: true","    },","    validatedProps: {","      value: [],","      enumerable: true,","      configurable: true,","      enumerable: false,","      writable: true","    },","    schema: {","      value: schema && schema.properties ? schema : { type: 'object', properties: schema || {} },","      configurable: true,","      enumerable: false,","      writable: true","    },","    keys: {","      value: [],","      configurable: true,","      enumerable: false,","      writable: true","    },","    errors: {","      value: [],","      configurable: true,","      enumerable: true,","      writable: true","    },","    is_valid: {","      get: function() {","","        if( !this.errors ) {","          return true;","        }","","        return !this.errors.length;","","      },","      configurable: true,","      enumerable: true","    }","  });","","  // Start Validation","  this.validateObject( this.target, this.schema, this.options, this.errors );","","  var keys = [];","","  this.keys.forEach( function( key ) {","    keys.push( key.join( '.' ) );","  })","","  this.keys = keys;","","  return this;","","}","","/**"," * Prototypal Properties"," *"," */","Object.defineProperties( Validator.prototype, {","  messages: {","    value: {","      required: \"is required\",","      minLength: \"is too short (minimum is %{expected} characters)\",","      maxLength: \"is too long (maximum is %{expected} characters)\",","      pattern: \"invalid input\",","      minimum: \"must be greater than or equal to %{expected}\",","      maximum: \"must be less than or equal to %{expected}\",","      exclusiveMinimum: \"must be greater than %{expected}\",","      exclusiveMaximum: \"must be less than %{expected}\",","      divisibleBy: \"must be divisible by %{expected}\",","      minItems: \"must contain more than %{expected} items\",","      maxItems: \"must contain less than %{expected} items\",","      uniqueItems: \"must hold a unique set of values\",","      format: \"is not a valid %{expected}\",","      conform: \"must conform to given constraint\",","      type: \"must be of %{expected} type\",","      enum: \"must be present in given enumerator\"","    },","    enumerable: false,","    writable: true","  },","  formats: {","    value: {","      'email': /^((([a-z]|\\d|[!#\\$%&'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+(\\.([a-z]|\\d|[!#\\$%&'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+)*)|((\\x22)((((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(([\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f]|\\x21|[\\x23-\\x5b]|[\\x5d-\\x7e]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(\\\\([\\x01-\\x09\\x0b\\x0c\\x0d-\\x7f]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]))))*(((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(\\x22)))@((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?$/i,","      'ip-address': /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i,","      'ipv6': /^([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$/,","      'date-time': /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:.\\d{1,3})?Z$/,","      'date': /^\\d{4}-\\d{2}-\\d{2}$/,","      'time': /^\\d{2}:\\d{2}:\\d{2}$/,","      'color': /^#[a-z0-9]{6}|#[a-z0-9]{3}|(?:rgb\\(\\s*(?:[+-]?\\d+%?)\\s*,\\s*(?:[+-]?\\d+%?)\\s*,\\s*(?:[+-]?\\d+%?)\\s*\\))aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|and yellow$/i,","      //'style':        (not supported)","      //'phone':        (not supported)","      //'uri':          (not supported)","      'host-name': /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\\-]*[A-Za-z0-9])/,","      'utc-millisec': {","        test: function( value ) {","          return typeof(value) === 'number' && value >= 0;","        }","      },","      'regex': {","        test: function( value ) {","          try { new RegExp( value ) }","          catch( e ) { return false }","          return true;","        }","      }","    },","    enumerable: true,","    writable: true","  },","  formatExtensions: {","    value: {","      'url': /^(https?|ftp|git):\\/\\/(((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:)*@)?(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]))|((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?)(:\\d*)?)(\\/((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)+(\\/(([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)*)*)?)?(\\?((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|[\\uE000-\\uF8FF]|\\/|\\?)*)?(\\#((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|\\/|\\?)*)?$/i","    },","    enumerable: false,","    writable: true","  },","  validateObject: {","    value: function validateObject( object, schema, options, errors, path ) {","      var self = this;","      var props;","      var allProps = Object.keys( object );","","      // see 5.2","      if( schema.properties ) {","","        for( var property in schema.properties ) {","          if( schema.properties.hasOwnProperty( property ) ) {","            this.targetedProps.push( property );","            this.validateProperty( object, object[property], property, schema.properties[property], options, errors, property, path || [] );","          }","        }","      }","","      // see 5.3","      if( schema.patternProperties ) {","        props = schema.patternProperties;","        for( var p in props ) {","          if( props.hasOwnProperty( p ) ) {","            var re = new RegExp( p );","","            // Find all object properties that are matching `re`","            for( var k in object ) {","              if( object.hasOwnProperty( k ) ) {","                this.targetedProps.push( k );","                if( re.exec( k ) !== null ) {","                  Validator.property( object, object[k], p, props[p], options, errors );","","                }","              }","            }","          }","        }","      }","","      // see 5.4","      if( schema.additionalProperties ) {","        var i, l;","","        var unvisitedProps = allProps.filter( function( k ) {","          return (this.targetedProps.indexOf( k ) > 0);","        });","","        if( schema.additionalProperties === false && unvisitedProps.length > 0 ) {","          for( i = 0, l = unvisitedProps.length; i < l; i++ ) {","            self.error( \"additionalProperties\", unvisitedProps[i], object[unvisitedProps[i]], false, errors );","          }","        }","","        else if( typeof schema.additionalProperties == \"object\" && unvisitedProps.length > 0 ) {","          for( i = 0, l = unvisitedProps.length; i < l; i++ ) {","            validateProperty( object, object[unvisitedProps[i]], unvisitedProps[i], schema.unvisitedProperties, options, errors, property, path || [] );","          }","        }","      }","","    },","    enumerable: true,","    writable: false","  },","  validateProperty: {","    /**","     * Validate Single Property","     *","     * @param object","     * @param value","     * @param property","     * @param schema","     * @param options","     * @param errors","     * @returns {*}","     */","    value: function validateProperty( object, value, property, schema, options, errors, property, path ) {","      var self = this;","      var format, valid, spec, type;","","      if( 'function' === typeof path.push ) {","","        // Add current property to path","        path.push( property );","","        // Add to absolute key list","        self.keys.push( path );","","      }","","      function constrain( name, value, assert ) {","        if( schema[name] !== undefined && !assert( value, schema[name] ) ) {","          self.error( name, property, value, schema, errors );","        }","      }","","      if( value === undefined ) {","        if( schema.required && schema.type !== 'any' ) {","          return self.error( 'required', property, undefined, schema, errors );","        } else {","          return;","        }","      }","","      if( value === \"\" ) {","        if( schema.required && schema.type === 'string' ) {","          return self.error( 'required', property, \"\", schema, errors );","        } else {","          return;","        }","      }","","      if( schema.format && options.validateFormats ) {","        format = schema.format;","","        if( options.validateFormatExtensions ) { spec = validate.formatExtensions[format] }","        if( !spec ) { spec = validate.formats[format] }","        if( !spec ) {","          if( options.validateFormatsStrict ) {","            return self.error( 'format', property, value, schema, errors );","          }","        } else {","          if( !spec.test( value ) ) {","            return self.error( 'format', property, value, schema, errors );","          }","        }","      }","","      if( schema['enum'] && schema['enum'].indexOf( value ) === -1 ) {","        self.error( 'enum', property, value, schema, errors );","      }","","      // Dependencies (see 5.8)","      if( typeof schema.dependencies === 'string' && object[schema.dependencies] === undefined ) {","        self.error( 'dependencies', property, null, schema, errors );","      }","","      if( Array.isArray( schema.dependencies ) ) {","        for( var i = 0, l = schema.dependencies.length; i < l; i++ ) {","          if( object[schema.dependencies[i]] === undefined ) {","            self.error( 'dependencies', property, null, schema, errors );","          }","        }","      }","","      if( typeof schema.dependencies === 'object' ) {","        self.validateObject( object, schema.dependencies, options, errors );","      }","","      this.checkType( value, schema.type, function( err, type ) {","        if( err ) return self.error( 'type', property, typeof value, schema, errors );","","        constrain( 'conform', value, function( a, e ) {","          return e( a )","        });","","        switch( type || (Array.isArray( value ) ? 'array' : typeof value) ) {","","          case 'string':","            constrain( 'minLength', value.length, function( a, e ) {","              return a >= e","            });","            constrain( 'maxLength', value.length, function( a, e ) {","              return a <= e","            });","            constrain( 'pattern', value, function( a, e ) {","              e = typeof e === 'string' ? e = new RegExp( e ) : e;","              return e.test( a )","            });","          break;","","          case 'number':","            constrain( 'minimum', value, function( a, e ) {","              return a >= e","            });","            constrain( 'maximum', value, function( a, e ) {","              return a <= e","            });","            constrain( 'exclusiveMinimum', value, function( a, e ) {","              return a > e","            });","            constrain( 'exclusiveMaximum', value, function( a, e ) {","              return a < e","            });","            constrain( 'divisibleBy', value, function( a, e ) {","              var multiplier = Math.max( (a - Math.floor( a )).toString().length - 2,","                (e - Math.floor( e )).toString().length - 2 );","              multiplier = multiplier > 0 ? Math.pow( 10, multiplier ) : 1;","              return (a * multiplier) % (e * multiplier) === 0","            });","          break;","","          case 'array':","            constrain( 'items', value, function( a, e ) {","              for( var i = 0, l = a.length; i < l; i++ ) {","                validateProperty( object, a[i], property, e, options, errors, property, path || [] );","              }","              return true;","            });","            constrain( 'minItems', value, function( a, e ) {","              return a.length >= e","            });","            constrain( 'maxItems', value, function( a, e ) {","              return a.length <= e","            });","            constrain( 'uniqueItems', value, function( a ) {","              var h = {};","","              for( var i = 0, l = a.length; i < l; i++ ) {","                var key = JSON.stringify( a[i] );","                if( h[key] ) return false;","                h[key] = true;","              }","","              return true;","            });","          break;","","          // Recursive validation","          case 'object':","            if( schema.properties || schema.patternProperties || schema.additionalProperties ) {","              self.validateObject( value, schema, options, errors, path || [] );","            }","          break;","","        }","","      });","","    },","    enumerable: true,","    writable: false","  },","  checkType: {","    value: function checkType( val, type, callback ) {","      var result = false, types = Array.isArray( type ) ? type : [type];","","      // No type - no check","      if( type === undefined ) return callback( null, type );","","      // Go through available types","      // And fine first matching","      for( var i = 0, l = types.length; i < l; i++ ) {","        type = types[i];","        if( type === 'string' ? typeof val === 'string' : type === 'array' ? Array.isArray( val ) :","          type === 'object' ? val && typeof val === 'object' && !Array.isArray( val ) :","            type === 'number' ? typeof val === 'number' : type === 'integer' ? typeof val === 'number' && ~~val === val :","              type === 'null' ? val === null : type === 'boolean' ? typeof val === 'boolean' :","                type === 'function' ? typeof val === 'function' : type === 'any' ? typeof val !== 'undefined' : false ) {","          return callback( null, type );","        }","      }","      ;","","      callback( true );","    },","    enumerable: true,","    writable: false","  },","  error: {","    value: function error( attribute, property, actual, schema, errors ) {","","      var lookup = {","        expected: schema[attribute],","        attribute: attribute,","        property: property","      };","","      var message = schema.messages && schema.messages[attribute] || schema.message || this.messages[attribute] || \"no default message\";","","      message = message.replace( /%\\{([a-z]+)\\}/ig, function( _, match ) {","        return lookup[match.toLowerCase()] || '';","      });","","      errors.push({","        attribute: attribute,","        property: property,","        expected: schema[attribute],","        actual: actual,","        message: message","      });","","    },","    enumerable: true,","    writable: false","  },","});","","/**"," * Constructor Properties"," *"," */","Object.defineProperties( module.exports = Validator, {","  create: {","    /**","     *","     * @param target","     * @param schema","     * @param options","     * @for engine","     * @returns {Validator}","     */","    value: function create( target, schema, options ) {","      return new Validator( target, schema, options );","    }","  }","});",""];
function Validator(target, schema, options) {
    _$jscoverage_done("lib/engine.js", 28);
    if (_$jscoverage_done("lib/engine.js", 28, !(this instanceof Validator))) {
        _$jscoverage_done("lib/engine.js", 29);
        return new Validator(target, schema, options);
    }
    _$jscoverage_done("lib/engine.js", 33);
    Object.defineProperties(this, {
        target: {
            value: target || {},
            configurable: true,
            enumerable: true,
            writable: true
        },
        options: {
            value: options || {},
            configurable: true,
            enumerable: false,
            writable: true
        },
        targetedProps: {
            value: [],
            enumerable: true,
            configurable: true,
            enumerable: false,
            writable: true
        },
        validatedProps: {
            value: [],
            enumerable: true,
            configurable: true,
            enumerable: false,
            writable: true
        },
        schema: {
            value: schema && schema.properties ? schema : {
                type: "object",
                properties: schema || {}
            },
            configurable: true,
            enumerable: false,
            writable: true
        },
        keys: {
            value: [],
            configurable: true,
            enumerable: false,
            writable: true
        },
        errors: {
            value: [],
            configurable: true,
            enumerable: true,
            writable: true
        },
        is_valid: {
            get: function() {
                _$jscoverage_done("lib/engine.js", 81);
                if (_$jscoverage_done("lib/engine.js", 81, !this.errors)) {
                    _$jscoverage_done("lib/engine.js", 82);
                    return true;
                }
                _$jscoverage_done("lib/engine.js", 85);
                return !this.errors.length;
            },
            configurable: true,
            enumerable: true
        }
    });
    _$jscoverage_done("lib/engine.js", 94);
    this.validateObject(this.target, this.schema, this.options, this.errors);
    _$jscoverage_done("lib/engine.js", 96);
    var keys = [];
    _$jscoverage_done("lib/engine.js", 98);
    this.keys.forEach(function(key) {
        _$jscoverage_done("lib/engine.js", 99);
        keys.push(key.join("."));
    });
    _$jscoverage_done("lib/engine.js", 102);
    this.keys = keys;
    _$jscoverage_done("lib/engine.js", 104);
    return this;
}

_$jscoverage_done("lib/engine.js", 112);
Object.defineProperties(Validator.prototype, {
    messages: {
        value: {
            required: "is required",
            minLength: "is too short (minimum is %{expected} characters)",
            maxLength: "is too long (maximum is %{expected} characters)",
            pattern: "invalid input",
            minimum: "must be greater than or equal to %{expected}",
            maximum: "must be less than or equal to %{expected}",
            exclusiveMinimum: "must be greater than %{expected}",
            exclusiveMaximum: "must be less than %{expected}",
            divisibleBy: "must be divisible by %{expected}",
            minItems: "must contain more than %{expected} items",
            maxItems: "must contain less than %{expected} items",
            uniqueItems: "must hold a unique set of values",
            format: "is not a valid %{expected}",
            conform: "must conform to given constraint",
            type: "must be of %{expected} type",
            "enum": "must be present in given enumerator"
        },
        enumerable: false,
        writable: true
    },
    formats: {
        value: {
            email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
            "ip-address": /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i,
            ipv6: /^([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$/,
            "date-time": /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:.\d{1,3})?Z$/,
            date: /^\d{4}-\d{2}-\d{2}$/,
            time: /^\d{2}:\d{2}:\d{2}$/,
            color: /^#[a-z0-9]{6}|#[a-z0-9]{3}|(?:rgb\(\s*(?:[+-]?\d+%?)\s*,\s*(?:[+-]?\d+%?)\s*,\s*(?:[+-]?\d+%?)\s*\))aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|and yellow$/i,
            "host-name": /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])/,
            "utc-millisec": {
                test: function(value) {
                    _$jscoverage_done("lib/engine.js", 150);
                    return typeof value === "number" && value >= 0;
                }
            },
            regex: {
                test: function(value) {
                    _$jscoverage_done("lib/engine.js", 155);
                    try {
                        _$jscoverage_done("lib/engine.js", 155);
                        new RegExp(value);
                    } catch (e) {
                        _$jscoverage_done("lib/engine.js", 156);
                        return false;
                    }
                    _$jscoverage_done("lib/engine.js", 157);
                    return true;
                }
            }
        },
        enumerable: true,
        writable: true
    },
    formatExtensions: {
        value: {
            url: /^(https?|ftp|git):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
        },
        enumerable: false,
        writable: true
    },
    validateObject: {
        value: function validateObject(object, schema, options, errors, path) {
            _$jscoverage_done("lib/engine.js", 173);
            var self = this;
            _$jscoverage_done("lib/engine.js", 174);
            var props;
            _$jscoverage_done("lib/engine.js", 175);
            var allProps = Object.keys(object);
            _$jscoverage_done("lib/engine.js", 178);
            if (_$jscoverage_done("lib/engine.js", 178, schema.properties)) {
                _$jscoverage_done("lib/engine.js", 180);
                for (var property in schema.properties) {
                    _$jscoverage_done("lib/engine.js", 181);
                    if (_$jscoverage_done("lib/engine.js", 181, schema.properties.hasOwnProperty(property))) {
                        _$jscoverage_done("lib/engine.js", 182);
                        this.targetedProps.push(property);
                        _$jscoverage_done("lib/engine.js", 183);
                        this.validateProperty(object, object[property], property, schema.properties[property], options, errors, property, path || []);
                    }
                }
            }
            _$jscoverage_done("lib/engine.js", 189);
            if (_$jscoverage_done("lib/engine.js", 189, schema.patternProperties)) {
                _$jscoverage_done("lib/engine.js", 190);
                props = schema.patternProperties;
                _$jscoverage_done("lib/engine.js", 191);
                for (var p in props) {
                    _$jscoverage_done("lib/engine.js", 192);
                    if (_$jscoverage_done("lib/engine.js", 192, props.hasOwnProperty(p))) {
                        _$jscoverage_done("lib/engine.js", 193);
                        var re = new RegExp(p);
                        _$jscoverage_done("lib/engine.js", 196);
                        for (var k in object) {
                            _$jscoverage_done("lib/engine.js", 197);
                            if (_$jscoverage_done("lib/engine.js", 197, object.hasOwnProperty(k))) {
                                _$jscoverage_done("lib/engine.js", 198);
                                this.targetedProps.push(k);
                                _$jscoverage_done("lib/engine.js", 199);
                                if (_$jscoverage_done("lib/engine.js", 199, re.exec(k) !== null)) {
                                    _$jscoverage_done("lib/engine.js", 200);
                                    Validator.property(object, object[k], p, props[p], options, errors);
                                }
                            }
                        }
                    }
                }
            }
            _$jscoverage_done("lib/engine.js", 210);
            if (_$jscoverage_done("lib/engine.js", 210, schema.additionalProperties)) {
                _$jscoverage_done("lib/engine.js", 211);
                var i, l;
                _$jscoverage_done("lib/engine.js", 213);
                var unvisitedProps = allProps.filter(function(k) {
                    _$jscoverage_done("lib/engine.js", 214);
                    return this.targetedProps.indexOf(k) > 0;
                });
                _$jscoverage_done("lib/engine.js", 217);
                if (_$jscoverage_done("lib/engine.js", 217, schema.additionalProperties === false) && _$jscoverage_done("lib/engine.js", 217, unvisitedProps.length > 0)) {
                    _$jscoverage_done("lib/engine.js", 218);
                    for (i = 0, l = unvisitedProps.length; i < l; i++) {
                        _$jscoverage_done("lib/engine.js", 219);
                        self.error("additionalProperties", unvisitedProps[i], object[unvisitedProps[i]], false, errors);
                    }
                } else {
                    _$jscoverage_done("lib/engine.js", 223);
                    if (_$jscoverage_done("lib/engine.js", 223, typeof schema.additionalProperties == "object") && _$jscoverage_done("lib/engine.js", 223, unvisitedProps.length > 0)) {
                        _$jscoverage_done("lib/engine.js", 224);
                        for (i = 0, l = unvisitedProps.length; i < l; i++) {
                            _$jscoverage_done("lib/engine.js", 225);
                            validateProperty(object, object[unvisitedProps[i]], unvisitedProps[i], schema.unvisitedProperties, options, errors, property, path || []);
                        }
                    }
                }
            }
        },
        enumerable: true,
        writable: false
    },
    validateProperty: {
        value: function validateProperty(object, value, property, schema, options, errors, property, path) {
            _$jscoverage_done("lib/engine.js", 247);
            var self = this;
            _$jscoverage_done("lib/engine.js", 248);
            var format, valid, spec, type;
            _$jscoverage_done("lib/engine.js", 250);
            if (_$jscoverage_done("lib/engine.js", 250, "function" === typeof path.push)) {
                _$jscoverage_done("lib/engine.js", 253);
                path.push(property);
                _$jscoverage_done("lib/engine.js", 256);
                self.keys.push(path);
            }
            function constrain(name, value, assert) {
                _$jscoverage_done("lib/engine.js", 261);
                if (_$jscoverage_done("lib/engine.js", 261, schema[name] !== undefined) && _$jscoverage_done("lib/engine.js", 261, !assert(value, schema[name]))) {
                    _$jscoverage_done("lib/engine.js", 262);
                    self.error(name, property, value, schema, errors);
                }
            }
            _$jscoverage_done("lib/engine.js", 266);
            if (_$jscoverage_done("lib/engine.js", 266, value === undefined)) {
                _$jscoverage_done("lib/engine.js", 267);
                if (_$jscoverage_done("lib/engine.js", 267, schema.required) && _$jscoverage_done("lib/engine.js", 267, schema.type !== "any")) {
                    _$jscoverage_done("lib/engine.js", 268);
                    return self.error("required", property, undefined, schema, errors);
                } else {
                    _$jscoverage_done("lib/engine.js", 270);
                    return;
                }
            }
            _$jscoverage_done("lib/engine.js", 274);
            if (_$jscoverage_done("lib/engine.js", 274, value === "")) {
                _$jscoverage_done("lib/engine.js", 275);
                if (_$jscoverage_done("lib/engine.js", 275, schema.required) && _$jscoverage_done("lib/engine.js", 275, schema.type === "string")) {
                    _$jscoverage_done("lib/engine.js", 276);
                    return self.error("required", property, "", schema, errors);
                } else {
                    _$jscoverage_done("lib/engine.js", 278);
                    return;
                }
            }
            _$jscoverage_done("lib/engine.js", 282);
            if (_$jscoverage_done("lib/engine.js", 282, schema.format) && _$jscoverage_done("lib/engine.js", 282, options.validateFormats)) {
                _$jscoverage_done("lib/engine.js", 283);
                format = schema.format;
                _$jscoverage_done("lib/engine.js", 285);
                if (_$jscoverage_done("lib/engine.js", 285, options.validateFormatExtensions)) {
                    _$jscoverage_done("lib/engine.js", 285);
                    spec = validate.formatExtensions[format];
                }
                _$jscoverage_done("lib/engine.js", 286);
                if (_$jscoverage_done("lib/engine.js", 286, !spec)) {
                    _$jscoverage_done("lib/engine.js", 286);
                    spec = validate.formats[format];
                }
                _$jscoverage_done("lib/engine.js", 287);
                if (_$jscoverage_done("lib/engine.js", 287, !spec)) {
                    _$jscoverage_done("lib/engine.js", 288);
                    if (_$jscoverage_done("lib/engine.js", 288, options.validateFormatsStrict)) {
                        _$jscoverage_done("lib/engine.js", 289);
                        return self.error("format", property, value, schema, errors);
                    }
                } else {
                    _$jscoverage_done("lib/engine.js", 292);
                    if (_$jscoverage_done("lib/engine.js", 292, !spec.test(value))) {
                        _$jscoverage_done("lib/engine.js", 293);
                        return self.error("format", property, value, schema, errors);
                    }
                }
            }
            _$jscoverage_done("lib/engine.js", 298);
            if (_$jscoverage_done("lib/engine.js", 298, schema["enum"]) && _$jscoverage_done("lib/engine.js", 298, schema["enum"].indexOf(value) === -1)) {
                _$jscoverage_done("lib/engine.js", 299);
                self.error("enum", property, value, schema, errors);
            }
            _$jscoverage_done("lib/engine.js", 303);
            if (_$jscoverage_done("lib/engine.js", 303, typeof schema.dependencies === "string") && _$jscoverage_done("lib/engine.js", 303, object[schema.dependencies] === undefined)) {
                _$jscoverage_done("lib/engine.js", 304);
                self.error("dependencies", property, null, schema, errors);
            }
            _$jscoverage_done("lib/engine.js", 307);
            if (_$jscoverage_done("lib/engine.js", 307, Array.isArray(schema.dependencies))) {
                _$jscoverage_done("lib/engine.js", 308);
                for (var i = 0, l = schema.dependencies.length; i < l; i++) {
                    _$jscoverage_done("lib/engine.js", 309);
                    if (_$jscoverage_done("lib/engine.js", 309, object[schema.dependencies[i]] === undefined)) {
                        _$jscoverage_done("lib/engine.js", 310);
                        self.error("dependencies", property, null, schema, errors);
                    }
                }
            }
            _$jscoverage_done("lib/engine.js", 315);
            if (_$jscoverage_done("lib/engine.js", 315, typeof schema.dependencies === "object")) {
                _$jscoverage_done("lib/engine.js", 316);
                self.validateObject(object, schema.dependencies, options, errors);
            }
            _$jscoverage_done("lib/engine.js", 319);
            this.checkType(value, schema.type, function(err, type) {
                _$jscoverage_done("lib/engine.js", 320);
                if (_$jscoverage_done("lib/engine.js", 320, err)) {
                    _$jscoverage_done("lib/engine.js", 320);
                    return self.error("type", property, typeof value, schema, errors);
                }
                _$jscoverage_done("lib/engine.js", 322);
                constrain("conform", value, function(a, e) {
                    _$jscoverage_done("lib/engine.js", 323);
                    return e(a);
                });
                _$jscoverage_done("lib/engine.js", 326);
                switch (type || (Array.isArray(value) ? "array" : typeof value)) {
                  case "string":
                    _$jscoverage_done("lib/engine.js", 329);
                    constrain("minLength", value.length, function(a, e) {
                        _$jscoverage_done("lib/engine.js", 330);
                        return a >= e;
                    });
                    _$jscoverage_done("lib/engine.js", 332);
                    constrain("maxLength", value.length, function(a, e) {
                        _$jscoverage_done("lib/engine.js", 333);
                        return a <= e;
                    });
                    _$jscoverage_done("lib/engine.js", 335);
                    constrain("pattern", value, function(a, e) {
                        _$jscoverage_done("lib/engine.js", 336);
                        e = typeof e === "string" ? e = new RegExp(e) : e;
                        _$jscoverage_done("lib/engine.js", 337);
                        return e.test(a);
                    });
                    _$jscoverage_done("lib/engine.js", 339);
                    break;
                  case "number":
                    _$jscoverage_done("lib/engine.js", 342);
                    constrain("minimum", value, function(a, e) {
                        _$jscoverage_done("lib/engine.js", 343);
                        return a >= e;
                    });
                    _$jscoverage_done("lib/engine.js", 345);
                    constrain("maximum", value, function(a, e) {
                        _$jscoverage_done("lib/engine.js", 346);
                        return a <= e;
                    });
                    _$jscoverage_done("lib/engine.js", 348);
                    constrain("exclusiveMinimum", value, function(a, e) {
                        _$jscoverage_done("lib/engine.js", 349);
                        return a > e;
                    });
                    _$jscoverage_done("lib/engine.js", 351);
                    constrain("exclusiveMaximum", value, function(a, e) {
                        _$jscoverage_done("lib/engine.js", 352);
                        return a < e;
                    });
                    _$jscoverage_done("lib/engine.js", 354);
                    constrain("divisibleBy", value, function(a, e) {
                        _$jscoverage_done("lib/engine.js", 355);
                        var multiplier = Math.max((a - Math.floor(a)).toString().length - 2, (e - Math.floor(e)).toString().length - 2);
                        _$jscoverage_done("lib/engine.js", 357);
                        multiplier = multiplier > 0 ? Math.pow(10, multiplier) : 1;
                        _$jscoverage_done("lib/engine.js", 358);
                        return a * multiplier % (e * multiplier) === 0;
                    });
                    _$jscoverage_done("lib/engine.js", 360);
                    break;
                  case "array":
                    _$jscoverage_done("lib/engine.js", 363);
                    constrain("items", value, function(a, e) {
                        _$jscoverage_done("lib/engine.js", 364);
                        for (var i = 0, l = a.length; i < l; i++) {
                            _$jscoverage_done("lib/engine.js", 365);
                            validateProperty(object, a[i], property, e, options, errors, property, path || []);
                        }
                        _$jscoverage_done("lib/engine.js", 367);
                        return true;
                    });
                    _$jscoverage_done("lib/engine.js", 369);
                    constrain("minItems", value, function(a, e) {
                        _$jscoverage_done("lib/engine.js", 370);
                        return a.length >= e;
                    });
                    _$jscoverage_done("lib/engine.js", 372);
                    constrain("maxItems", value, function(a, e) {
                        _$jscoverage_done("lib/engine.js", 373);
                        return a.length <= e;
                    });
                    _$jscoverage_done("lib/engine.js", 375);
                    constrain("uniqueItems", value, function(a) {
                        _$jscoverage_done("lib/engine.js", 376);
                        var h = {};
                        _$jscoverage_done("lib/engine.js", 378);
                        for (var i = 0, l = a.length; i < l; i++) {
                            _$jscoverage_done("lib/engine.js", 379);
                            var key = JSON.stringify(a[i]);
                            _$jscoverage_done("lib/engine.js", 380);
                            if (_$jscoverage_done("lib/engine.js", 380, h[key])) {
                                _$jscoverage_done("lib/engine.js", 380);
                                return false;
                            }
                            _$jscoverage_done("lib/engine.js", 381);
                            h[key] = true;
                        }
                        _$jscoverage_done("lib/engine.js", 384);
                        return true;
                    });
                    _$jscoverage_done("lib/engine.js", 386);
                    break;
                  case "object":
                    _$jscoverage_done("lib/engine.js", 390);
                    if (_$jscoverage_done("lib/engine.js", 390, schema.properties) || _$jscoverage_done("lib/engine.js", 390, schema.patternProperties) || _$jscoverage_done("lib/engine.js", 390, schema.additionalProperties)) {
                        _$jscoverage_done("lib/engine.js", 391);
                        self.validateObject(value, schema, options, errors, path || []);
                    }
                    _$jscoverage_done("lib/engine.js", 393);
                    break;
                }
            });
        },
        enumerable: true,
        writable: false
    },
    checkType: {
        value: function checkType(val, type, callback) {
            _$jscoverage_done("lib/engine.js", 405);
            var result = false, types = Array.isArray(type) ? type : [ type ];
            _$jscoverage_done("lib/engine.js", 408);
            if (_$jscoverage_done("lib/engine.js", 408, type === undefined)) {
                _$jscoverage_done("lib/engine.js", 408);
                return callback(null, type);
            }
            _$jscoverage_done("lib/engine.js", 412);
            for (var i = 0, l = types.length; i < l; i++) {
                _$jscoverage_done("lib/engine.js", 413);
                type = types[i];
                _$jscoverage_done("lib/engine.js", 414);
                if (_$jscoverage_done("lib/engine.js", 414, type === "string" ? typeof val === "string" : type === "array" ? Array.isArray(val) : type === "object" ? val && typeof val === "object" && !Array.isArray(val) : type === "number" ? typeof val === "number" : type === "integer" ? typeof val === "number" && ~~val === val : type === "null" ? val === null : type === "boolean" ? typeof val === "boolean" : type === "function" ? typeof val === "function" : type === "any" ? typeof val !== "undefined" : false)) {
                    _$jscoverage_done("lib/engine.js", 419);
                    return callback(null, type);
                }
            }
            _$jscoverage_done("lib/engine.js", 424);
            callback(true);
        },
        enumerable: true,
        writable: false
    },
    error: {
        value: function error(attribute, property, actual, schema, errors) {
            _$jscoverage_done("lib/engine.js", 432);
            var lookup = {
                expected: schema[attribute],
                attribute: attribute,
                property: property
            };
            _$jscoverage_done("lib/engine.js", 438);
            var message = schema.messages && schema.messages[attribute] || schema.message || this.messages[attribute] || "no default message";
            _$jscoverage_done("lib/engine.js", 440);
            message = message.replace(/%\{([a-z]+)\}/ig, function(_, match) {
                _$jscoverage_done("lib/engine.js", 441);
                return lookup[match.toLowerCase()] || "";
            });
            _$jscoverage_done("lib/engine.js", 444);
            errors.push({
                attribute: attribute,
                property: property,
                expected: schema[attribute],
                actual: actual,
                message: message
            });
        },
        enumerable: true,
        writable: false
    }
});

_$jscoverage_done("lib/engine.js", 462);
Object.defineProperties(module.exports = Validator, {
    create: {
        value: function create(target, schema, options) {
            _$jscoverage_done("lib/engine.js", 473);
            return new Validator(target, schema, options);
        }
    }
});