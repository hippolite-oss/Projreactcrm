const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailConfig() {
  console.log('Test de configuration email...\n');
  
  // Verifier les variables d'environnement
  console.log('Variables d\'environnement:');
  console.log(`   SMTP_HOST: ${process.env.SMTP_HOST}`);
  console.log(`   SMTP_PORT: ${process.env.SMTP_PORT}`);
  console.log(`   SMTP_USER: ${process.env.SMTP_USER}`);
  console.log(`   SMTP_PASS: ${process.env.SMTP_PASS ? '***masque***' : 'NON DEFINI'}`);
  console.log(`   EMAIL_FROM: ${process.env.EMAIL_FROM}`);
  console.log(`   EMAIL_FROM_NAME: ${process.env.EMAIL_FROM_NAME}\n`);

  // Creer le transporteur
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Test de connexion
    console.log('Test de connexion SMTP...');
    await transporter.verify();
    console.log('Connexion SMTP reussie!\n');

    // Test d'envoi d'email
    console.log('Test d\'envoi d\'email...');
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: process.env.SMTP_USER, // Envoyer a soi-meme
      subject: 'Test de configuration email - CRM System',
      html: `
        <h2>Test de configuration email</h2>
        <p>Si vous recevez cet email, la configuration fonctionne correctement !</p>
        <p><strong>Date du test:</strong> ${new Date().toLocaleString('fr-FR')}</p>
        <p><strong>Configuration utilisee:</strong></p>
        <ul>
          <li>Host: ${process.env.SMTP_HOST}</li>
          <li>Port: ${process.env.SMTP_PORT}</li>
          <li>User: ${process.env.SMTP_USER}</li>
        </ul>
      `,
    });

    console.log('Email de test envoye avec succes!');
    console.log(`Message ID: ${info.messageId}`);
    console.log(`Reponse: ${info.response}\n`);

  } catch (error) {
    console.error('Erreur lors du test:');
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    console.error(`   Response: ${error.response}`);
    
    // Diagnostics specifiques
    if (error.code === 'EAUTH') {
      console.error('\nProbleme d\'authentification:');
      console.error('   - Verifiez que le mot de passe d\'application Gmail est correct');
      console.error('   - Assurez-vous que l\'authentification a 2 facteurs est activee');
      console.error('   - Generez un nouveau mot de passe d\'application si necessaire');
    }
    
    if (error.code === 'ECONNECTION') {
      console.error('\nProbleme de connexion:');
      console.error('   - Verifiez votre connexion internet');
      console.error('   - Verifiez les parametres SMTP (host, port)');
    }
  }
}

testEmailConfig().catch(console.error);