import React, { useContext, useEffect, useState } from "react";
import { Avatar, Button, Paper, TextField, Typography } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import axios from "axios";
import "./Profile.css";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";

function Profile() {
  const { userData } = useContext(AuthContext);
  const [username, setUsername] = useState(userData?.user?.username);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("tokenStore");
      if (token) {
        const res = await axios.post(
          "/users/profile",
          { username },
          {
            headers: { Authorization: token },
          }
        );
        toast.success("Profile updated");
      }
    } catch (error) {
      toast.error(error.response.message);
    }
  };

  return (
    <Paper elevation={20} className="profilePage">
      <div className="profilePage__img">
        <Avatar
          src={
            "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=20&m=1223671392&s=612x612&w=0&h=lGpj2vWAI3WUT1JeJWm1PRoHT3V15_1pdcTn2szdwQ0="
          }
          className="profilePage__avatar"
        />
        <div className="file">
          <label htmlFor="file-upload" className="custom-file-upload">
            <CameraAltIcon />
          </label>
          <input id="file-upload" type="file" accept="'image/*" />
        </div>
      </div>
      <Typography variant="h6">{userData?.user?.username}</Typography>
      <Typography variant="h6">{userData?.user?.email}</Typography>
      <div className="profilePage__userData">
        <TextField
          fullWidth
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="Username"
          placeholder="Update Username"
          style={{
            marginBottom: 9,
            marginTop: 9,
          }}
        />
      </div>
      <Button
        variant="contained"
        fullWidth
        disabled={!username}
        onClick={handleUpdate}
      >
        Update
      </Button>
    </Paper>
  );
}

export default Profile;
