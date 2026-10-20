/* ======================================================================
   ZANZA · TUDO QUE VOCÊ PRECISA PREENCHER FICA AQUI
   Vale pro site e pras páginas legais (privacidade, termos, trocas).
   Campo vazio = aparece marcado como "a preencher" nas páginas legais.
   ====================================================================== */
const CONFIG = {
  /* ---------- dados legais da empresa (Decreto 7.962/2013 e LGPD) ----------
     Obrigatórios antes de abrir a venda e antes de ligar a planilha. */
  EMPRESA: {
    NOME_FANTASIA: 'Zanza Street Wear',
    RAZAO_SOCIAL: '',        // nome que está no cartão do CNPJ. Ex.: 'Fulano de Tal 00000000000' (MEI)
    CNPJ: '',                // Ex.: '00.000.000/0001-00'
    ENDERECO: '',            // endereço físico completo, com CEP
    EMAIL: '',               // e-mail de atendimento e de privacidade (o titular usa pra pedir exclusão)
    ENCARREGADO: ''          // quem responde por privacidade (LGPD art. 41). Pequeno porte pode deixar vazio,
                             // mas o EMAIL acima continua obrigatório como canal (Resolução CD/ANPD nº 2/2022)
  },

  /* ---------- privacidade ---------- */
  // Data da versão atual da Política de Privacidade. Mude sempre que mudar o texto.
  // Vai junto com cada cadastro, como prova de qual versão a pessoa aceitou.
  POLITICA_VERSAO: '2026-10-20',

  // Google Analytics 4 (ex.: 'G-XXXXXXXXXX'). Vazio = nenhum rastreamento e nenhum aviso de cookies,
  // porque o site não usa cookies. Preenchido = o aviso aparece e o GA só carrega se a pessoa aceitar.
  GA_ID: '',

  /* ---------- formulário de pré-venda ---------- */
  // URL do Google Apps Script (Implantar > App da Web). Passo a passo em apps-script/LEIAME.md
  // Vazia = o formulário funciona, mas não envia os dados pra lugar nenhum.
  PLANILHA_URL: '',

  /* ---------- contato e redes ---------- */
  // WhatsApp da marca: só números, com 55 + DDD. Ex.: '5591912345678'. Vazio = botão flutuante escondido.
  WHATSAPP_NUMERO: '',
  WHATSAPP_MENSAGEM: 'Fala, Zanza! Vim pelo site e quero saber do Drop 01.',
  // Só o @ (sem o "@"). Vazio = aparece "em breve" no rodapé.
  INSTAGRAM: '',
  TIKTOK: '',

  /* ---------- drop ---------- */
  // Data e hora em que o drop abre, com fuso. Ex.: '2026-11-20T19:00:00-03:00'
  // Vazio (ou data que já passou) = a contagem regressiva não aparece.
  DATA_DROP: '',
  // Fotos do lookbook (substituem os quadros em ordem). Ex.: ['assets/lookbook/01.webp']
  // Antes de publicar foto com pessoa: autorização de uso de imagem assinada (e do responsável, se for menor).
  LOOKBOOK_FOTOS: []
};
