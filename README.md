# Éden | Zilli Construtora

Landing page estática do Éden em Campinas, São José (SC), com três seções e imagens oficiais. Esta é a versão visual revisada: textos maiores, títulos diretos e legendas fora das imagens.

## Subir no GitHub

1. Crie um repositório para o Éden, separado do Solo Boulevard.
2. Extraia o ZIP.
3. Envie todo o conteúdo extraído: a pasta `public` e os arquivos da raiz, inclusive `vercel.json`.
4. Confirme que `vercel.json` e `README.md` estão na raiz do repositório. Não envie o arquivo ZIP como se fosse o código do site.

## Deploy na Vercel

Importe o repositório do GitHub. Use a raiz do repositório como Root Directory e Framework Preset **Other**. O arquivo `vercel.json` configura `public` como Output Directory, sem instalação de dependências e sem build.

Não selecione a pasta `public` como Root Directory; a configuração já aponta para ela como saída. Nenhuma variável de ambiente é necessária.

Documentação oficial: https://vercel.com/docs/project-configuration/vercel-json

## Atendimento: configuração ainda pendente

O site pode ser publicado para revisão. O formulário está em modo `review`, sem envio ao WhatsApp e sem carregar ou disparar o Pixel.

Em `public/config.js`, o telefone do Éden está vazio. Depois de confirmar o destino comercial, informe o número com país e DDD, apenas dígitos, e altere `mode` para `live`. O número do Solo não foi reaproveitado.

A conta de Pixel `973592522081687` é a encontrada no código atual do Solo. Confirmar sua utilização no Éden antes de ativar.

O fluxo preservado do Solo valida as respostas, dispara `Form Response` na confirmação e abre o WhatsApp com o resumo. A equipe só recebe a mensagem quando o visitante envia no WhatsApp; não há envio para servidor nem CRM. O evento não comprova recebimento da mensagem. Não mudar a conversão para PageView ou clique em um botão direto de WhatsApp.

## Estrutura

- `public/index.html`: as três seções da página.
- `public/style.css`: identidade e responsividade.
- `public/app.js`: perguntas em etapas, revisão, Pixel e encaminhamento.
- `public/config.js`: modo de revisão, telefone e Pixel.
- `public/assets/`: imagens locais usadas pela página.
- `vercel.json`: configuração do deploy estático.
- `verify.cjs`: testes sem rede nem eventos reais.

## Verificação

Com Node instalado, execute `npm test` ou `node verify.cjs`. Não é necessário instalar dependências. Os testes cobrem 180 combinações de respostas, validação, revisão, prevenção de duplicidade e ordem do evento/redirecionamento.

A conferência visual desktop/mobile no endereço final e o teste real no Gerenciador de Eventos continuam pendentes. O ambiente de preparação bloqueou conexões de prévia local.

A página mantém `noindex,nofollow` e `robots.txt` bloqueando indexação durante a revisão. Após definir o domínio final, configure a imagem de compartilhamento com uma URL HTTPS absoluta. Não foram incluídos o book completo, plantas públicas, preços, vagas, estoque ou prazo de entrega não confirmados.
