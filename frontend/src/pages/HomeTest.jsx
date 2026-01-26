import React from 'react';

const HomeTest = () => {
  console.log('🏠 HomeTest component is rendering');
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Page Home - Test Simple</h1>
      <p>Si vous voyez ce message, la page Home fonctionne !</p>
      <p>URL actuelle: {window.location.href}</p>
    </div>
  );
};

export default HomeTest;