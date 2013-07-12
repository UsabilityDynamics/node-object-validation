/**
 * Schema Validation
 *
 * Validators the target Object based on the Schema.
 *
 * Required JavaScript capabilities:
 * - Array.isArray
 * - Object.defineProperties
 *
 * @module object-validation
 * @submodule engine
 *
 * @param target {Object}
 * @param schema {Object}
 * @param options {Object}
 * @param options.validateFormats {Object}
 * @param options.validateFormatsStrict {Object}
 * @param options.validateFormatExtensions {Object}
 *
 * @author potanin@UD
 * @date 6/15/13
 *
 * @return {{target: *, valid: boolean, errors: Array}}
 */
function Validator( target, schema, options ) {

  // Force own context
  if( !( this instanceof Validator ) ) {
    return new Validator( target, schema, options );
  }

  // new Instance properties
  Object.defineProperties( this, {
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
      value: schema && schema.properties ? schema : { type: 'object', properties: schema || {} },
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

        if( !this.errors ) {
          return true;
        }

        return !this.errors.length;

      },
      configurable: true,
      enumerable: true
    }
  });

  // Start Validation
  this.validateObject( this.target, this.schema, this.options, this.errors );

  var keys = [];

  this.keys.forEach( function( key ) {
    keys.push( key.join( '.' ) );
  })

  this.keys = keys;

  return this;

}

/**
 * Prototypal Properties
 *
 */
