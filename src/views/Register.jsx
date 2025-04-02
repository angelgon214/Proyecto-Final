import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/AuthService";
import "bootstrap/dist/css/bootstrap.min.css";
import { BiShow, BiHide } from "react-icons/bi";
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    const result = await register(username, email, password);
    if (result.success) {
      toast.success('Reistro exitoso');

      setTimeout(() => {
        navigate("/login");
      }, 4000);

    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light text-light">
      <div className="card shadow-lg p-4" style={{ width: '400px', borderRadius: '5px' }}>
            <h2 className="text-center mb-4 text-dark">Registro</h2>

            <div className="mb-3">
              <label className="form-label text-dark">Nombre de Usuario</label>
              <input
                type="text"
                className="form-control border"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-dark">Correo Electrónico</label>
              <input
                type="email"
                className="form-control border"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-dark">Contraseña</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control border"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="btn border-0 bg-transparent text-muted"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <BiHide size={20} /> : <BiShow size={20} />}
                </button>
              </div>
            </div>

            <button className="btn btn-dark w-100" onClick={handleRegister}>
              Registrar
            </button>

            <div className="text-center mt-3">
              <a href="/login" className="text-primary text-decoration-none">
                ¿Ya tienes una cuenta? Click aquí
              </a>
            </div>

            <ToastContainer />
          </div>
        </div>
  );
};

export default Register;
