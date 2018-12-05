
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;


var hashSchema = new Schema({
  brand: String,
  url: { type: String, required: true, unique: true },
  filename: String,
  hash: { type: String, required: true},
  created_at: Date,
  updated_at: Date
}, {collection : 'hashs'});

hashSchema.plugin(timestamps);

var Hash = mongoose.model('Hash', hashSchema);

module.exports = Hash;