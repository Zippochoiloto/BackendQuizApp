const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const router = require("./routes");
const {connectToDb} = require("./model/db")
const bodyParser = require("body-parser");

app.use(bodyParser.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));


app.use("/", router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    connectToDb();
  });