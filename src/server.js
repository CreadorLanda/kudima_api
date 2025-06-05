const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const dotenv = require('dotenv');
const { testConnection, sequelize } = require('./config/db');
const { sincronizarModelos } = require('./models');

dotenv.config();

// Testar conexão e sincronizar modelos
(async () => {
  await testConnection();
  await sincronizarModelos();
})();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const usuarioRoutes = require('./routes/usuarioRoutes');
const aulaRoutes = require('./routes/aulaRoutes');
const provaRoutes = require('./routes/provaRoutes');

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/aulas', aulaRoutes);
app.use('/api/provas', provaRoutes);

app.get('/', (req, res) => {
  res.send('API do Kudima está funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 