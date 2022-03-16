import React, { useContext } from "react";

import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import PrivateRoute from "./PrivateRoute";
import NavBar from "./components/navbar/Navbar";

import Create from "./pages/Create/Create";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BlogDetail from "./pages/BlogDetail/BlogDetail";
import SavePage from "./pages/SavePage/SavePage";
import MyBlogs from "./pages/MyBlogs/MyBlogs";
import EditPage from "./pages/EditPage/EditPage";
import SpecificUserBlog from "./pages/SpecificUserBlog/SpecificUserBlog";

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={!user ? <Register /> : <Home />} />
          <Route index element={<Home />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/user/:id" element={<SpecificUserBlog />} />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <Create />
              </PrivateRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <PrivateRoute>
                <SavePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/myBlogs"
            element={
              <PrivateRoute>
                <MyBlogs />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <EditPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}
