const Usuario = require('../models/usuarioModel');
const Aula = require('../models/aulaModel');
const Prova = require('../models/provaModel');
const connectDB = require('./db');

const usuarios = [
  {
    nome: 'Administrador',
    email: 'admin@kudima.com',
    senha: 'admin123',
    tipo: 'admin'
  },
  {
    nome: 'Professor',
    email: 'professor@kudima.com',
    senha: 'prof123',
    tipo: 'professor'
  },
  {
    nome: 'Estudante',
    email: 'estudante@kudima.com',
    senha: 'est123',
    tipo: 'estudante'
  }
];

const aulas = [
  {
    titulo: 'Introdução à Língua Portuguesa',
    descricao: 'Aula introdutória sobre os fundamentos da língua portuguesa',
    conteudo: 'Nesta aula, vamos aprender os conceitos básicos da língua portuguesa...',
    nivel: 'iniciante',
    categoria: 'Português',
    recursos: {
      videos: ['https://exemplo.com/video1.mp4'],
      audios: ['https://exemplo.com/audio1.mp3'],
      documentos: ['https://exemplo.com/doc1.pdf']
    }
  },
  {
    titulo: 'Matemática Básica',
    descricao: 'Fundamentos de matemática para iniciantes',
    conteudo: 'Nesta aula, vamos aprender operações básicas de matemática...',
    nivel: 'iniciante',
    categoria: 'Matemática',
    recursos: {
      videos: ['https://exemplo.com/video2.mp4'],
      audios: [],
      documentos: ['https://exemplo.com/doc2.pdf']
    }
  },
  {
    titulo: 'História de Angola',
    descricao: 'Introdução à história de Angola',
    conteudo: 'Nesta aula, vamos conhecer os principais eventos históricos de Angola...',
    nivel: 'intermediário',
    categoria: 'História',
    recursos: {
      videos: ['https://exemplo.com/video3.mp4'],
      audios: ['https://exemplo.com/audio3.mp3'],
      documentos: ['https://exemplo.com/doc3.pdf']
    }
  }
];

const provas = [
  {
    titulo: 'Avaliação de Português',
    descricao: 'Teste seus conhecimentos em língua portuguesa',
    categoria: 'Português',
    nivel: 'iniciante',
    questoes: [
      {
        pergunta: 'Qual é a classe gramatical da palavra "casa"?',
        opcoes: ['Verbo', 'Substantivo', 'Adjetivo', 'Advérbio'],
        resposta: 1
      },
      {
        pergunta: 'Quantas sílabas tem a palavra "computador"?',
        opcoes: ['2', '3', '4', '5'],
        resposta: 2
      }
    ]
  },
  {
    titulo: 'Avaliação de Matemática',
    descricao: 'Teste seus conhecimentos em matemática básica',
    categoria: 'Matemática',
    nivel: 'iniciante',
    questoes: [
      {
        pergunta: 'Quanto é 2 + 2?',
        opcoes: ['2', '3', '4', '5'],
        resposta: 2
      },
      {
        pergunta: 'Quanto é 10 - 5?',
        opcoes: ['3', '4', '5', '6'],
        resposta: 2
      }
    ]
  }
];

const seedData = async () => {
  try {
    await connectDB();
    
    await Usuario.deleteMany({});
    await Aula.deleteMany({});
    await Prova.deleteMany({});
    
    await Usuario.insertMany(usuarios);
    await Aula.insertMany(aulas);
    await Prova.insertMany(provas);
    
    console.log('Dados de exemplo inseridos com sucesso!');
    process.exit();
  } catch (error) {
    console.error(`Erro ao inserir dados: ${error.message}`);
    process.exit(1);
  }
};

seedData(); 