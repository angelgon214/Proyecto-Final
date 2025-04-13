import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://practica-syf7.onrender.com/api";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    if (response.data.requiresMFA) {
      return { 
        success: true, 
        requiresMFA: true, 
        qrCodeUrl: response.data.qrCodeUrl 
      };
    }

    if (response.data.token) {
      const token = response.data.token;
      localStorage.setItem("token", token);
      return { 
        success: true, 
        token 
      };
    }

    return { success: false, message: "Error desconocido" };

  } catch (error) {
    if (error.response) {
      return { 
        success: false, 
        message: error.response.data.message || "Error del servidor" 
      };
    } else if (error.request) {
      return { 
        success: false, 
        message: "No se pudo conectar con el servidor" 
      };
    } else {
      return { 
        success: false, 
        message: "Error desconocido" 
      };
    }
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password });
    return { 
      success: true, 
      message: response.data.message 
    };
  } catch (error) {
    if (error.response) {
      return { 
        success: false, 
        message: error.response.data.message || "Error del servidor" 
      };
    } else {
      return { 
        success: false, 
        message: "Error al registrar" 
      };
    }
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al verificar el correo');
  }
};

export const verifyOtpReset = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp-reset`, { email, otp });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al verificar el código MFA');
  }
};

export const resetPassword = async (email, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, { email, newPassword });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar la contraseña');
  }
};

export const verifyOTP = async (email, token) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, {
      email,
      token,
    });
    if (response.data.success) {
      localStorage.setItem("token", response.data.token);

      return { 
        success: true, 
        message: "Codigo verificado correctamente." 
      };
    }
    return { 
      success: false, 
      message: response.data.message 
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Error al verificar el codigo.",
    };
  }
};

export const fetchLogsData = async () => {
  try {
    const response = await axios.get(`${API_URL}/logs`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener logs:", error);
    throw error;
  }
};

export const fetchLogsBySeverity = async () => {
  try {
    const response = await axios.get(`${API_URL}/logs/severity`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener logs por severidad:", error);
    throw error;
  }
};

export const fetchLogsByMethod = async () => {
  try {
    const response = await axios.get(`${API_URL}/logs/methods`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener logs por método:", error);
    throw error;
  }
};

export const fetchAvgResponseTimes = async () => {
  try {
    const response = await axios.get(`${API_URL}/logs/response-times`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener tiempos de respuesta:", error);
    throw error;
  }
};

export const fetchLogsByUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/logs/users`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener logs por usuario:", error);
    throw error;
  }
};

export const fetchInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/getInfo`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la información:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    return decoded?.exp && decoded.exp < Date.now() / 1000;

  } catch (error) {
    return true;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  return token && !isTokenExpired();
};
