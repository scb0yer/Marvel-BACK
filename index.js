require("dotenv").config();
const express = require("express");
const { connect, default: mongoose } = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGODB_URL + "Marvel");

const characterRoutes = require("./routes/character");
const comicsRoutes = require("./routes/comic");
const userRoutes = require("./routes/user");
app.use(characterRoutes);
app.use(comicsRoutes);
app.use(userRoutes);

// app.get("*", (res) => {
//   res.json("Page not found");
// });

app.listen(process.env.PORT || 4000, () => {
  console.log("Server started");
});
