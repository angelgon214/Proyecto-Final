import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { forgotPassword, verifyOtpReset, resetPassword } from '../services/AuthService';
import { BiShow, BiHide } from 'react-icons/bi';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Restablecercontraseña() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    try {
      const data = await forgotPassword(email);
      if (data.success) {
        toast.success(data.message);
        setStep('otp');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error al verificar el correo.');
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const data = await verifyOtpReset(email, otp);
      if (data.success) {
        toast.success(data.message);
        setStep('password');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error al verificar el código.');
    }
  };

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    try {
      const data = await resetPassword(email, newPassword);
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          navigate('/login');
        }, 4000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error al actualizar la contraseña.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light text-light">
      <div className="card shadow-lg p-4" style={{ width: '400px', borderRadius: '5px' }}>
        <h2 className="text-center mb-4 text-dark">Recuperar contraseña</h2>

        {step === 'email' && (
          <>
            <div className="mb-3">
              <label className="form-label text-dark">Correo electrónico</label>
              <input
                className="form-control border"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="btn btn-dark w-100" onClick={handleEmailSubmit}>
              Continuar
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <div className="mb-3">
              <label className="form-label text-dark">Código de verificación</label>
              <input
                type="text"
                className="form-control border"
                placeholder="Ingresa el código de tu app de autenticación"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button className="btn btn-dark w-100" onClick={handleOtpSubmit}>
              Verificar código
            </button>
          </>
        )}

        {step === 'password' && (
          <>
            <div className="mb-3">
              <label className="form-label text-dark">Nueva contraseña</label>
              <div className="input-group">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  className="form-control border"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  className="btn border-0 bg-transparent text-muted"
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <BiHide size={20} /> : <BiShow size={20} />}
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label text-dark">Confirmar nueva contraseña</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-control border"
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  className="btn border-0 bg-transparent text-muted"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <BiHide size={20} /> : <BiShow size={20} />}
                </button>
              </div>
            </div>
            <button className="btn btn-dark w-100" onClick={handlePasswordSubmit}>
              Actualizar contraseña
            </button>
          </>
        )}

        <div className="text-center mt-3">
          <a href="/login" className="text-primary text-decoration-none">
            Volver al inicio de sesión
          </a>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}