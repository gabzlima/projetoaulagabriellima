// Google Apps Script: recebe a pré-venda do site e grava na planilha.
// Passo a passo no LEIAME.md desta pasta.
const ABA = 'Pré-venda';

function doPost(e) {
  const p = e.parameter;
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(ABA) || planilha.insertSheet(ABA);
  if (aba.getLastRow() === 0) aba.appendRow(['Data', 'Nome', 'WhatsApp', 'Tamanho', 'Cor', 'Origem']);
  aba.appendRow([p.data, p.nome, p.whatsapp, p.tamanho, p.cor, p.origem]);
  return ContentService.createTextOutput('ok');
}
