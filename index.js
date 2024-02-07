require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const characterRoutes = require("./routes/character");
const comicsRoutes = require("./routes/comic");
app.use(characterRoutes);
app.use(comicsRoutes);

app.get("*", (res) => {
  res.json("Page not found");
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server started");
});
