const http = require('http');

function testEmailEndpoint() {
  console.log('Test de l\'endpoint email...\n');
  
  const postData = JSON.stringify({
    destinataire: 'hippoliteagbodamakou@gmail.com'
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/email/test',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Reponse:', data);
      try {
        const jsonData = JSON.parse(data);
        console.log('Reponse JSON:', JSON.stringify(jsonData, null, 2));
      } catch (e) {
        console.log('Reponse non-JSON:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Erreur de requete: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

testEmailEndpoint();