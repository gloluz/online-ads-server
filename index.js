const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");

const user = require("./routes/user");
const offer = require("./routes/offer");

const app = express();
app.use(formidableMiddleware());

mongoose.connect("mongodb://localhost/LeBonCoin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

app.use(user);

app.use(offer);

app.all("*", (req, res) => {
  res.json({ message: "Page not found" });
});

app.listen(3000, () => {
  console.log("Server Started");
});
