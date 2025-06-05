const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Iniciando configuração da API Kudima...');

try {
  console.log('Instalando dependências...');
  execSync('npm install', { stdio: 'inherit' });
  
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('Criando arquivo .env...');
    fs.writeFileSync(
      envPath,
      'PORT=3000\nMONGODB_URI=mongodb://localhost:27017/kudima\nJWT_SECRET=kudima_secret_key'
    );
  }
  
  console.log('\nConfiguração concluída com sucesso!');
  console.log('\nPara iniciar o servidor em modo de desenvolvimento:');
  console.log('npm run dev');
  console.log('\nPara iniciar o servidor em modo de produção:');
  console.log('npm start');
  console.log('\nDocumentação da API estará disponível em:');
  console.log('http://localhost:3000/api-docs');
} catch (error) {
  console.error('Erro durante a configuração:', error);
} 