const jwt = require("jsonwebtoken");
const { db } = require("../model/db");
const PRIVATE_KEY = require("../model/key")

async function authmdw(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token)
  let decode;
  try {
    decode = jwt.verify(token, PRIVATE_KEY);
    console.log(decode)
  } catch (error) {
    res.json(error.message);
    res.status(401);
    return;
  }
  if (decode) {
    const users = await db.User.find({}).toArray();
    const admins = await db.Admin.find({}).toArray();
    const index = users.findIndex((el) => {
        return decode.email === el.email && decode.password === el.password;
      });

    const idx = admins.findIndex((el) => {
      return decode.email === el.email && decode.password === el.password;
    });

    if (index < 0 && idx < 0) {
      res.send("User is not existed");
      res.status(401);
      return;
    } else if (index > 0) {
      req["userRole"] = "user";
      next();
    } else if (idx > 0) {
      req["userRole"] = "admin";
      next();
    }
  } else {
    res.send("JWT is not valid");
    res.status(401);
    return;
  }
}

module.exports = authmdw;
