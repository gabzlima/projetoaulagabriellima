# Prompt para o Claude Code (melhorias no site da Zanza)

Você está trabalhando no site da Zanza, uma marca de streetwear brasileira que está começando.
Slogan: "A rua é tua". Público: 15 a 30 anos, vibe skate, streetwear limpo.
Produto: camisetas oversized de algodão penteado 180–200 g/m², estampa DTF, cores preta e off-white.
Primeiro drop: 50 peças, tamanhos P ao XG, ainda em pré-venda.

Arquivos:
- index.html: site completo (HTML, CSS e JS no mesmo arquivo)
- assets/: logos com fundo transparente (wordmark e estrela), versão "light" pra fundo escuro e "dark" pra fundo claro

Regras que não podem mudar:
- Manter a identidade: azul da marca #2933E6, asfalto escuro, off-white #F2F0E9, logos originais
- Fontes: Big Shoulders Display (títulos), Familjen Grotesk (texto), JetBrains Mono (detalhes)
- Todo o texto do site em português do Brasil, linguagem de rua, sem parecer propaganda genérica
- Funcionar perfeito no celular (é onde o público está), sem rolagem lateral
- Respeitar prefers-reduced-motion

O que eu quero que você melhore:
1. Separe o código em index.html, css/style.css e js/main.js, sem perder nada.
2. Hero: deixe a entrada mais impactante (por exemplo, a estrela girando entra primeiro e a logo é "pintada" depois), mas sem pesar no celular.
3. Provador de camisetas: deixe o mockup mais realista (sombras, dobras, textura de malha) e adicione um botão de zoom na estampa.
4. Crie uma seção "Lookbook" com grade de fotos (use espaços reservados bem desenhados, porque as fotos reais ainda vão ser feitas).
5. Crie uma tabela de medidas (P, M, G, GG, XG) com largura e comprimento, em formato de modal.
6. Formulário de pré-venda: máscara no WhatsApp, validação melhor e deixar pronto pra enviar os dados pra uma planilha do Google (via Google Apps Script). Deixe a URL do script como uma constante fácil de trocar.
7. SEO e compartilhamento: meta tags, Open Graph (imagem de prévia quando mandarem o link no WhatsApp/Instagram), favicon com a estrela.
8. Performance: imagens otimizadas (WebP), lazy loading, nota 90+ no Lighthouse no celular.
9. Botão flutuante de WhatsApp e links das redes no rodapé (deixe os @ como constantes pra eu preencher).

Antes de começar, me mostre um plano curto do que vai fazer. Depois de cada etapa, rode o site localmente (por exemplo com `npx serve .`) e confira no celular e no desktop.
