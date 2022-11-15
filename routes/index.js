const express = require("express");
const AdminRouter = require("./Admin");
const QuesRoute = require("./questions");
const SessionRoute = require("./Session");
const UserRouter = require("./User");
const router = express.Router();

router.use("/user", UserRouter);
router.use("/questions", QuesRoute);
router.use("/admin", AdminRouter);
router.use("/session", SessionRoute);

module.exports = router;
