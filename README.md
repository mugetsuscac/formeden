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

## Atendimento e Meta Pixel

O formulário está em modo `live`, com o WhatsApp comercial do Éden configurado em `public/config.js`.

O Meta Pixel do Éden é `985054417533046`, confirmado pelo responsável. Em modo `live`, o script registra `PageView` na abertura da página. O HTML inclui o fallback `noscript` do mesmo Pixel.

O formulário mostra as quatro perguntas juntas, com três alternativas e uma única escolha em cada pergunta. Os tamanhos foram agrupados em 68 ou 80 m², 90 a 117 m² e uma opção para quem ainda não decidiu. As respostas podem ser alteradas antes do envio.

O botão final valida as respostas, dispara o evento padrão `Lead` uma única vez e abre o WhatsApp com o resumo. Cliques nas chamadas e respostas incompletas não disparam conversões. A equipe só recebe a mensagem quando o visitante envia no WhatsApp; não há envio para servidor nem CRM. O evento não comprova recebimento da mensagem.

No celular, uma faixa fixa convida o visitante a consultar valores e unidades. Ela leva diretamente ao formulário e desaparece enquanto ele estiver visível. A faixa segue as cores e a tipografia existentes.

## Estrutura

- `public/index.html`: as três seções da página.
- `public/style.css`: identidade e responsividade.
- `public/app.js`: formulário completo, validação, chamada fixa, Pixel e encaminhamento.
- `public/config.js`: modo de revisão, telefone e Pixel.
- `public/assets/`: imagens locais usadas pela página.
- `vercel.json`: configuração do deploy estático.
- `verify.cjs`: testes sem rede nem eventos reais.

## Verificação

Com Node instalado, execute `npm test` ou `node verify.cjs`. Não é necessário instalar dependências. Os testes cobrem 81 combinações de respostas, validação, revisão, edição das escolhas, prevenção de duplicidade, visibilidade da chamada fixa e ordem do evento/redirecionamento.

O fluxo do Pixel e do formulário também foi validado em Chromium nos tamanhos desktop e mobile, com interceptação das requisições para não enviar eventos de teste ao Meta. A confirmação de recebimento no Gerenciador de Eventos deve ser feita na conta do Meta.

A página mantém `noindex,nofollow` e `robots.txt` bloqueando indexação durante a revisão. Após definir o domínio final, configure a imagem de compartilhamento com uma URL HTTPS absoluta. Não foram incluídos o book completo, plantas públicas, preços, vagas, estoque ou prazo de entrega não confirmados.
