const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../Schemas/userSchema");
const User = new mongoose.model("User", userSchema);

//GET ALL THE
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ Message: "Signup was Created Successfully" });
  } catch {
    res.status(500).json({ Error: "Signup failed" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });

    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      console.log(isValidPassword);
      if (isValidPassword) {
        const token = jwt.sign(
          {
            username: user[0].username,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.status(200).json({
          access_token: token,
          message: "Login Successful",
        });
      } else {
        res.status(401).json({ Error: "Authentication failed" });
      }
    } else {
      res.status(401).json({ Error: "Authentication faileds" });
    }
  } catch (error) {
    res.status(401).json({ Error: "Authentication failed" });
  }
});

//Export module
module.exports = router;
