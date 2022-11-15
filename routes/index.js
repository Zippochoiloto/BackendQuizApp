const express = require("express");
const authmdw = require("../middleware/auth_middleware");
const AdminRouter = require("./Admin");
const AuthRouter = require("./auth");
const OverviewRouter = require("./overview");
const QuesRoute = require("./questions");
const UserRouter = require("./User");
const router = express.Router();

router.use("/auth", AuthRouter)
router.use("/user", authmdw, UserRouter);
router.use("/questions", QuesRoute);
router.use("/admin", AdminRouter);
router.use("/overview", OverviewRouter)

module.exports = router;
