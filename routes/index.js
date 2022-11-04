const express = require("express");
const AdminRouter = require("./Admin");
const QuesRoute = require("./questions");
const UserRouter = require("./User");
const router = express.Router();

router.use("/user", UserRouter);
router.use("/questions", QuesRoute);
router.use("/admin", AdminRouter);

module.exports = router;
