// grab the things we need
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// create a schema
let userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: Date,
  updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
let User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;