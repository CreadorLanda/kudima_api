const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async gerarAula(tema, nivel, categoria) {
    try {
      const prompt = `
        Crie uma aula completa sobre "${tema}" para nível ${nivel}. 
        A aula deve ser estruturada da seguinte forma:
        
        1. Título criativo e envolvente
        2. Breve descrição introdutória (máximo 3 parágrafos)
        3. Conteúdo principal detalhado e educativo (inclua exemplos, explicações e conceitos)
        4. Recursos sugeridos para aprofundamento
        5. Exercícios de fixação
        
        A aula deve ser adequada para o nível ${nivel} e categoria "${categoria}".
        O conteúdo deve ser educativo, preciso e envolvente.
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
      if (!titulo) titulo = tema;
      if (!descricao) descricao = text.substring(0, 300) + '...';
      if (!conteudo) conteudo = text;

      return {
        titulo: titulo || tema,
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

  async gerarQuestoes(tema, quantidade = 5) {
    try {
      const prompt = `
        Crie ${quantidade} questões de múltipla escolha sobre "${tema}".
        
        Para cada questão, forneça:
        1. A pergunta
        2. 4 opções de resposta
        3. O índice da resposta correta (de 0 a 3)
        
        Formate cada questão da seguinte forma exata para facilitar o parsing:

        PERGUNTA: [Texto da pergunta]
        OPCOES: ["Opção 1", "Opção 2", "Opção 3", "Opção 4"]
        RESPOSTA: [índice da resposta correta]
        
        Certifique-se de que as questões sejam educativas e precisas.
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
}

module.exports = new GeminiService(); 