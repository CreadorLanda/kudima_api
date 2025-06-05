const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Lista de línguas nacionais angolanas
    this.linguasAngolanas = [
      'Umbundu',
      'Kimbundu',
      'Kikongo',
      'Chokwe',
      'Nganguela',
      'Kwanyama',
      'Fiote',
      'Mbunda',
      'Nhaneca-Humbe',
      'Luvale',
      'Mucubal'
    ];
  }

  async gerarAula(tema, nivel, categoria, linguaAngolana) {
    try {
      // Verificar se o tema está relacionado a línguas angolanas
      const temaValidado = this._validarTema(tema, linguaAngolana);
      
      const prompt = `
        Crie uma aula completa sobre "${temaValidado}" para nível ${nivel}, focando especificamente na língua angolana ${linguaAngolana}. 
        A aula deve ser estruturada da seguinte forma:
        
        1. Título criativo e envolvente
        2. Breve descrição introdutória (máximo 3 parágrafos)
        3. Conteúdo principal detalhado e educativo sobre a língua ${linguaAngolana} (inclua exemplos, explicações e conceitos)
        4. Recursos sugeridos para aprofundamento
        5. Exercícios de fixação
        
        A aula deve ser adequada para o nível ${nivel} e categoria "${categoria}".
        O conteúdo deve ser educativo, preciso e envolvente, e DEVE focar exclusivamente na língua nacional angolana ${linguaAngolana}.
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Extraindo título, descrição e conteúdo
      const linhas = text.split('\n');
      let titulo = '';
      let descricao = '';
      let conteudo = '';

      // Encontrando título (normalmente é a primeira linha não vazia)
      for (let i = 0; i < linhas.length; i++) {
        if (linhas[i].trim() !== '') {
          titulo = linhas[i].replace(/^#\s*/, '').trim();
          break;
        }
      }

      // Extraindo descrição (primeiros 3 parágrafos após o título)
      let inicioDescricao = false;
      let paragrafosDescricao = 0;
      let indiceFimDescricao = 0;

      for (let i = 0; i < linhas.length; i++) {
        if (linhas[i].includes(titulo)) {
          inicioDescricao = true;
          continue;
        }

        if (inicioDescricao && linhas[i].trim() !== '') {
          descricao += linhas[i] + '\n\n';
          paragrafosDescricao++;
          indiceFimDescricao = i;
          
          if (paragrafosDescricao >= 3) {
            break;
          }
        }
      }

      // O resto é considerado conteúdo
      for (let i = indiceFimDescricao + 1; i < linhas.length; i++) {
        conteudo += linhas[i] + '\n';
      }

      // Se não conseguimos extrair automaticamente, use todo o texto
      if (!titulo) titulo = temaValidado;
      if (!descricao) descricao = text.substring(0, 300) + '...';
      if (!conteudo) conteudo = text;

      return {
        titulo: titulo || temaValidado,
        descricao: descricao.trim(),
        conteudo: conteudo.trim(),
        nivel,
        categoria,
        recursos: {
          videos: [],
          audios: [],
          documentos: []
        }
      };
    } catch (error) {
      console.error('Erro ao gerar aula com Gemini:', error);
      throw new Error('Falha ao gerar aula com IA');
    }
  }

  async gerarQuestoes(tema, quantidade = 5, linguaAngolana) {
    try {
      // Verificar se o tema está relacionado a línguas angolanas
      const temaValidado = this._validarTema(tema, linguaAngolana);
      
      const prompt = `
        Crie ${quantidade} questões de múltipla escolha sobre "${temaValidado}" focando exclusivamente na língua nacional angolana ${linguaAngolana}.
        
        Para cada questão, forneça:
        1. A pergunta relacionada à língua ${linguaAngolana}
        2. 4 opções de resposta
        3. O índice da resposta correta (de 0 a 3)
        
        Formate cada questão da seguinte forma exata para facilitar o parsing:

        PERGUNTA: [Texto da pergunta sobre a língua ${linguaAngolana}]
        OPCOES: ["Opção 1", "Opção 2", "Opção 3", "Opção 4"]
        RESPOSTA: [índice da resposta correta]
        
        Certifique-se de que as questões sejam educativas, precisas e relacionadas exclusivamente à língua nacional angolana ${linguaAngolana}.
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Processando o texto para extrair as questões
      const questoesTexto = text.split('PERGUNTA:').filter(q => q.trim() !== '');
      const questoes = [];

      for (const questaoTexto of questoesTexto) {
        try {
          // Extraindo pergunta
          let pergunta = questaoTexto.split('OPCOES:')[0].trim();
          
          // Extraindo opções
          const opcoesTexto = questaoTexto.split('OPCOES:')[1].split('RESPOSTA:')[0].trim();
          let opcoes;
          try {
            opcoes = JSON.parse(opcoesTexto);
          } catch (e) {
            // Se falhar o parsing, tenta extrair manualmente
            opcoes = opcoesTexto
              .replace(/[\[\]"]/g, '')
              .split(',')
              .map(o => o.trim())
              .filter(o => o);
          }

          // Extraindo resposta
          const respostaTexto = questaoTexto.split('RESPOSTA:')[1];
          let resposta = parseInt(respostaTexto);
          
          // Se não conseguir extrair a resposta, assume que é a primeira opção
          if (isNaN(resposta)) resposta = 0;

          if (pergunta && opcoes && opcoes.length > 0) {
            questoes.push({
              pergunta,
              opcoes,
              resposta
            });
          }
        } catch (e) {
          console.error('Erro ao processar questão:', e);
        }
      }

      return questoes;
    } catch (error) {
      console.error('Erro ao gerar questões com Gemini:', error);
      throw new Error('Falha ao gerar questões com IA');
    }
  }
  
  // Método para validar se o tema está relacionado às línguas angolanas
  _validarTema(tema, linguaAngolana) {
    // Se a língua foi especificada, prioriza ela
    if (linguaAngolana) {
      if (!tema.toLowerCase().includes(linguaAngolana.toLowerCase())) {
        return `${tema} na língua ${linguaAngolana}`;
      }
      return tema;
    }
    
    // Verifica se o tema já menciona alguma língua angolana
    const temLinguaAngolana = this.linguasAngolanas.some(lingua => 
      tema.toLowerCase().includes(lingua.toLowerCase())
    );
    
    // Se não mencionar, adapta o tema para incluir línguas angolanas
    if (!temLinguaAngolana) {
      return `${tema} nas línguas nacionais angolanas`;
    }
    
    return tema;
  }
}

module.exports = new GeminiService(); 