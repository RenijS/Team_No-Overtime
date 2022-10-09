const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxLength: 32,
    trim: true,
  },
  remindDate: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
  },
});

const Reminder = mongoose.model("Reminder", reminderSchema);

module.exports = Reminder;
