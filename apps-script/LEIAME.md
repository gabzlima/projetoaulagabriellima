# Ligar o formulário numa planilha do Google

1. Crie uma planilha no Google Sheets.
2. Menu **Extensões > Apps Script**, apague o código que vier e cole o conteúdo de `Code.gs`.
3. **Implantar > Nova implantação > App da Web**. Executar como: **você**. Quem tem acesso: **Qualquer pessoa**.
4. Copie a URL gerada (termina em `/exec`).
5. Em `js/main.js`, cole a URL em `CONFIG.PLANILHA_URL`.

Cada cadastro vira uma linha: data, nome, WhatsApp (com 55), tamanho, cor e origem.
Se mudar o `Code.gs`, faça uma **nova implantação** (a URL antiga não atualiza sozinha).
