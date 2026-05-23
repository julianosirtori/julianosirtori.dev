# PRD: Migração de artigos do blog antigo para o portfólio

**Date:** 2026-05-22
**Status:** Approved

## Problem

Os artigos publicados em `github.com/julianosirtori/blog` (4 posts em português, escritos entre nov/2025 e jan/2026, servidos publicamente em `julianosirtori.github.io/blog`) vivem hoje em um canal editorial paralelo ao portfólio. Como consequência, fragmentam a presença editorial em dois endereços, dividem a tração de SEO entre dois domínios, e impedem que visitantes do portfólio principal (`julianosirtori.dev`) encontrem todo o conteúdo do autor em um único lugar. A intenção declarada de "escrever todos os dias" (registrada no próprio *hello-world* do blog antigo) só ganha alavanca quando os textos vivem em um único endereço público.

## Background

O portfólio atual já possui um sistema de blog maduro: Contentlayer + MDX, bilíngue (en/pt), com 21 artigos publicados (10 pares en+pt e 1 só em PT). O schema do portfólio é diferente do schema do blog antigo (`pliny`): nomes de campos divergem, imagens são resolvidas via Cloudinary/Unsplash em vez de paths locais, e há campos obrigatórios que o blog antigo não usa (`categories`, `meta.keywords`, `bannerCloudinaryId`).

A precedência de artigo só em PT já existe (`how-to-run-sonarqube-locally`), então a regra de pareamento bilíngue não é absoluta.

Dos 4 artigos do blog antigo:

| Slug original | Título | Data | Caráter | Observação |
|---|---|---|---|---|
| `hello-world` | Hello World - Meu Primeiro post aqui | 2025-11-20 | pessoal (*devaneios*) | **conflita** com `hello-world` já existente no portfólio |
| `react-sctrict-mode` | Ué, por que está renderizando duas vezes | 2025-11-23 | técnico (React) | typo no slug: `sctrict` deve ser `strict` |
| `sse` | Real Time com SSE no Next.js | 2026-01-04 | técnico (Next.js) | menciona curso pago do Frontend Masters |
| `primeiro-video` | Editei meu primeiro vídeo! | 2026-01-08 | pessoal (*devaneios*) | referencia imagem local `/static/images/davinci_resolve_cut.jpg` |

A divisão entre conteúdo técnico (2 artigos) e *devaneios* pessoais (2 artigos) é uma decisão editorial nova: o portfólio hoje é 100% técnico. Trazer os *devaneios* expande o escopo do blog.

## Requirements

### Must Have

- Migrar os 4 artigos do blog antigo para o portfólio, criando pares `content/en/{slug}.mdx` + `content/pt/{slug}.mdx` para cada um, com datas originais preservadas.
- Slugs finais:
  - `hello-world-devaneios` (renomeado do `hello-world` antigo para evitar colisão com o `hello-world` atual do portfólio).
  - `react-strict-mode` (corrige typo `react-sctrict-mode`).
  - `sse` (mantém slug).
  - `primeiro-video` (mantém slug).
- Adaptar o frontmatter ao schema do portfólio: `summary` → `description`, `tags` → `categories` + `meta.keywords`, remover campos não usados (`lastmod`, `authors`, `layout`).
- Definir `bannerCloudinaryId`, `bannerCredit` e `bannerAlt` para todos os 4 artigos. Sem banner, listagem do blog quebra visualmente.
- Traduzir todo o conteúdo (corpo + frontmatter) para inglês, criando os arquivos em `content/en/`. Traduções devem soar naturais em inglês, não literais.
- Para `primeiro-video`: baixar `davinci_resolve_cut.jpg` da URL pública `https://julianosirtori.github.io/blog/static/images/davinci_resolve_cut.jpg`, salvar em `public/images/davinci_resolve_cut.jpg`, referenciar como `/images/davinci_resolve_cut.jpg` (inline) e usar a mesma URL no `bannerCloudinaryId` (o resolver retorna a string como URL absoluta no `urlImage`).
- Cada artigo migrado deve renderizar em `/en/blog/{slug}` e `/pt/blog/{slug}` sem erro de build do Contentlayer e sem regressão visual nos posts existentes.

### Should Have

- Adicionar a categoria `devaneios` (em PT) e `musings` (em EN) para os 2 artigos pessoais (`hello-world-devaneios`, `primeiro-video`), marcando explicitamente a expansão editorial do blog para temas não-técnicos.
- Para o artigo `sse`: reler o trecho que cita o Frontend Masters e confirmar que não há transcrição literal do curso. O resumo deve ser nas próprias palavras do autor.

### Out of Scope

