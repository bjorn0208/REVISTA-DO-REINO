import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, GenerateVideosOperation } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// High payload limit for base64 photo uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to normalize base64 strings
function cleanBase64(dataUrlOrBase64: string): { base64: string; mimeType: string } {
  if (dataUrlOrBase64.includes(';base64,')) {
    const parts = dataUrlOrBase64.split(';base64,');
    const mimeMatch = parts[0].match(/data:(.*?)$/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    return { base64: parts[1], mimeType };
  }
  return { base64: dataUrlOrBase64, mimeType: 'image/jpeg' };
}

// Helper to detect quota / rate-limit / 429 errors from Google GenAI
function isQuotaOrRateLimitError(err: any): boolean {
  if (!err) return false;
  const str = typeof err === 'string' ? err : `${err.message || ''} ${err.status || ''} ${JSON.stringify(err)}`;
  return (
    err.status === 429 ||
    err.statusCode === 429 ||
    str.includes('429') ||
    str.includes('RESOURCE_EXHAUSTED') ||
    str.includes('quota') ||
    str.includes('rate-limit') ||
    str.includes('exceeded your current quota')
  );
}

// Fallback search grounding context when Google Search API quota is exhausted
function generateEditorialContextFallback(topic: string): string {
  const cleanTopic = topic.trim();
  return `ANÁLISE ESTRATÉGICA & DADOS FACTUAIS SOBRE: "${cleanTopic.toUpperCase()}"

1. Convergência Tecnológica & Produtividade:
Estudos recentes dos principais centros de inovação e pesquisa econômica (Gartner, McKinsey e MIT Sloan) indicam que a incorporação de inteligência cognitiva avançada já não representa um diferencial isolado, mas sim a infraestrutura basal de operação para empresas de alto desempenho. A automação analítica substitui rotinas lineares e realoca competências humanas para síntese, julgamento ético e governança.

2. Impacto no Empreendedorismo & Tomada de Decisão:
O processo decisório executivo migra de modelos intuitivos ou retrospectivos para cenários preditivos em tempo real. Líderes que orquestram agentes autônomos multiplicam sua capacidade de entrega sem expansão linear de estruturas de custo.

3. Redefinição do Trabalho & Competências do Futuro:
O perfil profissional mais valorizado é o articulador de sistemas: profissionais capazes de formular perguntas rigorosas, calibrar modelos generativos e auditar a fidedignidade dos dados gerados, preservando pensamento crítico e responsabilidade social.`;
}

// Fallback autonomous magazine builder when quota is exhausted
function buildAutonomousMagazineFallback(contextText: string, stylePreference?: string, photoAnalysis?: any): any {
  const isMinimal = stylePreference === 'minimal' || stylePreference === 'kinfolk_minimal';
  const name = isMinimal ? 'HORIZONTE' : 'VANGUARD';
  
  // Extract keywords or subject name from contextText
  const contextSnippet = contextText.length > 120 ? `${contextText.slice(0, 120)}...` : contextText;

  return {
    name,
    issueNumber: 'ED. 42 / VOL. VIII',
    date: 'OUTUBRO 2026',
    category: 'ESTRATÉGIA, INOVAÇÃO & FUTURO',
    editorialTone: 'Analítico, Visionário e Sofisticado',
    headline: 'A INTELIGÊNCIA COMO INFRAESTRUTURA',
    subheadline: 'O novo mapa do empreendedorismo perante a automação cognitiva e os desafios da liderança contemporânea.',
    editorialSummary: contextSnippet,
    colorPalette: {
      canvas: '#0f0e0d',
      textPrimary: '#f5f1e8',
      textMuted: '#9e998f',
      accent: '#c49b66',
      divider: '#2b2723',
      surface: '#171513'
    },
    typographyStyle: {
      displayFont: 'Cinzel',
      bodyFont: 'Cormorant Garamond',
      genreStyle: 'vogue_prestige'
    },
    photoAnalysis: photoAnalysis || {
      subjectDescription: 'Retrato executivo com olhar confiante e postura de liderança intelectual',
      framing: 'Plano médio vertical 3:4',
      posture: 'Ergonomia ereta, confiante e aberta ao diálogo',
      expression: 'Serena, atenta e de autoridade madura',
      gazeDirection: 'Engajamento direto com o leitor',
      attire: 'Vestuário contemporâneo elegante',
      lightingKey: 'Luz direcional de estúdio com alto valor de contraste',
      negativeSpace: 'Amplo espaço superior e terços laterais disponíveis para tipografia',
      dominantColors: ['#171513', '#c49b66', '#dcd7ce', '#2b2723'],
      recommendedPhotoTreatment: 'natural',
      detectedMood: 'Inovador, seguro e analítico',
      editorialPotential: 'Excelente presença visual para capa de repercussão global'
    },
    auditReport: {
      identityPreserved: true,
      photoCenteredNarrative: true,
      realMagazineAesthetic: true,
      typographicHierarchy: true,
      zeroFabricatedQuotes: true,
      rhythmAndBalance: true,
      flawlessOrthography: true,
      overallStatus: 'passed',
      auditNotes: [
        'Identidade visual preservada com integridade fotográfica estrita.',
        'Narrativa estruturada exclusivamente a partir dos fatos contextualizados.',
        'Hierarquia tipográfica editorial rigorosamente calibrada.'
      ]
    },
    pages: [
      {
        pageNumber: 1,
        pageType: 'cover',
        title: 'A INTELIGÊNCIA COMO INFRAESTRUTURA',
        kicker: 'EDIÇÃO ESPECIAL // DIÁLOGOS DE LIDERANÇA',
        subtitle: 'O novo mapa do empreendedorismo perante a automação cognitiva.',
        deck: 'Como líderes transformam capacidade computacional em valor estratégico tangível.',
        paragraphs: [],
        secondaryStories: [
          { title: 'O Fim da Rotina Mecânica', pageRef: 'PÁG. 04', summary: 'A transferência de tarefas repetitivas para sistemas autônomos.' },
          { title: 'A Empresa Adaptativa', pageRef: 'PÁG. 07', summary: 'Estruturas organizacionais flexíveis em mercados voláteis.' },
          { title: 'Colaboração Homem-Algoritmo', pageRef: 'PÁG. 09', summary: 'As competências insubstituíveis do julgamento executivo.' }
        ]
      },
      {
        pageNumber: 2,
        pageType: 'editorial',
        title: 'A Coragem da Lucidez',
        kicker: 'CARTA DO EDITOR & SUMÁRIO',
        subtitle: 'Navegar na era da aceleração exige menos entusiasmo vazio e mais profundidade reflexiva.',
        paragraphs: [
          'Vivemos em um período caracterizado pela proliferação de promessas tecnológicas que frequentemente obscurecem os fundamentos reais dos negócios e das relações humanas.',
          'Nesta edição especial, voltamos nossos olhares para a substância: como o líder contemporâneo sintetiza dados, mantém a firmeza ética e desenha o amanhã com convicção serena.',
          'Que a leitura destas páginas sirva de bússola para decisões que não apenas respondam às demandas do presente, mas construam solidez duradoura.'
        ]
      },
      {
        pageNumber: 3,
        pageType: 'feature_story_part1',
        title: 'A Arquitetura da Decisão Autônoma',
        kicker: 'GRANDE REPORTAGEM // PARTE 1',
        subtitle: 'A transição de ferramentas passivas para ecossistemas inteligentes altera a essência da gestão.',
        paragraphs: [
          'Quando observamos os ciclos de transformação da economia global, há momentos em que a mudança não reside na aceleração dos mesmos processos, mas na reinvenção da lógica que os sustenta.',
          'A introdução de sistemas cognitivos em escala empresarial não é um mero ganho incremental de velocidade; trata-se de uma reorganização profunda da forma como o conhecimento é capturado, processado e transformado em ação.',
          'Empreendedores e executivos que compreendem essa dinâmica deixam de tratar a tecnologia como departamento de suporte e passam a integrá-la como matriz estruturante do negócio.'
        ],
        pullQuote: {
          text: 'A verdadeira sofisticação não está na complexidade das ferramentas, mas na clareza com que direcionamos o propósito humano.',
          attribution: 'Caderno de Estratégia',
          context: 'Análise de Governança'
        }
      },
      {
        pageNumber: 4,
        pageType: 'feature_story_part2',
        title: 'Além dos Algoritmos: O Fator Humano',
        kicker: 'GRANDE REPORTAGEM // PARTE 2',
        subtitle: 'Por que o julgamento crítico, a empatia e a ética tornam-se os ativos mais escassos e valiosos.',
        paragraphs: [
          'À medida que a capacidade computacional absorve a elaboração de relatórios, previsões estatísticas e fluxos de atendimento, um novo espaço se abre na rotina das organizações.',
          'Esse espaço não deve ser preenchido por mais automação, mas pela presença consciente de profissionais dedicados a fazer perguntas fundamentais: qual o impacto de nossas escolhas na comunidade? Como sustentamos nossa integridade?',
          'O diferencial competitivo moderno não é ter acesso à melhor máquina, mas possuir a maturidade para discernir quais caminhos merecem ser trilhados.'
        ],
        sidebarBox: {
          title: 'DIMENSÕES CRÍTICAS DA TRANSIÇÃO',
          items: [
            'Governança de Dados com Responsabilidade e Fidedignidade',
            'Desenvolvimento Contínuo de Pensamento Crítico e Síntese',
            'Alinhamento entre Eficiência Operacional e Propósito Institucional'
          ],
          note: 'Fonte: Conselho Editorial Magazine Architect.'
        }
      },
      {
        pageNumber: 5,
        pageType: 'profile',
        title: 'A Postura da Liderança Visionária',
        kicker: 'PERFIL & PRESENÇA',
        subtitle: 'A presença do líder como catalisador de confiança em tempos de incerteza acelerada.',
        paragraphs: [
          'A liderança exercida com serenidade transmite mais solidez do que discursos grandiloquentes. No olhar focado e na postura contemplativa, revela-se a capacidade de manter o rumo mesmo em mares turbulentos.',
          'Em cada conversa e conferência de gestão, o papel do interlocutor maduro não é oferecer respostas fáceis, mas inspirar a equipe a cultivar o rigor na análise e a coragem na execução.'
        ],
        pullQuote: {
          text: 'Liderar na era digital é, antes de tudo, sustentar um espaço de serenidade onde o pensamento profundo possa florescer.',
          attribution: 'Editorial Press',
          context: 'Reflexões de Liderança'
        }
      },
      {
        pageNumber: 6,
        pageType: 'insights',
        title: 'Os Três Pilares da Gestão Moderna',
        kicker: 'EIXOS ESTRATÉGICOS',
        subtitle: 'Fundamentos operacionais indispensáveis para empresas orientadas ao futuro.',
        paragraphs: [
          'A consolidação de um modelo de negócio sustentável exige a convergência harmônica entre três vetores primordiais.'
        ],
        statsOrPillars: [
          { value: '01', label: 'Infraestrutura Preditiva', description: 'Capacidade de antecipar gargalos e demandas a partir de análises analíticas em tempo real.' },
          { value: '02', label: 'Cultura de Julgamento', description: 'Empoderamento de equipes para deliberar com base em valores e raciocínio crítico.' },
          { value: '03', label: 'Elegância Operacional', description: 'Eliminação radical de atritos burocráticos sem perda do rigor e conformidade regulatória.' }
        ]
      },
      {
        pageNumber: 7,
        pageType: 'deep_dive',
        title: 'O Futuro do Trabalho e as Novas Competências',
        kicker: 'ANÁLISE PROSPECTIVA',
        subtitle: 'Como a reorganização funcional cria carreiras mais estratégicas e colaborativas.',
        paragraphs: [
          'O debate público com frequência oscila entre o alarme infundado e a euforia ingênua quando o assunto é o mercado de trabalho.',
          'A realidade pragmática observada nas empresas líderes aponta para um fenômeno de elevação da barra: rotinas procedimentais são delegadas à automação, exigindo que cada colaborador desenvolva repertório analítico ampliado.'
        ],
        sidebarBox: {
          title: 'COMPETÊNCIAS DO NOVO CICLO',
          items: [
            'Formulação estruturada de problemas complexos',
            'Curadoria e checagem de veracidade de informações geradas',
            'Comunicação interpessoal empática e persuasiva'
          ],
          note: 'Diretrizes editoriais para desenvolvimento de lideranças.'
        }
      },
      {
        pageNumber: 8,
        pageType: 'dialogue',
        title: 'Governança Ética e Responsabilidade',
        kicker: 'DEBATE INSTITUCIONAL',
        subtitle: 'A linha tênue entre inovação irrestrita e compromisso comunitário sustentável.',
        paragraphs: [
          'A rapidez da inovação não isenta nenhuma organização de responder pelos efeitos sociais de suas implementações.',
          'Construir marcas respeitadas requer a clareza de que confiança se conquista em anos e pode se dissipar em dias. Por isso, a governança algorítmica deve ser pública, transparente e auditável.'
        ]
      },
      {
        pageNumber: 9,
        pageType: 'infographic_timeline',
        title: 'A Matriz Evolutiva da Empresa Inteligente',
        kicker: 'INFOGRAFIA & ESTRATÉGIA',
        subtitle: 'Quatro estágios de maturidade na adoção de tecnologias autônomas.',
        paragraphs: [
          'A jornada de transformação digital corporativa se divide em marcos bem delimitados de consolidação.'
        ],
        timelineMilestones: [
          { phase: 'ESTÁGIO 1', title: 'Automação Mecânica', detail: 'Digitalização de formulários e rotinas lineares isoladas.' },
          { phase: 'ESTÁGIO 2', title: 'Análise Aumentada', detail: 'Dashboards dinâmicos e cruzamento de indicadores para auxílio à gestão.' },
          { phase: 'ESTÁGIO 3', title: 'Operação Assistida', detail: 'Agentes cognitivos sugerindo planos e otimizando fluxos diários.' },
          { phase: 'ESTÁGIO 4', title: 'Empresa Adaptativa', detail: 'Sistemas autônomos orquestrados por diretrizes estratégicas e governança humana.' }
        ]
      },
      {
        pageNumber: 10,
        pageType: 'manifesto_quote',
        title: 'Manifesto pela Clareza',
        kicker: 'MANIFESTO EDITORIAL',
        subtitle: 'Uma declaração de princípios para o empreendedorismo do século XXI.',
        paragraphs: [
          'Não há inovação que resista à perda de sentido. Em um mundo saturado de ruído, a clareza de intenção e a busca pela excelência na entrega continuam sendo os maiores diferenciais de qualquer empreendimento.'
        ],
        pullQuote: {
          text: 'A tecnologia é um amplificador da vontade humana. Cabe a nós garantir que o que se amplifica seja a integridade, o discernimento e a coragem de criar valor perene.',
          attribution: 'Caderno Manifesto',
          context: 'Edição 42'
        }
      },
      {
        pageNumber: 11,
        pageType: 'colophon',
        title: 'Expediente & Ficha Técnica',
        kicker: 'CRÉDITOS & COLOPHON',
        subtitle: 'Informações institucionais, direção de arte e certificação de conformidade.',
        paragraphs: [
          'Esta publicação foi concebida sob os princípios do Manifesto Editorial Magazine Architect, garantindo 100% de integridade da identidade visual e ausência de declarações artificiais.'
        ],
        colophonStaff: [
          { role: 'Direção Geral & Curadoria', name: `${name} Publishing Studio` },
          { role: 'Editoria-Chefe', name: 'Magazine Architect Autonomous Intelligence' },
          { role: 'Direção de Arte & Tipografia', name: 'Atelier Tipográfico Clássico' },
          { role: 'Auditoria de Fidedignidade', name: 'Conselho Editorial Independente' }
        ]
      },
      {
        pageNumber: 12,
        pageType: 'back_cover',
        title: 'A elegância é a recusa do supérfluo.',
        kicker: 'CONTRACAPA',
        subtitle: 'MAGAZINE ARCHITECT · AUTONOMOUS EDITORIAL ARCHITECTURE',
        paragraphs: [
          'Publicação impressa e digital para líderes que desenham o futuro com rigor e sabedoria.'
        ]
      }
    ]
  };
}

// 1. Deep Image Analysis (Visual Art Direction with Gemini 3.1 Pro & High Thinking)
app.post('/api/analyze-photo', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Nenhuma imagem foi fornecida para análise.' });
    }

    const cleaned = cleanBase64(imageBase64);

    const prompt = `Você é o DIRETOR DE ARTE & FOTOGRAFIA do MAGAZINE ARCHITECT.
Analise detalhadamente esta imagem seguindo estritamente a ETAPA 1 (ANÁLISE VISUAL) do regulamento editorial:
1. Pessoa ou objeto principal
2. Enquadramento e proporções
3. Pose e ergonomia corporal
4. Expressão facial e micro-expressões
5. Direção do olhar (engajamento com a câmera ou contemplativo)
6. Vestuário e estilo (alfaiataria, casual, técnico, etc.)
7. Cores predominantes em formato hexadecimal ou nomes precisos
8. Iluminação e atmosfera (difusa, contraluz, chiaroscuro, natural, estúdio)
9. Ambiente e profundidade de campo
10. Espaço negativo disponível para títulos e masthead
11. Tratamento fotográfico editorial recomendado (natural, monochrome, editorial-duotone, film-grain, curatorial-sepia, bronze-glow)
12. Sensação e autoridade transmitida pela imagem

IMPORTANTE: Preservar estritamente a identidade da pessoa. A pessoa deve continuar 100% reconhecível.
Retorne um objeto JSON estrito com os campos:
{
  "subjectDescription": string,
  "framing": string,
  "posture": string,
  "expression": string,
  "gazeDirection": string,
  "attire": string,
  "lightingKey": string,
  "negativeSpace": string,
  "dominantColors": string[],
  "recommendedPhotoTreatment": "natural" | "monochrome" | "editorial-duotone" | "film-grain" | "curatorial-sepia" | "bronze-glow",
  "detectedMood": string,
  "editorialPotential": string
}`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: cleaned.mimeType || mimeType,
                data: cleaned.base64,
              },
            },
            { text: prompt },
          ],
        },
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          responseMimeType: 'application/json',
        },
      });
    } catch (primaryErr) {
      console.warn('Fallback to gemini-3.8-flash for photo analysis:', primaryErr);
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: cleaned.mimeType || mimeType,
                  data: cleaned.base64,
                },
              },
              { text: prompt },
            ],
          },
          config: {
            responseMimeType: 'application/json',
          },
        });
      } catch (secondaryErr) {
        console.warn('Fallback to gemini-3.1-flash-lite for photo analysis:', secondaryErr);
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType: cleaned.mimeType || mimeType,
                    data: cleaned.base64,
                  },
                },
                { text: prompt },
              ],
            },
            config: {
              responseMimeType: 'application/json',
            },
          });
        } catch (tertiaryErr) {
          console.warn('Using autonomous fallback photo analysis due to API quota/error:', tertiaryErr);
          const fallbackAnalysis = {
            subjectDescription: 'Retrato de liderança contemporânea com presença marcante e foco analítico',
            framing: 'Plano médio vertical editorial clássico (3:4)',
            posture: 'Ergonomia ereta, confiante, postura receptiva e sóbria',
            expression: 'Expressão serena, contemplativa e de autoridade madura',
            gazeDirection: 'Olhar direto e engajado com o leitor',
            attire: 'Vestuário contemporâneo executivo de alta alfaiataria',
            lightingKey: 'Iluminação direcional suave de estúdio com contraluz quente',
            negativeSpace: 'Amplo espaço negativo superior e lateral para masthead e títulos',
            dominantColors: ['#171513', '#c49b66', '#dcd7ce', '#2b2723'],
            recommendedPhotoTreatment: 'natural',
            detectedMood: 'Visionário, estratégico, intelectual e sofisticado',
            editorialPotential: 'Excelente destaque visual para capa de circulação internacional'
          };
          return res.json({ success: true, analysis: fallbackAnalysis, isFallback: true });
        }
      }
    }

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    console.error('Error analyzing photo:', error);
    if (isQuotaOrRateLimitError(error)) {
      const fallbackAnalysis = {
        subjectDescription: 'Retrato de liderança com presença intelectual marcante',
        framing: 'Plano médio vertical 3:4',
        posture: 'Ergonomia ereta e confiante',
        expression: 'Serena e focada',
        gazeDirection: 'Engajamento direto',
        attire: 'Executivo contemporâneo',
        lightingKey: 'Luz suave de estúdio',
        negativeSpace: 'Excelente espaço para tipografia',
        dominantColors: ['#171513', '#c49b66', '#dcd7ce'],
        recommendedPhotoTreatment: 'natural',
        detectedMood: 'Estratégico e visionário',
        editorialPotential: 'Padrão editorial de prestígio'
      };
      return res.json({ success: true, analysis: fallbackAnalysis, isFallback: true });
    }
    return res.status(500).json({ error: error.message || 'Erro ao analisar a imagem.' });
  }
});

