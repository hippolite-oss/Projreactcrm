import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('❌ Erreur OAuth:', error);
        navigate('/login?error=oauth_failed');
        return;
      }

      if (token) {
        try {
          // Stocker le token
          localStorage.setItem('token', token);
          
          // Configurer l'API avec le token
          const api = (await import('../services/api')).default;
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Récupérer les informations utilisateur
          const response = await api.get('/api/auth/me');
          setUser(response.data);

          console.log('✅ Connexion OAuth réussie:', response.data);
          navigate('/dashboard');
        } catch (error) {
          console.error('❌ Erreur lors de la récupération du profil:', error);
          localStorage.removeItem('token');
          navigate('/login?error=profile_failed');
        }
      } else {
        console.error('❌ Aucun token reçu');
        navigate('/login?error=no_token');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <FaSpinner 
        style={{ 
          fontSize: '2rem', 
          color: '#3b82f6',
          animation: 'spin 1s linear infinite'
        }} 
      />
      <p style={{ 
        marginTop: '1rem', 
        fontSize: '1.1rem', 
        color: '#64748b' 
      }}>
        Finalisation de la connexion...
      </p>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthCallback;