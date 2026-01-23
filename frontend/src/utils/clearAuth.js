/**
 * Script pour nettoyer l'authentification et résoudre les boucles de redirection
 */

console.log('🧹 Nettoyage de l\'authentification...');

// Supprimer tous les tokens et données d'auth
localStorage.removeItem('token');
localStorage.removeItem('user');
localStorage.removeItem('authToken');
sessionStorage.clear();

// Nettoyer les cookies d'authentification
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

console.log('✅ Nettoyage terminé');
console.log('🔄 Rechargez la page pour appliquer les changements');

// Recharger la page automatiquement
setTimeout(() => {
  window.location.reload();
}, 1000);