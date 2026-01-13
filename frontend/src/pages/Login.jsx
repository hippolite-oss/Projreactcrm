import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEnvelope, FaLock, FaBuilding, FaCheck, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Erreur de connexion");
    }

    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left Panel - Form (Compact) */}
        <div className="form-section">
          <div className="form-content">
            <div className="logo-header">
              <div className="logo-wrapper">
                <div className="logo-icon">
                  <FaBuilding />
                </div>
                <h1 className="app-title">DIGIDEV</h1>
              </div>
              
            </div>

            {error && (
              <div className="error-alert">
                <span className="error-icon">!</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <div className="input-wrapper">
                  
                  <input
                    className="form-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  
                  <input
                    className="form-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkbox"></span>
                  Se souvenir
                </label>
                <a href="/forgot-password" className="forgot-link">
                  Mot de passe oublié ?
                </a>
              </div>

              <button 
                className={`login-button ${isLoading ? 'loading' : ''}`} 
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
                <FaArrowRight className="arrow-icon" />
              </button>

              <div className="divider">
                <span className="divider-text">ou continuer avec</span>
              </div>

              <div className="social-login">
                <button type="button" className="social-button google">
                  <FcGoogle /> Google
                </button>
                <button type="button" className="social-button github">
                  <FaGithub /> GitHub
                </button>
              </div>

              <div className="signup-link">
                Bradley Hypox 2025
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel - Illustration (Large) */}
        <div className="illustration-section">
          <div className="illustration-content">
            <div className="feature-highlight">
              <div className="feature-badge">
                <FaCheck /> CRM Premium
              </div>
              <h2 className="illustration-title">
                Gérez vos clients efficacement
              </h2>
              <p className="illustration-text">
                Une plateforme tout-en-un pour suivre vos prospects, automatiser vos tâches et augmenter vos ventes.
              </p>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;