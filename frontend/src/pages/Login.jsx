import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  FaEnvelope, FaLock, FaBuilding, FaCheck, FaArrowRight, 
  FaEye, FaEyeSlash, FaSpinner, FaUser, FaShieldAlt, FaCheckCircle,
  FaExclamationTriangle, FaInfoCircle, FaTimes
} from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showCredentialsHelper, setShowCredentialsHelper] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: "" });

  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (!loading && user) {
      console.log('👤 Utilisateur déjà connecté, redirection vers dashboard');
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        <FaSpinner className="animate-spin mr-3" />
        Vérification de l'authentification...
      </div>
    );
  }

  // Ne pas afficher la page de login si l'utilisateur est connecté
  if (user) {
    return null;
  }

  // Validation améliorée de l'email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation de la force du mot de passe
  const validatePasswordStrength = (password) => {
    let score = 0;
    let feedback = "";

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        feedback = "Très faible";
        break;
      case 2:
        feedback = "Faible";
        break;
      case 3:
        feedback = "Moyen";
        break;
      case 4:
        feedback = "Fort";
        break;
      case 5:
        feedback = "Très fort";
        break;
      default:
        feedback = "Faible";
    }

    return { score, feedback };
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setValidationErrors(prev => ({ ...prev, email: "Format d'email invalide" }));
    } else {
      setValidationErrors(prev => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    // Calculer la force du mot de passe
    const strength = validatePasswordStrength(value);
    setPasswordStrength(strength);
    
    if (value && !validatePassword(value)) {
      setValidationErrors(prev => ({ ...prev, password: "Le mot de passe doit contenir au moins 6 caractères" }));
    } else {
      setValidationErrors(prev => ({ ...prev, password: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});

    // Validation finale
    const errors = {};
    if (!email) {
      errors.email = "L'email est requis";
    } else if (!validateEmail(email)) {
      errors.email = "Format d'email invalide";
    }

    if (!password) {
      errors.password = "Le mot de passe est requis";
    } else if (!validatePassword(password)) {
      errors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    const result = await login(email, password, rememberMe);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Erreur de connexion");
    }

    setIsLoading(false);
  };

  const fillDemoCredentials = () => {
    setEmail("admin@test.com");
    setPassword("admin123");
    setShowCredentialsHelper(false);
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setValidationErrors({});
    setError("");
  };

  const getPasswordStrengthColor = (score) => {
    switch(score) {
      case 0:
      case 1: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-yellow-500";
      case 4: return "bg-green-500";
      case 5: return "bg-emerald-500";
      default: return "bg-red-500";
    }
  };

  const getPasswordStrengthTextColor = (score) => {
    switch(score) {
      case 0:
      case 1: return "text-red-600";
      case 2: return "text-orange-600";
      case 3: return "text-yellow-600";
      case 4: return "text-green-600";
      case 5: return "text-emerald-600";
      default: return "text-red-600";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
        {/* Left Panel - Form */}
        <div className="w-full md:w-2/5 p-8 lg:p-12 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                  DIGIDEV
                </h1>
              </div>
             
            </div>

            {/* Demo Credentials Helper */}
            <div className="relative mb-6">
              
              
              {showCredentialsHelper && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-10 animate-slideDown">
                  <div className="p-3 border-b border-gray-100 flex items-center justify-between text-sm font-semibold text-gray-800">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-blue-500" />
                      Compte de démonstration
                    </div>
                    <button 
                      className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                      onClick={() => setShowCredentialsHelper(false)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">Email:</span> admin@test.com</p>
                    <p className="text-sm text-gray-600 mb-4"><span className="font-semibold">Mot de passe:</span> admin123</p>
                    <button 
                      className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700 transition-all"
                      onClick={fillDemoCredentials}
                    >
                      <FaCheckCircle /> Remplir automatiquement
                    </button>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 animate-shake">
                <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                <span className="text-sm flex-grow">{error}</span>
                <button 
                  className="p-1 text-red-500 hover:text-red-700 rounded transition-colors"
                  onClick={() => setError("")}
                >
                  <FaTimes />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" /> Adresse email
                </label>
                <div className={`relative rounded-lg border-2 transition-all ${emailFocused ? 'border-blue-500 ring-4 ring-blue-100' : validationErrors.email ? 'border-red-500' : email && !validationErrors.email ? 'border-green-500' : 'border-gray-200'}`}>
                  <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${emailFocused ? 'text-blue-500' : validationErrors.email ? 'text-red-500' : email && !validationErrors.email ? 'text-green-500' : 'text-gray-400'}`} />
                  <input
                    className="w-full pl-12 pr-12 py-3 rounded-lg focus:outline-none"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder="Entrez votre email"
                    autoComplete="email"
                    required
                  />
                  {email && !validationErrors.email && (
                    <FaCheckCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 text-green-500" />
                  )}
                  {validationErrors.email && (
                    <FaExclamationTriangle className="absolute right-12 top-1/2 transform -translate-y-1/2 text-red-500" />
                  )}
                </div>
                {validationErrors.email && (
                  <span className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <FaExclamationTriangle /> {validationErrors.email}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaLock className="text-gray-400" /> Mot de passe
                </label>
                <div className={`relative rounded-lg border-2 transition-all ${passwordFocused ? 'border-blue-500 ring-4 ring-blue-100' : validationErrors.password ? 'border-red-500' : password && !validationErrors.password ? 'border-green-500' : 'border-gray-200'}`}>
                  <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${passwordFocused ? 'text-blue-500' : validationErrors.password ? 'text-red-500' : password && !validationErrors.password ? 'text-green-500' : 'text-gray-400'}`} />
                  <input
                    className="w-full pl-12 pr-12 py-3 rounded-lg focus:outline-none"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="Entrez votre mot de passe"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {password && !validationErrors.password && (
                    <FaCheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500" />
                  )}
                </div>
                
                {/* Password Strength Indicator */}
                {password && passwordFocused && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs font-medium mt-1 flex items-center gap-1 ${getPasswordStrengthTextColor(passwordStrength.score)}`}>
                      <FaShieldAlt /> Force: {passwordStrength.feedback}
                    </span>
                  </div>
                )}
                
                {validationErrors.password && (
                  <span className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <FaExclamationTriangle /> {validationErrors.password}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${rememberMe ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                      {rememberMe && <FaCheck className="text-white text-xs" />}
                    </div>
                  </div>
                  <span>Se souvenir de moi</span>
                </label>
                
                <div className="flex items-center gap-3">
                 
                  <a href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>

              <button 
                className={`w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all ${isLoading ? 'bg-gray-400' : email && password && !Object.keys(validationErrors).length ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg'}`} 
                disabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <FaUser /> Se connecter
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100 flex items-center justify-center gap-2">
                <FaBuilding className="text-blue-400" /> Bradley Hypox 2025 - CRM Premium
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel - Illustration avec ancienne photo */}
        <div className="hidden md:flex md:w-3/5 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('login.jpg')"
            }}
          ></div>
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10 p-12 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-8">
              <FaCheck /> CRM Premium
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Gérez vos clients <span className="text-blue-200">efficacement</span>
            </h2>
            
            <p className="text-lg text-white mb-10 opacity-90">
              Une plateforme tout-en-un pour suivre vos prospects, automatiser vos tâches et augmenter vos ventes.
            </p>
            
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <FaCheckCircle className="text-emerald-300" />
                </div>
                <span className="text-white font-medium">Gestion complète des clients</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <FaCheckCircle className="text-emerald-300" />
                </div>
                <span className="text-white font-medium">Suivi des commandes en temps réel</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <FaCheckCircle className="text-emerald-300" />
                </div>
                <span className="text-white font-medium">Tableau de bord analytique</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <FaCheckCircle className="text-emerald-300" />
                </div>
                <span className="text-white font-medium">Sécurité avancée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;