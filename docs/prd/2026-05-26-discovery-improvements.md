# PRD: julianosirtori.dev — Discovery Crítica e Próximas Apostas

**Date:** 2026-05-26
**Status:** Draft

## Problem

O site tem um chassi de Ferrari rodando em pista de kart. Tecnicamente é um dos portfólios mais bem construídos que se vê em devs sêniores brasileiros. Next.js 16 com Turbopack, Tailwind v4 CSS-first, bilíngue com voice guide, terminal interativo de verdade, testes unit e e2e, semantic tokens, lighthouse no CI. Mas quem chega no site não fica sabendo *quem* é o Juliano nem *por que* deveria contratar, ler, ou voltar.

A home é uma estampa neutra. O hero diz "Juliano é um engenheiro front-end" e completa com uma descrição que poderia estar em mil currículos. Os projetos são uma lista de doze links sem descrição, sem imagem, sem stack, sem aprendizado. O blog tem 29 artigos bilíngues mas zero opinião declarada, zero série, zero CTA pra newsletter (que não existe). O guestbook escreve em localStorage e some no próximo dispositivo. O playground é uma jóia escondida que poucos visitantes vão descobrir porque nenhum lugar do site grita "abre o terminal". Em resumo: o site mostra que o Juliano *sabe construir*, mas não mostra *o que ele constrói no mundo, com quem, e pra quê*.

## Background

Histórico recente do site (último mês):

- 2026-05-08, rebrand editorial completo (`8e2142b`). Tipografia editorial, paleta nova, command palette `cmdk`, playground, voice guide.
- 2026-05-22 a 2026-05-23, migração dos 22 artigos antigos pro `content/{en,pt}`. Expansão pra 29 artigos.
- Sem deploy novo de conteúdo desde então. Cadência de escrita pós-migração: ainda não definida.

A casa foi reformada nos últimos 30 dias. Os móveis chegaram. Falta o morador. Esta discovery cobre o que vem *depois* do rebrand: virar o site num produto que captura atenção, retém audiência e converte intenção (de contratar, de assinar, de voltar) em ação.

A motivação imediata vem da própria evolução do site. O PRD anterior (editorial refresh) deixou newsletter, busca full-text e backend out-of-scope. Foi a chamada certa naquele momento. Agora cabe revisitar com cabeça fria.

## Positioning Shift

Decisão de carreira recente que muda o eixo desta discovery: o Juliano está se reposicionando de **front-end engineer** pra **engenheiro de software full-stack**, e tem **engenharia de IA como direção de estudo** pro próximo capítulo. Hoje trabalha React/Next.js no front e NestJS no back, em TypeScript ponta a ponta. Estuda IA, mas ainda não tem entrega de IA no portfólio.

Isso afeta praticamente todas as superfícies do site, que hoje ainda comunicam "front-end" como identidade:

- Hero da home declara front-end ("engenheiro front-end")
- Subtítulo da home enumera só React/Next/TS
- Tech Stack section mostra só stack de front
- About page descreve carreira como front-end
- CV carrega o mesmo posicionamento antigo

Princípio que vai guiar a comunicação: **o hero é o que se é hoje, não o que se quer ser**. Full-stack pode entrar no slogan porque já existe na prática. IA não entra como competência, entra como direção declarada de estudo, em camada secundária (subtítulo, `/now`, `/about`). Quando houver entrega de IA shippada, a comunicação migra. Antes disso, vale honestidade sobre estar estudando, sem inflar bio.

## Competitive Landscape

Devs sêniores que estão alguns passos à frente, e o que cada um faz que o `julianosirtori.dev` ainda não faz:

