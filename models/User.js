const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  account: {
    username: {
      type: String,
      required: true,
    },
  },
  favourites: {
    comics: [{ id: String, title: String, picture: String }],
    characters: [String],
  },
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});
module.exports = User;
