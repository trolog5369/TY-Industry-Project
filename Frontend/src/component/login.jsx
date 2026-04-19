import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import axios from "axios";
import { FiMail, FiLock, FiLogIn, FiUserPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import { StoreContext } from '../Context/StoreContext';
import steelBoltVideo from '../assets/videos/Steel_bolt_component_202604190116.mp4';
import avadhootLogo from '../assets/logo/avadhoot-logo.png';

const Login = () => {
  const {backend_url,token,setToken} = useContext(StoreContext);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginInfo({...loginInfo, [e.target.name]: e.target.value});
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
  
    if (!email || !password) {
      return handleError("All fields are required");
    }
  
    if (password.length < 4) {
      return handleError("Password must be at least 4 characters");
    }
  
    setLoading(true);
    try {
      const response = await axios.post(backend_url+"/api/login", loginInfo);
      const { success, message, jwttoken, name } = response.data;
  
      if (success) {
        handleSuccess(message || "Login successful!");
        localStorage.setItem("token", jwttoken);
        setToken(localStorage.getItem("token"));
        localStorage.setItem("loggedInUser", name);
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        handleError(message || "Login failed. Please try again.");
      }
    } catch (err) {
      handleError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ═══ LEFT PANEL — Brand / Video ═══ */}
      <div className="login-left">

        {/* Video background */}
        <video
          className="login-left__video"
          src={steelBoltVideo}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Dark overlay */}
        <div className="login-left__overlay" />

        {/* Decorative watermark */}
        <span className="login-left__watermark">AVADHOOT</span>

        {/* Foreground branding */}
        <div className="login-left__brand">
          <img
            src={avadhootLogo}
            alt="Avadhoot Auto Components"
            className="login-left__logo"
          />
          <p className="login-left__tagline">
            PRECISION MACHINED COMPONENTS
          </p>
          <p className="login-left__cert">
            ISO 1461 Certified &middot; Est. 2004
          </p>
        </div>
      </div>

      {/* ═══ RIGHT PANEL — Form ═══ */}
      <div className="login-right">
        <div className="login-form-wrapper">

          {/* Heading */}
          <h1 className="login-form__heading">Portal Access</h1>
          <p className="login-form__subtext">
            Sign in to manage inventory and operations
          </p>

          <form onSubmit={handleLogin} className="login-form">

            {/* Email */}
            <div className="login-field">
              <label className="login-label" htmlFor="login-email">Email</label>
              <div className="login-input-wrap">
                <FiMail className="login-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={loginInfo.email}
                  placeholder="you@company.com"
                  onChange={handleChange}
                  className="login-input"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-label" htmlFor="login-password">Password</label>
              <div className="login-input-wrap">
                <FiLock className="login-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={loginInfo.password}
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="login-input login-input--password"
                  required
                  minLength="4"
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(prev => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="login-forgot-row">
              <Link to="/forgot-password" className="login-forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`login-submit ${loading ? 'login-submit--loading' : ''}`}
            >
              {loading ? (
                <span className="login-submit__spinner" />
              ) : (
                <>
                  Sign In <FiLogIn className="login-submit__icon" />
                </>
              )}
            </button>

            {/* Signup link */}
            <p className="login-signup-row">
              Don't have an account?{' '}
              <Link to="/signup" className="login-signup-link">
                Create Account <FiUserPlus style={{ marginLeft: 4, verticalAlign: 'middle' }} />
              </Link>
            </p>
          </form>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Login;