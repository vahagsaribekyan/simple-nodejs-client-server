// grab the things we need
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// create a schema
let userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  city: String,
  texts: [{ body: String, date: { type: Date, default: Date.now }}],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// the schema is useless so far
// we need to create a model using it
let User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;