| Referência | O que faz bem | O que dá pra adaptar |
|---|---|---|
| **leerob.io** (Lee Robinson, Vercel) | Dashboard com GitHub stars, YouTube views, total subs, Spotify currently playing | Painel "vivo" como prova de movimento contínuo |
| **brian.lovin.io** (GitHub) | AMA público, case studies de projetos, books, music feed, work history detalhada | Estudos de caso de projeto e seção de leituras com nota pessoal |
| **joshwcomeau.com** | Demos interativos dentro dos artigos (sliders, canvas, react state vivo) | Pelo menos 2 artigos viram showcase técnico em vez de texto puro |
| **delba.dev** (BR/Vercel) | Sketch notes, Twitter integrado, voz própria como dev BR no exterior | Posição clara como dev BR sênior, vinculando experiências locais e globais |
| **wesbos.com** | Newsletter (Syntax), `/uses` page, podcast, curso como funil | `/uses` page é low-cost e alto efeito. Newsletter é canal próprio |
| **brittanychiang.com** | Layout limpo + case studies linkados com depoimento de cliente | Cada projeto featured tem 1 quote de quem trabalhou junto |
| **theo.io** / theprimeagen | Opinião forte, recortes de YouTube, presença pública | Conteúdo de vídeo curto (não precisa virar youtuber) |
| **rauchg.com** (Guillermo Rauch) | Lista de essays curados, cada um é uma tese declarada | Posts âncora ("if you read one thing, read this") |
| **akitaonrails.com** (Fabio Akita) | Voz autoral marcante, sem complexidade visual mas presença forte | Opinião declarada por escrito, não só tutorial |
| **lhsantos.com** (BR sênior) | Foco em devlog pessoal, escrita em primeira pessoa | Devlog curto entre artigos longos |

Padrão recorrente nos melhores: **eles existem fora do site também e o site é o agregador**. GitHub vivo, YouTube ou podcast, newsletter, talks. O `julianosirtori.dev` hoje é uma ilha. Sem feed externo, sem newsletter, sem dashboard de atividade.

## Critical Findings

Pontuei dor por dor, com franqueza:

### 1. Hero genérico e desatualizado

Copy atual:

> "Juliano é um engenheiro front-end."
> "Há mais de 9 anos construindo aplicações web complexas, escaláveis e performáticas. Trabalho com React, Next.js e TypeScript..."

Dois problemas se somam. Primeiro, é genérico. Descreve metade da timeline do LinkedIn brasileiro. Falta tese. Segundo, e mais grave depois da decisão recente, está desatualizado: diz "front-end" quando o Juliano já trabalha full-stack e estuda IA. O hero precisa declarar tese **E** refletir o novo eixo (full-stack hoje, IA como direção de estudo, sem inflar competência).

### 2. Página de projetos é um cemitério de links

`src/data/projects.ts`: 12 títulos com URL, agrupados por ano. Sem descrição, sem stack, sem print, sem contexto. Quem clica em "Space Invaders in Vanilla JS" não sabe se é um exercício de 1 semana ou um projeto de 6 meses, nem por que valeu fazer. Cliente que pesquisa o nome do Juliano antes de uma reunião vai sair sem repertório nenhum.

### 3. Sem captura de audiência

Nada de newsletter, RSS link discreto, follow no GitHub destacado, ou opt-in pra ser avisado de novo artigo. Visitante que gosta do conteúdo vai embora e não volta. Para um blog que virou a porta principal (segundo o próprio PRD anterior), isso é furo grande.

### 4. Guestbook é teatro

Hoje grava só em localStorage. Visitante deixa mensagem, recarrega no celular, sumiu. Nenhuma mensagem aparece pra outros. Não gera prova social, não gera retorno emocional pra quem assinou, não vira conteúdo do site. É um botão de "fingir engajamento".

### 5. Now page sem vida

A página `now` é uma boa ideia (Derek Sivers popularizou). Mas o conteúdo atual está em nível de bullet vago. Sem data de última edição visível na hora de ler (existe campo, mas precisa estar gritando), sem indicação de cadência ("atualizo a cada 2 semanas"), sem histórico de versões. Quem chega não sabe se a página é de ontem ou de seis meses atrás.

### 6. Recommendations enterrados

`/about` tem 3 quotes de colegas. Em portfólios competitivos, isso vai pra home ou pra uma página `/testimonials` própria. Como prova social, o lugar atual desperdiça o ativo.

