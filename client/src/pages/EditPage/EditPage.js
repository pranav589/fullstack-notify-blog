import React, { useContext, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "../Create/Create.css";
import { Button, TextField, Typography } from "@mui/material";
import { AuthContext } from "../../context/authContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function EditPage() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const [content, setContent] = useState("");
  const { user, userData } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  var richMessage = "";
  const handleEditorChange = (e) => {
    richMessage = e.target.getContent();
  };

  useEffect(() => {
    const getBlog = async () => {
      if (params.id) {
        const res = await axios.post(`/api/blog/getBlog`, {
          blogId: params.id,
        });
        setTitle(res.data.blog.title);
        setDesc(res.data.blog.description);
        setContent(res.data.blog.content);
      }
    };
    getBlog();
  }, [params.id]);

  richMessage = content;

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("clikc");
    if (!user) {
      return toast.error("Login");
    }

    const variables = {
      content: richMessage,
      userID: localStorage.getItem("userId"),
      title: title,
      description: desc,
      blogId: params.id,
    };
    axios.post("/api/blog/editBlog", variables).then((response) => {
      if (response) {
        toast.success("Post Updated!");
        richMessage = "";
        navigate("/myBlogs");
      }
    });
  };

  return (
    <div className="create">
      <Typography
        variant="h5"
        style={{ textAlign: "center", paddingBottom: "1rem" }}
      >
        Update your blog post..
      </Typography>
      <div className="create__textFields">
        <TextField
          margin="normal"
          required
          id="title"
          label="Blog Title"
          name="title"
          className="create__textField"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="desc"
          label="Small description of your blog"
          name="desc"
          className="create__textField"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      <div className="create__editor">
        <Editor
          apiKey="tsjggcqd1749ircqxch1gaaje751c4y3e1aieoahhn90bn7l"
          name="message"
          initialValue={content}
          init={{
            height: "60vh",
            // width: "auto",
            menubar: true,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help wordcount",
            ],
            toolbar:
              "undo redo | formatselect | " +
              "bold italic backcolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
          onChange={handleEditorChange}
          outputFormat={"text"}
          onBlur={() => setOpen(false)}
        />
      </div>

      <Button
        variant="contained"
        onClick={handleUpdate}
        className="create__publish"
      >
        Update
      </Button>
    </div>
  );
}

export default EditPage;
