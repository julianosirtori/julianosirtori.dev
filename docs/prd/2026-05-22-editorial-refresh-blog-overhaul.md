# PRD: julianosirtori.dev — Editorial Refresh + Reading Overhaul

**Date:** 2026-05-22
**Status:** Draft

## Problem

A maior parte do tráfego hoje cai em artigos do blog, mas o site ainda foi pensado como portfólio de projetos. A tipografia não foi calibrada pra leitura longa, falta orientação dentro do post (sem TOC, sem next/previous, copy-code escondido no hover), e a paleta dracula é repetida em milhares de sites de dev. O `/playground` recém-lançado mostrou que dá pra ter personalidade, mas a casa toda continua sem identidade própria. Quem chega pelo Google a um artigo, lê, e vai embora sem saber que estava no site do Juliano.

## Background

22 artigos bilíngues (en/pt) publicados, com novos saindo. O blog virou a porta da frente, não o complemento. O `/playground` (terminal interativo) foi planejado como o momento de personalidade contrastante do site, mas a entrega dele foi adiada pra depois do rebrand. A ordem importa: o sistema de design novo precisa existir antes pra que o playground encaixe nele com tema próprio, em vez de ser um ponto fora da curva sem base.

A escolha é rebrand total. Logo "JS" sai. Tagline "I create interactions between users and technology!" sai. Paleta dracula sai. Em troca, o site ganha um sistema de design coerente que sustenta blog, projetos, playground e o que vier depois. Inspiração: Vercel, Linear, robinrendle.com.

## Roadmap em fases

1. **Fase 1 — Foundation (este PRD).** Tokens, paleta nova, tipografia, light/dark com toggle, brand mark, tagline, voice guide, command palette com `cmdk`. Migração dos componentes existentes pros novos tokens.
2. **Fase 2 — Blog reading overhaul (este PRD).** TOC, code blocks repensados, navegação fim de post, relacionados, prose calibrada, banner padronizado, componentes MDX expandidos.
3. **Fase 3 — Playground (PRD próprio, depois deste).** Terminal interativo em `/playground` redesenhado dentro do novo sistema (tema dark próprio), easter eggs no site (konami, console).

## Requirements

### Must Have — Identidade

- **Novo brand mark.** Substituir o lettermark "JS" por um wordmark ou monograma redesenhado. Critério: deve funcionar em 16px (favicon), 24px (header) e 96px (OG image) sem perder leitura.
- **Nova tagline.** Uma frase que diga "construtor curioso + escritor pragmático" sem cair em "I create interactions". Versão pt e en, com a mesma intenção, não tradução literal.
- **Voice guide enxuto** (1 página). Define: pronome, registro, o que evitar (frases de efeito, jargão corporativo, exclamações soltas), exemplos antes/depois em pt e en.
- **Paleta nova de zero.** Editorial clean: base neutra (off-white + charcoal/ink, ou warm-paper + warm-black), 1 cor de destaque, escala de cinzas com 9 stops, semântica para success/warn/error/info que se comporta nos dois modos.
- **Light + Dark com toggle.** Default: respeita prefer-color-scheme do sistema. Toggle no header, persiste em localStorage, sem flash no primeiro paint, transição suave entre temas (200ms, sem scroll jump).
- **Sistema tipográfico em camadas.** Pairing definido: tipografia editorial pra títulos e UI, fonte otimizada pra leitura no corpo, mono pra código. Escala modular consistente (8 níveis), line-height calibrado por tamanho.
- **Command palette com `cmdk`.** Substituir `kbar` pelo `cmdk` (mesmo pacote usado por Vercel, Linear, Raycast). Mesmo atalho (`⌘K`/`Ctrl+K`), mesmo conjunto de ações (email, source, navegação), visual repensado pra paleta editorial nova, sem dependência de Framer Motion no overlay (cmdk usa Radix Dialog internamente). Atalhos `g + letra` continuam.

### Must Have — Leitura do Blog

- **Coluna de leitura calibrada.** Largura máxima entre 65 e 75 caracteres, corpo em ≥ 18px, line-height ≥ 1.7, contraste WCAG AAA no modo claro e AA grande no escuro.
- **TOC flutuante automático.** Lateral em desktop com seção atual destacada, drawer colapsável em mobile, gerado a partir de h2/h3 com auto-slug (já existe rehype-slug).
- **Progresso visível.** Barra de progresso no topo refinada na nova paleta, e indicador "X de Y min" no header do post.
- **Navegação fim de post.** Botão "Anterior" e "Próximo" claramente nomeados (não setas soltas), com título do post de destino. Se não houver vizinho, oculta o lado.
- **Posts relacionados.** Até 3 cards por tag em comum no fim do artigo. Se nenhum relacionado, omite a seção (não mostra vazio).
- **Code blocks repensados.** Botão de cópia sempre visível (não hover-only), label de linguagem, suporte a filename opcional, realce de linhas opcional, overflow horizontal com scrollbar visível em vez de cortar. Cores adaptadas ao tema ativo.
- **Banner opcional por artigo.** Já existe `bannerCloudinaryId` no frontmatter, mas raramente renderizado com destaque. Padronizar: hero do artigo se houver banner, caso contrário apenas título.
- **Última atualização visível** quando o post foi tocado depois do publish (campo novo opcional `updated` no frontmatter).

### Should Have

