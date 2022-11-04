const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const router = require("./routes");
const { connectToDb, db } = require("./model/db");
const categoryRouter = require("./routes/category");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/categories", categoryRouter);

app.use("/", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  connectToDb();
});