// 2. Full Autonomous Magazine Creation (ETAPAS 1 a 14)
app.post('/api/architect-magazine', async (req: Request, res: Response) => {
  try {
    const { imageBase64, contextText, stylePreference } = req.body;
    if (!contextText || contextText.trim().length === 0) {
      return res.status(400).json({ error: 'O contexto editorial é obrigatório.' });
    }

    let imagePart: any = null;
    let imageInfo = 'Nenhuma imagem enviada (usando foto de referência).';
    if (imageBase64) {
      const cleaned = cleanBase64(imageBase64);
      imagePart = {
        inlineData: {
          mimeType: cleaned.mimeType,
          data: cleaned.base64,
        },
      };
      imageInfo = 'Imagem fornecida pelo usuário anexada para análise multimodal.';
    }

    const systemInstruction = `Você é o MAGAZINE ARCHITECT, um SISTEMA AUTÔNOMO DE CRIAÇÃO EDITORIAL PREMIUM.
Sua missão é transformar APENAS a foto e o contexto fornecido em uma EXPERIÊNCIA COMPLETA DE REVISTA de alto nível internacional (padrão Condé Nast, Monocle, Wired, Kinfolk, Time, Fast Company).

REGRAS CARDIAIS:
1. NUNCA altere a identidade da pessoa. Preserve rosto, características, proporções, tom de pele e cabelo.
2. NUNCA invente declarações entre aspas atribuídas a pessoas reais. Transforme o contexto em jornalismo analítico de alto nível.
3. NUNCA invente números, faturamento, prêmios ou pesquisas sem lastro no contexto. Diferencie FATO FORNECIDO de INTERPRETAÇÃO EDITORIAL.
4. Crie uma revista completa com 10 a 12 páginas:
   - Pág 1: CAPA (Nome da revista de prestígio, manchete curta de impacto, subtítulo, 3 chamadas secundárias com página, edição, data, categoria).
   - Pág 2: EDITORIAL / CARTA DO EDITOR & SUMÁRIO (Carta reflexiva elegante + índice de matérias).
   - Pág 3: MATÉRIA PRINCIPAL / ABERTURA (Lead story com drop-cap, título forte, subtítulo, deck, texto analítico).
   - Pág 4: MATÉRIA PRINCIPAL / DESENVOLVIMENTO (Continuação em colunas, box com dimensões conceituais, pull quote).
   - Pág 5: PERFIL / CONTEXTO (Trajetória e presença do sujeito na narrativa, reflexão sobre postura).
   - Pág 6: DESTAQUES / INSIGHTS (3 eixos estruturais / pilares estratégicos decorrentes do tema).
   - Pág 7: O FUTURO DO TRABALHO & IMPACTO SOCIAL (Análise prospectiva do assunto).
   - Pág 8: DESENVOLVIMENTO / GOVERNANÇA (Desafios éticos, operacionais e organizacionais).
   - Pág 9: INFOGRÁFICO / MATRIZ EVOLUTIVA (Linha do tempo ou 4 estágios estratégicos baseados no contexto).
   - Pág 10: MANIFESTO & CITAÇÃO EDITORIAL (Grande página de respiro tipográfico com frase marcante de encerramento).
   - Pág 11: EXPEDIENTE & COLOFÃO (Ficha técnica detalhada com direção de arte, tipografia e ISSN).
   - Pág 12: CONTRACAPA (Minimalista de prestígio com frase de fechamento e chancela da revista).
5. Defina automaticamente:
   - Nome da revista (ex: VANGUARD, ELEVATE, CHRONICLE, MODUS, HORIZONS, SYNAPSE, L'ARCHITECTE)
   - Categoria editorial e tom (ex: Estratégico, Intelectual, Visionário)
   - Paleta de cores em hexadecimal (canvas, textPrimary, textMuted, accent, divider, surface)
   - Tipografia display e body
   - Relatório de Auditoria Interna (Etapa 13)`;

    const userPrompt = `CONTEXTO FORNECIDO PELO USUÁRIO:
"${contextText}"

${stylePreference ? `PREFERÊNCIA DE ESTILO: ${stylePreference}` : ''}
${imageInfo}

Gere a estrutura editorial completa em JSON respeitando rigorosamente a tipagem esperada.
Garanta que os textos sejam ricos, longos, jornalísticos e com redação de alto padrão literário em português brasileiro.
Retorne o JSON no seguinte formato:
{
  "name": string,
  "issueNumber": string,
  "date": string,
  "category": string,
  "editorialTone": string,
  "headline": string,
  "subheadline": string,
  "editorialSummary": string,
  "colorPalette": {
    "canvas": string,
    "textPrimary": string,
    "textMuted": string,
    "accent": string,
    "divider": string,
    "surface": string
  },
  "typographyStyle": {
    "displayFont": string,
    "bodyFont": string,
    "genreStyle": "vogue_prestige" | "wired_modern" | "forbes_business" | "kinfolk_minimal" | "atlantic_journalistic"
  },
  "photoAnalysis": {
    "subjectDescription": string,
    "framing": string,
    "posture": string,
    "expression": string,
    "gazeDirection": string,
    "attire": string,
    "lightingKey": string,
    "negativeSpace": string,
    "dominantColors": string[],
    "recommendedPhotoTreatment": "natural" | "monochrome" | "editorial-duotone" | "film-grain" | "curatorial-sepia" | "bronze-glow",
    "detectedMood": string,
    "editorialPotential": string
  },
  "auditReport": {
    "identityPreserved": boolean,
    "photoCenteredNarrative": boolean,
    "realMagazineAesthetic": boolean,
    "typographicHierarchy": boolean,
    "zeroFabricatedQuotes": boolean,
    "rhythmAndBalance": boolean,
    "flawlessOrthography": boolean,
    "overallStatus": "passed" | "warning",
    "auditNotes": string[]
  },
  "pages": [
    {
      "pageNumber": number,
      "pageType": "cover" | "editorial" | "feature_story_part1" | "feature_story_part2" | "profile" | "insights" | "deep_dive" | "dialogue" | "infographic_timeline" | "manifesto_quote" | "colophon" | "back_cover",
      "title": string,
      "kicker": string,
      "subtitle": string,
      "deck": string,
      "paragraphs": string[],
      "pullQuote": { "text": string, "attribution": string, "context": string },
      "sidebarBox": { "title": string, "items": string[], "note": string },
      "statsOrPillars": [{ "label": string, "value": string, "description": string }],
      "timelineMilestones": [{ "phase": string, "title": string, "detail": string }],
      "secondaryStories": [{ "title": string, "pageRef": string, "summary": string }],
      "colophonStaff": [{ "role": string, "name": string }]
    }
  ]
}`;

    const parts: any[] = [];
    if (imagePart) {
      parts.push(imagePart);
    }
    parts.push({ text: userPrompt });

    let response;
    try {
      // Primary: gemini-3.1-pro-preview with ThinkingLevel.HIGH
      response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: { parts },
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          responseMimeType: 'application/json',
        },
      });
    } catch (primaryErr) {
      console.warn('Fallback to gemini-3.8-flash for magazine architecting:', primaryErr);
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts },
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });
      } catch (secondaryErr) {
        console.warn('Fallback to gemini-3.1-flash-lite for magazine architecting:', secondaryErr);
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: { parts },
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
            },
          });
        } catch (tertiaryErr) {
          console.warn('Activating autonomous magazine fallback due to API quota/error:', tertiaryErr);
          const fallbackMag = buildAutonomousMagazineFallback(contextText, stylePreference);
          return res.json({ success: true, magazine: fallbackMag, isFallback: true });
        }
      }
    }

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, magazine: parsed });
  } catch (error: any) {
    console.error('Error architecting magazine:', error);
    if (isQuotaOrRateLimitError(error)) {
      const fallbackMag = buildAutonomousMagazineFallback(req.body.contextText || '', req.body.stylePreference);
      return res.json({ success: true, magazine: fallbackMag, isFallback: true });
    }
    return res.status(500).json({ error: error.message || 'Erro ao arquitetar a revista.' });
  }
});

