# Espelho do iPhone

Mostra a tela do iPhone no navegador, via cabo USB, e só libera depois de digitar uma senha.

## Como usar (Mac)

1. Instale o ffmpeg e o Node: `brew install ffmpeg node`
2. Plugue o iPhone no cabo USB.
3. Na pasta `espelho-iphone`:
   ```
   SENHA="escolha-uma-senha" node server.js
   ```
4. Abra http://127.0.0.1:3000, digite a senha e a tela aparece.

Para listar o nome do aparelho: `ffmpeg -f avfoundation -list_devices true -i ""`.
Se houver mais de um, use `IPHONE_DEVICE="nome ou índice"`.

## Teste sem iPhone

`SENHA=123 npm run demo` mostra uma imagem de teste, só para conferir o site.

## Windows / Linux

O navegador não lê o iPhone por USB sozinho, e o ffmpeg só enxerga o aparelho no Mac.
Em outros sistemas, use uma ferramenta que capture o iPhone por USB (por exemplo
[quicktime_video_hack](https://github.com/danielpaulus/quicktime_video_hack), `qvh`) e entregue
o vídeo ao ffmpeg com `FONTE=custom`, por exemplo:

```
FONTE=custom FFMPEG_ENTRADA="-f h264 -i /caminho/saida.h264" SENHA=... node server.js
```

## Opções (variáveis de ambiente)

| Variável | Padrão | O que faz |
|---|---|---|
| `SENHA` | (obrigatória) | senha de acesso |
| `PORT` | 3000 | porta |
| `HOST` | 127.0.0.1 | `0.0.0.0` abre para outros aparelhos da rede (só em rede de confiança) |
| `FPS` | 20 | quadros por segundo |
| `LARGURA` | 720 | largura do vídeo |
| `QUALIDADE` | 5 | 2 (melhor) a 31 (pior) |

## Segurança

Senha comparada em tempo constante, cookie `HttpOnly`, bloqueio de 1 minuto após 5 erros, e a
captura só roda enquanto alguém está assistindo. Por padrão só aceita conexões do próprio computador.

## Limites

- É só espelho (ver a tela). Não dá para tocar na tela por aqui.
- O iPhone precisa estar desbloqueado e já ter confiado neste computador.