Object.defineProperties( Validator.prototype, {
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
      enum: "must be present in given enumerator"
    },
    enumerable: false,
    writable: true
  },
  formats: {
    value: {
      'email': /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
      'ip-address': /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i,
      'ipv6': /^([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$/,
      'date-time': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:.\d{1,3})?Z$/,
      'date': /^\d{4}-\d{2}-\d{2}$/,
      'time': /^\d{2}:\d{2}:\d{2}$/,
      'color': /^#[a-z0-9]{6}|#[a-z0-9]{3}|(?:rgb\(\s*(?:[+-]?\d+%?)\s*,\s*(?:[+-]?\d+%?)\s*,\s*(?:[+-]?\d+%?)\s*\))aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|and yellow$/i,
      //'style':        (not supported)
      //'phone':        (not supported)
      //'uri':          (not supported)
      'host-name': /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])/,
      'utc-millisec': {
        test: function( value ) {
          return typeof(value) === 'number' && value >= 0;
        }
      },
      'regex': {
        test: function( value ) {
          try { new RegExp( value ) }
          catch( e ) { return false }
          return true;
        }
      }
    },
    enumerable: true,
    writable: true
  },
  formatExtensions: {
    value: {
      'url': /^(https?|ftp|git):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
    },
    enumerable: false,
    writable: true
  },
  validateObject: {
    value: function validateObject( object, schema, options, errors, path ) {
      var self = this;
      var props;
      var allProps = Object.keys( object );

      // see 5.2
      if( schema.properties ) {

        for( var property in schema.properties ) {
          if( schema.properties.hasOwnProperty( property ) ) {
            this.targetedProps.push( property );
            this.validateProperty( object, object[property], property, schema.properties[property], options, errors, property, path || [] );
          }
        }
      }

      // see 5.3
      if( schema.patternProperties ) {
        props = schema.patternProperties;
        for( var p in props ) {
          if( props.hasOwnProperty( p ) ) {
            var re = new RegExp( p );

            // Find all object properties that are matching `re`
            for( var k in object ) {
              if( object.hasOwnProperty( k ) ) {
                this.targetedProps.push( k );
                if( re.exec( k ) !== null ) {
                  Validator.property( object, object[k], p, props[p], options, errors );

                }
              }
            }
          }
        }
      }

      // see 5.4
      if( schema.additionalProperties ) {
        var i, l;

        var unvisitedProps = allProps.filter( function( k ) {
          return (this.targetedProps.indexOf( k ) > 0);
        });

        if( schema.additionalProperties === false && unvisitedProps.length > 0 ) {
          for( i = 0, l = unvisitedProps.length; i < l; i++ ) {
            self.error( "additionalProperties", unvisitedProps[i], object[unvisitedProps[i]], false, errors );
          }
        }

        else if( typeof schema.additionalProperties == "object" && unvisitedProps.length > 0 ) {
          for( i = 0, l = unvisitedProps.length; i < l; i++ ) {
            validateProperty( object, object[unvisitedProps[i]], unvisitedProps[i], schema.unvisitedProperties, options, errors, property, path || [] );
          }
        }
      }

    },
    enumerable: true,
    writable: false
  },
  validateProperty: {
    /**
     * Validate Single Property
     *
     * @param object
     * @param value
     * @param property
     * @param schema
     * @param options
     * @param errors
     * @returns {*}
     */
    value: function validateProperty( object, value, property, schema, options, errors, property, path ) {
      var self = this;
      var format, valid, spec, type;

      if( 'function' === typeof path.push ) {

        // Add current property to path
        path.push( property );

        // Add to absolute key list
        self.keys.push( path );

      }

      function constrain( name, value, assert ) {
        if( schema[name] !== undefined && !assert( value, schema[name] ) ) {
          self.error( name, property, value, schema, errors );
        }
      }

      if( value === undefined ) {
        if( schema.required && schema.type !== 'any' ) {
          return self.error( 'required', property, undefined, schema, errors );
        } else {
          return;
        }
      }

      if( value === "" ) {
        if( schema.required && schema.type === 'string' ) {
          return self.error( 'required', property, "", schema, errors );
        } else {
          return;
        }
      }

      if( schema.format && options.validateFormats ) {
        format = schema.format;

        if( options.validateFormatExtensions ) { spec = validate.formatExtensions[format] }
        if( !spec ) { spec = validate.formats[format] }
        if( !spec ) {
          if( options.validateFormatsStrict ) {
            return self.error( 'format', property, value, schema, errors );
          }
        } else {
          if( !spec.test( value ) ) {
            return self.error( 'format', property, value, schema, errors );
          }
        }
      }

      if( schema['enum'] && schema['enum'].indexOf( value ) === -1 ) {
        self.error( 'enum', property, value, schema, errors );
      }

      // Dependencies (see 5.8)
      if( typeof schema.dependencies === 'string' && object[schema.dependencies] === undefined ) {
        self.error( 'dependencies', property, null, schema, errors );
      }

      if( Array.isArray( schema.dependencies ) ) {
        for( var i = 0, l = schema.dependencies.length; i < l; i++ ) {
          if( object[schema.dependencies[i]] === undefined ) {
            self.error( 'dependencies', property, null, schema, errors );
          }
        }
      }

      if( typeof schema.dependencies === 'object' ) {
        self.validateObject( object, schema.dependencies, options, errors );
      }

      this.checkType( value, schema.type, function( err, type ) {
        if( err ) return self.error( 'type', property, typeof value, schema, errors );

        constrain( 'conform', value, function( a, e ) {
          return e( a )
        });

        switch( type || (Array.isArray( value ) ? 'array' : typeof value) ) {

          case 'string':
            constrain( 'minLength', value.length, function( a, e ) {
              return a >= e
            });
            constrain( 'maxLength', value.length, function( a, e ) {
              return a <= e
            });
            constrain( 'pattern', value, function( a, e ) {
              e = typeof e === 'string' ? e = new RegExp( e ) : e;
              return e.test( a )
            });
          break;

          case 'number':
            constrain( 'minimum', value, function( a, e ) {
              return a >= e
            });
            constrain( 'maximum', value, function( a, e ) {
              return a <= e
            });
            constrain( 'exclusiveMinimum', value, function( a, e ) {
              return a > e
            });
            constrain( 'exclusiveMaximum', value, function( a, e ) {
              return a < e
            });
            constrain( 'divisibleBy', value, function( a, e ) {
              var multiplier = Math.max( (a - Math.floor( a )).toString().length - 2,
                (e - Math.floor( e )).toString().length - 2 );
              multiplier = multiplier > 0 ? Math.pow( 10, multiplier ) : 1;
              return (a * multiplier) % (e * multiplier) === 0
            });
          break;

          case 'array':
            constrain( 'items', value, function( a, e ) {
              for( var i = 0, l = a.length; i < l; i++ ) {
                validateProperty( object, a[i], property, e, options, errors, property, path || [] );
              }
              return true;
            });
            constrain( 'minItems', value, function( a, e ) {
              return a.length >= e
            });
            constrain( 'maxItems', value, function( a, e ) {
              return a.length <= e
            });
            constrain( 'uniqueItems', value, function( a ) {
              var h = {};

              for( var i = 0, l = a.length; i < l; i++ ) {
                var key = JSON.stringify( a[i] );
                if( h[key] ) return false;
                h[key] = true;
              }

              return true;
            });
          break;

          // Recursive validation
          case 'object':
            if( schema.properties || schema.patternProperties || schema.additionalProperties ) {
              self.validateObject( value, schema, options, errors, path || [] );
            }
          break;

        }

      });

    },
    enumerable: true,
    writable: false
  },
  checkType: {
    value: function checkType( val, type, callback ) {
      var result = false, types = Array.isArray( type ) ? type : [type];

      // No type - no check
      if( type === undefined ) return callback( null, type );

      // Go through available types
      // And fine first matching
      for( var i = 0, l = types.length; i < l; i++ ) {
        type = types[i];
        if( type === 'string' ? typeof val === 'string' : type === 'array' ? Array.isArray( val ) :
          type === 'object' ? val && typeof val === 'object' && !Array.isArray( val ) :
            type === 'number' ? typeof val === 'number' : type === 'integer' ? typeof val === 'number' && ~~val === val :
              type === 'null' ? val === null : type === 'boolean' ? typeof val === 'boolean' :
                type === 'function' ? typeof val === 'function' : type === 'any' ? typeof val !== 'undefined' : false ) {
          return callback( null, type );
        }
      }
      ;

      callback( true );
    },
    enumerable: true,
    writable: false
  },
  error: {
    value: function error( attribute, property, actual, schema, errors ) {

      var lookup = {
        expected: schema[attribute],
        attribute: attribute,
        property: property
      };

      var message = schema.messages && schema.messages[attribute] || schema.message || this.messages[attribute] || "no default message";

      message = message.replace( /%\{([a-z]+)\}/ig, function( _, match ) {
        return lookup[match.toLowerCase()] || '';
      });

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
  },
});

/**
 * Constructor Properties
 *
 */
Object.defineProperties( module.exports = Validator, {
  create: {
    /**
     *
     * @param target
     * @param schema
     * @param options
     * @for engine
     * @returns {Validator}
     */
    value: function create( target, schema, options ) {
      return new Validator( target, schema, options );
    }
  }
});