- Migrar metadata do `pliny` que não tem equivalente (`bibliography`, `canonicalUrl`, `authors`). O portfólio assume autor único.
- Setup de redirects 301 de `julianosirtori.github.io/blog`. Domínios distintos, sem histórico de tráfego significativo a preservar.
- Mudanças no design ou no layout do blog do portfólio.
- Desligar/arquivar o repositório `julianosirtori/blog`. Decisão separada após a migração estar concluída e validada em produção.
- Reescrita do conteúdo dos posts. A migração preserva o conteúdo original, apenas adapta frontmatter, traduz e ajusta referências de imagem.

## Constraints

- O blog antigo usa `pliny` e o portfólio usa Contentlayer custom. Não há ferramenta de migração automática. O trabalho é manual, post a post.
- O artigo `sse` referencia conteúdo de um curso pago (Frontend Masters). Reler para confirmar que não há trecho com risco de violação de copyright antes de publicar.
- O slug `hello-world` do portfólio é a página inaugural do blog atual e tem valor editorial. Não pode ser sobrescrito.
- O `bannerCloudinaryId` é um campo `required: true` no schema. Quando não houver imagem no Cloudinary, o resolver `urlImage` retorna a string literal. Isso permite passar URLs absolutas ou paths relativos do `public/`.
- Pre-commit hook do portfólio roda `lint-staged` + `pnpm test` em todo commit. Frontmatter inválido ou MDX quebrado bloqueia o commit.

## Acceptance Criteria

### Migração dos artigos técnicos

- Dado o artigo `react-sctrict-mode.mdx` do blog antigo, quando migrado, então existem `content/pt/react-strict-mode.mdx` e `content/en/react-strict-mode.mdx` com data original (`2025-11-23`), `description` populado a partir do `summary` antigo, e ambos renderizam em `/pt/blog/react-strict-mode` e `/en/blog/react-strict-mode`.
- Dado o artigo `sse.mdx`, quando migrado, então existem `content/pt/sse.mdx` (título "Real Time com SSE no Next.js") e `content/en/sse.mdx` (título traduzido natural), com blocos de código TypeScript renderizando com syntax highlighting Dracula, e links externos funcionais.
- Dado qualquer artigo migrado, quando o build (`pnpm build`) roda, então Contentlayer gera o JSON sem warnings de campos obrigatórios faltando.

### Migração dos artigos pessoais (devaneios)

- Dado o `hello-world.mdx` do blog antigo, quando migrado, então existem `content/pt/hello-world-devaneios.mdx` e `content/en/hello-world-devaneios.mdx`, e o `hello-world` atual do portfólio permanece intacto e renderizando em ambos idiomas.
- Dado o `primeiro-video.mdx`, quando migrado, então existem `content/pt/primeiro-video.mdx` e `content/en/primeiro-video.mdx`, com a imagem `davinci_resolve_cut.jpg` salva em `public/images/` e referenciada como `/images/davinci_resolve_cut.jpg` no corpo e no banner.
- Dado um visitante acessando `/pt/blog/hello-world` (slug antigo do portfólio), então vê o conteúdo de boas-vindas original do portfólio, não o post de devaneios.

### Imagens

- Dado o artigo `primeiro-video` migrado, quando carregado, então `https://julianosirtori.dev/images/davinci_resolve_cut.jpg` retorna 200 e a imagem renderiza tanto inline no corpo quanto como banner do post.
- Dado qualquer artigo migrado, quando aparece na listagem do blog, então o banner renderiza sem placeholder quebrado, com `bannerCredit` visível e `bannerAlt` preenchido em ambos idiomas.

### Categorização

- Dado um artigo técnico migrado, quando categorizado, então usa categorias compatíveis com o resto do blog (ex.: `react`, `nextjs`, `front-end`).
- Dado um artigo de devaneios migrado, então usa a categoria `devaneios` na versão PT e `musings` na versão EN, com `meta.keywords` espelhando as tags originais traduzidas.

### Bilinguismo

- Dado um artigo migrado, então sua versão EN não é uma tradução literal do PT, mas uma adaptação que soa natural ao leitor anglófono.
- Dados os 4 artigos migrados, então cada um tem par EN+PT completo (sem nenhum só em um idioma).

### Validação final

- Dado o conjunto completo de artigos migrados, quando `pnpm dev` roda, então todas as URLs `/pt/blog/{slug}` e `/en/blog/{slug}` retornam 200 e os artigos existentes pré-migração continuam renderizando sem regressão.
- Dado o pre-commit hook do portfólio, quando o commit da migração é feito, então `lint-staged` e `pnpm test` passam sem erros.
