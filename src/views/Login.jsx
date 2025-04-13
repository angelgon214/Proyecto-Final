import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { login, verifyOTP } from '../services/AuthService';
import { BiShow, BiHide } from 'react-icons/bi'; // Cambiamos a BiShow/BiHide
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [otp, setOtp] = useState('');
  const [requiresMFA, setRequiresMFA] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const data = await login(email, password);
    if (data.success) {
      if (data.requiresMFA) {
        if (data.qrCodeUrl) {
          setQrCode(data.qrCodeUrl);
        }
        setRequiresMFA(true);
      } else {
        toast.success('Inicio de sesión exitoso');
        setTimeout(() => {
          navigate('/home');
        }, 4000);
      }
    } else {
      toast.error(data.message);
    }
  };

  const handleVerifyOTP = async () => {
    const data = await verifyOTP(email, otp);
    if (data.success) {
      toast.success('Inicio de sesión exitoso');
      setTimeout(() => {
        navigate('/home');
      }, 4000);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light text-light">
      <div className="card shadow-lg p-4" style={{ width: '400px', borderRadius: '5px' }}>
        <h2 className="text-center mb-4 text-dark">Iniciar sesión</h2>

        {!requiresMFA ? (
          <>
            <div className="mb-3">
              <label className="form-label text-dark">Correo electrónico</label>
              <input
                className="form-control border"
                placeholder="Correo electrónico"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-dark">Contraseña</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  className="form-control border"
                  placeholder="Contraseña"
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
            <button className="btn btn-dark w-100" onClick={handleLogin}>
              Login
            </button>
            <div className="text-center mt-3">
              <a href="/restablecer/contraseña" className="text-primary text-decoration-none">
                He olvidado mi contraseña
              </a>
            </div>
          </>
        ) : (
          <>
            {qrCode && (
              <div className="text-center">
                <p>Escanea el QR con Google Authenticator:</p>
                <img src={qrCode} alt="QR Code" className="img-fluid" />
              </div>
            )}
            <div className="mb-3">
              <label className="form-label text-dark">Código</label>
              <input
                type="text"
                className="form-control border"
                placeholder="Ingresa el código"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button className="btn btn-dark w-100" onClick={handleVerifyOTP}>
              Verificar código
            </button>
          </>
        )}

        <div className="mt-3 text-center">
          <a href="/register" className="text-primary text-decoration-none">
            ¿No tienes una cuenta? Regístrate
          </a>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}
