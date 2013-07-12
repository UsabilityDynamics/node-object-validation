###*
* Object Validation
*
* Validation manager.
*
* @module object-validation
* @author potanin@UD
* @constructor
###
require( 'abstract' ).createModel ( model, prototype ) ->

  # Add Utility shortcut
  utility = require( 'abstract' ).utility

  # Constructor Properties
  model.properties
    validate: get: -> ( target, schema ) -> model::validate.call( target, schema )
    keys: get: -> ( target, schema ) -> model::keys.call( target, schema )

  # Instance Properties
  model.properties @prototype,

    # Validate
    #
    # @params schema {Object} Validation schema.
    # @params options {Object} Validation options.
    # @returns {Object} Validation result.
    validate: ( schema, options ) ->
      result = require( './engine' ).create( this, schema, options )

      # Clean-up keys
      result.keys = utility.unique( result.keys )

      # Return validation result
      result;

    # Return absolute validation keys
    #
    # @params schema {Object} Validation schema.
    # @returns {Object} Reduce result.
    keys: ( schema, options ) ->
      result = require( './engine' ).create( this, schema, options )

      # Clean-up keys
      result.keys = utility.unique( result.keys )

  # Instantiation Handler
  model.defineInstance ( schema, options ) ->

    # Set Schema and Options
    @set 'schema', schema
    @set 'validation', options

    # Call Validation in context
    require( './engine' ).create( this, schema, options )

  # Export Abstrat Model as the module
  module.exports = model
