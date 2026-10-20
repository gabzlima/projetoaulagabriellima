# Auditoria de conformidade do site da Zanza

Data: 20 de outubro de 2026

> **Isto não é parecer jurídico.** É um levantamento técnico com textos-modelo baseados na legislação.
> Antes de abrir a venda, um advogado precisa revisar as páginas legais e os pontos marcados como
> "revisar com advogado".

---

## 1. Pendências que só você resolve (e que bloqueiam a venda)

| # | O que fazer | Por quê |
|---|---|---|
| 1 | Preencher `EMPRESA` em `js/config.js`: razão social, CNPJ, endereço e e-mail. Sem CNPJ, o mínimo é nome e CPF, mas o recomendado é abrir um MEI antes de vender. | O Decreto 7.962/2013 (art. 2º) exige esses dados visíveis em quem vende pela internet. A LGPD (art. 9º) exige que a pessoa saiba quem é o controlador dos dados. Enquanto estiver vazio, as páginas legais mostram **[a preencher]** em amarelo. |
| 2 | Confirmar se a marca "Zanza" está registrada no INPI. Os dois logos têm o símbolo **®**. | ® indica marca registrada. Usar ® sem registro pode ser visto como informação enganosa (CDC, art. 37). Se não estiver registrada, tire o ® dos arquivos dos logos e peça o registro (classe 25, vestuário). Vale também pesquisar se já existe "Zanza" registrada nessa classe por outra pessoa. **Revisar com advogado.** |
| 3 | Ter um contrato de cessão de direitos com quem desenhou o logo e as estampas. | Sem cessão por escrito, os direitos autorais continuam com o autor (Lei 9.610/1998). |
| 4 | Confirmar com o fornecedor toda a ficha técnica do site: 100% algodão, malha penteada, fio 30.1, 180–200 g/m², malha pré-encolhida, estampa DTF, "Feito no Brasil" e 50 peças. | Cada um desses dados é uma afirmação ao consumidor (CDC, art. 31 e 37). Se algum não for verdade, mude no site. |
| 5 | **Trocar os números da tabela de medidas.** | Os valores atuais (P 58×70 cm até XG 66×78 cm) **foram inventados por mim como exemplo**. O site agora avisa que são "provisórios", mas precisam ser os reais antes da venda. |
| 6 | Cumprir o "preço de estreia só pra lista". | É uma promessa pública da marca. |
| 7 | Decidir se vai ter troca por tamanho ou cor e em quais condições. | Não é obrigatória por lei. Hoje a página de trocas diz que vocês "ainda vão definir". |
| 8 | Confirmar o prazo de guarda dos dados (12 meses depois do fim da pré-venda). | Fui eu que propus esse prazo. Se mudar, ajuste em `privacidade.html`, seção 6. |
| 9 | Ligar a verificação em duas etapas na conta Google da planilha e não compartilhar a planilha com link público. | A Política de Privacidade promete isso (seção 9). |
| 10 | Revisar com advogado a lista de pré-venda pra menores de 18 anos. | O público vai de 15 a 30 anos. O formulário pede que a pessoa declare ter 18+ ou autorização do responsável. A LGPD (art. 14) pede atenção ao melhor interesse de adolescentes, e o Código Civil trata da capacidade de menores de 16 e de 16–17. **Revisar com advogado.** |
| 11 | Revisar com advogado a transferência internacional de dados. | Google, Meta (WhatsApp) e GitHub guardam dados fora do Brasil. A LGPD (art. 33) só permite isso em hipóteses específicas, como as cláusulas-padrão da Resolução CD/ANPD nº 19/2024. **Revisar com advogado.** |
| 12 | Antes de publicar fotos do lookbook: ter autorização de uso de imagem assinada por cada pessoa que aparece (e pelo responsável, se for menor), e cessão de direitos do fotógrafo. | Código Civil (art. 20), ECA e Lei 9.610/1998. |
| 13 | Quando comprar um domínio próprio, trocar o endereço `gabzlima.github.io/projetoaulagabriellima` nas tags `canonical` e `og:` de todas as páginas. | Antes elas apontavam pra `zanza.com.br`, um domínio que talvez não seja seu. |

## 2. Quando a venda abrir (próxima etapa)

- Mostrar preço total, frete, prazo de entrega e formas de pagamento antes do pagamento (CDC, art. 31; Decreto 7.962/2013).
- Mostrar um resumo do pedido antes de confirmar e mandar a confirmação logo depois da compra (Decreto 7.962/2013, art. 4º).
- Ter um canal de atendimento fácil de achar (o e-mail do `config.js` e o WhatsApp).
- Emitir nota fiscal.
- Atualizar a Política de Privacidade pra incluir os dados da compra (CPF, endereço, pagamento) e mudar `POLITICA_VERSAO`.
- Se a loja tiver cadastro com login no futuro, ver com o advogado a guarda de registros de acesso (Marco Civil da Internet, art. 15).

## 3. O que foi feito (e testado)

### Documentos legais
- `privacidade.html`: Política de Privacidade (LGPD, art. 6º, 7º, 8º, 9º, 14, 16, 18, 33, 46 e 48).
- `termos.html`: Termos de Uso (pré-venda não é compra, imagens ilustrativas, marca, foro do consumidor pelo CDC, art. 101).
- `trocas.html`: Trocas, devoluções e reembolso (arrependimento em 7 dias, CDC art. 49 e Decreto 7.962/2013 art. 5º; defeito em 90 dias, CDC art. 18 e 26; atraso, CDC art. 35).
- Links das três páginas no rodapé de todas as páginas e nas Dúvidas.
- Os dados da empresa vêm de um lugar só (`js/config.js`) e aparecem marcados enquanto estiverem vazios.

