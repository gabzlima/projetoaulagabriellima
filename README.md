# Zanza Street Wear

Site da Zanza ("A rua é tua"), marca de streetwear brasileira. Primeiro drop: 50 camisetas oversized, pré-venda.

Site estático, sem build. Pra rodar: `npx serve .`

## Estrutura
- `index.html`: marcação e SEO (meta tags, Open Graph, favicon)
- `css/style.css`: estilos
- `js/main.js`: comportamento. **As configurações ficam no topo** (`CONFIG`): URL da planilha, WhatsApp, @ do Instagram e do TikTok
- `assets/`: logos em WebP, favicon e imagem de prévia (`og-image.jpg`). Os PNGs originais estão em `assets/src/`
- `apps-script/`: script pra mandar o formulário pra uma planilha do Google
- `docs/PROMPT.md`: briefing original

## Antes de publicar
- Preencher `CONFIG` em `js/main.js`
- Trocar `https://zanza.com.br/` pelo domínio real no `index.html` (canonical e Open Graph)
- Conferir as medidas da tabela (modal "Tabela de medidas") com as peças reais
- Trocar os quadros do Lookbook pelas fotos (instruções no comentário do `index.html`)
