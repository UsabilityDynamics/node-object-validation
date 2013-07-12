The module is a wrapper for json-schema with convenience methods and improvements:

  - Does not trigger target object's getters during validation.

## Module Methods

  - create( config ): Creates and returns new instance of Object Validation.
  - mixin( target ): Adds the prototypal methods of Object Validation to a target object.
  - set( key, value ): Set a setting to instance meta. To set default setting use 'defaults' as key.
  - get( key ): Get a meta value.

## Instance Methods
Instance methods are available if the create() method was used to instantiate a new Object State.

  - validate( schema ): Validate against provided schema or default schema.
  - is_valid: Getter for validation status.

## Basic Usage

## Advanced Usage

## License

(The MIT License)

Copyright (c) 2013 Usability Dynamics, Inc. &lt;info@usabilitydynamics.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.