# Zanza Street Wear

Site da Zanza ("A rua é tua"), marca de streetwear brasileira. Primeiro drop: 50 camisetas oversized, pré-venda.

Site estático, sem build. Pra rodar: `npx serve .`

## Estrutura
- `index.html`: marcação e SEO (meta tags, Open Graph, favicon)
- `css/style.css`: estilos
- `js/main.js`: comportamento. **As configurações ficam no topo** (`CONFIG`): URL da planilha, WhatsApp, @ do Instagram e do TikTok, data do drop (contagem regressiva) e fotos do lookbook
- `assets/`: logos em WebP, favicon e imagem de prévia (`og-image.jpg`). Os PNGs originais estão em `assets/src/`
- `assets/fonts/`: fontes da marca hospedadas no próprio site (Big Shoulders Display, Familjen Grotesk e JetBrains Mono, todas com licença OFL)
- `apps-script/`: script pra mandar o formulário pra uma planilha do Google
- `docs/PROMPT.md`: briefing original

## Antes de publicar
- Preencher `CONFIG` em `js/main.js`
- Trocar `https://zanza.com.br/` pelo domínio real no `index.html` (canonical e Open Graph)
- Conferir as medidas da tabela (modal "Tabela de medidas") com as peças reais
- Trocar os quadros do Lookbook pelas fotos (instruções no comentário do `index.html`)

## Seções da página
Faixa de aviso · menu do produto fixo · hero com holofote (o cursor revela a camada escondida) · cena "Visão geral" (a camiseta gira, troca de cor e dá zoom com a rolagem) · Estampas (provador com zoom) · Manifesto · Detalhes (grade com luz que segue o cursor) · Lookbook · Pré-venda (formulário e contagem regressiva opcional) · Dúvidas · Rodapé.

Tudo respeita `prefers-reduced-motion`: sem animação, a página vira uma leitura estática.
