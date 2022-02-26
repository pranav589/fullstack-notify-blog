const express = require("express");
const router = express.Router();
const { Blog } = require("../models/blogModel");

const { auth } = require("../middleware/auth");

router.post("/createPost", (req, res) => {
  let blog = new Blog({
    content: req.body.content,
    writer: req.body.userID,
    title: req.body.title,
    description: req.body.description,
  });

  blog.save((err, postInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true, postInfo });
  });
});

router.get("/getBlogs", (req, res) => {
  Blog.find()
    .populate("writer")
    .exec((err, blogs) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, blogs });
    });
});

router.post("/getBlog", (req, res) => {
  Blog.findOne({ _id: req.body.blogId })
    .populate("writer")
    .exec((err, blog) => {
      if (err) return res.status(400).send(err);

      res.status(200).json({ success: true, blog });
    });
});

router.post("/deleteBlog", (req, res) => {
  console.log(req.body);
  Blog.findByIdAndDelete({ _id: req.body.blogId }).exec((err, blog) => {
    if (err) return res.status(400).send(err);
    res.json({ success: true });
  });
});

router.post("/editBlog", (req, res) => {
  const { title, content, description, blogId } = req.body;
  Blog.findOneAndUpdate(
    { _id: blogId },
    {
      title,
      description,
      content,
    }
  ).exec((err, blog) => {
    if (err) return res.status(400).send(err);
    return res.json({ success: true, blog });
  });
});

module.exports = router;
