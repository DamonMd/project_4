var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tripsSchema = new Schema({
  name: String,
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Trip', tripsSchema)
