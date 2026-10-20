# Ligar o formulário numa planilha do Google

> Antes de ligar: preencha os dados da empresa em `js/config.js` (`EMPRESA`). A Política de Privacidade
> mostra esses dados pra quem se cadastra, e a LGPD exige que a pessoa saiba quem é o controlador.

1. Crie uma planilha no Google Sheets, numa conta com **verificação em duas etapas ligada**
   (a Política de Privacidade promete isso).
2. Menu **Extensões > Apps Script**, apague o código que vier e cole o conteúdo de `Code.gs`.
3. **Implantar > Nova implantação > App da Web**. Executar como: **você**. Quem tem acesso: **Qualquer pessoa**.
   (Isso deixa o site enviar cadastros. Ninguém consegue ler a planilha por essa URL.)
4. Copie a URL gerada (termina em `/exec`).
5. Em `js/config.js`, cole a URL em `PLANILHA_URL`.

Cada cadastro vira uma linha: data, nome, WhatsApp (com 55), estampa, tamanho, cor, consentimento,
declaração de idade e a versão da política que a pessoa aceitou.
O script não grava cadastros sem consentimento e bloqueia textos que viram fórmula na planilha.
Se mudar o `Code.gs`, faça uma **nova implantação** (a URL antiga não atualiza sozinha).

## Cuidados com os dados (LGPD)

- **Compartilhe a planilha só com quem precisa.** Nada de link público.
- **Pedido de saída ("SAIR") ou de exclusão:** apague a linha da pessoa na hora e pare de mandar mensagens.
  Guarde só um registro mínimo do pedido (data e que foi atendido), sem o número.
- **Pedido de acesso:** mande pra pessoa uma cópia da linha dela em até 15 dias.
- **Prazo de guarda:** a política promete apagar os dados até 12 meses depois do fim da pré-venda do Drop 01.
  Coloque um lembrete na agenda.
- **Mudou o texto da Política de Privacidade?** Atualize `POLITICA_VERSAO` em `js/config.js`.
