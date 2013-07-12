/**
 * Object States API
 *
 * mocha test/api.js --reporter list --ui exports --watch
 *
 * @author potanin@UD
 * @date 7/11/13
 * @type {Object}
 */
module.exports = {

  /**
   * Prepare Environment
   *
   */
  'before': function() {

    require( 'should' );

    // Cache Module
    require( '../' );

    module.createSimpleUser = function createSimpleUser() {

      return Object.defineProperties( {}, {
        first: {
          value: 'Joe',
          enumerable: false
        },
        last: {
          value: 'Bobo',
          enumerable: true,
          configurable: true,
          writable: true
        }
      });

    };

    module.createUser = function createSimpleUser() {
      return {
        "first": "Bob",
        "last": "McCarthy",
        "age": 22,
        "occupation": "developer",
        "skills": ["javascript", "node.js"],
        "education": {
          "college": "full sail university",
          "skills": {
            "technical": ['javascript', 'php'],
            "business": ['project management', 'budgeting']
          }
        },
        personality: 'awesome',
        sex: 'male'
      }
    };

    module.schema = {
      type: 'object',
      required: true,
      properties: {
        first: {
          type: 'string',
          required: true
        },
        age: {
          type: 'number',
          required: true,
          minimum: 20,
          maximum: 30
        },
        occupation: {
          type: 'string',
          required: true,
          enum: ['developer', 'programmer', 'chicken farmer']
        },
        education: {
          type: 'object',
          properties: {
            college: {
              type: 'string'
            }
          }
        },
        skills: {
          type: 'array',
          maxItems: 3
        },
        personality: {
          type: 'string',
          required: true
        }
      }
    };

    module.reduced_schema = {
      type: 'object',
      required: true,
      properties: {
        first: {
          type: 'string',
          required: true
        },
        occupation: {
          type: 'string',
          required: true,
          enum: ['developer', 'programmer', 'chicken farmer']
        },
        education: {
          type: 'object',
          properties: {
            college: {
              type: 'string'
            },
            skills: {
              type: 'array',
              required: true,
              minItems: 2
            }
          }
        },
        personality: {
          type: 'string'
        }

      }
    };

  },

  'Object Validation API': {

    'model has expected methods.': function() {
      var validation = require( '../' );

      // Constructor tests
      validation.should.be.a( 'function' );
      validation.should.have.property( 'validate' );
      validation.should.have.property( 'keys' );

      // Inherited Abstract methods
      validation.should.have.property( 'create' );
      validation.should.have.property( 'use' );
      validation.should.have.property( 'get' );
      validation.should.have.property( 'set' );

      // Prototypal Methods
      validation.should.have.property( 'prototype' );

    },

    /**
     * Testing successful
     *
     * @author mccarthy@UD
     */
    "handles success as expected": function() {
      var validation = require( '../' );
      var instance = validation.validate( module.createUser(), module.schema );

      instance.should.have.property( 'is_valid', true );
      instance.should.have.property( "errors" ).with.lengthOf( 0 );

    },

    /**
     * Testing failure when numerically out of range.
     *
     * @author mccarthy@UD
     */
    "handles failure as expected": function() {
      var validation = require( '../' );
      var user = module.createUser();

      // Set the age to a value that is out of the schema's valid range
      user.age = 40;

      var instance = validation.validate( user, module.schema );

      instance.should.have.property( 'is_valid', false );
      instance.should.have.property( "errors" ).with.lengthOf( 1 );
      instance.errors[0].should.have.property( "property", "age" );
      instance.errors[0].should.have.property( "expected", 30 );
      instance.errors[0].should.have.property( "actual", 40 );

    },

    /**
     * Reduced object returns object based on reduced schema validation.
     */
    "returns list of keys that were validated": function() {
      var validation = require( '../' );
      var instance = validation.validate( module.createUser(), module.reduced_schema );

      instance.keys.should.be.a( 'object' );
      instance.keys.should.have.property( 'length', 4 );
      instance.keys[0].should.equal( 'first' );
      instance.keys[1].should.equal( 'occupation' );
      instance.keys[2].should.equal( 'education.college.skills' );
      instance.keys[3].should.equal( 'personality' );

    },

    "simple user does not return enumerable properties": function() {

      var validation = require( '../' );
      var _createSimpleUser = validation.validate( module.createSimpleUser() );

      //console.log(module.createSimpleUser());

      //_createSimpleUser.should.have.property("first");
      //_createSimpleUser.should.have.property("last");


    }

  }

};
