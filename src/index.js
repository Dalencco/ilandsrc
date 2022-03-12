const app = require('./server');

const PORT = process.env.PORT || 3000
const LOCAL = "127.0.0.1"

app.listen(PORT, () => {
  console.log(`Servidor encendido en: http://${LOCAL}:${PORT}`);
});