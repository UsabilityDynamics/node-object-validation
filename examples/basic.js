
var validate = require( 'object-validation' ).validate;

var schema = {
  name: {
    required: true
  },
  age: {
    format: "number",
    required: true
  }
}

// Will fail because missing "age"
console.log( validate({
  "name": "John Smith"
}, schema ).is_valid );

// Will validate
console.log( validate({
  "name": "John Smith",
  "age": 30
}, schema ).is_valid );
