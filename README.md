# API do Kudima

API RESTful desenvolvida para o aplicativo educacional Kudima, construída com Node.js, Express e MongoDB, com recursos de geração de conteúdo usando IA (Google Gemini).

## Requisitos

- Node.js (v14 ou superior)
- MongoDB (v4.4 ou superior)

## Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
cd api
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione as seguintes variáveis:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/kudima
   JWT_SECRET=sua_chave_secreta_aqui
   GEMINI_API_KEY=AIzaSyCu4cJWYTXELIYi8yZbLtw0ZJuGVr10eZk
   ```

## Execução

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

Para iniciar o servidor em modo de produção:

```bash
npm start
```

## Documentação da API

A documentação completa da API está disponível através do Swagger UI. Após iniciar o servidor, acesse:

```
http://localhost:3000/api-docs
```

## Principais Endpoints

### Usuários

- `GET /api/usuarios` - Lista todos os usuários
- `GET /api/usuarios/:id` - Obtém um usuário específico
- `POST /api/usuarios` - Cria um novo usuário
- `PUT /api/usuarios/:id` - Atualiza um usuário
- `DELETE /api/usuarios/:id` - Exclui um usuário
- `POST /api/usuarios/progresso` - Atualiza o progresso do usuário

### Aulas

- `GET /api/aulas` - Lista todas as aulas
- `GET /api/aulas/buscar` - Busca aulas por termo
- `GET /api/aulas/:id` - Obtém uma aula específica
- `POST /api/aulas/gerar` - Gera uma nova aula usando IA (Gemini)
- `POST /api/aulas` - Cria uma nova aula
- `PUT /api/aulas/:id` - Atualiza uma aula
- `DELETE /api/aulas/:id` - Exclui uma aula

### Provas

- `GET /api/provas` - Lista todas as provas
- `GET /api/provas/:id` - Obtém uma prova específica
- `POST /api/provas/gerar` - Gera uma nova prova usando IA (Gemini)
- `POST /api/provas` - Cria uma nova prova
- `PUT /api/provas/:id` - Atualiza uma prova
- `DELETE /api/provas/:id` - Exclui uma prova
- `POST /api/provas/verificar` - Verifica as respostas de uma prova

## Estrutura do Projeto

```
api/
├── docs/             # Documentação Swagger
├── src/
│   ├── controllers/  # Controladores da API
│   ├── models/       # Modelos de dados
│   ├── routes/       # Rotas da API
│   ├── services/     # Serviços (incluindo integração com Gemini)
│   ├── config/       # Configurações (banco de dados, etc.)
│   ├── examples/     # Exemplos de uso
│   └── server.js     # Ponto de entrada da aplicação
├── .env              # Variáveis de ambiente
├── package.json      # Dependências e scripts
└── README.md         # Este arquivo
``` #   k u d i m a _ a p i 
 
 