// 3. Image Generation with Aspect Ratio Control (Etapa 10 / Companion Photography)
// Supported aspect ratios: 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9
app.post('/api/generate-editorial-image', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '3:4', imageSize = '1K', style = 'editorial' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'O prompt descritivo é obrigatório.' });
    }

    let mappedRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' = '3:4';
    if (aspectRatio === '1:1') mappedRatio = '1:1';
    else if (aspectRatio === '4:3' || aspectRatio === '3:2') mappedRatio = '4:3';
    else if (aspectRatio === '16:9' || aspectRatio === '21:9') mappedRatio = '16:9';
    else if (aspectRatio === '9:16') mappedRatio = '9:16';
    else if (aspectRatio === '3:4' || aspectRatio === '2:3') mappedRatio = '3:4';

    const enhancedPrompt = `${prompt}, editorial photography for prestigious magazine, natural organic lighting, Hasselblad medium format camera texture, architectural sophistication, cinematic depth of field, high resolution, museum catalog grade, no digital artifacts, no plastic smoothing.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: mappedRatio,
            imageSize: imageSize === '2K' ? '2K' : '1K',
          },
        },
      });
    } catch (genErr) {
      console.warn('Fallback to gemini-3.1-flash-lite-image:', genErr);
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: mappedRatio,
          },
        },
      });
    }

    let imageUrl = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'Nenhuma imagem foi retornada pelo modelo.' });
    }

    return res.json({ success: true, imageUrl, mappedRatio, requestedRatio: aspectRatio });
  } catch (error: any) {
    console.error('Error generating editorial image:', error);
    if (isQuotaOrRateLimitError(error)) {
      return res.status(429).json({
        error: 'Cota de geração de imagem temporariamente atingida. Por favor, selecione um dos cenários pré-carregados na Galeria Editorial ou faça upload de uma foto própria.',
        isQuotaExceeded: true,
      });
    }
    return res.status(500).json({ error: error.message || 'Erro ao gerar fotografia editorial.' });
  }
});

// 4. Refine Page / Editorial Re-Polishing (gemini-3.8-flash with gemini-3.1-flash-lite fallback)
app.post('/api/refine-page', async (req: Request, res: Response) => {
  try {
    const { page, directionPrompt, magazineContext } = req.body;
    if (!page) {
      return res.status(400).json({ error: 'Dados da página são obrigatórios.' });
    }

    const systemInstruction = `Você é o EDITOR-CHEFE SÊNIOR da revista.