### 7. Playground escondido

Terminal interativo com 30 comandos, easter eggs, jogos, autocomplete, pipes. Diferencial gigante de portfólio. Mas a única menção é um link no `/playground` que ninguém alcança organicamente. A home não conta sobre. Sem analytics, o Juliano nem sabe quais comandos as pessoas tentam.

### 8. Sem página "hire me" / disponibilidade

`/contact` é um form genérico. Quem chega querendo contratar não sabe: o Juliano está disponível? Faz freelance? Aceita consultoria? Mentoria? Pair programming? Tem range de orçamento? Trabalha remoto pra fora? A ausência dessa informação filtra contatos errados e perde contatos certos.

### 9. Stack vive isolado

Tech stack na home é um carrossel de logos. Não diz por que essas escolhas, nem o que o Juliano *prefere* num projeto novo. Sem opinião. Sem ranking. Sem "se eu começasse hoje" honesto.

### 10. Sem analytics de produto

Sem tracking de comandos do playground, sem heatmap de blog, sem contagem de cliques no CV, sem dashboard interno pro próprio Juliano. Decisão de produto vira chute. "Acho que as pessoas gostam do playground" não é dado.

### 11. Voz no blog não chegou ainda

Os 29 artigos são tecnicamente sólidos. Mas o voice guide (que existe) ainda não está visível na maioria dos posts. Sem opinião declarada, sem hook empático, sem assinatura de escrita reconhecível. Quem leu 3 artigos do Juliano ainda não consegue descrever pra um amigo "como o Juliano escreve".

### 12. Mobile do playground

O terminal tem soft keyboard pra mobile, mas a real é que terminal em telinha de celular não é a melhor experiência. Vale considerar uma versão "mobile-aware" do playground (lista de comandos clicáveis em vez de input livre).

### 13. Incongruência de posicionamento em todo o site

Não é só o hero. Tech Stack section da home, página About, `/now`, OG metadata e o próprio CV declaram "front-end engineer". Pra reposicionar com coerência, a mudança precisa varrer essas superfícies juntas. Senão visitante recebe sinais conflitantes: hero novo dizendo full-stack, mas about velho ainda contando história de front-end puro.

## Requirements

Organizei em **três fases**. Cada fase tem entrega isolada e visível. Fases podem ser executadas fora de ordem se necessário, mas a ordem proposta segue de "mais barato e mais impacto" pra "mais ambicioso".

### Fase 1, Voz e profundidade (Must Have)

Custo baixo, retorno alto. Quase tudo é conteúdo, não código.

