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

    // Dependancies
    require( 'should' );


    module.simple_user = function() {

      var simple_user = {};

      Object.defineProperties( simple_user, {
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

      return simple_user;
    };

    module.user = function() {
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

        }

      }
    };

  },

  'Object Validation API': {

    'model has expected methods.': function() {
      var validation = require( 'object-validation' );

      // Constructor tests
      validation.should.be.a( 'function' );
      validation.should.have.property( 'defaults' );
      validation.should.have.property( 'utility' );

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
      var _instance = validation.validate( module.user(), module.schema );

      _instance.should.have.property( "valid", true );
      _instance.should.have.property( "errors" ).with.lengthOf( 0 );

    },

    /**
     * Testing failure when numerically out of range.
     *
     * @author mccarthy@UD
     */
    "handles failure as expected": function() {
      var validation = require( '../' );
      var user = module.user();

      // Set the age to a value that is out of the schema's valid range
      user.age = 40;

      var _instance = validation.validate( user, module.schema );

      _instance.should.have.property( "valid", false );
      _instance.should.have.property( "errors" ).with.lengthOf( 1 );
      _instance.errors[0].should.have.property( "property", "age" );
      //_instance.errors[0].should.have.property( "expected", 30 );
      //_instance.errors[0].should.have.property( "actual", 40 );

    },

    /**
     * Reduced object returns object based on reduced schema validation.
     */
    "reduce method returns reduced object with schema applied": function() {

      return;

      var validation = require( '../' );
      var _reduced = validation.reduce( module.user(), module.reduced_schema );

      //      _reduced.should.not.have.property( "age" );
      //      _reduced.should.not.have.property( "last" );
      //      _reduced.education.should.not.have.property( "college" );

      _reduced.should.have.property( "first" );
      _reduced.should.have.property( "occupation" );
      _reduced.should.have.property( "education" );
      _reduced.education.skills.should.have.property( "technical" ).with.lengthOf(2);
      _reduced.education.skills.should.have.property( "business" ).with.lengthOf(2);


    },

    "simple user does not return enumerable properties": function() {

      var validation = require( '../' );
      //var _simple_user = validation.validate( module.simple_user() );

      //console.log(module.simple_user());

      //_simple_user.should.have.property("first");
      //_simple_user.should.have.property("last");


    }

  },

};