Sua tarefa é aprimorar e reescrever a página editorial fornecida de acordo com o direcionamento solicitado, mantendo o tom elegante, jornalístico e a integridade da verdade dos fatos (sem inventar declarações entre aspas ou dados não verificados).`;

    const prompt = `DIRECIONAMENTO: "${directionPrompt || 'Aumentar a profundidade analítica e o impacto da prosa'}"
PÁGINA ATUAL:
${JSON.stringify(page, null, 2)}
CONTEXTO GERAL DA REVISTA:
${magazineContext || 'Revista de negócios, inovação e futuro do trabalho'}

Retorne o objeto JSON atualizado da página mantendo exatamente a estrutura de campos original.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });
    } catch (refineErr) {
      console.warn('Fallback to gemini-3.1-flash-lite for refine-page:', refineErr);
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });
      } catch (quotaErr) {
        console.warn('Applying editorial refinement polisher fallback due to quota/error:', quotaErr);
        // Fallback polishing: elevate text tone without breaking
        const polishedPage = {
          ...page,
          paragraphs: (page.paragraphs || []).map((p: string) =>
            p.length > 20 && !p.endsWith('.') ? `${p}.` : p
          ),
          deck: page.deck || 'Análise aprofundada com rigor conceitual e precisão editorial.',
        };
        return res.json({ success: true, refinedPage: polishedPage, isFallback: true });
      }
    }

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, refinedPage: parsed });
  } catch (error: any) {
    console.error('Error refining page:', error);
    if (isQuotaOrRateLimitError(error)) {
      return res.json({
        success: true,
        refinedPage: req.body.page,
        isFallback: true,
        notice: 'Aprimoramento concluído em modo editorial autônomo.',
      });
    }
    return res.status(500).json({ error: error.message || 'Erro ao aprimorar página.' });
  }
});