- **Reescrever o hero da home.** Saída: substituir "Juliano é um engenheiro front-end" por slogan + subtítulo refletindo o novo posicionamento. Slogan declara identidade full-stack com tese (estrutura: o que faço + qual é a forma + diferencial). Subtítulo expande stack (React/Next no front, NestJS no back, TS ponta a ponta) e cita IA como **estudo declarado**, não competência. Exemplo de direção (não copy final): slogan "Construo aplicações web ponta a ponta, e me importo principalmente com o que sobra do projeto depois que o hype passa." + subtítulo "9 anos no desenvolvimento web. React e Next.js no front, NestJS no back, sempre em TypeScript. Atualmente estudando engenharia de IA." Voice guide aplicado em pt e en (rewrite, não tradução literal).
- **Atualizar Tech Stack section da home.** Saída: agrupar logos em três faixas visíveis: **Front** (React, Next.js, TypeScript), **Back** (NestJS, Node, banco de dados que usa) e **Estudando** (ferramentas/conceitos de IA conforme o Juliano definir: LLMs, RAG, agents, evals). Faixa "Estudando" tem rótulo explícito pra deixar claro que não é stack de entrega.
- **Reescrever About page pra refletir transição.** Saída: parágrafo declarando posicionamento full-stack atual + parágrafo declarando estudo de IA como próximo capítulo, com lista do que está estudando especificamente. Honesto sobre estar estudando, não entregando. Mantém timeline de experiências (não reescreve história), atualiza só o framing do "quem sou hoje".
- **Estudos de caso para 3 projetos featured.** Saída: cada projeto featured ganha página própria com hero, contexto (qual era o problema), decisões técnicas (stack, trade-offs, alternativas descartadas), resultado (métrica ou aprendizado), e 1 print ou GIF curto. Mínimo 3 case studies, máximo 5. Os outros 7 ficam como lista compacta. Critério de escolha: variedade (1 produto a serviço de cliente real, 1 experimento técnico, 1 colaboração open source ou ferramenta).
- **Página `/uses`.** Saída: rota nova `/[lang]/uses` listando hardware (notebook, monitor, teclado, mouse, fone, cadeira), software (editor, terminal, browser, extensions, dotfiles), ferramentas de back (DB client, API client, container runtime), ferramentas de IA usadas no dia a dia (Claude, Cursor, ChatGPT, etc.) e configs (font, theme, key bindings). Cada item com 1 frase de "por que esse". Inspiração: `uses.tech` agregator + `wesbos.com/uses`.
- **Página `/hire-me` (ou `/work-with-me`).** Saída: rota nova com 3 blocos. Disponibilidade atual (full-time, freelance, mentoria, palestra). Tipo de trabalho que aceita (front-end, full-stack) e o que **ainda** não aceita (projetos puros de IA, porque está em fase de estudo). Como contratar (link pro form + email + LinkedIn, com tempo de resposta esperado). O comando hidden do playground `hire-me` já navega pra essa rota.
- **Reorganizar recommendations.** Saída: mover bloco de testimonials da `/about` pra home (acima da seção "get in touch") em formato compacto (carrossel ou 2-3 visíveis com link "ver mais"). Adicionar foto pequena de quem recomendou se houver permissão, com link pro LinkedIn da pessoa.
- **Now page com timestamp grande.** Saída: data de última edição em destaque no topo. Cadência declarada ("atualizo no início de cada mês"). Histórico das últimas 3 versões linkável (opcional, low-priority).
- **Voice no blog: 1 série + 1 artigo opinativo.** Saída: definir 1 série com 3-5 artigos relacionada à transição atual (ex: "Migrando da fronteira: front-end pra full-stack sem virar generalista raso", ou "Primeiros passos honestos em engenharia de IA"), publicar o primeiro com hook de série visível no header do post. Publicar 1 artigo declaradamente opinativo (formato "manifesto pessoal" ou "o que eu mudei de ideia"). Voice guide aplicado de ponta a ponta.

### Fase 2, Captura e prova social (Must Have)

Custo médio. Backend leve.

- **Newsletter.** Saída: provider (sugiro Buttondown ou Resend Audiences, já tem Resend integrado), opt-in no footer + 1 banner discreto no fim de cada artigo, página `/[lang]/newsletter` explicando o que é (frequência, formato, tema). Confirmação double opt-in. Primeira edição não-obrigatória nesta fase, mas plano editorial declarado.
- **Guestbook com backend leve.** Saída: trocar localStorage por backend persistente (sugestão: Turso/libSQL ou Vercel KV pra ficar barato). Auth via GitHub (já tem Giscus, mesma identidade serve). Moderação: aprovação manual via flag no banco. Wall pública das últimas 30 mensagens. Manter compatibilidade com mensagens antigas (best effort, podem se perder).
- **Wall de testemunhos em `/work-with-me`.** Saída: agregar recommendations + frases de clientes (com permissão), formato cards verticais empilhados, foto+nome+cargo+empresa+quote. Mínimo 5 itens pra começar.
- **Reactions agregadas no perfil.** Saída: footer da home mostra "X reações em Y artigos" como prova de tráfego. Dado vem de localStorage hoje (Reactions component), o que limita. Migrar pra backend junto com guestbook.
- **CV opt-in opcional.** Saída: download do CV pode ser direto (como hoje) ou com email opcional (campo "te aviso quando tiver vaga aberta pro tipo de trabalho que você procura"). Não bloquear download se vazio. Métrica de adesão pra decidir continuar ou não.

