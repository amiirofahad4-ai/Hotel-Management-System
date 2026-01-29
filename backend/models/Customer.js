const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tell: {
    type: String,
    required: true
  },
  pass_no: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
