const Tasks = require("../../models/Tasks");
const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { title } = req.body;
  const newTask = new Tasks({
    title: title,
    description: req.body?.description || "",
    status: req.body?.status || "inprogress",
    priority: req.body?.priority || "",
    deadline: req.body?.deadline || "",
    deadline: req.body?.deadline || "",
    addedProperties: req.body?.addedProperties || [],
    user: req.user.id,
  });
  const task = await newTask.save();
  return res.status(200).json({ msg: "Task Created Successfully", data: task });
});

router.get("/", auth, async (req, res) => {
  const tasks = await Tasks.find({ user: req.user.id });
  // console.log("🚀 ~ router.get ~ tasks:", tasks);
  return res.status(200).json(tasks);
});

module.exports = router;
