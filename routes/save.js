const express = require("express");
const router = express.Router();

const { Save } = require("../models/saveModel");

const { auth } = require("../middleware/auth");

router.post("/saveNumber", (req, res) => {
  Save.find({ blogId: req.body.blogId }).exec((err, save) => {
    if (err) return res.status(400).send(err);

    res.status(200).json({ success: true, saveNumber: save.length });
  });
});

router.post("/saved", (req, res) => {
  Save.find({
    blogId: req.body.blogId,
    userFrom: req.body.userFrom,
  }).exec((err, save) => {
    if (err) return res.status(400).send(err);

    let result = false;
    if (save.length !== 0) {
      result = true;
    }

    res.status(200).json({ success: true, saved: result });
  });
});

router.post("/addToSave", (req, res) => {
  console.log(req.body);

  const save = new Save(req.body);

  save.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/removeFromSave", (req, res) => {
  Save.findOneAndDelete({
    blogId: req.body.blogId,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, doc });
  });
});

router.post("/getSavedBlog", (req, res) => {
  Save.find({ userFrom: req.body.userFrom })
    .populate("userFrom")
    .exec((err, saves) => {
      if (err) return res.status(400).send(err);

      return res.status(200).json({ success: true, saves });
    });
});

module.exports = router;
