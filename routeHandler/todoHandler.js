const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkLogin = require("../middleware/checkLogin");
const todoSchema = require("../Schemas/todoSchemas");
const Todo = new mongoose.model("Todo", todoSchema);

//GET ALL THE TODOS
router.get("/", checkLogin, (req, res) => {
  console.log(req.username);
  console.log(req.userId);
  Todo.find({})
    .select({
      _id: 0,
      __v: 0,
    })
    .limit(2)
    .exec((err, data) => {
      if (err) {
        res.status(500).json({ Error: "There was a error in server site" });
      } else {
        res.status(200).json({
          result: data,
          Message: "Successfully find data",
        });
      }
    });
});

//GET A TODOS BY ID
router.get("/:id", async (req, res) => {
  try {
    const data = await Todo.find({ _id: req.params.id });
    res.status(200).json({
      result: data,
      Message: "Successfully find data",
    });
  } catch (err) {
    res.status(500).json({ Error: "There was a error in server site" });
  }
});

//POST TODO
router.post("/", (req, res) => {
  const newTodo = new Todo(req.body);
  newTodo.save((err) => {
    if (err) {
      res.status(500).json({ Error: "There was a error in server site" });
    } else {
      res.status(200).json({ Message: "Todo was inserted Successfully" });
    }
  });
});

//POST MULTIPLE TODO
router.post("/all", (req, res) => {
  Todo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({ Error: "There was a error in server site" });
    } else {
      res.status(200).json({ Message: "Todos were inserted Successfully" });
    }
  });
});

//PUT TODO
router.put("/:id", (req, res) => {
  Todo.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        status: "active",
      },
    },
    {
      new: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) {
        res.status(500).json({ Error: "There was a error in server site" });
      } else {
        res.status(200).json({ Message: "Todo was updated Successfully" });
      }
    }
  );
});

//DELETE TODO
router.delete("/:id", (req, res) => {
  Todo.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).json({ Error: "There was a error in server site" });
    } else {
      res.status(200).json({ Message: "Todo was Deleted Successfully" });
    }
  });
});
router.delete("/", (req, res) => {
  Todo.deleteMany({}, (err) => {
    if (err) {
      res.status(500).json({ Error: "There was a error in server site" });
    } else {
      res.status(200).json({ Message: "Todo was Deleted Successfully" });
    }
  });
});

//Export module
module.exports = router;
