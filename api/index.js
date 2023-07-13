const app = require('./src/app');
const { conn } = require('./src/db');
require('dotenv').config() 
const { PORT } = process.env;

conn.sync({ force: true }).then(() => {
  app.listen(PORT, () => {
    console.log('Escuchando en el puerto ' + PORT);
  })
})