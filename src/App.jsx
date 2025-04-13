import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { isAuthenticated } from "./services/AuthService";
import Login from "./views/Login";
import Home from "./views/Home";
import Register from "./views/Register";
import Logs from "./views/Logs";
import ForgotPassword from "./views/Restablecercontraseña";
import "bootstrap/dist/css/bootstrap.min.css";

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/Login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restablecer/contraseña" element={<ForgotPassword />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/logs" element={<PrivateRoute><Logs /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/Login" />} />
      </Routes>
    </Router>
  );
};

export default App;
