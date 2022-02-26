const express = require("express");
const router = express.Router();
const { Comment } = require("../models/commentModel");

const { auth } = require("../middleware/auth");

router.post("/saveComment", auth, (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });

    Comment.find({ _id: comment._id })
      .populate("writer")
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, result });
      });
  });
});

router.post("/getComments", auth, (req, res) => {
  Comment.find({ blogId: req.body.blogId })
    .populate("writer")
    .exec((err, comments) => {
      if (err) return res.status(400).json({ success: false, err });
      res.json({ success: true, comments });
    });
});

module.exports = router;