### Fase 3, Sinais vivos e analytics (Should Have)

Custo médio-alto. Diferenciação grande.

- **Dashboard vivo na home (compacto).** Saída: um bloco de 4-6 cards mostrando commits dos últimos 7 dias (GitHub API), último artigo publicado com data, livro que está lendo (manualmente curado, atualiza com a now page), e "tocando agora" (last.fm ou Spotify, opcional). Cards com fallback gracioso quando API cai.
- **Analytics do playground.** Saída: trackear comando executado, theme escolhido, tempo na sessão. Pode ser self-hosted (Plausible/Umami) pra não depender de Google. Dashboard interno (rota com auth simples ou .env-gated) listando top comandos, % de visitantes que executam ≥ 3 comandos, % que descobrem snake/matrix.
- **Reading log / livraria pessoal.** Saída: rota `/[lang]/reading` (ou `/library`) listando livros lidos com 1 takeaway pessoal cada. Estrutura MDX simples, próxima ao blog mas sem comments. Cadência: 1 update por mês idealmente. Inspiração: brian.lovin.io/books.
- **Devlog curto entre artigos longos.** Saída: novo content type `notes` (≤ 200 palavras, sem capa, sem TOC), URL `/[lang]/notes/[slug]`. Frontmatter mínimo: title, date, language. Aparece num feed lateral ou em `/[lang]/blog?type=notes`. Pra micro-publicações que hoje virariam tweet e morrem.
- **OG por post mais agressivo.** Saída: já existe gerador, mas calibrar pra cada artigo ter título + tag + foto pequena do autor + cor temática por categoria. Critério: ao compartilhar 5 artigos diferentes no Twitter/LinkedIn, os 5 cards devem ser visualmente distintos sem perder identidade.

### Wild Ideas (Should Have ou descartar conforme valor)

Apostas mais arriscadas. Cada uma é um spike, pode ser feita ou cortada.

- **Site Tour no playground.** Comando `tour` no terminal que conta a história do site em 7 passos guiados (curtos, com voz autoral). Visitante novo digita `tour` e descobre o que tem em cada canto.
- **Year in review anual.** Página `/[lang]/2026` no fim do ano com retrospectiva: artigos publicados, projetos enviados, livros lidos, decisões de carreira. Vira tradição. Pode reaproveitar dados que já existem.
- **Failure log.** Página `/[lang]/oops` listando 5-10 coisas que o Juliano errou e o que aprendeu. Difícil de fazer com voz honesta, mas raríssimo no mercado. Conteúdo memorável.
- **"Ask me anything" assíncrono.** Formulário pra perguntas + página `/[lang]/ama` mostrando perguntas respondidas. Vira conteúdo evergreen. Mantém site vivo sem pressão de blog.
- **Theme picker além de light/dark.** 4 temas escolhíveis (editorial, sépia, terminal-green, hi-contrast). Persistido via next-themes. Baixo custo, alto "wow".
- **Konami code revelando lore.** Já existe KonamiEgg. Hoje provavelmente abre algo simples. Transformar em easter egg narrativo: revela uma página secreta com história do Juliano em formato bloco de tempo. Vale só se a página tiver conteúdo de verdade.
- **Bilíngue assimétrico declarado.** Artigo onde a versão PT *não* é tradução da EN. Vira meta-conteúdo sobre escrever em duas línguas. Pode virar série recorrente.
- **"Last shipped" no footer.** Data do último deploy visível em todas as páginas como prova de movimento. Pode puxar da env de build.
- **Snippets/recipes section.** Pasta de utilitários TS/React curtos com tag e explicação. Pra gente que cai do Google buscando "react usePrevious typescript", encontra, e leva o site na cabeça depois.
- **Open source contributions visíveis.** Bloco em `/about` ou home listando PRs notáveis em projetos famosos (Next.js, Radix, etc.) se houver. Prova social técnica gratuita.
- **Open AI learning log.** Rota `/[lang]/learning-ai` (ou similar) com devlog público do estudo de IA: o que tentou, o que funcionou, o que falhou, links pra repos e notebooks. Bilíngue. Vira diferencial enorme porque a maioria dos devs entrando em IA esconde a jornada e só aparece "pronto". Mostrar processo é raro e marca posição.

