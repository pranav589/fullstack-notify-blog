import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./BlogDetail.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Divider, IconButton, Typography } from "@mui/material";
import { Markup } from "interweave";
import LikeDisLike from "../../components/likeDisLike/LikeDisLike";
import Comments from "../../components/comment/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../../context/authContext";
import Save from "../../components/save/Save";
import Loader from "../../components/loader/Loader";

function BlogDetail() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [blog, setBlog] = useState([]);
  const [commentLists, setCommentLists] = useState([]);
  const params = useParams();
  const userId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(false);

  const variable = {
    blogId: params.id,
  };

  useEffect(() => {
    setIsLoading(true);
    axios.post("/api/blog/getBlog", variable).then((response) => {
      if (response.data.success) {
        setBlog(response.data.blog);
        setIsLoading(false);
      } else {
        toast.error("Couldn't get blog");
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    axios.post("/api/comment/getComments", variable).then((res) => {
      if (res.data.success) {
        setCommentLists(res.data.comments);
      } else {
        console.log("failed to fetch");
      }
    });
  }, []);

  const updateComment = (newComment) => {
    setCommentLists(commentLists.concat(newComment));
  };

  const deleteBlog = (blogId) => {
    if (user) {
      axios.post("/api/blog/deleteBlog", { blogId: blogId }).then((res) => {
        if (res.data.success) {
          toast.success("Blog is deleted!");
          navigate("/");
        } else {
          toast.error("Failed to delete!");
        }
      });
    }
  };

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

  if (blog.writer) {
    return (
      <div className="blogDetail">
        <div className="blogDetail__titles">
          <Typography variant="h5" className="blogDetail__mainTitle">
            {blog?.title}
          </Typography>
          <Typography variant="subtitle1">{blog?.description}</Typography>
        </div>
        <Divider />
        <div className="blogDetail__interactions">
          <Link
            to={`/user/${blog?.writer?._id}`}
            className="blogDetail__userDetail"
          >
            <img
              src={blog.writer.image}
              alt={blog.writer.name}
              className="blogDetail__userImg"
            />
            <p>{blog?.writer?.name}</p>
          </Link>
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
          </div>
        </div>
        <Divider />
        <div className="blogDetail__markup">
          <Markup content={blog.content} />
        </div>
        <Divider />
        <Comments
          commentLists={commentLists}
          blogId={blog._id}
          refreshFunction={updateComment}
        />
      </div>
    );
  }

  return (
    <div>
      <h6>Loading....</h6>
    </div>
  );
}

export default BlogDetail;
