const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "Minimum should be 3 Characters"],
    maxlength: [30, "Maximum limit is 30 Characters"],
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: function(value) {
          // Basic email validation - checking for "@" and a valid domain
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
      },
      message: props => `${props.value} is not a valid email address!`
  }
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  tc: {
    type: Boolean,
    trim: true,
    required: true,
  },
});


const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