### Out of Scope

- **App mobile dedicado, PWA offline.** Site responsivo continua, mas sem app instalável.
- **Tradução automática de artigos faltantes.** Bilíngue continua manual e curado.
- **Comments próprios.** Giscus fica. Sem CMS de comentários custom.
- **Refazer o terminal do zero.** O playground é considerado um asset estável. Pode ganhar analytics e novos comandos, mas não reescrita.
- **Migrar Contentlayer.** Continua.
- **Trocar Vercel ou Resend.** Sem mudança de infra.
- **Monetização direta.** Sem cursos pagos, sem "buy me a coffee" agressivo, sem ads. Foco é audiência e oportunidades, não receita direta de site.
- **Reivindicar título de AI Engineer sem entrega.** Sem "AI Engineer in transition" no hero, sem stack list com "AI/ML" enfileirado junto com React, sem badge no LinkedIn antes de ter código de IA público. IA fica em camada de estudo até virar prática.

## Constraints

- **Bilíngue obrigatório.** Toda copy, página, e campo de frontmatter entrega em pt e en.
- **Voice guide manda.** Sem em dashes, sem exclamações, sem clichés. Vale pro hero, pra newsletter, pra qualquer copy nova.
- **Backend o mais leve possível.** Newsletter via provider externo. Guestbook + reactions persistentes via Turso/Vercel KV ou similar. Sem provisionar Postgres só pra isso.
- **Performance não regride.** Lighthouse score atual é referência. Cada nova feature passa pelo CI Lighthouse e não baixa o score em mais de 2 pontos.
- **Acessibilidade mantida.** Contraste AAA no light, AA no dark. Focus rings. Navegação por teclado em qualquer página nova.
- **SSR-friendly.** Qualquer dado vivo (GitHub, Spotify) tem fallback estático, não quebra build.
- **Privacy-first em analytics.** Sem Google Analytics. Plausible ou Umami self-hosted. Sem cookies de tracking sem consentimento.
- **Custo mensal teto.** Newsletter + backend leve juntos não passam de USD 20/mês até atingir 500 assinantes ou métrica equivalente. Acima disso, reavaliar.
- **Honest framing em IA.** IA aparece no site só como **estudo declarado**, nunca como expertise ou serviço entregável, até existir produto/PR/artigo de IA shippado. Vale pro hero, about, `/work-with-me`, CV, OG metadata e newsletter.

## Acceptance Criteria

### Hero com voz e posicionamento atualizado

- Dado um visitante novo na home, quando lê o hero, então identifica em 1 frase qual é a tese profissional do Juliano (não "engenheiro front-end" genérico).
- Dado o hero atualizado, quando lido, então declara identidade full-stack (não front-end) e menciona IA apenas em camada de estudo, nunca como competência atual ou serviço.
- Dado um leitor em pt vs en, quando compara os heros, então as duas versões expressam a mesma tese mas não são tradução literal uma da outra.
- Dado o voice guide aplicado, quando revisado por outra pessoa, então passa o checklist (sem em dash, sem exclamação, sem "soluções incríveis", sem "create interactions").

### Tech Stack e About coerentes com posicionamento

- Dado a Tech Stack section da home, quando renderizada, então mostra logos agrupados em **Front**, **Back** e **Estudando**, com rótulo "Estudando" explícito (não enfileira tudo no mesmo nível).
- Dado a página `/about`, quando lida, então declara posicionamento full-stack atual no primeiro parágrafo e cita estudo de IA como direção, sem inflar como competência.
- Dado qualquer superfície do site (hero, about, /now, OG, CV link), quando comparadas lado a lado, então comunicam o mesmo eixo de posicionamento (full-stack hoje, IA como estudo).

### Profundidade em projetos

