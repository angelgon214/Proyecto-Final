import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { altLogin, verifyOTP } from '../services/AuthService';
import { ToastContainer, toast } from 'react-toastify';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false); 
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    const data = await altLogin(email);

    if (data.success) {
      setRequiresMFA(true);
      setQrCode(data.qrCodeUrl); 
      setIsEmailValid(true);
    } else {
      toast.error(data.message);
    }
  };

  const handleVerifyOTP = async () => {
    const data = await verifyOTP(email, otp);
  
    if (data.success) {
      toast.success("Inicio de sesión exitoso");
  
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

      <h2 className="text-center mb-4">Iniciar sesión</h2>
    
        {!isEmailValid ? (
          <>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input 
                className="form-control" 
                placeholder="Correo electrónico" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <button className="btn btn-dark w-100" onClick={handleEmailSubmit}>
              Validar correo
            </button>
          </>
        ) : (
          <>
            <div className="text-center">
              <p>Escanea el QR con Google Authenticator:</p>
              {qrCode && <img src={qrCode} alt="QR Code" className="img-fluid" />}
            </div>
            <div className="mb-3">
              <label className="form-label">Código</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ingresa el código OTP" 
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
              />
            </div>
            <button className="btn btn-dark w-100" onClick={handleVerifyOTP}>
                Verificar código
            </button>
          </>
        )}

        <div className="text-center mt-3">
          <a href="/register" className="text-primary text-decoration-none">
            ¿Aún no tienes una cuenta? Click aquí
          </a>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}
