const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  breed: String,
  gender: String,
  age: Number,
  address: String,
  image: String,
  adoptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },  
  donatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },  
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Pet', petSchema);