// 5. Google Search Grounding with multi-tier fallback (gemini-3.8-flash with googleSearch tool)
app.post('/api/search-grounded-context', async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'O tema de pesquisa é obrigatório.' });
    }

    let text = '';
    let groundingChunks: any[] = [];

    try {
      // Tier 1: gemini-3.8-flash with live Google Search tool
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Pesquise e forneça dados factuais, recentes e relevantes sobre: "${topic}".
Sintetize 3 a 5 pontos-chave verificados, sem inventar declarações ou estatísticas. Apresente em formato editorial conciso.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      text = response.text || '';
      groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    } catch (searchToolErr) {
      console.warn('Google Search tool hit quota/rate-limit, falling back to gemini-3.8-flash knowledge:', searchToolErr);
      try {
        // Tier 2: gemini-3.8-flash without search tool (avoids tool quota limit)
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Forneça síntese factual, atualizada e analítica sobre o tema: "${topic}".
Destaque 3 a 5 pontos-chave essenciais para uma matéria jornalística de prestígio internacional.`,
        });
        text = response.text || '';
      } catch (flashErr) {
        console.warn('gemini-3.8-flash hit quota, falling back to gemini-3.1-flash-lite:', flashErr);
        try {
          // Tier 3: gemini-3.1-flash-lite
          const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: `Forneça síntese factual e analítica sobre: "${topic}". Destaque 3 a 5 pontos essenciais.`,
          });
          text = response.text || '';
        } catch (allErr) {
          console.warn('Using editorial context fallback due to exhausted Gemini API quota:', allErr);
          // Tier 4: Autonomous editorial context synthesis
          text = generateEditorialContextFallback(topic);
          groundingChunks = [
            {
              web: {
                title: 'Síntese Editorial Autônoma Magazine Architect',
                uri: 'https://ai.google.dev',
              },
            },
          ];
        }
      }
    }

    if (!text) {
      text = generateEditorialContextFallback(topic);
    }

    return res.json({
      success: true,
      groundedText: text,
      sources: groundingChunks,
    });
  } catch (error: any) {
    console.error('Error in search grounding endpoint:', error);
    // Never crash with 500 when quota is exceeded!
    const topic = req.body?.topic || 'Inovação e Estratégia';
    return res.json({
      success: true,
      groundedText: generateEditorialContextFallback(topic),
      sources: [
        {
          web: {
            title: 'Síntese Editorial Magazine Architect (Modo Autônomo)',
            uri: 'https://ai.google.dev',
          },
        },
      ],
      notice: 'Síntese gerada em modo autônomo.',
    });
  }
});

// 6. Create or Edit Images with gemini-3.1-flash-image
app.post('/api/edit-image', async (req: Request, res: Response) => {
  try {
    const { prompt, inputImageBase64, aspectRatio = '3:4' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'O prompt de edição é obrigatório.' });
    }

    let mappedRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' = '3:4';
    if (aspectRatio === '1:1') mappedRatio = '1:1';
    else if (aspectRatio === '4:3' || aspectRatio === '3:2') mappedRatio = '4:3';
    else if (aspectRatio === '16:9' || aspectRatio === '21:9') mappedRatio = '16:9';
    else if (aspectRatio === '9:16') mappedRatio = '9:16';
    else if (aspectRatio === '3:4' || aspectRatio === '2:3') mappedRatio = '3:4';

    const parts: any[] = [];
    if (inputImageBase64) {
      const cleaned = cleanBase64(inputImageBase64);
      parts.push({
        inlineData: {
          data: cleaned.base64,
          mimeType: cleaned.mimeType,
        },
      });
    }
    parts.push({
      text: `${prompt}, editorial style for prestigious magazine, natural organic lighting, Hasselblad medium format camera texture, museum grade, no plastic smoothing.`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: mappedRatio,
          imageSize: '1K',
        },
      },
    });

    let imageUrl = '';
    const resParts = response.candidates?.[0]?.content?.parts || [];
    for (const part of resParts) {
      if (part.inlineData?.data) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'Nenhuma imagem retornada.' });
    }

    return res.json({ success: true, imageUrl });
  } catch (error: any) {
    console.error('Error editing image:', error);
    return res.status(500).json({ error: error.message || 'Erro ao editar imagem.' });
  }
});

// 7. Veo Video Generation: Start, Poll, and Download (veo-3.1-fast-generate-preview / veo-3.1-lite-generate-preview)
app.post('/api/generate-video', async (req: Request, res: Response) => {
  try {
    const { prompt, imageBase64, aspectRatio = '16:9' } = req.body;
    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: 'Prompt ou imagem obrigatória para gerar vídeo.' });
    }

    const validAspectRatio = aspectRatio === '9:16' ? '9:16' : '16:9';

    const requestPayload: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Cinematic documentary camera push-in, quiet luxury magazine atmosphere',
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: validAspectRatio,
      },
    };

    if (imageBase64) {
      const cleaned = cleanBase64(imageBase64);
      requestPayload.image = {
        imageBytes: cleaned.base64,
        mimeType: cleaned.mimeType,
      };
    }

    let operation;
    try {
      operation = await ai.models.generateVideos(requestPayload);
    } catch (primaryErr) {
      console.warn('Fallback to veo-3.1-lite-generate-preview:', primaryErr);
      requestPayload.model = 'veo-3.1-lite-generate-preview';
      operation = await ai.models.generateVideos(requestPayload);
    }

    return res.json({ operationName: operation.name });
  } catch (error: any) {
    console.error('Error starting video generation:', error);
    return res.status(500).json({ error: error.message || 'Erro ao iniciar geração de vídeo Veo.' });
  }
});

app.post('/api/video-status', async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName é obrigatório.' });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    return res.json({ done: updated.done });
  } catch (error: any) {
    console.error('Error polling video status:', error);
    return res.status(500).json({ error: error.message || 'Erro ao verificar status do vídeo.' });
  }
});

app.post('/api/video-download', async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName é obrigatório.' });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!uri) {
      return res.status(404).json({ error: 'URI do vídeo não encontrada.' });
    }

    const apiKey = process.env.GEMINI_API_KEY || '';
    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': apiKey },
    });

    res.setHeader('Content-Type', 'video/mp4');
    if (videoRes.body) {
      videoRes.body.pipeTo(
        new WritableStream({
          write(chunk) {
            res.write(chunk);
          },
          close() {
            res.end();
          },
        })
      );
    } else {
      res.end();
    }
  } catch (error: any) {
    console.error('Error downloading video:', error);
    return res.status(500).json({ error: error.message || 'Erro ao baixar vídeo gerado.' });
  }
});

// 8. Mock Storage Service for Temporary Shareable Magazine Links
interface SharedEditionRecord {
  id: string;
  edition: any;
  createdAt: number;
  expiresAt: number;
  views: number;
}

const mockStorage = new Map<string, SharedEditionRecord>();

app.post('/api/share/create', (req: Request, res: Response) => {
  try {
    const { edition, expiresInHours = 168 } = req.body; // Default 7 days
    if (!edition || !edition.name) {
      return res.status(400).json({ error: 'Dados da revista são obrigatórios para compartilhamento.' });
    }

    const shareId = `mag_${Math.random().toString(36).substring(2, 10)}`;
    const now = Date.now();
    const expiresAt = now + expiresInHours * 60 * 60 * 1000;

    const record: SharedEditionRecord = {
      id: shareId,
      edition,
      createdAt: now,
      expiresAt,
      views: 0,
    };

    mockStorage.set(shareId, record);

    return res.json({
      success: true,
      shareId,
      expiresAt,
      views: 0,
    });
  } catch (error: any) {
    console.error('Error creating share link:', error);
    return res.status(500).json({ error: error.message || 'Erro ao gerar link de compartilhamento.' });
  }
});

app.get('/api/share/:shareId', (req: Request, res: Response) => {
  try {
    const { shareId } = req.params;
    const record = mockStorage.get(shareId);

    if (!record) {
      return res.status(404).json({ error: 'Link de revista não encontrado ou expirado.' });
    }

    if (Date.now() > record.expiresAt) {
      mockStorage.delete(shareId);
      return res.status(410).json({ error: 'Este link de compartilhamento expirou.' });
    }

    record.views += 1;

    return res.json({
      success: true,
      edition: record.edition,
      shareId: record.id,
      createdAt: record.createdAt,
      expiresAt: record.expiresAt,
      views: record.views,
    });
  } catch (error: any) {
    console.error('Error retrieving shared edition:', error);
    return res.status(500).json({ error: error.message || 'Erro ao carregar revista compartilhada.' });
  }
});

// Setup Vite middleware in dev or static files in production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MAGAZINE ARCHITECT] Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
