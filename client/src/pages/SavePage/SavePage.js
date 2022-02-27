import { Divider, IconButton, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import "./SavePage.css";
import axios from "axios";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import LikeDisLike from "../../components/likeDisLike/LikeDisLike";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";

import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";

function SavePage() {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const userId = localStorage.getItem("userId");
  let variable = {
    userFrom: localStorage.getItem("userId"),
  };

  const fetchBlogs = async () => {
    axios.post("/api/save/getSavedBlog", variable).then((response) => {
      if (response.data.success) {
        setBlogs(response.data.saves);
      } else {
        toast.error("Couldnt get blog`s lists");
      }
    });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const deleteBlog = (blogId) => {
    if (user) {
      axios.post("/api/blog/deleteBlog", { blogId: blogId }).then((res) => {
        if (res.data.success) {
          fetchBlogs();
          toast.success("Blog is deleted!");
        } else {
          toast.error("Failed to delete!");
        }
      });
    }
  };

  const removeSave = (blogId, userFrom) => {
    axios
      .post("/api/save/removeFromSave", {
        blogId: blogId,
        userFrom: userFrom,
      })
      .then((res) => {
        if (res.data.success) {
          console.log(res.data);
          fetchBlogs();
          toast.success("Removed from save!");
        } else {
          toast.error("Failed to remove!");
        }
      });
  };

  const renderBlog = blogs.map((blog) => {
    return (
      <div className="blog" key={blog._id}>
        <Link to={`/blog/${blog?.blogId}`} className="blog__titles">
          <Typography variant="h6">{blog?.blogTitle}</Typography>
          <Typography variant="subtitle1">{blog?.blogDesc}</Typography>
        </Link>
        <Divider style={{ marginTop: "0.5rem" }} />
        <div className="home__interaction">
          <Link
            to={`/user/${blog?.blogWriter?._id}`}
            className="home__userDetail"
          >
            <img src={blog?.blogWriter?.image} alt={blog?.blogWriter?.name} />
            <p>{blog?.blogWriter?.name}</p>
          </Link>
          <div className="home__actions">
            <LikeDisLike blog={blog} />

            <div
              className="save"
              onClick={() => removeSave(blog?.blogId, blog?.userFrom?._id)}
            >
              <IconButton>
                <BookmarkAddedIcon fontSize="large" color="primary" />
              </IconButton>
              <span>Remove</span>
            </div>
            {userId === blog?.userFrom?._id && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <IconButton onClick={() => deleteBlog(blog._id)}>
                  <DeleteIcon fontSize="large" color="primary" />
                </IconButton>
                <span>Delete</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      {user ? (
        <>
          <Typography
            variant="h6"
            mb={2}
            mt={2}
            style={{ color: "#191919", textAlign: "center" }}
          >
            Your Saved Blogs
          </Typography>
          <div className="savePage">{renderBlog}</div>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Typography variant="h6" mb={2} mt={2} style={{ color: "#191919" }}>
            Please Login to read your saved blogs!
          </Typography>
          <Link
            to="/login"
            style={{ textDecoration: "underline", color: "#191919" }}
          >
            Click here.
          </Link>
        </div>
      )}
    </>
  );
}

export default SavePage;
