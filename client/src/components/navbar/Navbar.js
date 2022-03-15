import React, { useContext, useState } from "react";
import StreamIcon from "@mui/icons-material/Stream";
import {
  Avatar,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./Navbar.css";
import SideNav from "../sideNav/SideNav";
import { AuthContext } from "../../context/authContext";
import BookmarkAdded from "@mui/icons-material/BookmarkAdded";
import AddBoxIcon from "@mui/icons-material/AddBox";
import axios from "axios";

function NavBar() {
  const { user, setUser, userData } = useContext(AuthContext);

  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    axios.get(`/api/user/logout`).then((response) => {
      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUser(null);
        navigate("/login");
        toast.success("Logout success!");
      } else {
        toast.error("Logout Failed");
      }
    });
  };

  const handleGuestLogin = async () => {
    try {
      const res = await axios.post("/api/user/login", {
        email: "guest@gmail.com",
        password: "password",
      });

      if (res.data.loginSuccess) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        setUser(true);

        toast.success("Welcome Guest!");
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="static" className="nav">
        <Toolbar>
          <SideNav
            visible={visible}
            setVisible={setVisible}
            onClose={onClose}
          />
          <StreamIcon className="header__titleIcon" />
          <Typography
            variant="h6"
            className="header__title"
            onClick={() => navigate("/")}
          >
            Notify
          </Typography>

          <div className="header__icons">
            {!user && (
              <MenuItem onClick={handleGuestLogin}>
                <Typography>Guest Login</Typography>
              </MenuItem>
            )}
            {user && (
              <IconButton onClick={() => navigate("/saved")}>
                <BookmarkAdded />
              </IconButton>
            )}
            {user && (
              <IconButton onClick={() => navigate("/create")}>
                <AddBoxIcon />
              </IconButton>
            )}
            <IconButton onClick={handleClick}>
              <Avatar sx={{ width: 30, height: 30 }} />
            </IconButton>
          </div>
        </Toolbar>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          className="dropdown"
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 3.5,
              "& .MuiAvatar-root": {
                width: 30,
                height: 30,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
        >
          {user ? (
            <div>
              <MenuItem onClick={() => navigate("/myBlogs")}>
                <ListItemIcon>
                  <AddCircleOutlineIcon />
                </ListItemIcon>
                {userData?.email}
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </div>
          ) : (
            <div>
              <MenuItem onClick={() => navigate("/login")}>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                Login
              </MenuItem>
              <MenuItem onClick={() => navigate("/register")}>
                <ListItemIcon>
                  <AddCircleOutlineIcon />
                </ListItemIcon>
                Register
              </MenuItem>
            </div>
          )}
        </Menu>
      </AppBar>
    </div>
  );
}

export default NavBar;
