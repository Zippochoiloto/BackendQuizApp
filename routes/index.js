const express = require("express");
const authmdw = require("../middleware/auth_middleware");
const AdminRouter = require("./Admin");
const AuthRouter = require("./auth");
const OverviewRouter = require("./overview");
const QuesRoute = require("./questions");
const SessionRoute = require("./Session");
const UserRouter = require("./User");
const router = express.Router();

router.use("/auth", AuthRouter)
router.use("/user", authmdw, UserRouter);
// router.use("/user",  UserRouter);


router.use("/questions", authmdw, QuesRoute);
router.use("/admin", authmdw, AdminRouter);
router.use("/session", authmdw, SessionRoute);
router.use("/overview", OverviewRouter);

module.exports = router;
