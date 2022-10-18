const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxLength: 32,
    trim: true,
  },
  phone: {
    type: Number,
    required: true,
    maxLength: 10,
    trim: true,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
