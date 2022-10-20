const express = require("express");
const UserRouter = require("./User");
const router = express.Router();

router.use("/user", UserRouter);

module.exports = router;
