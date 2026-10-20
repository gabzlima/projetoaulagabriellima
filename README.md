# Zanza Street Wear

Site da Zanza ("A rua é tua"), marca de streetwear brasileira. Primeiro drop: 50 camisetas oversized, pré-venda.

Site estático, sem build. Pra rodar: `npx serve .`

## Estrutura
- `index.html`: página inicial, com marcação e SEO (meta tags, Open Graph, favicon)
- `privacidade.html`, `termos.html`, `trocas.html`: Política de Privacidade, Termos de Uso e Trocas e devoluções
- `css/style.css`: estilos
- `js/config.js`: **tudo que você preenche fica aqui**: dados legais da empresa, versão da política, Google Analytics (opcional), URL da planilha, WhatsApp, redes, data do drop e fotos do lookbook
- `js/site.js`: comum a todas as páginas (dados da empresa, botão de pausar animações, aviso de cookies)
- `js/main.js`: comportamento da página inicial
- `assets/`: logos em WebP, favicon e imagem de prévia (`og-image.jpg`). Os PNGs originais estão em `assets/src/`
- `assets/fonts/`: fontes da marca hospedadas no próprio site (Big Shoulders Display, Familjen Grotesk e JetBrains Mono, todas com licença OFL)
- `apps-script/`: script pra mandar o formulário pra uma planilha do Google
- `docs/AUDITORIA.md`: **auditoria de conformidade (LGPD, consumidor, acessibilidade) e pendências antes da venda**
- `docs/PROMPT.md`: briefing original

## Antes de abrir a venda
A lista completa, com o motivo de cada item, está em [`docs/AUDITORIA.md`](docs/AUDITORIA.md). O principal:
- Preencher os dados da empresa em `js/config.js` (as páginas legais mostram **[a preencher]** até lá)
- Pedir pra um advogado revisar as páginas legais
- Confirmar o registro da marca no INPI (os logos têm ®)
- Trocar a tabela de medidas provisória pelas medidas reais
- Quando tiver domínio próprio, trocar `gabzlima.github.io/projetoaulagabriellima` nas tags `canonical` e `og:` das 4 páginas
- Trocar os quadros do Lookbook pelas fotos, com autorização de uso de imagem de quem aparecer

## Seções da página
Faixa de aviso · menu do produto fixo · hero com holofote (o cursor revela a camada escondida) · cena "Visão geral" (a camiseta gira, troca de cor e dá zoom com a rolagem) · Estampas (provador com zoom) · Manifesto · Detalhes (grade com luz que segue o cursor) · Lookbook · Pré-venda (formulário e contagem regressiva opcional) · Dúvidas · Rodapé.

Tudo respeita `prefers-reduced-motion`: sem animação, a página vira uma leitura estática.
