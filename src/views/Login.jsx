import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { login, verifyOTP } from '../services/AuthService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        toast.success("Inicio de sesión exitoso");
  
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
      if (data.requiresMFA) {
        if (data.qrCodeUrl) {
          setQrCode(data.qrCodeUrl);
        }
        setRequiresMFA(true);
      } else {
        toast.success("Inicio de sesión exitoso");
  
        setTimeout(() => {
          navigate('/home');
        }, 4000);
      }
    } else {
      toast.error(data.message);
    }
  };
  
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light text-light">
      <div className="card shadow-lg p-4" style={{ width: '400px', borderRadius: '5px' }}>
        <h2 className="text-center mb-4">Iniciar sesión</h2>

        {!requiresMFA ? (
          <>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input 
                className="form-control" 
                placeholder="Correo electrónico" 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input 
                type="password"
                value={password}
                className="form-control" 
                placeholder="Contraseña" 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
            <button className="btn btn-dark w-100" onClick={handleLogin}>
              Login
            </button>

            <div className="mt-3 text-center">
              <p className="text-center">¿Olvidaste la contraseña?</p>
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-outline-dark"
                  onClick={() => navigate("/loginPage")}
                >
                  <i className="fab fa-google"></i> Probar otro método
                </button>
              </div>
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
              <label className="form-label">Código</label>
              <input 
                type="text"
                className="form-control" 
                placeholder="Ingresa el código"
                value={otp}
                onChange={e => setOtp(e.target.value)}
              />
            </div>
            <button className="btn btn-dark w-100" onClick={handleVerifyOTP}>
              Verificar código
            </button>
          </>
        )}

        <div className="mt-3 text-center">
        <div className="text-center">
          <a href="/register" className="text-primary text-decoration-none">
            ¿Aún no tienes una cuenta? Click aquí
          </a>
        </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}
