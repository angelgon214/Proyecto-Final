import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, isAuthenticated, isTokenExpired, fetchInfo } from "../services/AuthService";

export default function Home() {
  const navigate = useNavigate();
  const [validSession, setValidSession] = useState(isAuthenticated());
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = () => {
      if (isTokenExpired()) {
        logout();
        setValidSession(false);
        navigate("/login");
      }
    };

    const loadInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchInfo();
        setInfo(data);
      } catch (err) {
        setError("No se pudo cargar la información del proyecto.");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    loadInfo();

    const interval = setInterval(checkSession, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  if (!validSession) return null;

  const handleLogout = () => {
    logout();
    setValidSession(false);
    navigate("/login");
  };

  return (
    <div className="container mt-5 text-center">
      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <>
          <p><strong>Nombre:</strong> {info.alumno.nombre}</p>
          <p><strong>Grado:</strong> {info.alumno.grado}</p>
          <p><strong>Maestro:</strong> {info.alumno.profesor || "No especificado"}</p>
          <p><strong>Grupo:</strong> {info.alumno.grupo}</p>
          <p><strong>Versión de Node.js:</strong> {info.nodeVersion}</p>
          <p><strong>Descripción del proyecto:</strong> {info.description}</p>
        </>
      )}

      <div className="d-grid gap-2">
        <Link to="/logs">
          <button className="btn btn-primary w-100">Ver Logs</button>
        </Link>
      </div>

      <div className="mt-4">
        <button className="btn btn-danger" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}