- Dado um visitante clica num projeto featured, quando a página abre, então tem hero, contexto (problema), decisões técnicas, resultado, e pelo menos 1 print ou GIF.
- Dado a página `/projects`, quando renderizada, então projetos featured aparecem como cards com prévia e descrição, e projetos não-featured ficam numa lista compacta abaixo.
- Dado o conteúdo de case study, quando lido, então responde "por que esse projeto" em até 2 parágrafos no topo (não enterra a resposta).

### Captura de audiência

- Dado o footer do site, quando renderizado, então tem opt-in de newsletter com 1 campo (email) e botão claro.
- Dado um visitante chega ao fim de um artigo, quando rola até o final, então vê 1 CTA discreto de newsletter (não popup intrusivo).
- Dado um visitante assina a newsletter, quando confirma o opt-in, então recebe email de boas-vindas dentro de 1 minuto explicando frequência e formato.
- Dado a página `/newsletter`, quando aberta, então mostra: o que é, quem escreve, frequência, exemplo de edição (ou link pra arquivo), e opt-in.

### Prova social viva

- Dado a home, quando renderizada, então mostra pelo menos 2 testimonials acima do "get in touch", com foto se permissão concedida.
- Dado o guestbook, quando aberto, então mostra mensagens reais de outros visitantes (mínimo 5 visíveis ao chegar) ordenadas por data.
- Dado um visitante deixa uma mensagem no guestbook, quando submete, então recebe feedback ("aguardando moderação" ou publicado imediato, conforme regra de moderação) e a mensagem persiste entre dispositivos.

### Hire-me / disponibilidade clara

- Dado a página `/work-with-me`, quando aberta, então diz em até 3 segundos de leitura: o Juliano está disponível? pra quê?
- Dado um visitante quer contratar, quando lê a página, então sabe o tempo médio de resposta declarado e qual canal usar (form, email, LinkedIn).
- Dado a página `/work-with-me`, quando aberta, então lista explicitamente o que **aceita** (front-end, full-stack) e o que **ainda não aceita** (projetos puros de IA), sem esconder a fase de estudo.

### Página /uses

- Dado a página `/uses`, quando aberta, então lista pelo menos 1 ferramenta de back-end e 1 ferramenta de IA usadas no dia a dia, além das ferramentas de front.
- Dado cada item listado em `/uses`, quando lido, então traz 1 frase de "por que esse" (não só nome + logo).

### Playground exposto sem quebrar minimalismo

- Dado a home, quando renderizada, então tem 1 referência sutil ao playground (link, comando, ou frase de easter egg) visível sem precisar de scroll exagerado.
- Dado o terminal, quando o visitante digita `tour`, então recebe sequência guiada explicando o site (wild idea, se entregue).

### Sinais vivos (Fase 3)

- Dado a home, quando renderizada, então mostra pelo menos 1 dado vivo (último artigo, último commit, ou status atual) com data ≤ 30 dias.
- Dado um dado vivo falha (API down), quando renderiza, então o card mostra fallback gracioso sem quebrar layout e sem mensagem de erro técnica visível.

### Analytics do playground

- Dado o playground recebe um comando, quando executado, então é registrado no backend de analytics privacy-first.
- Dado o Juliano abre o dashboard interno, quando consulta, então vê top 10 comandos executados nos últimos 30 dias e contagem de visitantes únicos no playground.

### Now page com cadência declarada

- Dado a página `/now`, quando aberta, então mostra data da última edição no topo com destaque tipográfico.
- Dado a página `/now`, quando aberta, então declara cadência ("atualizo no início de cada mês" ou similar) explícita.
- Dado a página `/now`, quando aberta, então lista 2-4 itens específicos sob "estudando IA" (ex: LLM apps, RAG, agents, evals), não bullet genérico "estudando IA".

### Performance e acessibilidade

- Dado qualquer página nova, quando medida pelo Lighthouse no CI, então score de performance ≥ 90 e accessibility ≥ 95.
- Dado qualquer rota com dado vivo, quando renderizada com API offline, então TTI não passa de 2.5s e nenhum elemento crítico do layout some.
