const mongoose = require("mongoose");

const TasksSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  decription: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
  },
  deadline: {
    type: Date,
  },
  addedProperties: {
    type: Array,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Tasks = mongoose.model("task", TasksSchema);
