const express = require("express");
const QuesRoute = require("./questions");
const UserRouter = require("./User");
const router = express.Router();

router.use("/user", UserRouter);
router.use("/questions", QuesRoute )

module.exports = router;
