var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tripsSchema = new Schema({
  name: String,
  user: String,
  test: String,
  activities: [{place_name: String, rating: String, icon: String, address: String, placeid: String}]
})

module.exports = mongoose.model('Trip', tripsSchema)


// {
//   type: Schema.ObjectId,
//   ref: 'User'
// }
