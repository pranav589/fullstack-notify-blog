import { Divider, IconButton, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import "../Home/Home.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import LikeDisLike from "../../components/likeDisLike/LikeDisLike";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import Save from "../../components/save/Save";
import EditIcon from "@mui/icons-material/Edit";
import Loader from "../../components/loader/Loader";

function MyBlogs() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const userId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(false);

  const fetchBlogs = async () => {
    setIsLoading(true);
    axios.get("/api/blog/getBlogs").then((response) => {
      if (response.data.success) {
        setBlogs(response.data.blogs);
        setIsLoading(false);
      } else {
        toast.error("Couldnt get blog`s lists");
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const deleteBlog = (blogId) => {
    setIsLoading(true);
    if (user) {
      axios.post("/api/blog/deleteBlog", { blogId: blogId }).then((res) => {
        if (res.data.success) {
          fetchBlogs();
          toast.success("Blog is deleted!");
          setIsLoading(false);
        } else {
          toast.error("Failed to delete!");
          setIsLoading(false);
        }
      });
    }
  };

  const editBlog = (blogId) => {
    navigate(`/edit/${blogId}`);
  };

  const renderBlog = blogs.map((blog) => {
    if (blog.writer._id === userId) {
      return (
        <div className="blog" key={blog._id}>
          <Link to={`/blog/${blog._id}`} className="blog__titles">
            <Typography variant="h6">{blog?.title}</Typography>
            <Typography variant="subtitle1">{blog?.description}</Typography>
          </Link>
          <Divider style={{ marginTop: "0.5rem" }} />
          <div className="home__interaction">
            <div className="home__userDetail">
              <img src={blog.writer.image} alt={blog.writer.name} />
              <p>{blog?.writer?.name}</p>
            </div>
            <div className="home__actions">
              <LikeDisLike blog={blog} />
              <Save blog={blog} />
              {userId === blog.writer._id && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <IconButton onClick={() => deleteBlog(blog._id)}>
                    <DeleteIcon fontSize="large" color="primary" />
                  </IconButton>
                  <span>Delete</span>
                </div>
              )}
              {userId === blog.writer._id && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <IconButton onClick={() => editBlog(blog._id)}>
                    <EditIcon fontSize="large" color="primary" />
                  </IconButton>
                  <span>Edit</span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  });

  if (isLoading) {
    return (
      <Loader
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }
  if (blogs?.length === 0) {
    return (
      <Typography
        variant="h5"
        mb={2}
        mt={2}
        style={{ color: "#191919", textAlign: "center" }}
      >
        No Blogs Yet. May be create one?
      </Typography>
    );
  }

  return (
    <>
      <Typography
        variant="h5"
        mb={2}
        mt={2}
        style={{ color: "#191919", textAlign: "center" }}
      >
        Your Blogs
      </Typography>

      {user ? (
        <div className="home">{renderBlog}</div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Typography variant="h6" mb={2} mt={2} style={{ color: "#191919" }}>
            Please Login to see you blogs!
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

export default MyBlogs;