### Formulário (LGPD)
- Caixa de consentimento **desmarcada** por padrão, obrigatória, com finalidade específica (avisos do Drop 01 e dos próximos lançamentos) e link pra política.
- Declaração de idade (18+ ou autorização do responsável).
- **Dado removido:** a URL da página, que era enviada sem necessidade.
- Pede só o primeiro nome.
- Cada cadastro guarda a data, o consentimento e a versão da política aceita, como prova (LGPD, art. 8º, § 2º).
- Explica como sair da lista (responder "SAIR" ou por e-mail).
- O script da planilha (`apps-script/Code.gs`) não grava cadastro sem consentimento, valida o WhatsApp, limita o tamanho dos campos e bloqueia **injeção de fórmula** na planilha (um nome começando com `=` virava fórmula).
- Testado: sem as caixas marcadas, nada é enviado.

### Cookies, Google Analytics e rastreamento
- **Não existe nenhum Google Analytics, pixel, cookie ou script de rastreamento no site.** Testado: ao abrir a página, zero cookies e zero chamadas a outros domínios.
- Por isso **não aparece aviso de cookies**. Mostrar um aviso sem ter cookies seria informação falsa.
- Ficou pronto um sistema de consentimento desligado: se um dia você colocar o ID do GA4 em `CONFIG.GA_ID`, o aviso aparece com "Aceitar" e "Recusar" do mesmo tamanho, e o GA só carrega depois do aceite, sem recursos de publicidade. O link "Cookies" do rodapé reabre a escolha. Testado com um GA simulado: zero pedidos ao Google antes do aceite e zero depois de recusar.
- As fontes passaram a ficar no próprio site (antes vinham do Google Fonts, que recebia o IP de cada visitante).

### Promessas sem comprovação (reescritas)
| Antes | Depois |
|---|---|
| "A mesma malha que as melhores marcas de streetwear do Brasil usam." | "Algodão penteado de 180 a 200 g/m²." |
| "estampa que não desbota" | "estampa DTF" |
| "Não encolhe. Não desbota." | "Feita pra durar." + cuidados da etiqueta |
| "sem encolher depois da primeira lavagem" | "malha pré-encolhida" |
| "que não faz bolinha" / "sem bolinha" | "que forma menos bolinhas" / "Encorpado e macio" |
| "Aguenta lavagem." | removido |
| FAQ "A camiseta encolhe ou desbota? Não." | "Como cuidar da camiseta?" com os cuidados da etiqueta |
| "garante a sua com preço de estreia" | "tem prioridade pra comprar com preço de estreia, enquanto durarem as peças" |
| "Duas cores que combinam com tudo que você já tem." | "Duas cores fáceis de combinar." |
| Tabela de medidas sem aviso | "Medidas provisórias" |
| Camisetas sem aviso | "Imagens ilustrativas, feitas no computador..." (CDC, art. 31) |

### Verificado e sem problema
- **Avaliações e depoimentos falsos:** não existe nenhum no site.
- **Contadores falsos** (estoque, "X pessoas vendo agora"): nenhum. A contagem regressiva só aparece com uma data real em `CONFIG.DATA_DROP`.
- **Imagens de terceiros:** nenhuma. Tudo é logo da marca (enviado por você), ilustração feita em código ou a imagem de prévia montada com o logo.
- **Fontes:** Big Shoulders Display, Familjen Grotesk e JetBrains Mono, todas com licença SIL Open Font License 1.1, que permite usar no site. As licenças agora acompanham os arquivos em `assets/fonts/`.
- **Ícone do WhatsApp:** usado só pra indicar contato pelo WhatsApp, que é o uso previsto pela marca.
- **Áudio e vídeo:** o site não tem. Se um dia tiver vídeo, coloque legenda e audiodescrição.

### Acessibilidade (Lei Brasileira de Inclusão, art. 63, e WCAG 2.2 AA)
- **axe-core 4.10** (WCAG 2.0, 2.1 e 2.2 AA + boas práticas): **zero violações** nas 4 páginas, no celular e no desktop, inclusive com o modal aberto e com os erros do formulário aparecendo.
- **Lighthouse (celular):** acessibilidade 100 em todas as páginas testadas.
- **Contraste corrigido:** títulos pequenos em azul (4,3:1, passou pra mais de 4,5:1), links, palavras apagadas do manifesto e foco no fundo azul.
- **Teclado:** testado com Tab do começo ao fim de cada página. Todo elemento focado fica visível, com contorno de foco, e nunca fica escondido atrás do menu fixo ou da barra de compra (WCAG 2.4.11).
- **Movimento:** botão "Pausar animações" no topo e no rodapé (WCAG 2.2.2), e respeito a "reduzir movimento" do aparelho.
- **Cursor:** a seta do sistema não é mais escondida. Quem usa seta ampliada continua vendo a sua.
- **Imagens:** todas têm texto alternativo ou estão marcadas como decorativas.
- **Formulário:** rótulos, mensagens de erro lidas pelo leitor de tela e foco no primeiro erro.
- **Limite:** testes automáticos não pegam tudo. O ideal é alguém testar com um leitor de tela (NVDA, VoiceOver ou TalkBack) antes do lançamento.
