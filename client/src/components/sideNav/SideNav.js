import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AddBoxIcon from "@mui/icons-material/AddBox";
import StreamIcon from "@mui/icons-material/Stream";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import FaceIcon from "@mui/icons-material/Face";
import "./SideNav.css";
import { AuthContext } from "../../context/authContext";

export default function SwipeableTemporaryDrawer() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sideNav">
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        anchor="left"
        open={isOpen}
        onClose={onClose}
        onOpen={() => setIsOpen(true)}
      >
        <div className="drawer">
          <Box
            textAlign="center"
            p={2}
            fontSize={24}
            className="drawer__heading"
          >
            <StreamIcon className="drawer__icon" /> Notify
          </Box>
          <Divider />
          <List>
            <ListItem button onClick={() => navigate("/")}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItem>
            {user ? (
              <>
                <ListItem button onClick={() => navigate("/create")}>
                  <ListItemIcon>
                    <AddBoxIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Create Blog"} />
                </ListItem>
                <ListItem button onClick={() => navigate("/saved")}>
                  <ListItemIcon>
                    <BookmarkAddedIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Saved Blogs"} />
                </ListItem>
                <ListItem button onClick={() => navigate("/myBlogs")}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary={"My Blogs"} />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button onClick={() => navigate("/login")}>
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Login"} />
                </ListItem>
                <ListItem button onClick={() => navigate("/register")}>
                  <ListItemIcon>
                    <FaceIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Register Account"} />
                </ListItem>
              </>
            )}
          </List>
        </div>
      </SwipeableDrawer>
    </div>
  );
}