- Featured article pinado na home do blog (latest ou marcação manual via frontmatter `featured: true`).
- Componentes MDX expandidos: `<Callout>`, `<Quote>`, `<Aside>`, `<Figure caption alt>`. Atalhos pra autor escrever melhor sem CSS inline.
- "On this page" também como label flutuante lateral em posts muito longos (>15min).
- Comments (Giscus) atrás de "Carregar comentários" pra economizar bundle no first paint, com contador se a API permitir.
- Tag cloud no `/blog` com peso visual por contagem de posts.
- Página `/styleguide` interna documentando tokens, componentes, exemplos. Útil pro autor (Juliano) e pra eventual contribuição.

### Out of Scope

- Newsletter / lista de e-mails (sem provider, sem plano editorial).
- Busca full-text dentro dos artigos (busca por título e categoria continua).
- Tradução automática de posts ausentes em uma das línguas.
- Mudança no provider de comments (Giscus fica).
- Implementação do `/playground` em si. Fica pra Fase 3 com PRD separado. O que entra aqui é apenas garantir que o sistema de tema do site não atropele a "ilha dark" do terminal quando ele existir.
- App mobile, PWA install prompt, modo offline.
- Migração de Contentlayer (continua).

## Constraints

- **Bilingue obrigatório.** Toda mudança de copy entrega em pt e en. Não publica meia-língua.
- **22 artigos legados.** Renderizam no novo prose sem reescrita. Frontmatter pode ganhar campos opcionais, mas não pode quebrar posts antigos.
- **Sem backend.** Estado de tema, reactions, snake high score, navegação de TOC vivem em localStorage. Comments via Giscus.
- **Vercel + Resend.** Sem mudança de infra.
- **Playground coexiste no futuro.** Quando o `/playground` for reconstruído na Fase 3, vai precisar de tema próprio dark independente do modo do site. O sistema de tema entregue agora precisa suportar "ilhas" com tema fixo via override por rota ou componente.
- **Performance não regride.** Bundle do post route hoje é 8.2 KB. Tolerância: até +5% (8.6 KB). LCP em 4G ≤ 2.5s. CLS ≤ 0.1.
- **Acessibilidade.** Contraste AAA no body claro, AA no escuro. Focus rings visíveis. Toggle de tema via teclado.

## Acceptance Criteria

### Identidade nova viva

- Dado um visitante novo, quando abre qualquer página, então vê o novo brand mark (não mais "JS" solto) e a nova tagline na home.
- Dado um visitante com sistema em light, quando o site carrega, então renderiza em light no primeiro paint (sem flash de dark).
- Dado um visitante clica no toggle de tema, quando troca, então a preferência persiste em refresh e navegação, e a transição entre modos não causa flicker ou scroll jump.
- Dado qualquer copy em pt ou en, quando lida lado a lado, então segue o voice guide novo (sem "create interactions", sem exclamações genéricas).

### Leitura confortável

- Dado um visitante abre um artigo em desktop, quando o post tem 2+ h2, então uma TOC lateral aparece com a seção atual marcada conforme o scroll.
- Dado um visitante em mobile, quando toca o botão de TOC, então um drawer abre com o mesmo outline e fecha ao escolher uma seção.
- Dado qualquer parágrafo de prose, quando inspecionado, então tem largura ≤ 75 caracteres, fonte ≥ 18px, line-height ≥ 1.7.
- Dado um code block, quando renderizado, então o botão de copiar está visível sempre, label de linguagem aparece, e overflow horizontal tem scrollbar (não corta).
- Dado um visitante chega ao fim do post, quando rola até o último parágrafo, então vê navegação Anterior/Próximo com títulos legíveis, e até 3 relacionados se existirem.
- Dado um post sem vizinho anterior ou sem relacionados, quando renderiza o fim do post, então o lado/seção vazia é omitida (não mostra "—" nem placeholder).

### Performance e acessibilidade

- Dado um post carregado em 4G, quando medido pelo Lighthouse, então LCP ≤ 2.5s, CLS ≤ 0.1, performance ≥ 90.
- Dado o bundle do route /blog/[slug] medido antes e depois, quando comparado, então não cresce mais que 5%.
- Dado um usuário navega só com teclado, quando passa pelo header e toggle de tema, então todos os elementos interativos têm focus ring visível e ordem lógica.
- Dado qualquer texto sobre cor de fundo, quando testado, então atinge contraste mínimo (AAA light, AA grande dark).

### Command palette com cmdk

- Dado um visitante em qualquer página, quando aperta `⌘K` ou `Ctrl+K`, então a paleta abre com input focado e lista de ações navegáveis por teclado.
- Dado um visitante digita parte do nome de uma ação, quando o filtro aplica, então só as ações que casam com o input aparecem (fuzzy match nativo do cmdk).
- Dado um visitante pressiona `Esc` ou clica fora, quando a paleta está aberta, então ela fecha sem mudar a rota.
- Dado um visitante seleciona uma ação de navegação, quando confirma, então é redirecionado pra rota correspondente e a paleta fecha.
- Dado um visitante usa um atalho `g + letra` (ex: `g b` pra blog), quando dispara, então pula a paleta e vai direto pra rota.
- Dado o site está em light ou dark, quando a paleta abre, então o visual respeita o tema ativo (sem incongruência cromática).

### Suporte futuro a ilhas de tema (validação adiada pra Fase 3)

- Dado o sistema de tema do site, quando um componente ou rota declarar `forceDark` ou equivalente, então renderiza em dark independente da preferência do usuário, sem persistir essa escolha como nova preferência global.
