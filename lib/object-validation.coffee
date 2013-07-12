###*
* Object Validation
*
* -
*
* @module object-validation
* @author potanin@UD
* @constructor
###
require( 'abstract' ).createModel ( model, prototype ) ->

  # Set JSON-Schema as the Engine
  model.engine require( 'json-schema' ).validate

  # Add Utility shortcut
  utility = require( 'abstract' ).utility

  # Constructor Properties
  model.properties
    utility: utility
    reduce: utility.noop
    validate: model.engine()
    defaults: utility.defaults

  # Instance Properties
  model.properties @prototype,
    validate: ( schema ) -> model.validate( this, schema )
    reduce: ( schema ) -> model.reduce( this, reduce )

  # Instantiation Handler
  model.defineInstance ( schema, options ) ->

    # Set Schema and Options
    @set 'schema', schema
    @set 'validation', options

    # Call Validation in context
    model.engine( this, schema, options )

  # Export Abstrat Model as the module
  module.exports = model
