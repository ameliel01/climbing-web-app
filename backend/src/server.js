const fs = require('fs')
const app = require('./app')


// Démarrer le serveur HTTPS
if (process.env.PROTOCOL && process.env.PROTOCOL === 'https') {
  // Lire les certificats SSL
  const sslOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  }
  const https = require('https')
  https.createServer(sslOptions, app).listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Backend listening on ${process.env.PROTOCOL}://0.0.0.0:${process.env.PORT}`);
  });
}

else {
  // Instantiate an Express Application
  // Open Server on selected Port
  app.listen(
    process.env.PORT,
    () => console.info('Server listening on port ', process.env.PORT)
  )
}
