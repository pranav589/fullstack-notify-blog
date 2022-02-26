import { Divider, IconButton, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import SingleComment from "../singleComment/SingleComment";
import ReplyComment from "../replyComment/ReplyComment";
import SendIcon from "@mui/icons-material/Send";
import "./Comment.css";
import { AuthContext } from "../../context/authContext";

function Comments(props) {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const userId = localStorage.getItem("userId");

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const variables = {
      content: comment,
      writer: userId,
      blogId: props.blogId,
    };

    axios.post("/api/comment/saveComment", variables).then((res) => {
      if (res.data.success) {
        setComment("");
        props.refreshFunction(res.data.result);
      } else {
        toast.error("Failed to comment!");
      }
    });
  };

  return (
    <div className="comments">
      <br />
      <Typography variant="h6" style={{ marginBottom: "0.5rem" }}>
        Comments
      </Typography>
      <Divider style={{ marginBottom: "0.5rem" }} />
      {props.commentLists &&
        props.commentLists.map(
          (comment, index) =>
            !comment.responseTo && (
              <div key={comment._id}>
                <SingleComment
                  comment={comment}
                  blogId={props.blogId}
                  refreshFunction={props.refreshFunction}
                />
                <ReplyComment
                  commentLists={props.commentLists}
                  blogId={props.blogId}
                  parentCommentId={comment._id}
                  refreshFunction={props.refreshFunction}
                />
              </div>
            )
        )}
      {user && (
        <div style={{ display: "flex" }}>
          <TextField
            fullWidth
            onChange={handleChange}
            value={comment}
            placeholder="Comment Here"
          />
          <IconButton onClick={handleSubmit}>
            <SendIcon fontSize="large" color="primary" />
          </IconButton>
        </div>
      )}
    </div>
  );
}

export default Comments;
