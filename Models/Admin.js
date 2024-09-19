const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  number: String,
});

const AdminModel = mongoose.model('Admin', adminSchema);

module.exports = AdminModel;
