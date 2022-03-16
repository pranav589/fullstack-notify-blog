import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import "./Save.css";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";

function Save(blog) {
  const { user, userData } = useContext(AuthContext);
  const userFrom = localStorage.getItem("userId");

  const [saveNumber, setSaveNumber] = useState(0);
  const [saved, setSaved] = useState(false);

  const variables = {
    blogId: blog.blog._id,
    userFrom: userFrom,
    blogTitle: blog.blog.title,
    blogDesc: blog.blog.description,
    blogWriter: blog?.blog?.writer,
  };
  const handleSave = () => {
    if (!user) {
      return toast.error("Please Login first");
    }

    if (saved) {
      axios.post("/api/save/removeFromSave", variables).then((response) => {
        if (response.data.success) {
          setSaveNumber(saveNumber - 1);
          setSaved(!saved);
          toast.success("Removed from saved!");
        } else {
          toast.error("Failed!");
        }
      });
    } else {
      axios.post("/api/save/addToSave", variables).then((response) => {
        if (response.data.success) {
          setSaveNumber(saveNumber + 1);
          setSaved(!saved);
          toast.success("Saved!");
        } else {
          toast.error("Failed!");
        }
      });
    }
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    try {
      axios
        .post("/api/save/saveNumber", variables, { cancelToken: source.token })
        .then((response) => {
          if (response.data.success) {
            setSaveNumber(response.data.saveNumber);
          } else {
            toast.error("Failed to get Saved Number");
          }
        });

      axios
        .post("/api/save/saved", variables, { cancelToken: source.token })
        .then((response) => {
          if (response.data.success) {
            setSaved(response.data.saved);
          } else {
            toast.error("Failed to get Saved Information");
          }
        });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("cancelled");
      } else {
        throw error;
      }
    }
    return () => {
      source.cancel();
    };
  }, []);

  return (
    <div className="save">
      <IconButton onClick={handleSave}>
        {!saved ? (
          <BookmarkAddedOutlinedIcon fontSize="large" color="primary" />
        ) : (
          <BookmarkAddedIcon fontSize="large" color="primary" />
        )}
      </IconButton>
      <span>{saved ? "Remove" : "Add"}</span>
    </div>
  );
}

export default Save;
