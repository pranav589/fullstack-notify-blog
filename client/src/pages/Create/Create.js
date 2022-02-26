import React, { useContext, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./Create.css";
import { Button, TextField, Typography } from "@mui/material";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Create() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();
  const { user, userData } = useContext(AuthContext);
  console.log(user);
  const [open, setOpen] = useState(false);

  var richMessage = "";
  const handleEditorChange = (e) => {
    richMessage = e.target.getContent();
    console.log("Rich Message was updated:", richMessage);
  };

  const handlePublish = (e) => {
    e.preventDefault();
    console.log("clikc");
    if (!user) {
      return alert("Login");
    }

    const variables = {
      content: richMessage,
      userID: localStorage.getItem("userId"),
      title: title,
      description: desc,
    };
    axios.post("/api/blog/createPost", variables).then((response) => {
      if (response) {
        toast.success("Post Created!");
        richMessage = "";
        navigate("/");
      }
    });
  };

  return (
    <div className="create">
      <Typography
        variant="h5"
        style={{ textAlign: "center", paddingBottom: "1rem" }}
      >
        Create your blog post..
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
          initialValue=""
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
        onClick={handlePublish}
        className="create__publish"
      >
        Publish
      </Button>
    </div>
  );
}

export default Create;
