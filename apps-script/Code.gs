// Google Apps Script: recebe a lista de pré-venda do site e grava na planilha.
// Passo a passo (e como atender pedidos de exclusão) no LEIAME.md desta pasta.
const ABA = 'Pré-venda';
const CAMPOS = [
  // [coluna na planilha, campo enviado pelo site, tamanho máximo]
  ['Data', 'data', 40],
  ['Nome', 'nome', 40],
  ['WhatsApp', 'whatsapp', 15],
  ['Estampa', 'estampa', 20],
  ['Tamanho', 'tamanho', 4],
  ['Cor', 'cor', 12],
  ['Consentimento WhatsApp', 'consentimento_whatsapp', 3],
  ['Declaração de idade', 'declaracao_idade', 3],
  ['Versão da política', 'politica_versao', 10]
];

// Impede que um texto começando com = + - @ vire fórmula na planilha (injeção de fórmula)
function limpar(valor, max) {
  let v = String(valor || '').replace(/[\r\n\t]/g, ' ').trim().slice(0, max);
  if (/^[=+\-@]/.test(v)) v = "'" + v;
  return v;
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  // sem consentimento ou sem WhatsApp válido: não grava nada
  if (p.consentimento_whatsapp !== 'sim' || p.declaracao_idade !== 'sim' || !/^55\d{10,11}$/.test(p.whatsapp || '')) {
    return ContentService.createTextOutput('ignorado');
  }
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const aba = planilha.getSheetByName(ABA) || planilha.insertSheet(ABA);
  if (aba.getLastRow() === 0) aba.appendRow(CAMPOS.map(c => c[0]));
  aba.appendRow(CAMPOS.map(([, campo, max]) => limpar(p[campo], max)));
  return ContentService.createTextOutput('ok');
}
