const jwt = require("jsonwebtoken");
const { db } = require("../model/db");
const jwtKey = require("../model/key");
const bcrypt = require("bcrypt");

async function authmdw(req, res, next) {
  if (!req.headers.authorization) {
    res.send("Miss authorization");
    res.status(401);
    return;
  } else {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
  
    let decode;
    try {
      decode = jwt.verify(token, jwtKey);
      // console.log(decode);
    } catch (error) {
      res.json(error.message);
      res.status(401);
      return;
    }
    if (decode) {
      const users = await db.User.find({}).toArray();
      const admins = await db.Admin.find({}).toArray();
      const index = users.findIndex((el) => {
        let checkPassword = bcrypt.compare(req.body.password, el.password);
        return decode.email === el.email && checkPassword;
      });
  
      const idx = admins.findIndex( (el) => {
        let checkPassword = bcrypt.compare(req.body.password, el.password);
        return decode.email === el.email && checkPassword;
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
}

module.exports = authmdw;
