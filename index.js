const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const { connectToDb, db } = require("./db");
app.use(bodyParser.json({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello");
  console.log("database", db);
});


app.listen(port, (error) => {
  if (error) {
    return;
  }
  console.log(`Example app listening on port ${port}`);
  connectToDb();
});
