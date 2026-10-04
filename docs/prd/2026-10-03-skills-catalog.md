# PRD: Catálogo de skills para agentes

**Date:** 2026-10-03
**Status:** Draft

## Problem

O Juliano começou a guardar e compartilhar as skills que escreve para agentes de código no repositório público [`julianosirtori/skills`](https://github.com/julianosirtori/skills) (MIT). O repositório funciona, tem CI e instala por `npx skills` ou pelo marketplace de plugins do Claude Code. Mas ele só é útil para quem já chegou nele e sabe ler um README de instalação.

Hoje o site não mostra nada disso. Quem lê na home que o Juliano "também cria produtos com IA" não encontra nenhuma prova pública desse trabalho. E quem recebe o link de uma skill cai numa árvore de pastas do GitHub, sem saber em dois segundos o que ela faz, em qual agente roda, se é segura e qual comando copiar.

O pedido, nas palavras dele: uma ou mais páginas navegáveis com a lista de skills, onde a pessoa abre uma skill e copia um link ou comando para adicionar no Claude Code, no OpenCode ou no Codex. A lista precisa ser dinâmica: skill nova no repositório aparece no site sem ninguém editar o site.

## Background

### O repositório de skills hoje

- Público, MIT, branch `main`, 1 commit (`180c1b5`, 2026-10-03). Descrição: "Agent Skills (SKILL.md) for Claude Code, OpenCode, Codex, Cursor and Gemini CLI."
- Estrutura: `skills/<nome>/SKILL.md`, com `scripts/` e `references/` opcionais. `.claude-plugin/marketplace.json` lista um plugin por skill. `scripts/validate.py` roda no CI a cada push em `main` e em PRs.
- Uma skill: `mac-cleanup` (SKILL.md com 8,5 KB, 3 scripts, 3 references).
- Frontmatter do SKILL.md segue a [especificação Agent Skills](https://agentskills.io/specification). Campos permitidos pelo `validate.py`: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. Regras: `name` igual ao nome da pasta, `[a-z0-9]` com hífens simples, até 64 caracteres; `description` até 1024 caracteres; `compatibility` até 500; toda skill precisa estar em algum plugin do `marketplace.json`. Pastas que começam com `.` são ignoradas.
- O `description` do SKILL.md é escrito para o agente decidir quando acionar a skill ("Use this whenever the user says..."). É longo e bom para o agente, ruim como resumo de card. O `marketplace.json` tem uma `description` mais curta e humana, além de `version`, `keywords`, `category` e `homepage`.
- Conteúdo das skills é em inglês.

### Comandos de instalação confirmados

Conferidos no README do repositório de skills e, onde indicado, no README oficial do CLI [`vercel-labs/skills`](https://github.com/vercel-labs/skills). Nenhuma sintaxe abaixo foi inventada.

| Método | Comando | Fonte |
|---|---|---|
| Qualquer agente | `npx skills add julianosirtori/skills --skill <name> -g` | README do repo de skills |
| Agente específico | `npx skills add julianosirtori/skills --skill <name> -g -a <agent-id>` | README do CLI: opção `-a, --agent`, ids `claude-code`, `opencode`, `codex`, `cursor`, `gemini-cli`, `github-copilot` |
| Por URL da pasta | `npx skills add https://github.com/julianosirtori/skills/tree/main/skills/<name>` | README do CLI: "Direct path to a skill in a repo" |
| Claude Code, plugin | `/plugin marketplace add julianosirtori/skills` e depois `/plugin install <plugin>@julianosirtori-skills` | README do repo. O sufixo é o `name` do `marketplace.json` |
| Manual | `git clone https://github.com/julianosirtori/skills.git ~/Developer/skills` e `ln -s ~/Developer/skills/skills/<name> ~/.claude/skills/<name>` | README do repo |
| Testar sem instalar | `npx skills use julianosirtori/skills@<name> \| claude` | README do CLI |
| Atualizar e remover | `npx skills update <name>`, `npx skills remove <name>` | README do CLI |
| Codex, instalador nativo | `$skill-installer install https://github.com/julianosirtori/skills/tree/main/skills/<name>` | README do `openai/skills`, que hoje está marcado como deprecated. Precisa de validação antes de usar |

Pastas de usuário por agente, segundo o README do repo de skills: Claude Code `~/.claude/skills/`, OpenCode `~/.config/opencode/skills/`, Codex `~/.agents/skills/`, Cursor `~/.cursor/skills/`, Gemini CLI `~/.gemini/skills/`, GitHub Copilot `~/.copilot/skills/`.

**Divergência encontrada:** para o Codex, o README do repo de skills diz `~/.agents/skills/`, a tabela do CLI `vercel-labs/skills` diz `~/.codex/skills/`, e o `$skill-installer` do Codex instala em `$CODEX_HOME/skills` (padrão `~/.codex/skills`). Ver perguntas em aberto.

### O site hoje

- Next.js 16, App Router, bilíngue com `localePrefix: "always"` e caminhos iguais nas duas línguas (`/pt/projects`, não `/pt/projetos`).
- Header com 4 links (about, projects, blog, work with me) mais o atalho `>_ playground`. No mobile a nav já quebra para uma linha própria.
- Footer com nav "Comunidade" (Newsletter, Guestbook) e ícones sociais.
- Command palette (`cmdk`) com ações fixas em `CommandBarDialog.tsx`.
- `sitemap.ts` lista páginas estáticas e posts. `robots.ts` bloqueia `/api/`.
- Já existe padrão de webhook com segredo (`/api/webhooks/resend`) e `.env.example` documentando cada variável.
- Analytics próprio em `src/lib/analytics.ts` com lista fechada de eventos e parâmetros permitidos.
- OG por rota usando `OgCard` (`src/app/og-card.tsx`), que já tem cor de destaque para a categoria "AI"/"IA".
- **Colisão de nome:** no playground, o comando `skills` (alias `stack`) mostra a stack de tecnologias, e o FS virtual tem `/skills/stack.txt`. No site, "skills" hoje quer dizer habilidades técnicas. A feature nova usa a palavra no sentido de skills para agentes.

## Conexão com o posicionamento

O PRD de discovery (2026-05-26) definiu: full-stack hoje, IA como direção de estudo, e IA só aparece como competência quando houver entrega pública. Desde então o site já avançou o discurso. A bio da home diz "hoje também crio produtos com IA", o `/work-with-me` lista "Produtos e soluções com IA" e o `/about` cita LLMs, RAG e agentes.

O catálogo é a primeira entrega de IA pública e verificável no site: código aberto, licença MIT, validado em CI, instalável em um comando. Ele dá lastro ao que a home já afirma. Regras de enquadramento:

- O catálogo mostra trabalho, não título. Nada de "AI engineer", "especialista em agentes" ou contagem inflada na página.
- A copy descreve o que cada skill faz e por que o Juliano escreveu, em primeira pessoa e com verbos concretos.
- `/about` e `/work-with-me` passam a apontar para o catálogo como evidência, no ponto onde já falam de IA.

## Users and Goals

**Visitante dev que usa agentes de código** (Claude Code, OpenCode, Codex, Cursor, Gemini CLI, Copilot). Chega por um link compartilhado, pelo GitHub ou navegando no site. Quer entender rápido o que a skill faz, se roda no ambiente dele e copiar o comando certo para o agente que usa.

**Recrutador, cliente ou colega avaliando o Juliano.** Não vai instalar nada. Quer ver que existe trabalho com agentes publicado, com cuidado de engenharia (CI, licença, documentação, segurança).

**O próprio Juliano.** Quer publicar uma skill nova só fazendo push no repo de skills. Zero edição no site, zero deploy.

### Sucesso

- **Instalação:** pelo menos 25% das visitas a uma página de skill geram ao menos um `skill_install_copy` nos primeiros 60 dias. Linha de base desconhecida, revisar após 60 dias.
- **Tráfego para o repo:** `julianosirtori.dev` aparece entre os referrers do repo `julianosirtori/skills` no GitHub Insights dentro de 60 dias.
- **Dinâmico de verdade:** 100% das skills válidas em `main` aparecem no site em até 60 minutos sem webhook e em até 2 minutos com webhook. Nenhuma edição no repositório do site para publicar uma skill.
- **Robustez:** nenhum build ou deploy falha por causa do GitHub fora do ar ou do repo vazio.
- **Vitrine:** `/about` e `/work-with-me` linkam o catálogo.

## Information Architecture

Legenda usada daqui em diante: **[Produto]** é decisão fechada. **[Design]** fica em aberto para UX/UI. **[Dev]** é restrição técnica com espaço para o dev escolher a implementação.

### Rotas [Produto]

- `/[lang]/skills`: lista.
- `/[lang]/skills/[slug]`: detalhe. O `slug` é o nome da pasta, que o `validate.py` garante ser igual ao `name` do frontmatter.
- Caminhos iguais em EN e PT (`/en/skills`, `/pt/skills`), como o resto do site.
- Uma skill nova abre em `/[lang]/skills/<slug>` sem deploy. Uma skill removida do repo passa a responder 404 depois da revalidação.

### Header [Produto]

**Não entra no header na v1.** Com uma skill só, um link de primeiro nível leva a uma página rala, e o header mobile já está no limite com 5 itens. O público principal do catálogo chega por link direto (GitHub, post, rede social), não navegando pelo header.

Critério de promoção: quando o catálogo tiver **3 ou mais skills publicadas**, o link entra no header. A posição e se algum item atual sai ou muda de formato fica com **[Design]**. Essa promoção é uma mudança pequena e separada, não faz parte desta entrega.

### Pontos de entrada da v1 [Produto]

| Superfície | Prioridade | O que entra |
|---|---|---|
| Command palette | Must | Ação "Agent skills" / "Skills para agentes" na seção de navegação, com keywords `skills agent agents claude opencode codex cursor gemini copilot ai ia` |
| Footer | Must | Link "Skills" na nav do footer, ao lado de Newsletter e Guestbook |
| Sitemap | Must | `/[lang]/skills` e cada `/[lang]/skills/<slug>` nas duas línguas |
| `/about` | Must | Link para o catálogo no bloco que fala de IA |
| `/work-with-me` | Must | Link para o catálogo junto do item "Produtos e soluções com IA" |
| Home | Should | Uma chamada discreta para o catálogo. Não vira seção nova no `HomeRail` na v1. Posição: **[Design]** |
| Playground | Could | Uma linha de dica no fim da saída do comando `skills` apontando para `/skills` do site. O comando continua mostrando a stack. Ver colisão de nome abaixo |
| Command palette, por skill | Could | Cada skill como item próprio, levando direto ao detalhe |

**Colisão de nome no playground [Produto]:** na v1 o comando `skills` e o diretório `/skills` do terminal continuam significando stack de tecnologias. Renomear quebraria hábito e testes por pouco ganho. Se um dia o terminal ganhar comandos de skills de agente, esse PRD recomenda que `stack` vire o nome principal e `skills` mude de significado numa mudança própria.

### Ações fora deste repositório (recomendadas ao Juliano)

- Preencher o campo `homepage` do repo `julianosirtori/skills` com `https://julianosirtori.dev/en/skills` e linkar o site no README.
- Configurar o webhook do GitHub (ver Fonte de dados).

## Data Source and Freshness

### Descoberta [Produto]

- A fonte de verdade é a branch padrão (`main`) do repo `julianosirtori/skills`.
- Uma skill existe no site quando existe `skills/<pasta>/SKILL.md`. Nada de lista manual no site.
- Pastas começando com `.` são ignoradas, igual ao `validate.py`.
- A skill só é listada se o frontmatter for válido pelas mesmas regras do `validate.py`: tem `name` e `description`, e `name` é igual à pasta. Skill inválida fica fora da lista e gera um aviso no log do servidor. Motivo: o site nunca deve mostrar um comando de instalação que vai falhar.
- O `marketplace.json` é enriquecimento opcional. Ele fornece resumo curto, categoria, keywords, versão de fallback, nome do plugin e nome do marketplace para o comando do Claude Code. Se ele faltar, estiver inválido ou não listar a skill, a skill aparece mesmo assim, só sem a opção de plugin do Claude Code e sem categoria.
- O nome do plugin vem do plugin cujo array `skills` contém `./skills/<pasta>`. Não assumir que plugin e skill têm o mesmo nome. Hoje têm, mas um plugin pode agrupar várias skills no futuro.

### Atualização [Produto]

- **Sem gatilho:** os dados do catálogo são revalidados por tempo. Janela máxima aceitável: **60 minutos**.
- **Com gatilho (Must):** webhook nativo do GitHub no repo de skills, evento `push`, apontando para um endpoint do site. O endpoint verifica a assinatura `X-Hub-Signature-256` (HMAC SHA-256) com um segredo em variável de ambiente, ignora pushes fora de `main`, responde ao evento `ping` e invalida o cache do catálogo. Assinatura ausente ou inválida responde 401 e não invalida nada. Meta: skill nova visível em até 2 minutos após o push.
- Escolhemos webhook do GitHub em vez de GitHub Action no repo de skills porque não exige workflow nem segredo no repo público, e segue o padrão que o site já usa com `/api/webhooks/resend`.
- O endpoint fica sob `/api/`, que o `robots.ts` já bloqueia.

### Restrições técnicas [Dev]

- O navegador do visitante nunca chama o GitHub. Tudo é resolvido no servidor e servido do cache. Isso protege rate limit, performance e privacidade.
- **Token:** produção usa um token read-only via variável de ambiente (sugestão de nome `SKILLS_GITHUB_TOKEN`; um fine-grained PAT sem permissões extras basta para repo público). Sem token, o site precisa funcionar em dev local com o limite de 60 req/h por IP, abrindo mão só do que custa chamadas extras (ex.: data de atualização).
- **Orçamento de chamadas:** uma revalidação completa não pode crescer mais que linearmente com o número de skills, e com 30 skills precisa caber com folga no limite sem token se as datas forem omitidas. Dica: a REST API só precisa resolver o commit de `main` e a árvore; arquivos podem vir de `raw.githubusercontent.com` pelo SHA do commit, que não conta no rate limit da API.
- **Ler pelo SHA, não pelo nome da branch.** O `raw.githubusercontent.com` por branch tem cache de CDN de alguns minutos. Logo depois do webhook isso traria o conteúdo velho e quebraria a meta de 2 minutos.
- **Data de atualização** (último commit que tocou `skills/<pasta>/`) custa uma chamada por skill na REST API, ou uma consulta GraphQL com token. Mostrar quando houver token, omitir sem token.
- **Slug desconhecido não chama o GitHub.** O detalhe resolve a partir do índice em cache. URL inventada responde 404 sem consumir rate limit. Slug fora do padrão `^[a-z0-9]+(-[a-z0-9]+)*$` responde 404 direto.
- **404 não pode ficar preso.** Se `/skills/foo` respondeu 404 antes de `foo` existir, a página precisa abrir depois que o índice revalidar.
- **Falha não entra em cache.** Se o GitHub falhar na revalidação, continua servindo a última versão boa. Se não existir versão boa (cold start com GitHub fora), a lista mostra estado de erro e o detalhe mostra erro com link para a pasta no GitHub, nunca 404.
- **Build não depende do GitHub.** Build e deploy passam com o GitHub fora do ar ou o repo vazio.
- O projeto não usa `cacheComponents`. Antes de escolher entre `fetch` com `revalidate`/tags e `use cache`, ler `node_modules/next/dist/docs/01-app/01-getting-started/09-revalidating.md` e o guia do modelo anterior. Em Next 16, `revalidateTag` recebe um segundo argumento de perfil.
- **Modo fixture para testes:** unit e e2e não chamam o GitHub. Precisa existir uma forma de alimentar o catálogo com dados fixos (0 skill, 1 skill, 10+ skills, frontmatter inválido, GitHub fora do ar) para o QA e o CI.
- Novas variáveis documentadas no `.env.example`.

### Comportamento por situação [Produto]

| Situação | Lista | Detalhe | Sitemap |
|---|---|---|---|
| GitHub ok, N skills | Lista as N | Abre | Index + N por língua |
| Repo sem skills válidas | Estado vazio com link para o repo | 404 | Só o index |
| GitHub fora, com cache | Última versão boa | Última versão boa | Última versão boa |
| GitHub fora, sem cache | Estado de erro com link para o repo, HTTP 200 | Estado de erro com link para a pasta no GitHub, sem 404 | Só o index, sem falhar |
| `marketplace.json` ausente ou inválido | Lista sem categoria, resumo cai para a primeira frase do `description` | Sem opção de plugin do Claude Code | Normal |
| Skill com frontmatter inválido | Fora da lista, aviso no log | 404 | Fora |

## Requirements

### Must Have: Lista (`/[lang]/skills`)

- Cabeçalho da página com título, lede e link para o repositório no GitHub. Copy na seção Copy.
- Contagem de skills com plural correto nas duas línguas.
- Um card ou linha por skill com:
  - **Nome** (o slug, em fonte mono).
  - **Resumo:** `description` do plugin no `marketplace.json`; se não houver, a primeira frase do `description` do SKILL.md, cortada em cerca de 160 caracteres sem quebrar palavra.
  - **Versão:** `metadata.version` do SKILL.md; fallback para a `version` do plugin. Se nenhuma existir, omite.
  - **Categoria** do `marketplace.json`, quando houver.
  - **Compatibilidade curta:** primeira frase do campo `compatibility`, só se tiver até 60 caracteres. Para a `mac-cleanup`, "macOS 13 or later." Caso contrário, omite no card e mostra completa no detalhe.
  - **Data de atualização**, quando disponível.
  - Link para o detalhe.
- Ordenação: atualizada mais recentemente primeiro. Sem datas, ordem alfabética.
- O comando padrão de instalação (`npx` para qualquer agente) precisa ser copiável em no máximo 2 interações a partir da lista. Se o atalho de cópia fica no card ou só no detalhe: **[Design]**.

**Comportamento por volume [Produto]:**

- **0 skills:** estado vazio, nunca lista vazia sem explicação.
- **1 a 7 skills:** lista simples. Sem busca, sem filtro, sem ordenação configurável. Com 1 skill a página não pode parecer quebrada nem esticar um card sozinho de forma estranha (**[Design]**).
- **8 ou mais skills:** aparece um filtro de texto no cliente que busca em nome, resumo e keywords, com estado "nenhum resultado". Se houver 2 ou mais categorias, aparecem filtros por categoria.
- **30 skills:** mesma coisa, sem paginação. 30 itens cabem numa página.
- O limiar de 8 fica numa constante única para o QA conseguir testar com fixture.

### Must Have: Detalhe (`/[lang]/skills/[slug]`)

- **Cabeçalho:** nome, resumo, versão, licença, data de atualização, categoria e keywords quando houver, e link "Ver no GitHub" para a pasta da skill.
- **Instalação** acima da dobra no desktop, logo depois do cabeçalho. É o coração da página. Detalhes na seção Instalação.
- **Quando o agente usa:** o `description` completo do SKILL.md, apresentado como "quando a skill entra em ação". É o texto que o agente lê para decidir acionar a skill, então mostra ao visitante as frases que disparam o uso.
- **Compatibilidade** completa, quando existir.
- **`allowed-tools`**, quando existir no frontmatter, listado como ferramentas que a skill pede pré-aprovadas. É um sinal de confiança.
- **Aviso de scripts:** se a pasta tiver `scripts/`, um aviso curto dizendo que a skill traz scripts que rodam na máquina da pessoa, com link para eles. Peso visual: **[Design]**.
- **Arquivos:** lista dos arquivos da pasta (`SKILL.md`, `scripts/*`, `references/*`, outros), cada um linkando para o arquivo no GitHub. Os arquivos de `references/` e `scripts/` não são renderizados no site na v1.
- **Corpo do SKILL.md renderizado**, sem o frontmatter:
  - Markdown com GFM (tabelas, listas, code blocks com destaque de sintaxe).
  - **Nunca MDX nem nada executável.** HTML bruto é sanitizado. Conteúdo vem de um repo público que pode receber PR.
  - Links relativos (`references/locations.md`, `scripts/scan.sh`) apontam para o arquivo no GitHub. Imagens relativas carregam do GitHub pelo SHA.
  - Headings com âncora.
  - O bloco inteiro de conteúdo da skill leva `lang="en"`.
- **Skill em inglês nas páginas PT [Produto]:** a interface do site é traduzida; o conteúdo da skill não. Sem tradução automática, coerente com os PRDs anteriores. A página PT mostra uma nota curta avisando que a skill é escrita em inglês, como no repositório. Resumo, `description` e corpo aparecem em inglês, marcados com `lang="en"`.
- Skill que não existe: página 404 padrão do site (`NotFoundPage`).

### Must Have: Instalação

**Agentes em destaque [Produto]:** Claude Code, OpenCode e Codex, que o Juliano citou e que estão na descrição do repo. Cursor, Gemini CLI e GitHub Copilot entram agrupados como "outros agentes". Custam pouco, já que só muda o id do `-a` e a pasta manual, e estão no README do repo.

**Padrão [Produto]:** o comando que aparece primeiro e pré-selecionado é o universal:

```bash
npx skills add julianosirtori/skills --skill <name> -g
```

Ele cobre qualquer agente, detecta os instalados e é o primeiro método do README. Vale também para quem usa Claude Code: instala em `~/.claude/skills/` e a skill é chamada como `/<name>`, sem o prefixo de plugin.

**Por agente [Produto]:**

| Agente | O que a pessoa copia | Observação na interface |
|---|---|---|
| Qualquer agente | `npx skills add julianosirtori/skills --skill <name> -g` | O CLI encontra os agentes instalados. `-g` instala para o usuário, em todos os projetos |
| Claude Code | `npx skills add julianosirtori/skills --skill <name> -g -a claude-code` | Alternativa: plugin (abaixo) |
| Claude Code, plugin | `/plugin marketplace add julianosirtori/skills` e `/plugin install <plugin>@<marketplace>` | Dois comandos, digitados dentro do Claude Code, não no terminal. Skill de plugin é chamada como `/<plugin>:<name>`, ou só descrevendo o problema. Só aparece se a skill estiver no `marketplace.json` |
| OpenCode | `npx skills add julianosirtori/skills --skill <name> -g -a opencode` | |
| Codex | `npx skills add julianosirtori/skills --skill <name> -g -a codex` | Se a skill não aparecer, reiniciar o agente |
| Cursor | `npx skills add julianosirtori/skills --skill <name> -g -a cursor` | Em "outros agentes" |
| Gemini CLI | `npx skills add julianosirtori/skills --skill <name> -g -a gemini-cli` | Em "outros agentes" |
| GitHub Copilot | `npx skills add julianosirtori/skills --skill <name> -g -a github-copilot` | Em "outros agentes" |

**Manual [Produto]:** um bloco recolhível com os dois comandos do README (`git clone` e `ln -s`) e a tabela de pastas por agente (usuário e projeto), copiada do README do repo de skills. A pasta de destino do `ln -s` muda conforme o agente selecionado. A tabela de pastas vive como constante no site, não é extraída do README em tempo de execução, porque parsear tabela de markdown é frágil. Quando o README mudar, a constante muda junto.

**Link da skill [Produto]:** botão "Copiar link do GitHub" que copia `https://github.com/julianosirtori/skills/tree/main/skills/<name>`. É o "link para adicionar no agente" do pedido: funciona com `npx skills add <url>`, serve para colar num agente e para compartilhar.

**Prompt para o agente [Produto]:** um texto pronto para colar em qualquer agente com acesso ao terminal, pedindo para ele instalar a skill a partir da URL. Atende quem não quer pensar em comando. A versão PT é reescrita, não traduzida. Texto na seção Copy.

**Regras do bloco de instalação [Produto]:**

- Todos os comandos são gerados a partir dos dados (nome da skill, nome do plugin, nome do marketplace). Nenhum comando é escrito à mão por skill.
- Cada comando aparece como texto selecionável, sem truncar, com rolagem horizontal quando não couber. Copiar funciona mesmo se a Clipboard API falhar, porque a pessoa consegue selecionar o texto.
- Botão de copiar sempre visível (não só no hover), acessível por teclado, com rótulo traduzido e confirmação "Copiado" anunciada para leitor de tela via `aria-live`. O `CopyCodeButton` atual tem rótulos fixos em inglês e precisa ser adaptado ou substituído.
- O texto copiado é exatamente o comando exibido, sem prompt `$`, sem espaço extra e sem quebra de linha no fim. No caso de dois comandos (plugin, manual), cada um tem seu botão, ou o bloco copia os dois separados por quebra de linha (**[Design]**).
- Como apresentar a escolha de agente (abas, select, lista) e onde fica o prompt: **[Design]**.

### Must Have: SEO e compartilhamento

- `generateMetadata` nas duas rotas:
  - Lista: título "Agent skills | Juliano Sirtori" / "Skills para agentes | Juliano Sirtori", descrição da seção Copy.
  - Detalhe: título "`<name>` · Agent skill | Juliano Sirtori" nas duas línguas, descrição igual ao resumo do card.
- `alternates.canonical` apontando para a própria URL na língua atual e `alternates.languages` com `en` e `pt`, no padrão do `/guestbook` e do `/newsletter`.
- `openGraph` com `title`, `description` e `url`.
- OG image por rota (`opengraph-image.tsx` na lista e no detalhe), usando o `OgCard` com a categoria "AI"/"IA" para herdar a cor de destaque dos posts de IA. Detalhe: título é o nome da skill; linha de meta com "Agent skill" e versão. Se o GitHub falhar, cai para um card genérico do catálogo, nunca 500.
- Sitemap: lista e cada detalhe nas duas línguas, `lastModified` igual à data de atualização da skill quando houver.
- Should: JSON-LD `SoftwareSourceCode` no detalhe, com `codeRepository`, `license` e `programmingLanguage` quando fizer sentido.

### Must Have: Analytics

Adicionar à lista fechada de `src/lib/analytics.ts`:

- `skill_install_copy`: `content_id` = slug, `action_id` = método (`npx`, `npx-claude-code`, `npx-opencode`, `npx-codex`, `npx-cursor`, `npx-gemini-cli`, `npx-github-copilot`, `claude-plugin`, `manual`, `prompt`, `link`), `location` = `skills`.
- `skill_source_click`: clique em "Ver no GitHub" ou em um arquivo, `content_id` = slug.
- Novo valor `skills` em `location`.
- Se o filtro de busca existir, enviar só `result_count`, nunca o texto digitado, seguindo a regra do módulo.
- Visualizações de página saem do `page_view` existente.

### Should Have

- Chamada discreta na home (ver Information Architecture).
- Lembrar o último agente escolhido pelo visitante entre páginas e visitas, usando `createStorage("skills")` de `src/utils/storage.ts`.
- Sumário (TOC) no detalhe quando o SKILL.md tiver 4 ou mais headings h2, reaproveitando o `TableOfContents` se fizer sentido (**[Design]**).
- Contagem de arquivos no card (ex.: "3 scripts · 3 references") como sinal de tamanho da skill (**[Design]** decide se cabe).
- JSON-LD no detalhe.

### Could Have

- Item por skill no command palette.
- Dica no comando `skills` do playground.
- "Testar sem instalar" com `npx skills use julianosirtori/skills@<name> | claude`. O dev valida a sintaxe na versão atual do CLI antes de publicar.
- Codex: `$skill-installer install <url>` como alternativa. Só entra se o dev confirmar que o `$skill-installer` ainda vem no Codex atual, já que o repo `openai/skills` foi marcado como deprecated.
- Bloco "Atualizar e remover" com `npx skills update <name>` e `npx skills remove <name>`.
- Link "Reportar problema" abrindo issue no repo de skills com o nome da skill no título.
- Resumo em português opcional via chave em `metadata` do SKILL.md (ex.: `metadata.summary-pt`), usado nas páginas PT quando existir. Depende de decisão do Juliano, já que mexe na convenção do repo de skills.

### Out of Scope

- Contagem de instalações, downloads, estrelas, forks ou ranking. O `skills.sh` da Vercel já mostra instalações feitas pelo CLI; o Juliano acompanha por lá.
- Comentários, reações ou avaliações por skill.
- Tradução do conteúdo das skills.
- Renderizar `references/` e `scripts/` dentro do site.
- Skills de outros autores ou de outros repositórios.
- Versões antigas, changelog ou seleção de tag/branch.
- Redirect quando uma skill for renomeada. O slug antigo vira 404.
- Editar, criar ou validar skills pelo site. O `validate.py` continua sendo o portão de qualidade.
- Escopo de projeto (sem `-g`) nos comandos copiáveis. Fica só na tabela manual.
- Promoção do link para o header (mudança separada, com o gatilho de 3 skills).
- Mudanças no repositório de skills, exceto as recomendações listadas.

## Copy

Rascunho dos textos principais. Voice guide aplicado: sem travessão, sem exclamação, sem clichê, primeira pessoa, PT reescrito. Microcopy restante segue o mesmo tom. Toda copy nova vai em `src/locales/{en,pt}/skills.json` (namespace novo), com as entradas de header, footer e palette em `global.json`.

| Onde | EN | PT |
|---|---|---|
| Nome da seção (palette, títulos) | Agent skills | Skills para agentes |
| Nome curto (footer, header futuro) | skills | skills |
| Kicker da lista | Open source · MIT | Código aberto · MIT |
| H1 da lista | Agent skills | Skills para agentes |
| Lede da lista | Skills I wrote for my own work with coding agents. Each one is a folder with a SKILL.md, so it runs in Claude Code, OpenCode, Codex and any other agent that reads the format. Pick one and copy the install command. | Escrevi estas skills para o meu dia a dia com agentes de código. Cada uma é uma pasta com um SKILL.md, então funciona no Claude Code, no OpenCode, no Codex e em qualquer agente que leia esse formato. Escolhe uma e copia o comando de instalação. |
| Link para o repo | Browse the repository | Ver o repositório |
| Contagem | {count, plural, one {# skill} other {# skills}} | {count, plural, one {# skill} other {# skills}} |
| Meta description da lista | Open source agent skills by Juliano Sirtori for Claude Code, OpenCode, Codex and other agents. Copy the command and install. | Skills de código aberto do Juliano Sirtori para Claude Code, OpenCode, Codex e outros agentes. Copie o comando e instale. |
| Estado vazio | No skills published yet. The repository is public, so you can follow it on GitHub. | Ainda não tem skill publicada por aqui. O repositório é público, dá pra acompanhar pelo GitHub. |
| Erro (GitHub fora) | Couldn't reach GitHub right now. The skills are still in the repository. | O GitHub não respondeu agora. As skills continuam no repositório. |
| Botão do erro | Open the repository | Abrir o repositório |
| Filtro (8+) | Filter by name or keyword | Filtrar por nome ou palavra-chave |
| Sem resultado | No skill matches "{query}". | Nenhuma skill bate com "{query}". |
| Atualizada | Updated {date} | Atualizada em {date} |
| Título da instalação | Install | Instalar |
| Opção padrão | Any agent | Qualquer agente |
| Dica do padrão | The skills CLI finds the agents on your machine and links the skill into each one. -g installs it for your user, across all projects. | O CLI skills encontra os agentes da sua máquina e coloca a skill na pasta de cada um. O -g instala para o seu usuário, em todos os projetos. |
| Outros agentes | Other agents | Outros agentes |
| Dica do plugin Claude Code | Run these inside Claude Code. Plugin skills are namespaced, so call it as /{plugin}:{name}, or describe the problem and Claude picks it up. | Esses comandos rodam dentro do Claude Code. Skill de plugin ganha prefixo: chame com /{plugin}:{name}, ou só descreva o problema que o Claude encontra a skill. |
| Dica de reinício | Restart the agent if the skill doesn't show up. | Se a skill não aparecer, reinicia o agente. |
| Manual, título | Install by hand | Instalar na mão |
| Manual, texto | Clone the repository and link the skill folder into your agent's skills directory. | Clona o repositório e cria um link da pasta da skill no diretório de skills do seu agente. |
| Link GitHub | Copy GitHub link | Copiar link do GitHub |
| Prompt, título | Or ask your agent | Ou pede pro seu agente |
| Prompt, dica | Paste this into Claude Code, OpenCode, Codex or any agent with terminal access. | Cola isso no Claude Code, no OpenCode, no Codex ou em outro agente com acesso ao terminal. |
| Prompt, texto | Install the agent skill at {url} for my user. If Node.js is available, run `npx skills add julianosirtori/skills --skill {name} -g`. If not, copy that folder into the user-level skills directory you read from. Then tell me where it was installed and how to call it. | Instala pra mim a skill que está em {url}, no nível do usuário. Se tiver Node.js, roda `npx skills add julianosirtori/skills --skill {name} -g`. Se não tiver, copia essa pasta para o diretório de skills do usuário que você lê. No fim, me diz onde ela ficou e como chamar. |
| Copiar / copiado | Copy / Copied | Copiar / Copiado |
| Quando o agente usa | When the agent uses it | Quando o agente usa |
| Compatibilidade | Requirements | Requisitos |
| Ferramentas pré-aprovadas | Pre-approved tools | Ferramentas pré-aprovadas |
| Aviso de scripts | This skill ships scripts that run on your machine. Read them before installing. | Esta skill traz scripts que rodam na sua máquina. Dá uma lida neles antes de instalar. |
| Arquivos | Files | Arquivos |
| Ver no GitHub | View on GitHub | Ver no GitHub |
| Nota de idioma (só PT) | (não aparece) | A skill é escrita em inglês, igual no repositório. |
| Chamada na home (Should) | I keep the agent skills I use open on GitHub. | As skills que uso com agentes de código ficam abertas no GitHub. |
| Link da chamada | See the skills | Ver as skills |
| Link em `/about` e `/work-with-me` | Some of this work is public: agent skills I wrote and use. | Parte disso é pública: skills para agentes que escrevi e uso. |
| Dica no playground (Could) | agent skills live at /skills on the site. | skills para agentes ficam em /skills no site. |

## Constraints

- **Bilíngue obrigatório.** Toda copy de interface sai em EN e PT, reescrita, não traduzida.
- **Voice guide vale para a interface**, não para o conteúdo das skills. O SKILL.md é renderizado como está no repo, mesmo que use travessão.
- **Design system do site.** Tokens semânticos (`bg-bg`, `text-fg`, `border-border`, `text-accent`...), Geist Sans e Mono, light e dark. Nada de paleta nova. Os blocos de comando seguem os code blocks do blog.
- **Server components por padrão.** Cliente só onde há interação: cópia, escolha de agente, filtro.
- **Performance.** Lista e detalhe servidos do cache, sem fetch no cliente. Lighthouse do CI com performance de pelo menos 90 e acessibilidade de pelo menos 95 nas duas rotas.
- **Acessibilidade.** Navegação completa por teclado, focus ring visível, contraste AAA no light e AA no dark, confirmação de cópia anunciada.
- **Segurança.** Markdown sanitizado, sem execução de conteúdo remoto. Endpoint de revalidação só aceita assinatura válida. Token e segredo nunca com prefixo `NEXT_PUBLIC_`.
- **Custo zero de infra nova.** Sem banco, sem serviço novo. GitHub API e o cache do Next bastam.
- **Testes sem rede.** Unit e e2e rodam com fixture.

## Risks

- **Rate limit sem token em produção.** Na Vercel o IP de saída é compartilhado, então 60 req/h sem token pode acabar por causa de outros. Mitigação: token obrigatório em produção, documentado no `.env.example`.
- **Comando errado na tela.** Um comando que falha queima a confiança no catálogo inteiro. Mitigação: comandos gerados dos dados, skill inválida fora da lista, critérios de aceite com o texto exato.
- **Pastas do Codex divergentes** entre fontes. Mitigação: a interface padrão usa `npx`, que resolve a pasta sozinho. A pasta manual do Codex precisa ser confirmada antes do lançamento.
- **CLI de terceiros muda.** O `skills` da Vercel pode mudar flags. Mitigação: só usamos as flags documentadas no README atual (`--skill`, `-g`, `-a`). Revisar quando o README do repo de skills mudar.
- **Conteúdo malicioso via PR** no repo de skills. Mitigação: sanitização e aviso de scripts. O Juliano revisa PRs antes do merge.
- **Página rala com 1 skill.** Mitigação: header só com 3 skills, entrada discreta na home, design pensado para 1 item.
- **Descrição em inglês e longa no PT.** Mitigação: nota de idioma e `lang="en"`. Resumo PT fica como Could.
- **CDN do raw servindo conteúdo velho** depois do webhook. Mitigação: ler arquivos pelo SHA do commit.

## Open Questions

### Para o Juliano

1. Header desde o primeiro dia ou só a partir de 3 skills? Este PRD recomenda 3.
2. Vale criar uma convenção de resumo em PT no `metadata` do SKILL.md? Mexe no repo de skills.
3. Qual é a pasta certa do Codex? Se for `~/.codex/skills/`, o README do repo de skills precisa de correção.
4. Quem cria e renova o token do GitHub e o segredo do webhook?
5. Vai ter um post de lançamento no blog apresentando o catálogo e a `mac-cleanup`? Ajudaria a dar tráfego inicial.

### Para UX/UI

1. Layout do bloco de instalação: abas por agente, select ou lista. Como destacar o padrão, onde fica o plugin do Claude Code (dois comandos) e onde fica o prompt.
2. Card da lista: densidade, quais metadados entram, se tem cópia rápida no card.
3. Como a página fica com 1 skill, com 8 (busca aparece) e com 30.
4. Posição da chamada na home e do link em `/about` e `/work-with-me`.
5. Renderização do SKILL.md: reaproveitar o estilo de prosa do blog? TOC lateral?
6. Lista de arquivos: árvore ou lista plana, com ou sem tamanho.
7. Peso visual do aviso de scripts e da nota de idioma.
8. Estados vazio e de erro.
9. OG image da lista e do detalhe dentro do `OgCard`.
10. Mobile: comandos longos com rolagem horizontal e botão de copiar sempre alcançável.

### Para o dev

1. Modelo de cache do Next 16 (o projeto não usa `cacheComponents`) e como a tag do catálogo é invalidada pelo webhook.
2. Datas de atualização: N chamadas REST ou uma consulta GraphQL?
3. Renderizador de markdown em runtime com sanitização. O projeto já tem `remark-gfm`, `rehype-slug` e `rehype-pretty-code`/`shiki`, mas não tem sanitizador.
4. Como os 404 de slugs desconhecidos são invalidados quando a skill passa a existir.
5. Validar `npx skills use` e `$skill-installer` antes de ativar os Could Haves que dependem deles.
6. Como o modo fixture é ligado no CI e no Playwright.

## Acceptance Criteria

### Dinâmico

- Dado que o repo tem a skill `mac-cleanup` válida, quando a lista é aberta em `/en/skills` e `/pt/skills`, então a `mac-cleanup` aparece com nome, resumo, versão `1.0.0`, categoria `productivity` e compatibilidade "macOS 13 or later.".
- Dado que uma pasta nova `skills/foo/SKILL.md` válida chega em `main`, quando passa a janela de revalidação (60 min) ou o webhook dispara, então `foo` aparece na lista e `/[lang]/skills/foo` abre, sem deploy e sem commit no repo do site.
- Dado que `/en/skills/foo` respondeu 404 antes de `foo` existir, quando `foo` é publicada e o índice revalida, então `/en/skills/foo` abre normalmente.
- Dado que uma skill é removida do repo, quando o índice revalida, então ela some da lista e do sitemap, e o detalhe responde 404.
- Dado que uma skill tem frontmatter sem `description`, ou com `name` diferente da pasta, quando o índice é montado, então ela não aparece na lista e o detalhe responde 404.
- Dado que a pasta começa com `.`, quando o índice é montado, então ela é ignorada.
- Dado que a skill não está no `marketplace.json`, quando o detalhe abre, então ela aparece com `npx` e manual, sem a opção de plugin do Claude Code.

### Webhook

- Dado um `push` em `main` com assinatura válida, quando chega no endpoint, então responde 2xx e o catálogo reflete a mudança em até 2 minutos.
- Dado um `push` sem assinatura ou com assinatura inválida, quando chega no endpoint, então responde 401 e nada é invalidado.
- Dado um `push` em outra branch, quando chega no endpoint, então responde 2xx sem invalidar.
- Dado um evento `ping` do GitHub, quando chega no endpoint, então responde 2xx.

### Resiliência

- Dado que o GitHub está fora e existe cache, quando lista ou detalhe são abertos, então mostram a última versão boa.
- Dado que o GitHub está fora e não existe cache, quando a lista é aberta, então mostra o estado de erro com link para o repo e HTTP 200; quando um detalhe é aberto, então mostra erro com link para a pasta no GitHub, sem 404.
- Dado que o repo não tem skills válidas, quando a lista é aberta, então mostra o estado vazio com link para o repo.
- Dado que o GitHub está fora durante o build, quando `pnpm build` roda, então o build termina com sucesso.
- Dado um slug com caractere fora de `[a-z0-9-]`, quando é acessado, então responde 404 sem nenhuma chamada ao GitHub.
- Dado qualquer página do catálogo aberta no navegador, quando se inspeciona a rede, então não há requisição do cliente para `api.github.com` nem `raw.githubusercontent.com`.

### Lista por volume

- Dado fixture com 1 skill, quando a lista abre, então não há campo de busca nem filtro, e a contagem diz "1 skill".
- Dado fixture com 8 ou mais skills, quando a lista abre, então há campo de filtro; ao digitar parte de um nome ou keyword, só as skills correspondentes ficam visíveis; sem correspondência, aparece a mensagem de nenhum resultado com o termo.
- Dado fixture com 8 ou mais skills em 2 ou mais categorias, quando a lista abre, então aparecem filtros por categoria que funcionam por teclado.
- Dado fixture com 30 skills, quando a lista abre, então todas aparecem sem paginação.
- Dado skills com datas de atualização, quando a lista abre, então a mais recente aparece primeiro; sem datas, a ordem é alfabética.

### Instalação

- Dado o detalhe da `mac-cleanup`, quando se copia o comando padrão, então a área de transferência contém exatamente `npx skills add julianosirtori/skills --skill mac-cleanup -g`.
- Dado o detalhe com o agente OpenCode escolhido, quando se copia, então o conteúdo é exatamente `npx skills add julianosirtori/skills --skill mac-cleanup -g -a opencode`. Mesmo teste para `claude-code`, `codex`, `cursor`, `gemini-cli` e `github-copilot`.
- Dado o detalhe com a opção de plugin do Claude Code, quando se copiam os comandos, então eles são `/plugin marketplace add julianosirtori/skills` e `/plugin install mac-cleanup@julianosirtori-skills`.
- Dado o detalhe, quando se usa "Copiar link do GitHub", então o conteúdo é `https://github.com/julianosirtori/skills/tree/main/skills/mac-cleanup`.
- Dado o detalhe em EN e em PT, quando se copia o prompt, então o texto contém a URL da pasta e o comando `npx` exatos, na língua da página.
- Dado o bloco manual com o agente Claude Code, quando é aberto, então mostra `git clone https://github.com/julianosirtori/skills.git ~/Developer/skills` e `ln -s ~/Developer/skills/skills/mac-cleanup ~/.claude/skills/mac-cleanup`, e a pasta muda ao trocar de agente.
- Dado qualquer botão de copiar, quando acionado por teclado (Tab e Enter), então copia e a confirmação é anunciada por leitor de tela.
- Dado que a Clipboard API falha, quando a pessoa tenta copiar, então o comando continua visível e selecionável inteiro.
- Dado a lista, quando a pessoa quer o comando padrão de uma skill, então chega nele copiado em no máximo 2 interações.
- Dado qualquer cópia de instalação, quando acontece, então dispara `skill_install_copy` com `content_id` igual ao slug e `action_id` igual ao método.

### Conteúdo do detalhe

- Dado o detalhe, quando abre, então mostra o corpo do SKILL.md renderizado sem o bloco de frontmatter.
- Dado um SKILL.md com link relativo `references/locations.md`, quando renderizado, então o link aponta para o arquivo no GitHub.
- Dado um SKILL.md com `<script>` ou atributo `onerror` no HTML, quando renderizado, então nada é executado e o HTML perigoso não aparece no DOM.
- Dado uma skill com pasta `scripts/`, quando o detalhe abre, então aparece o aviso de scripts com link para eles; sem `scripts/`, o aviso não aparece.
- Dado uma skill com `allowed-tools`, quando o detalhe abre, então as ferramentas aparecem listadas.
- Dado o detalhe, quando abre, então lista todos os arquivos da pasta da skill, cada um com link para o GitHub.
- Dado o detalhe em `/pt/skills/mac-cleanup`, quando abre, então a interface está em PT, a nota de idioma aparece e o bloco de conteúdo da skill tem `lang="en"`.

### Navegação

- Dado o command palette aberto, quando se digita "skills", "codex" ou "agent", então aparece a ação que leva para `/[lang]/skills`.
- Dado qualquer página, quando se olha o footer, então há link para `/[lang]/skills`.
- Dado `/about` e `/work-with-me`, quando abertas, então há link para o catálogo no trecho que fala de IA.
- Dado o header, quando o catálogo tem menos de 3 skills, então não há link para skills no header.

### SEO

- Dado `/en/skills` e `/pt/skills`, quando abertas, então têm `<title>` com "Juliano Sirtori", `meta description`, `og:title`, `og:description`, canonical para a própria URL e `hreflang` para `en` e `pt`.
- Dado `/en/skills/mac-cleanup`, quando aberta, então o título contém "mac-cleanup" e o canonical é `/en/skills/mac-cleanup`.
- Dado a OG image da lista e do detalhe, quando requisitadas, então respondem 200 com imagem 1200x630, inclusive com o GitHub fora.
- Dado `sitemap.xml`, quando gerado, então contém `/en/skills`, `/pt/skills`, `/en/skills/mac-cleanup` e `/pt/skills/mac-cleanup`.

### Qualidade

- Dado as duas rotas, quando medidas pelo Lighthouse no CI, então performance fica em pelo menos 90 e acessibilidade em pelo menos 95.
- Dado toda copy nova, quando revisada, então não tem travessão, exclamação nem clichê do voice guide, e existe em EN e PT.
- Dado `pnpm lint` e `pnpm test`, quando rodam, então passam sem chamar o GitHub.
- Dado o tema light e o dark, quando as duas rotas são abertas, então usam só tokens semânticos e o contraste é mantido.

## Design

Esta seção fecha as decisões **[Design]** do PRD. Tudo aqui usa o que já existe em `src/app/globals.css` (tokens semânticos, Geist Sans e Mono, `.prose`) e os padrões das páginas de lista (`/projects`, `/blog`) e do post. Nenhuma cor nova, nenhum alias legado.

### Princípios

1. **O comando é o herói.** No detalhe, o primeiro bloco depois do cabeçalho é o comando universal, já selecionado e com o botão de copiar visível. Outros agentes, plugin, manual e prompt são alternativas e pesam menos.
2. **Linhas editoriais, não grade de cards.** A lista usa as mesmas linhas com `divide-y` do blog e dos projetos. Com 1 skill a página continua parecendo uma lista, não um card solitário esticado.
3. **Confiança perto da ação.** O aviso de scripts fica logo abaixo do comando, e a lista de arquivos linka cada script.
4. **Mesmo resultado nos dois temas.** Nada de `bg-bg-muted` dentro de `bg-bg-elevated`: no dark os dois são `#171717` e o bloco interno some.
5. **Texto em repouso só em `text-fg` e `text-fg-muted`.** São os únicos tokens de texto que passam AAA no light (ver Acessibilidade). `text-accent` fica para hover, foco, indicador de aba ativa e texto grande.

### Inventário de componentes

**Reaproveitar como está**

| Componente | Onde entra | Observação |
|---|---|---|
| `Link` de `@/locales/navigation` | Links internos | Mantém o prefixo de língua |
| `NotFoundPage` | `skills/[slug]/not-found.tsx` | Mesmas props, copy do catálogo (ver Estados) |
| `CodeBlock` | `pre` dentro do SKILL.md renderizado | Visual e cópia iguais aos do blog. Usa o namespace `blog`, que já é carregado em todas as páginas |
| `Callout` (`@/components/Mdx/Callout`, `tone="warn"`) | Aviso de scripts | Não é exportado pelo `index.ts` do Mdx: importar pelo caminho do arquivo. Não tem `"use client"` e funciona em server component |
| `.prose` (globals.css) | Corpo do SKILL.md | Mesma tipografia do post: 1.125rem, line-height 1.8, tabela com rolagem, âncoras de heading |
| `OgCard` | As duas OG images | Ver OG images |
| `buttonClass`, `secondaryButtonClass`, `textButtonClass` de `src/components/Audience/copy.ts` | Estados vazio e de erro, "Copiar link do GitHub", "Limpar filtros" | Já têm `min-h-11`, foco e estados desabilitados |

**Reaproveitar o padrão (as classes), não o componente**

| Origem | Uso no catálogo |
|---|---|
| Linha de post do `BlogSearch` e `ProjectCard` | Linha da skill na lista (`SkillCard`) |
| Campo de busca e linha de status do `BlogSearch` | Filtro de texto (8+) |
| Botões `aria-pressed` do `ProjectArchive` | Filtro por categoria (8+, com 2 ou mais categorias) |
| `<details>` do `/about` | "Outras formas de instalar" |
| Linhas do `TechStack` (`grid sm:grid-cols-[140px_1fr]`, `divide-y`) | Seção Detalhes |
| Barra superior do `CodeBlock` | Barra do `CommandSnippet` |

**Estender**

| Componente | Mudança | Por quê |
|---|---|---|
| `CopyCodeButton` | **Substituir** por `CopyButton` genérico e apagar o atual | O `CopyCodeButton` não é usado em lugar nenhum: o blog usa o `CodeBlock`, que já é traduzido por `blog.copyCode`. Além dos rótulos fixos em inglês, ele troca o `aria-label` no meio da interação e não tem fallback. O novo recebe os rótulos por props |
| `TableOfContents` | Prop opcional `className` que substitui as classes de posição (`lg:col-start-2 lg:row-span-2 lg:row-start-1`) | No detalhe o TOC ocupa `lg:row-span-3` e vem no DOM depois da instalação. O default continua igual para o blog |
| `TechStack` | Prop opcional `children`, renderizada no fim do bloco "Studying" | Chamada da home |
| `Footer` | Link "Skills" e novo `aria-label` da nav | Ver Pontos de entrada |
| `CommandBarDialog` | Ação `skills`; grupo por skill (Could) | Ver Pontos de entrada |
| `OgCard` (opcional) | Prop `titleSize?: number` | Slug de até 64 caracteres a 66px quebra em 3 linhas |

**Novos** (convenção `src/components/Nome/{Nome.tsx,index.ts}`)

| Componente | Tipo | Responsabilidade |
|---|---|---|
| `CopyButton` | client | Copia um texto, troca rótulo e ícone por 2 s, chama `onCopied` (analytics) e `onError` (fallback). Rótulos e contexto por props |
| `CommandSnippet` | client | Barra (rótulo de contexto + `CopyButton`) e `<pre>` com o texto exato. Variante `wrap` para o prompt. Seleciona o próprio texto se a cópia falhar |
| `SkillCard` | server | Uma linha da lista |
| `SkillsCatalog` | client | Lista com filtro de texto e de categoria. Mostra os filtros só com `skills.length >= SKILLS_FILTER_THRESHOLD` (8) |
| `SkillInstall` | client | Seção Instalar: abas, painéis, plugin, aviso de scripts, "Outras formas", live region única, memória do agente |
| `SkillInstall/ManualInstall.tsx` | client | Conteúdo de "Instalar na mão": select de agente, dois passos, tabela de pastas |
| `SkillFiles` | server | Lista de arquivos agrupada por pasta, com tamanho e link |
| `SkillsState` | server | Bloco de vazio e de erro (`variant: "empty" \| "error" \| "detailError"`), usado na lista e no detalhe |
| `SkillMarkdown` | server | Renderiza o corpo sanitizado dentro de `<div lang="en" className="prose">`. A pipeline é do dev; aqui está só o contrato visual |

Os dados de agente viram constante (sugestão: `src/data/skill-agents.ts`): id do `-a`, nome de exibição, grupo (destaque ou "outros") e pastas de usuário e de projeto copiadas do README do repo de skills.

### Lista `/[lang]/skills`

**Container e cabeçalho**, iguais aos de `/projects` e `/blog`:

- `main`: `mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 pt-12 pb-20 lg:pt-24`
- `header`: `pb-10 sm:pb-12`
- Kicker: `text-fg-muted mb-5 font-mono text-xs tracking-[0.16em] uppercase`. Em `/work-with-me` o kicker é `text-accent`; aqui fica `text-fg-muted` por causa do AAA.
- H1: `text-fg mb-6 text-3xl leading-tight font-medium tracking-tight sm:text-4xl lg:text-5xl`
- Lede: `text-fg-muted max-w-[64ch] text-base leading-relaxed text-pretty sm:text-lg`
- Linha de meta: `mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm`, com a contagem (`text-fg-muted font-mono text-xs`), um `·` com `aria-hidden` e o link do repositório (`text-fg hover:text-accent focus-visible:ring-accent inline-flex min-h-11 items-center gap-1.5 rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none`, `ArrowTopRightIcon h-3.5 w-3.5`, `target="_blank"` e `sr-only` "(abre em uma nova aba)"). A contagem some nos estados vazio e de erro.

**Linha da skill (`SkillCard`).** A linha inteira é um `Link` para o detalhe, como no blog. Não existe elemento interativo dentro dela.

```
productivity · v1.0.0 · Updated Oct 3, 2026
mac-cleanup                                                         →
Analyze and safely free up disk space on macOS: measures what uses
storage, cleans only caches that rebuild themselves, finds leftovers…
macOS 13 or later.   3 scripts · 3 references
```

- `li` dentro de `ul` com `divide-border border-border divide-y border-y`.
- `Link`: `group hover:bg-bg-muted focus-visible:ring-accent -mx-3 grid grid-cols-[minmax(0,1fr)_16px] gap-4 rounded-sm px-3 py-5 transition-colors focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none sm:py-6`, com `aria-labelledby` apontando para o nome.
- Meta: `text-fg-muted mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs`. Categoria e versão em `font-mono`; data em `<time dateTime>`. Item sem dado some junto com o separador `·` (`aria-hidden`).
- Nome: `h2` com `text-fg group-hover:text-accent font-mono text-lg leading-snug font-medium [overflow-wrap:anywhere] transition-colors sm:text-xl`. É `h2` porque a lista não agrupa por ano.
- Resumo: `p lang="en"` com `text-fg-muted mt-2 max-w-[68ch] text-sm leading-relaxed text-pretty`.
- Sinais: `text-fg-muted mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs`. Compatibilidade curta com `lang="en"` (pela regra de 60 caracteres do PRD) e contagem de `scripts` e `references` em `font-mono`, com plural ICU. Se as duas faltarem, a linha não renderiza.
- Seta: `ArrowRightIcon` com `aria-hidden` e `text-fg-muted group-hover:text-accent mt-7 h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1`.

**Sem cópia rápida no card (decisão).** O PRD pede o comando padrão em até 2 interações a partir da lista: clicar na linha (1) e em "Copiar" no detalhe, onde o universal já vem selecionado (2). Um botão dentro da linha exigiria o padrão de link esticado, faria cada linha virar client component e deixaria a pessoa instalar sem passar pelo aviso de scripts.

**Datas sempre absolutas** (`Intl.DateTimeFormat` com `dateStyle: "medium"`, `timeZone: "UTC"`, `pt-BR` ou `en-US`), nunca "há 2 dias": a página sai do cache e data relativa envelhece.

**Rodapé da lista:** `text-fg-muted mt-8 max-w-[64ch] text-sm leading-relaxed` com `list.footnote`. Explica por que a lista é curta sem pedir desculpa e mostra que o catálogo se atualiza sozinho. Não aparece nos estados vazio e de erro.

**Comportamento por volume**

De 1 a 7 skills, sem filtro (desktop, com 1 skill):

```
OPEN SOURCE · MIT
Agent skills
Skills I wrote for my own work with coding agents. Each one is a
folder with a SKILL.md, so it runs in Claude Code, OpenCode, Codex…
1 skill · Browse the repository ↗
────────────────────────────────────────────────────────────────────
productivity · v1.0.0 · Updated Oct 3, 2026
mac-cleanup                                                        →
Analyze and safely free up disk space on macOS: measures what…
macOS 13 or later.   3 scripts · 3 references
────────────────────────────────────────────────────────────────────
Every skill here comes straight from the repository. When I push a
new one, it shows up on this page.
```

Com uma linha só, a lista tem borda em cima e embaixo, e o rodapé fecha a composição. Nada estica: a linha tem a mesma altura que teria no meio de 30.

A partir de 8 skills, o filtro entra entre o cabeçalho e a lista:

```
12 skills · Browse the repository ↗

Filter by name or keyword
┌────────────────────────────────────────────────────────────────┐
│ ⌕                                                             ×│
└────────────────────────────────────────────────────────────────┘
All 12    productivity 5    frontend 4    writing 3
Showing 3 of 12                                       Clear filters
────────────────────────────────────────────────────────────────────
linhas…
```

- Região: `div role="search" aria-label={filter.region}` com `mb-2 grid gap-4`.
- Campo: `label` visível (`text-fg-muted mb-2 block text-sm`) e `input type="search"` com as classes do `BlogSearch` (`border-border bg-bg-elevated text-fg focus:border-accent focus:ring-accent h-12 w-full rounded-md border pr-12 pl-10 text-base focus:ring-1 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none`), lupa à esquerda e botão de limpar `h-11 w-11` à direita quando há texto. Sem placeholder: o rótulo já diz o que digitar.
- Busca em nome, resumo e keywords, sem acento e sem caixa (mesma `normalize` do `BlogSearch`). O texto nunca vai para a URL nem para o analytics.
- Categorias (só com 2 ou mais): `div role="group" aria-label={filter.categories}` com `flex flex-wrap gap-x-6 gap-y-1`; botões com as classes do `ProjectArchive` (`text-fg-muted hover:text-fg aria-pressed:border-accent aria-pressed:text-fg focus-visible:ring-accent flex min-h-11 items-center gap-2 border-b-2 border-transparent text-sm …`) e contagem em `font-mono text-[11px] tabular-nums`. Seleção única, "All" primeiro. A categoria é o texto do `marketplace.json`, em `font-mono`.
- Status: `text-fg-muted flex min-h-12 items-center justify-between gap-4 text-xs`. À esquerda, `p role="status" aria-atomic="true" className="font-mono"`, vazio sem filtro e com "Showing 3 of 12" com filtro ativo (o total já está no cabeçalho). À direita, "Clear filters" (`textButtonClass`), só com filtro ativo.
- Nenhum resultado: no lugar das linhas, bloco `py-16 text-center` com a mensagem em `text-fg-muted text-base` e, abaixo, o mesmo "Clear filters", que devolve o foco ao campo.

Com 30 skills: igual ao estado de 8, sem paginação. Cada linha tem por volta de 140 px, então 30 skills dão uma página do tamanho do arquivo do blog. A ordem (mais recente primeiro, ou alfabética sem datas) não muda com o filtro.

### Detalhe `/[lang]/skills/[slug]`

**Largura e grade**, herdadas do post:

- Sem TOC: `main` com `mx-auto w-full max-w-[760px] px-5 pt-10 pb-20 lg:pt-16`, uma coluna.
- Com TOC (SKILL.md com 4 ou mais `h2`): `lg:max-w-[1040px]` e grade `grid gap-y-10 lg:grid-cols-[minmax(0,720px)_200px] lg:gap-x-16 lg:gap-y-8`. A coluna de 720 px cabe o comando mais longo de uma skill com nome curto (77 caracteres de Geist Mono a 14px, cerca de 650 px) sem rolagem.
- Ordem no DOM: `header`, `section#install`, `TableOfContents`, `div` com o resto. No `lg`, o TOC recebe `className="lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:sticky lg:top-28 lg:h-fit lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto"` e o resto fica em `lg:col-start-1`. No mobile, a gaveta "Nesta página" aparece **depois** da instalação, nunca entre o cabeçalho e o comando.

Desktop com TOC (1440 px):

```
 ← All skills                                View on GitHub ↗  │ On this page
 [PRODUCTIVITY]                                                │ ┃ Install
 mac-cleanup                                                   │ │ When the agent uses it
 Analyze and safely free up disk space on macOS: measures      │ │ Details
 what uses storage, cleans only caches that rebuild…           │ │ Instructions for the agent
                                                               │ │    Three tiers
 Version    License    Updated        Requirements             │ │    Ground rules, and why
 1.0.0      MIT        Oct 3, 2026    macOS 13 or later.       │ │    Workflow
 ──────────────────────────────────────────────────────        │ │    Automation
 Install                                🔗 Copy GitHub link     │
 Any agent   Claude Code   OpenCode   Codex   Other agents     │
 ━━━━━━━━━──────────────────────────────────────────────        │
 ┌ terminal ─────────────────────────────────────── ⧉ Copy ┐   │
 │ npx skills add julianosirtori/skills --skill mac-cleanup -g │ │
 └────────────────────────────────────────────────────────────┘ │
 The skills CLI finds the agents on your machine and links…    │
 ┌────────────────────────────────────────────────────────────┐ │
 │ ⚠  This skill ships 3 scripts that run on your machine.    │ │
 │    Read them before installing. See the scripts ↗          │ │
 └────────────────────────────────────────────────────────────┘ │
 OTHER WAYS TO INSTALL                                         │
 ───────────────────────────────────────────────────────────── │
 Ask your agent                                             ⌄  │
 ───────────────────────────────────────────────────────────── │
 Install by hand                                            ⌄  │
 ───────────────────────────────────────────────────────────── │
 When the agent uses it
 ▌ Analyze and safely free up disk space on macOS. Measures…
 Your agent reads this description to decide when to load the skill.
 Details
 ─────────────────────────────────────────────────────────────
 Requirements      macOS 13 or later. Uses the stock bash 3.2…
 ─────────────────────────────────────────────────────────────
 Keywords          macos  disk-space  cleanup  storage  caches
 ─────────────────────────────────────────────────────────────
 Source            julianosirtori/skills at commit 180c1b5 ↗
 ─────────────────────────────────────────────────────────────
 Files             SKILL.md                           8.6 kB ↗
                   references/
                   │ automation.md                    2.8 kB ↗
                   │ …
                   scripts/
                   │ leftovers.sh                     6.8 kB ↗
                   │ …
 ─────────────────────────────────────────────────────────────
 Instructions for the agent                          SKILL.md ↗
 (corpo do SKILL.md em .prose)
```

A 1440×900 (viewport útil de uns 760 px, conferido no post do blog), o comando universal fica inteiro acima da dobra: o cabeçalho termina perto de 470 px e a linha do comando, perto de 720 px. Por isso o cabeçalho não leva keywords (ver Pontos de alinhamento).

**Cabeçalho**

- Navegação: `mb-7 flex min-h-11 items-center justify-between gap-4 text-sm`. À esquerda, "← All skills" no estilo do "Back to the blog" (`text-fg-muted hover:text-accent focus-visible:ring-accent inline-flex min-h-11 items-center gap-2 rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none`). À direita, "View on GitHub ↗" (`text-fg-muted hover:text-accent inline-flex min-h-11 items-center gap-1.5`, nova aba com `sr-only`), que dispara `skill_source_click`.
- Categoria, se existir: a pílula do post com o texto trocado para passar AAA, `bg-accent-muted text-fg mb-5 inline-flex rounded-full px-2.5 py-1 font-mono text-xs tracking-wide uppercase`.
- H1: o slug, `text-fg mb-5 font-mono text-3xl leading-[1.15] font-medium tracking-tight [overflow-wrap:anywhere] sm:text-4xl lg:text-[2.75rem]`. O hífen é ponto de quebra natural, então slug longo quebra sem cortar.
- Resumo: `p lang="en"` com `text-fg-muted mb-6 text-base leading-relaxed text-pretty sm:text-lg`.
- Nota de idioma (só `/pt`): `p` com `text-fg-muted mb-6 flex items-start gap-2 text-sm` e `InfoCircledIcon` (`aria-hidden`, `mt-0.5 h-4 w-4 shrink-0`). Peso baixo, aparece uma vez, logo abaixo do primeiro texto em inglês.
- Fatos: `dl aria-label={detail.facts.label}` com `border-border grid grid-cols-2 gap-x-6 gap-y-4 border-b pb-6 sm:flex sm:flex-wrap sm:gap-x-10`. Cada item é `div` com `dt` (`text-fg-muted text-xs`) e `dd` (`text-fg mt-1 text-sm`; versão em `font-mono`, data em `<time>`, requisitos com `lang="en"`). Ordem: Versão, Licença, Atualizada, Requisitos. Item sem dado some. Requisitos só entra na forma curta (regra de 60 caracteres do card) e ocupa `col-span-2` no mobile.

**Instalar (`SkillInstall`, `section#install`)**

Cabeçalho da seção: `flex flex-wrap items-center justify-between gap-x-4 gap-y-2`, com `h2` (`text-fg text-2xl font-semibold tracking-tight scroll-mt-36 sm:scroll-mt-28`) e, à direita, "Copy GitHub link" (`textButtonClass` + `Link2Icon`), que vira "Link copied" com `CheckIcon` por 2 s. É botão de texto, sem borda, para não competir com o "Copiar" do comando.

*Escolha do agente: abas.* Abas e não select, porque os nomes à vista respondem "roda no meu agente?", metade da pergunta de quem chega. Abas e não lista, porque um comando por vez evita a pessoa escolher entre seis linhas quase iguais.

- `div role="tablist" aria-label={install.tabsLabel}` com `border-border no-scrollbar -mx-5 mt-5 flex gap-6 overflow-x-auto border-b px-5 sm:mx-0 sm:gap-7 sm:px-0`. No mobile a faixa vai até a borda da tela e rola na horizontal; a aba cortada na borda indica que há mais.
- Aba: `button role="tab"` com `text-fg-muted hover:text-fg aria-selected:border-accent aria-selected:text-fg focus-visible:ring-accent -mb-px inline-flex min-h-11 shrink-0 cursor-pointer items-center border-b-2 border-transparent px-0.5 text-sm whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:outline-none motion-reduce:transition-none`. Mesmo visual dos filtros de `/projects` e dos controles do `Workbench`. `ring-inset` porque o contêiner rolável corta o anel externo.
- Ordem: **Any agent** (padrão), Claude Code, OpenCode, Codex, Other agents.
- O HTML do servidor sempre sai com "Any agent". Se houver agente salvo (`createStorage("skills")`, chave `agent`), o cliente troca depois da hidratação, sem animação.
- Painel: `div role="tabpanel"` com `mt-5 flex flex-col gap-3`. Painel inativo com o atributo `hidden`.

*Conteúdo por aba*

| Aba | Snippets | Dica abaixo (`text-fg-muted max-w-[64ch] text-sm leading-relaxed`) |
|---|---|---|
| Any agent | `terminal`: `npx skills add julianosirtori/skills --skill <name> -g` | `install.hints.any` |
| Claude Code | `terminal`: `… -g -a claude-code`. Se a skill estiver no `marketplace.json`, bloco do plugin (abaixo) | `hints.agent` e `hints.claudeCode` |
| OpenCode | `terminal`: `… -g -a opencode` | `hints.agent` |
| Codex | `terminal`: `… -g -a codex` | `hints.agent` e `hints.restart` |
| Other agents | Três snippets empilhados, com o nome do agente como rótulo da barra: `Cursor`, `Gemini CLI`, `GitHub Copilot` | `hints.other` |

Nas abas de agente, o trecho `-a <id>` vai num `span` com `bg-accent-muted text-fg rounded-[3px]`, sem padding para não parecer espaço extra. É o único pedaço que muda entre abas, e o destaque torna a troca perceptível. `span`, não `mark`, para o leitor de tela não anunciar "destacado".

Bloco do plugin, dentro da aba Claude Code: `border-border mt-4 flex flex-col gap-3 border-t pt-5`, `h3` com `text-fg text-base font-medium` (`install.plugin.title`), a dica `install.plugin.hint` e dois snippets, rotulados `1 · add the marketplace` e `2 · install the plugin`. **Um botão por comando**: os dois são digitados dentro do Claude Code, um de cada vez, e colar as duas linhas juntas mandaria uma mensagem só. A regra vale também para o manual (`git clone` e `ln -s`): um comando, um snippet, um botão, sem exceção.

*`CommandSnippet`*, derivado da barra do `CodeBlock`:

```
┌ terminal ───────────────────────────────────────────── ⧉ Copy ┐   ← barra
│ npx skills add julianosirtori/skills --skill mac-cleanup -g    │   ← pre
└────────────────────────────────────────────────────────────────┘
```

- Contêiner: `bg-bg-muted border-border overflow-hidden rounded-lg border`. A borda é a única diferença para o `CodeBlock`: no light, `bg-bg-muted` sobre `bg-bg` (#f5f5f5 sobre #fafafa) quase não aparece, e aqui o bloco é o elemento principal da página.
- Barra: `border-border text-fg-muted flex min-h-11 items-center justify-between gap-4 border-b pr-1.5 pl-4`; rótulo em `font-mono text-xs` (`terminal`, `inside Claude Code`, `prompt`, nome do agente ou passo).
- Botão: `CopyButton` com `text-fg hover:bg-bg focus-visible:ring-accent inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none`, `CopyIcon` + "Copy". Mais forte que o "Copy code" do blog (`text-fg`, `text-sm`) porque aqui é a ação principal. Sempre visível, nunca só no hover. Fica na barra, fora da área que rola.
- Texto: `pre` com `text-fg focus-visible:ring-accent overflow-x-auto px-4 py-3.5 font-mono text-sm leading-relaxed whitespace-pre [scrollbar-width:thin] focus-visible:ring-2 focus-visible:ring-inset focus-visible:outline-none sm:px-5`, `tabIndex={0}` e `aria-label` igual ao rótulo da barra (região rolável precisa receber foco pelo teclado).
- Sem prompt `$`, sem espaço nem quebra de linha no fim. O conteúdo do `pre` é exatamente o que vai para a área de transferência.
- Variante `wrap` (só o prompt): `whitespace-pre-wrap [overflow-wrap:anywhere]`, ainda em mono, porque é texto para colar como está.

*Aviso de scripts:* logo depois do painel, antes de "Outras formas", um `Callout tone="warn"` sem título, com `detail.scripts.notice` (plural ICU) e o link `detail.scripts.link` para `tree/main/skills/<name>/scripts` (`text-fg underline decoration-border-strong underline-offset-4 hover:text-accent`, nova aba, dispara `skill_source_click`). Peso médio: tem borda e fundo quente, mas não é vermelho nem bloqueia nada. A cor `warn` fica só na borda e no ícone; o texto é `text-fg-muted`, porque o `warn` do light tem 2,8:1 sobre o fundo e não pode carregar texto. Sem `scripts/`, o aviso não renderiza.

*Outras formas de instalar:* `mt-8`; rótulo `h3` com `text-fg-muted mb-2 font-mono text-xs tracking-[0.14em] uppercase`; lista de `<details>` no padrão do `/about`. Contêiner `border-border border-t`; item `group border-border border-b`; `summary` com `text-fg hover:text-accent focus-visible:ring-accent flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-3 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden` e `ChevronDownIcon` (`text-fg-muted h-4 w-4 transition-transform group-open:rotate-180 motion-reduce:transition-none`); conteúdo `flex flex-col gap-3 pb-6`. Todos fechados por padrão, nesta ordem:

1. **Ask your agent** (`install.prompt`): dica e `CommandSnippet` com `wrap`, rótulo `prompt` e botão "Copy". O texto usa `{url}` e `{command}`, e `{command}` recebe o comando universal gerado, para existir uma fonte só.
2. **Install by hand** (`ManualInstall`): texto curto; linha com `label` "Agent" e `select` nativo (`border-border bg-bg-elevated text-fg focus:border-accent focus:ring-accent h-11 rounded-md border px-3 text-sm focus:ring-1 focus:outline-none`) com os seis agentes; snippet `1 · clone` com o `git clone`; snippet `2 · link` com o `ln -s` apontando para a pasta de usuário do agente escolhido; tabela de pastas dentro de `div.overflow-x-auto`, `caption` em `sr-only`, colunas Agent, For your user e For one project, células em `font-mono text-xs`, `th` com `text-fg-muted text-xs font-medium`, linhas `border-border border-b` com `py-2 pr-4`, e a linha do agente escolhido com `bg-bg-muted`. Abaixo, `install.manual.projectHint`. Sincronia: trocar para uma aba de agente específico atualiza o select; "Any agent" e "Other agents" não mexem nele; o select não muda a aba. Valor inicial: Claude Code.
3. **Try it without installing** (Could, só depois de o dev validar a sintaxe): dica e snippet com `npx skills use julianosirtori/skills@<name> | claude`.
4. **Update or remove** (Could): snippets `update` e `remove`.

**Quando o agente usa (`section#triggers`)**: `h2` igual ao de Instalar; `blockquote lang="en"` com `cite` apontando para o SKILL.md e `border-border-strong text-fg mt-4 border-l-2 pl-5 text-base leading-relaxed`, sem itálico para os 700 caracteres lerem bem; dica `text-fg-muted mt-3 text-sm` (`detail.triggers.hint`), que explica por que o texto soa como instrução.

**Detalhes (`section#details`)**: `dl` com `divide-border border-border mt-4 divide-y border-y`; linha `div` com `grid gap-2 py-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6`; `dt` com `text-fg text-sm font-semibold`; `dd` com `text-fg-muted min-w-0 text-sm leading-relaxed`. Linhas, todas condicionais:

- **Requirements**: `compatibility` completo, com `lang="en"`.
- **Pre-approved tools**: cada item do `allowed-tools` como chip `border-border text-fg rounded-md border px-2 py-0.5 font-mono text-xs` dentro de `ul flex flex-wrap gap-2`, e a dica `text-fg-muted mt-2 text-xs` (`detail.details.toolsHint`). É um sinal de confiança, então vem explicado.
- **Keywords**: `ul text-fg-muted flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs`, como as tecnologias do `TechStack`.
- **Source**: "julianosirtori/skills at commit 180c1b5", linkando a árvore no SHA usado. Mostra de onde veio exatamente o que está na tela.
- **Files** (`SkillFiles`): lista plana agrupada por pasta, não árvore. `SKILL.md` primeiro, depois os arquivos da raiz, depois cada pasta em ordem alfabética. Pasta: rótulo `text-fg-muted font-mono text-xs` (`scripts/`) e `ul border-border mt-1 ml-1 border-l pl-4`. Arquivo: link `group text-fg hover:text-accent focus-visible:ring-accent flex min-h-9 items-center justify-between gap-4 rounded-sm font-mono text-sm focus-visible:ring-2 focus-visible:outline-none`, nome com `[overflow-wrap:anywhere]` à esquerda, tamanho à direita (`text-fg-muted text-xs tabular-nums`, `Intl.NumberFormat` com `unit: "kilobyte"` e uma casa decimal) e `ArrowTopRightIcon h-3 w-3`. O tamanho vem de graça na árvore da API e dá noção do peso da skill. Com mais de 20 arquivos, a lista vai dentro de um `<details>` fechado com `detail.details.showAllFiles`.

**Instruções para o agente (`section#instructions`)**: cabeçalho `flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2` com o `h2` e o link `SKILL.md ↗` (`text-fg-muted hover:text-accent inline-flex min-h-11 items-center gap-1 font-mono text-xs`). Corpo em `SkillMarkdown`, `mt-6`, dentro de `div lang="en" className="prose"`:

- **Mesmo estilo de prosa do blog**, sem variante nova. Code blocks viram `CodeBlock` (barra com a linguagem, "Copy code" traduzido, shiki com os temas claro e escuro do blog). Tabelas usam o `.prose table`, que já rola na horizontal no mobile (a `mac-cleanup` tem uma tabela de três colunas longas).
- **H1 do corpo**: se o primeiro nó for um `h1` (na `mac-cleanup` é "Mac Cleanup"), ele sai, porque repete o H1 da página. Os headings restantes descem um nível (`h2` vira `h3`, `h3` vira `h4`, até `h6`) e ficam abaixo do `h2` "Instructions for the agent" sem pular nível.
- **Âncoras**: `rehype-slug` e `rehype-autolink-headings` como no blog (o `a.anchor` já tem estilo). O slugger começa com os ids da página reservados (`install`, `triggers`, `details`, `instructions`), então um "## Install" dentro do SKILL.md vira `#install-1` sem colidir.
- Links relativos e imagens seguem a regra do PRD (GitHub e SHA). Links do corpo seguem o `.prose a`, sem ícone extra.

**TOC (Should)**: aparece quando o SKILL.md tem 4 ou mais `h2`. Reaproveita o `TableOfContents` com `label={detail.onThisPage}` e estes itens: nível 2 para as seções da página (Install, When the agent uses it, Details, Instructions for the agent) e nível 3 para os `h2` originais do corpo. Os `h3` do corpo ficam fora (o "Workflow" da `mac-cleanup` tem 7). Assim o TOC mapeia a página inteira, não só o corpo.

**Rodapé do detalhe**: `border-border text-fg-muted mt-16 flex flex-wrap items-baseline justify-between gap-4 border-t pt-6 text-sm`, com "← All skills" e, se o Could entrar, `detail.report` com link para abrir issue.

### Estados

| Estado | Lista | Detalhe |
|---|---|---|
| Carregando | Sem UI de loading: a página sai do cache | **Sem `loading.tsx` em `skills/[slug]`.** Com streaming, um slug inexistente responderia 200 em vez de 404. Se o dev medir navegação fria acima de 300 ms, o loading entra só em `skills/loading.tsx` (lista) |
| Vazio (repo sem skills válidas) | Cabeçalho inteiro, sem contagem e sem rodapé, com `SkillsState variant="empty"` | 404 (regra do PRD) |
| Erro sem cache (HTTP 200) | Cabeçalho inteiro, sem contagem, com `SkillsState variant="error"` | Navegação, H1 com o slug da URL (já validado pelo padrão) e `SkillsState variant="detailError"` |
| Skill inexistente | n/a | `NotFoundPage` via `skills/[slug]/not-found.tsx` |

`SkillsState`: `border-border border-y py-12 sm:py-16`; mensagem em `text-fg max-w-[52ch] text-lg leading-relaxed`; ações em `mt-6 flex flex-wrap items-center gap-3`.

- Vazio: `state.empty` e "Open the repository ↗" (`secondaryButtonClass`).
- Erro da lista: `state.error`, "Open the repository ↗" (`secondaryButtonClass`) e "Try again" (`textButtonClass`; um `<a>` para a própria URL, funciona sem JS).
- Erro do detalhe: `state.detailError`, "Open the folder on GitHub ↗" (`secondaryButtonClass`, para `tree/main/skills/<slug>`) e "Try again".
- Sem ícone e sem vermelho: o erro não é culpa de quem visita, e a mensagem já diz onde as skills estão.

404: `NotFoundPage` com `title={notFound.title}`, `description={notFound.description}`, `linkLabel={notFound.link}` e `href="/<lang>/skills"`. Mesmo componente do site, com uma saída mais útil que voltar para a home.

**Feedback de cópia**

- Visual: o botão troca `CopyIcon` e "Copy" por `CheckIcon` e "Copied" por 2 s, o mesmo tempo do `CodeBlock`. O check pode usar `text-success` (3,2:1 no light, suficiente para ícone); o rótulo continua `text-fg`.
- Leitor de tela: **uma** live region por `SkillInstall`, `p role="status" aria-live="polite" aria-atomic="true" className="sr-only"`, que recebe "Command copied", "Link copied" ou "Prompt copied". Para repetir o anúncio em cópias seguidas, limpar e escrever de novo no frame seguinte.
- Falha da Clipboard API: o `CommandSnippet` seleciona o próprio texto (um `Range` sobre o `pre`) e mostra abaixo um `p role="alert"` com `text-fg-muted mt-2 flex items-start gap-2 text-sm` e `ExclamationTriangleIcon` (`aria-hidden`), com `copy.failed`. O analytics só dispara em sucesso.

### Responsivo

| Faixa | Lista | Detalhe |
|---|---|---|
| Abaixo de 640 px | Uma coluna; filtros em linhas; categorias com `flex-wrap` | Uma coluna; fatos em `grid-cols-2`; abas rolando até a borda; Detalhes com rótulo acima do valor; TOC como gaveta depois da instalação |
| `sm` (640+) | Igual, com mais respiro (`sm:py-6`) | Fatos em linha (`sm:flex`); abas sem vazar; Detalhes em duas colunas (160 px e o resto) |
| `lg` (1024+) | `max-w-5xl` | Com TOC, `max-w-[1040px]` e coluna de 720 px com TOC sticky de 200 px; sem TOC, coluna única de 760 px |

- **Comandos longos**: rolagem horizontal dentro do `pre`, nunca quebra nem truncamento (regra do PRD). O botão fica na barra, fora da área que rola, então nunca sai da tela. Barra de rolagem fina e visível (`[scrollbar-width:thin]`), nunca `no-scrollbar` no `pre`.
- **Ordem no mobile**, a mesma do desktop menos o TOC lateral: navegação, cabeçalho, Instalar, gaveta "Nesta página", Quando o agente usa, Detalhes, Instruções, rodapé.
- **Largura máxima**: lista em `max-w-5xl` (alinha com `/blog` e `/projects`); detalhe em 760 px sem TOC e 1040 px com TOC (alinha com o post). Texto corrido limitado entre `64ch` e `72ch`.

Mobile, detalhe (390 px):

```
 ← All skills        View on GitHub ↗
 [PRODUCTIVITY]
 mac-cleanup
 Analyze and safely free up disk
 space on macOS: measures what…
 ⓘ A skill é escrita em inglês, igual
   no repositório.                      (só PT)
 Version          License
 1.0.0            MIT
 Updated          Requirements
 Oct 3, 2026      macOS 13 or later.
 ─────────────────────────────────
 Install      🔗 Copy GitHub link
 Any agent  Claude Code  OpenCo│→      (rola)
 ━━━━━━━━━
 ┌ terminal ──────────── ⧉ Copy ┐
 │ npx skills add julianosirto│→      (rola)
 └──────────────────────────────┘
 The skills CLI finds the agents…
 ┌ ⚠ This skill ships 3 scripts… ┐
 OTHER WAYS TO INSTALL
 Ask your agent                  ⌄
 Install by hand                 ⌄
 ─────────────────────────────────
 On this page                    ⌄
 When the agent uses it
 …
```

### Acessibilidade

**Ordem de foco no detalhe**: All skills, View on GitHub, Copy GitHub link, aba selecionada (uma parada só; as setas trocam), "Copy" do snippet, `pre` do snippet, passos do plugin (aba Claude Code), link do aviso de scripts, summaries de "Outras formas", TOC, links de Detalhes (Source e arquivos), link do SKILL.md, links e code blocks do corpo, rodapé. Na lista: link do repositório, campo de filtro, limpar, categorias, linhas.

**Abas** (padrão WAI-ARIA APG com ativação automática, já que trocar de painel não custa nada):

- `role="tablist"` com `aria-label`; cada aba com `role="tab"`, `id="install-tab-<agente>"`, `aria-selected` e `aria-controls="install-panel-<agente>"`; cada painel com `role="tabpanel"`, `aria-labelledby` e `hidden` quando inativo.
- Tabindex móvel: só a aba ativa tem `tabIndex=0`; as outras, `-1`.
- `ArrowRight` e `ArrowLeft` movem foco e seleção, com volta circular; `Home` e `End` vão para a primeira e a última. `Tab` sai da lista e entra no painel, cujo primeiro focável é o "Copy" (o painel não precisa de `tabIndex`).
- Ao selecionar, a aba entra na área visível da faixa (`scrollIntoView({ block: "nearest", inline: "nearest" })`, sem `smooth` com `prefers-reduced-motion`).
- Sem JS, o painel padrão aparece e funciona; os `<details>` também.

**Botões de copiar**

- Nome acessível = rótulo visível + contexto em `sr-only`: "Copy" + " install command for OpenCode" dá "Copy install command for OpenCode" ("Copiar comando de instalação (OpenCode)"). Começa pelo texto visível (WCAG 2.5.3) e cada botão fica distinguível na lista de botões do leitor de tela. Sem `aria-label`, ao contrário do `CopyCodeButton` atual, que troca o `aria-label` e tira o texto visível do nome.
- Acionável por `Tab` e `Enter` ou `Espaço`, alvo mínimo de 44 px (`min-h-11`).

**Contraste**, calculado com os valores de `globals.css`:

| Par | Light | Dark | Uso permitido |
|---|---|---|---|
| `text-fg` sobre `bg-bg` | 19:1 | 19:1 | Qualquer texto |
| `text-fg-muted` sobre `bg-bg` / `bg-bg-muted` | 7,5:1 / 7,2:1 | 7,8:1 / 7,1:1 | Qualquer texto (AAA nos dois temas) |
| `text-fg-subtle` sobre `bg-bg` | 4,7:1 | 5,7:1 | **Não usar para texto** nas páginas novas (falha AAA no light) |
| `text-accent` sobre `bg-bg` | 6,0:1 | 6,6:1 | Hover, foco, indicador de aba ativa, texto de 24px ou mais. Nunca texto pequeno em repouso |
| `text-fg` sobre `bg-accent-muted` | 16:1 | 15:1 | Pílula de categoria e destaque do `-a` |
| `success` sobre `bg-bg` | 3,2:1 | alto | Só o ícone de check |
| `warn` sobre `bg-bg` | 2,8:1 | alto | Só borda e ícone decorativo |

Indicadores não textuais (borda da aba ativa, anel de foco) usam `accent`, que passa 3:1 nos dois temas.

**Outros**: `lang="en"` no resumo, na compatibilidade, no `description` e no corpo; cada seção com `aria-labelledby` apontando para o `h2`; outline H1 (slug), H2 (Install, When the agent uses it, Details, Instructions for the agent), H3 em diante (plugin, outras formas, corpo deslocado); links externos com `sr-only` "(abre em uma nova aba)"; nenhuma animação além de transição de cor, sempre com `motion-reduce:transition-none`.

### Pontos de entrada

| Superfície | Onde | Peso visual |
|---|---|---|
| Command palette | `CommandBarDialog`, seção `navigate`, logo depois de `projects`: `id: "skills"`, `label: t("skills")`, `icon: <CubeIcon />`, keywords do PRD | Igual às outras ações de navegação |
| Command palette, por skill (Could) | Grupo próprio com heading `global.kbar.skillsGroup`, um item por skill com o slug e as keywords dela. Entra junto com o header (3+ skills), porque exige mandar o índice ao cliente em toda página | Item comum do `cmdk` |
| Footer | Terceiro link da nav, depois de Newsletter e do guestbook: "Skills" (com maiúscula, como os vizinhos), `href="/<lang>/skills"`, mesmas classes (`hover:text-accent inline-flex min-h-11 items-center`). O `aria-label` da nav deixa de ser "Comunidade" e passa a ser `global.footer.label` | Igual aos vizinhos |
| `/about` | Na nota "What I'm learning now", um parágrafo novo depois do `p2`, com `t.rich` e link no trecho final da frase. Link no estilo do `contact.cta` da própria página (`text-fg border-border hover:border-accent hover:text-accent border-b pb-0.5`) | Uma frase, dentro do texto |
| `/work-with-me` | No `li` de `contributions.ai`, uma segunda linha `p text-fg-muted mt-1` com a mesma frase e o mesmo estilo de link | Uma frase, abaixo do item |
| Home (Should) | No bloco "Studying" do `TechStack` (o de `border-accent border-l-2`, que lista "Agents"), via `children`: `p text-fg-muted mt-4 text-sm leading-relaxed` com `home.stack.skillsNote` e o link `home.stack.skillsLink` (`text-fg hover:text-accent inline-flex items-center gap-1 font-medium` + `ArrowRightIcon h-3.5 w-3.5`) | Uma linha. Sem seção nova, sem card, sem item no `HomeRail` |
| Playground (Could) | Última linha da saída do comando `skills`, na cor atenuada do tema do terminal, com `playground.skillsHint` | Uma linha |
| Header (futuro, 3+ skills) | "skills" entre "projects" e "blog", trabalho junto de trabalho. No mobile o header passa de 5 para 6 itens e quebra; para caber, o link do playground mostra só `>_` abaixo de `sm`, com `aria-label` | Igual aos outros links |

A chamada da home vai para o bloco "Studying" porque é ali que "Agents" aparece como estudo; a skill publicada mostra o estudo virando entrega, que é a regra de posicionamento do PRD de discovery.

### OG images

As duas usam o `OgCard` com `category` "AI" (EN) ou "IA" (PT), que puxa o destaque âmbar (`#fbbf24`) dos posts de IA.

| Rota | `title` | `meta` | Falha |
|---|---|---|---|
| `skills/opengraph-image.tsx` | `meta.listTitle` | `meta.ogListMeta` | Não depende do GitHub, não falha |
| `skills/[slug]/opengraph-image.tsx` | O slug | `meta.ogDetailMeta`, mais ` · v1.0.0` quando houver versão | GitHub fora: card da lista. Slug inexistente com índice ok: 404, como a OG do post |

```
┌───────────────────────────────────────────────────────────── 1200×630 ┐
│████████████████████████ (faixa âmbar de 8px) ███████████████████████████│
│  ( AI )                                            ■ julianosirtori.dev │
│                                                                         │
│  mac-cleanup                                                            │
│                                                                         │
│  (JS)  Juliano Sirtori                                                  │
│        Agent skill · v1.0.0                                             │
└─────────────────────────────────────────────────────────────────────────┘
```

- Título em sans, como nos outros cards. O satori não tem Geist Mono sem carregar a fonte (o `MONO` do `OgCard` hoje cai na fonte padrão), e não vale carregar fonte só para isso.
- Slug com mais de 28 caracteres: título a 52px (prop opcional `titleSize`), para caber em 2 linhas.
- Sem resumo no card: o `og:description` já leva o resumo nas redes, e o card fica limpo como os dos posts.
- `alt` estático, sem travessão: `meta.ogAlt`. O `alt` das OGs atuais tem travessão; vale corrigir quando alguém mexer nelas.

### Copy

Revisada contra o voice guide: sem travessão, sem exclamação, sem clichê, primeira pessoa, PT reescrito. Mudanças sobre o rascunho do PRD: "Or ask your agent" virou "Ask your agent", porque agora é item dentro de "Other ways to install"; a dica do plugin ganhou "one at a time"; o prompt usa `{command}` em vez do comando escrito à mão; o aviso de scripts ganhou plural; a dica de cada agente explica o `-a`. As tags `<code>` e `<link>` são para `t.rich`. Os nomes Cursor, Gemini CLI e GitHub Copilot vêm da constante de agentes, não do JSON. Exportar como `skills` em `src/locales/{en,pt}/index.ts`.

`src/locales/en/skills.json`:

```json
{
  "meta": {
    "listTitle": "Agent skills",
    "listDescription": "Open source agent skills by Juliano Sirtori for Claude Code, OpenCode, Codex and other agents. Copy the command and install.",
    "detailTitle": "{name} · Agent skill",
    "ogListMeta": "Open source, for Claude Code, OpenCode and Codex",
    "ogDetailMeta": "Agent skill",
    "ogAlt": "Agent skills by Juliano Sirtori"
  },
  "list": {
    "kicker": "Open source · MIT",
    "title": "Agent skills",
    "lede": "Skills I wrote for my own work with coding agents. Each one is a folder with a SKILL.md, so it runs in Claude Code, OpenCode, Codex and any other agent that reads the format. Pick one and copy the install command.",
    "count": "{count, plural, one {# skill} other {# skills}}",
    "repoLink": "Browse the repository",
    "footnote": "Every skill here comes straight from the repository. When I push a new one, it shows up on this page."
  },
  "card": {
    "updated": "Updated {date}",
    "scripts": "{count, plural, one {# script} other {# scripts}}",
    "references": "{count, plural, one {# reference} other {# references}}"
  },
  "filter": {
    "region": "Filter skills",
    "label": "Filter by name or keyword",
    "clear": "Clear filter",
    "categories": "Categories",
    "all": "All",
    "showing": "Showing {visible} of {total}",
    "noResults": "No skill matches \"{query}\".",
    "clearFilters": "Clear filters"
  },
  "state": {
    "empty": "No skills published yet. The repository is public, so you can follow it on GitHub.",
    "error": "Couldn't reach GitHub right now. The skills are still in the repository.",
    "detailError": "Couldn't reach GitHub right now. This skill's files are still in the repository.",
    "openRepo": "Open the repository",
    "openFolder": "Open the folder on GitHub",
    "retry": "Try again",
    "loading": "Loading the skills"
  },
  "notFound": {
    "title": "This skill isn't in the catalog.",
    "description": "It may have been renamed or removed from the repository.",
    "link": "See all skills"
  },
  "detail": {
    "back": "All skills",
    "viewOnGitHub": "View on GitHub",
    "newTab": "opens in a new tab",
    "languageNote": "This skill is written in English, as in the repository.",
    "onThisPage": "On this page",
    "facts": {
      "label": "Skill facts",
      "version": "Version",
      "license": "License",
      "updated": "Updated",
      "requirements": "Requirements"
    },
    "triggers": {
      "title": "When the agent uses it",
      "hint": "Your agent reads this description to decide when to load the skill."
    },
    "details": {
      "title": "Details",
      "requirements": "Requirements",
      "tools": "Pre-approved tools",
      "toolsHint": "Your agent can run these without asking you each time.",
      "keywords": "Keywords",
      "source": "Source",
      "sourceValue": "{repo} at commit {sha}",
      "files": "Files",
      "filesCount": "{count, plural, one {# file} other {# files}}",
      "showAllFiles": "Show all {count} files"
    },
    "scripts": {
      "notice": "{count, plural, one {This skill ships a script that runs on your machine. Read it before installing.} other {This skill ships # scripts that run on your machine. Read them before installing.}}",
      "link": "{count, plural, one {See the script} other {See the scripts}}"
    },
    "instructions": {
      "title": "Instructions for the agent"
    },
    "report": "Something off with this skill? <link>Open an issue</link>."
  },
  "install": {
    "title": "Install",
    "tabsLabel": "Choose your agent",
    "tabs": {
      "any": "Any agent",
      "claudeCode": "Claude Code",
      "opencode": "OpenCode",
      "codex": "Codex",
      "other": "Other agents"
    },
    "context": {
      "terminal": "terminal",
      "insideClaudeCode": "inside Claude Code",
      "prompt": "prompt"
    },
    "hints": {
      "any": "The skills CLI finds the agents on your machine and links the skill into each one. <code>-g</code> installs it for your user, across all projects.",
      "agent": "<code>-a {agentId}</code> installs it only for {agent}. <code>-g</code> makes it available in every project.",
      "claudeCode": "Call it as <code>/{name}</code>, or describe the problem and Claude picks it up.",
      "restart": "Restart the agent if the skill doesn't show up.",
      "other": "Same CLI, pointed at one agent."
    },
    "plugin": {
      "title": "Or as a Claude Code plugin",
      "hint": "Run these inside Claude Code, one at a time. Plugin skills are namespaced, so call it as <code>/{plugin}:{name}</code>, or describe the problem and Claude picks it up.",
      "step1": "1 · add the marketplace",
      "step2": "2 · install the plugin"
    },
    "copyLink": "Copy GitHub link",
    "linkCopied": "Link copied",
    "otherWays": "Other ways to install",
    "prompt": {
      "title": "Ask your agent",
      "hint": "Paste this into Claude Code, OpenCode, Codex or any agent with terminal access.",
      "text": "Install the agent skill at {url} for my user. If Node.js is available, run `{command}`. If not, copy that folder into the user-level skills directory you read from. Then tell me where it was installed and how to call it."
    },
    "manual": {
      "title": "Install by hand",
      "text": "Clone the repository and link the skill folder into your agent's skills directory.",
      "agentLabel": "Agent",
      "step1": "1 · clone",
      "step2": "2 · link",
      "tableCaption": "Skills folder by agent",
      "colAgent": "Agent",
      "colUser": "For your user",
      "colProject": "For one project",
      "projectHint": "A project folder sits at the root of that project and only applies there."
    },
    "try": {
      "title": "Try it without installing",
      "hint": "Hands the skill to a single Claude Code session. Nothing goes into your skills folder."
    },
    "update": {
      "title": "Update or remove",
      "updateLabel": "update",
      "removeLabel": "remove"
    }
  },
  "copy": {
    "copy": "Copy",
    "copied": "Copied",
    "failed": "Couldn't copy automatically. The text is selected so you can copy it yourself.",
    "context": {
      "command": "install command for {agent}",
      "anyAgent": "any agent",
      "pluginStep": "plugin step {step}",
      "manualStep": "manual step {step}",
      "prompt": "prompt for your agent",
      "try": "command to try it",
      "update": "update command",
      "remove": "remove command"
    },
    "announce": {
      "command": "Command copied",
      "link": "Link copied",
      "prompt": "Prompt copied"
    }
  }
}
```

`src/locales/pt/skills.json`:

```json
{
  "meta": {
    "listTitle": "Skills para agentes",
    "listDescription": "Skills de código aberto do Juliano Sirtori para Claude Code, OpenCode, Codex e outros agentes. Copie o comando e instale.",
    "detailTitle": "{name} · Agent skill",
    "ogListMeta": "Código aberto, para Claude Code, OpenCode e Codex",
    "ogDetailMeta": "Skill para agentes",
    "ogAlt": "Skills para agentes do Juliano Sirtori"
  },
  "list": {
    "kicker": "Código aberto · MIT",
    "title": "Skills para agentes",
    "lede": "Escrevi estas skills para o meu dia a dia com agentes de código. Cada uma é uma pasta com um SKILL.md, então funciona no Claude Code, no OpenCode, no Codex e em qualquer agente que leia esse formato. Escolhe uma e copia o comando de instalação.",
    "count": "{count, plural, one {# skill} other {# skills}}",
    "repoLink": "Ver o repositório",
    "footnote": "Cada skill daqui vem direto do repositório. Quando publico uma nova, ela aparece nesta página."
  },
  "card": {
    "updated": "Atualizada em {date}",
    "scripts": "{count, plural, one {# script} other {# scripts}}",
    "references": "{count, plural, one {# referência} other {# referências}}"
  },
  "filter": {
    "region": "Filtrar skills",
    "label": "Filtrar por nome ou palavra-chave",
    "clear": "Limpar filtro",
    "categories": "Categorias",
    "all": "Todas",
    "showing": "Mostrando {visible} de {total}",
    "noResults": "Nenhuma skill bate com \"{query}\".",
    "clearFilters": "Limpar filtros"
  },
  "state": {
    "empty": "Ainda não tem skill publicada por aqui. O repositório é público, dá pra acompanhar pelo GitHub.",
    "error": "O GitHub não respondeu agora. As skills continuam no repositório.",
    "detailError": "O GitHub não respondeu agora. Os arquivos da skill continuam no repositório.",
    "openRepo": "Abrir o repositório",
    "openFolder": "Abrir a pasta no GitHub",
    "retry": "Tentar de novo",
    "loading": "Carregando as skills"
  },
  "notFound": {
    "title": "Essa skill não está no catálogo.",
    "description": "Pode ter mudado de nome ou saído do repositório.",
    "link": "Ver todas as skills"
  },
  "detail": {
    "back": "Todas as skills",
    "viewOnGitHub": "Ver no GitHub",
    "newTab": "abre em uma nova aba",
    "languageNote": "A skill é escrita em inglês, igual no repositório.",
    "onThisPage": "Nesta página",
    "facts": {
      "label": "Dados da skill",
      "version": "Versão",
      "license": "Licença",
      "updated": "Atualizada em",
      "requirements": "Requisitos"
    },
    "triggers": {
      "title": "Quando o agente usa",
      "hint": "É esse texto que o agente lê para decidir quando carregar a skill."
    },
    "details": {
      "title": "Detalhes",
      "requirements": "Requisitos",
      "tools": "Ferramentas pré-aprovadas",
      "toolsHint": "O agente pode usar essas ferramentas sem te pedir permissão a cada vez.",
      "keywords": "Palavras-chave",
      "source": "Origem",
      "sourceValue": "{repo} no commit {sha}",
      "files": "Arquivos",
      "filesCount": "{count, plural, one {# arquivo} other {# arquivos}}",
      "showAllFiles": "Mostrar os {count} arquivos"
    },
    "scripts": {
      "notice": "{count, plural, one {Esta skill traz um script que roda na sua máquina. Dá uma lida nele antes de instalar.} other {Esta skill traz # scripts que rodam na sua máquina. Dá uma lida neles antes de instalar.}}",
      "link": "{count, plural, one {Ver o script} other {Ver os scripts}}"
    },
    "instructions": {
      "title": "Instruções para o agente"
    },
    "report": "Achou algo errado na skill? <link>Abre uma issue</link>."
  },
  "install": {
    "title": "Instalar",
    "tabsLabel": "Escolha o seu agente",
    "tabs": {
      "any": "Qualquer agente",
      "claudeCode": "Claude Code",
      "opencode": "OpenCode",
      "codex": "Codex",
      "other": "Outros agentes"
    },
    "context": {
      "terminal": "terminal",
      "insideClaudeCode": "dentro do Claude Code",
      "prompt": "prompt"
    },
    "hints": {
      "any": "O CLI skills encontra os agentes da sua máquina e coloca a skill na pasta de cada um. O <code>-g</code> instala para o seu usuário, em todos os projetos.",
      "agent": "O <code>-a {agentId}</code> instala só no {agent}. O <code>-g</code> deixa a skill disponível em todos os projetos.",
      "claudeCode": "Chame com <code>/{name}</code>, ou só descreva o problema que o Claude encontra a skill.",
      "restart": "Se a skill não aparecer, reinicia o agente.",
      "other": "O mesmo CLI, apontado para um agente só."
    },
    "plugin": {
      "title": "Ou como plugin do Claude Code",
      "hint": "Esses comandos rodam dentro do Claude Code, um de cada vez. Skill de plugin ganha prefixo: chame com <code>/{plugin}:{name}</code>, ou só descreva o problema que o Claude encontra a skill.",
      "step1": "1 · adicionar o marketplace",
      "step2": "2 · instalar o plugin"
    },
    "copyLink": "Copiar link do GitHub",
    "linkCopied": "Link copiado",
    "otherWays": "Outras formas de instalar",
    "prompt": {
      "title": "Pedir pro seu agente",
      "hint": "Cola isso no Claude Code, no OpenCode, no Codex ou em outro agente com acesso ao terminal.",
      "text": "Instala pra mim a skill que está em {url}, no nível do usuário. Se tiver Node.js, roda `{command}`. Se não tiver, copia essa pasta para o diretório de skills do usuário que você lê. No fim, me diz onde ela ficou e como chamar."
    },
    "manual": {
      "title": "Instalar na mão",
      "text": "Clona o repositório e cria um link da pasta da skill no diretório de skills do seu agente.",
      "agentLabel": "Agente",
      "step1": "1 · clonar",
      "step2": "2 · criar o link",
      "tableCaption": "Pasta de skills por agente",
      "colAgent": "Agente",
      "colUser": "Para o seu usuário",
      "colProject": "Para um projeto",
      "projectHint": "A pasta de projeto fica na raiz do projeto e só vale nele."
    },
    "try": {
      "title": "Testar sem instalar",
      "hint": "Passa a skill para uma sessão do Claude Code. Nada vai para a sua pasta de skills."
    },
    "update": {
      "title": "Atualizar ou remover",
      "updateLabel": "atualizar",
      "removeLabel": "remover"
    }
  },
  "copy": {
    "copy": "Copiar",
    "copied": "Copiado",
    "failed": "A cópia automática falhou. O texto ficou selecionado para você copiar.",
    "context": {
      "command": "comando de instalação ({agent})",
      "anyAgent": "qualquer agente",
      "pluginStep": "passo {step} do plugin",
      "manualStep": "passo {step} da instalação na mão",
      "prompt": "prompt para o agente",
      "try": "comando para testar",
      "update": "comando para atualizar",
      "remove": "comando para remover"
    },
    "announce": {
      "command": "Comando copiado",
      "link": "Link copiado",
      "prompt": "Prompt copiado"
    }
  }
}
```

`detail.languageNote` existe nas duas línguas para manter as chaves iguais, mas só é renderizada em `/pt`. As dicas `try` dependem da validação do `npx skills use` pelo dev; se o comportamento for outro, a copy muda junto.

Entradas em outros namespaces:

| Arquivo | Chave | EN | PT |
|---|---|---|---|
| `global.json` | `kbar.skills` | Agent skills | Skills para agentes |
| `global.json` | `kbar.skillsGroup` (Could) | Agent skills | Skills para agentes |
| `global.json` | `footer.label` | More | Mais |
| `global.json` | `footer.skills` | Skills | Skills |
| `global.json` | `header.skills` (futuro) | skills | skills |
| `home.json` | `stack.skillsNote` | I keep the agent skills I use open on GitHub. | As skills que uso com agentes de código ficam abertas no GitHub. |
| `home.json` | `stack.skillsLink` | See the skills | Ver as skills |
| `about.json` | `notes.learning.skills` | Some of this work is public: `<link>agent skills I wrote and use</link>`. | Parte disso é pública: `<link>skills para agentes que escrevi e uso</link>`. |
| `work-with-me.json` | `contributions.aiEvidence` | Igual ao `about` | Igual ao `about` |
| `playground.json` | `skillsHint` (Could) | agent skills live at /skills on the site. | skills para agentes ficam em /skills no site. |

### Pontos de alinhamento com produto

1. **Keywords saem do cabeçalho e vão para Detalhes.** O PRD coloca keywords no cabeçalho. A 1440×900 o comando universal fica acima da dobra com pouca folga; uma linha de keywords empurra o comando para baixo e não ajuda ninguém a decidir nada. Recomendação: cabeçalho com nome, resumo e fatos; keywords em Detalhes.
2. **AAA no light é mais rígido que o resto do site.** `text-accent` dá 6,0:1 e `text-fg-subtle` dá 4,7:1 no light, então o kicker em `text-accent`, a meta em `text-fg-subtle` e o item ativo do TOC (`text-accent`) não passam AAA. As partes novas usam só `text-fg` e `text-fg-muted` em repouso. Para o `TableOfContents` reaproveitado, recomendo trocar o item ativo para `text-fg font-medium`, mantendo `border-accent` (o blog ganha junto). Se produto preferir não mexer no blog, o requisito precisa virar "AAA para texto em repouso, AA para hover e estado ativo".
3. **"Skills" numa nav chamada "Comunidade".** Skills não são comunidade, e o leitor de tela anuncia esse rótulo. Recomendo trocar o `aria-label` do footer para "More" / "Mais" na mesma mudança.
4. **404 de skill com saída para o catálogo.** O PRD pede a `NotFoundPage` padrão. Mantenho o componente, com copy própria e link "See all skills" em vez de voltar para a home: quem chega por um link quebrado de skill quer ver as outras.
5. **Erro com HTTP 200 precisa de `noindex`.** Lista e detalhe em erro respondem 200 por decisão do PRD. Sem `robots: { index: false }` no `generateMetadata` desses casos, o buscador pode indexar "O GitHub não respondeu agora".
6. **Sem `loading.tsx` no detalhe.** Com streaming, um `notFound()` depois do shell sai com status 200. Como o PRD exige 404 de verdade, o detalhe não pode ter loading.
7. **Sem cópia rápida no card.** O limite de 2 interações já é atendido pelo detalhe, e copiar direto da lista pula o aviso de scripts. Se a métrica de instalação ficar abaixo de 25% em 60 dias, este é o primeiro experimento a rodar.
8. **Lembrar o agente (Should) tem custo de layout.** O painel do Claude Code é mais alto que o padrão, então restaurar a escolha depois da hidratação empurra o conteúdo de baixo para quem volta. O Lighthouse do CI roda com storage limpo e não percebe. Recomendo manter, trocar sem animação e medir CLS com um perfil que já escolheu Claude Code; se passar de 0,1, adiar.
9. **O `CopyCodeButton` não é usado.** O PRD fala em adaptá-lo, mas ele é código morto; o blog usa o `CodeBlock`, que já tem rótulos traduzidos. Recomendo apagar e criar o `CopyButton` genérico.
10. **O H1 do SKILL.md sai e os headings descem um nível.** Não está no PRD, mas sem isso a página teria dois H1 ("mac-cleanup" e "Mac Cleanup").
11. **Categoria aparece crua no PT** ("productivity"), em `font-mono`, como identificador. Traduzir exigiria um mapa mantido no site, contra o "zero edição no site". Se a convenção `metadata.summary-pt` sair, dá para discutir uma `metadata.category-pt` junto.
12. **O link do `/about` fica dentro de uma nota fechada.** "What I'm learning now" é um `<details>` fechado por padrão, então quem avalia só vê o link se abrir a nota. Aceito porque footer, palette, home e `/work-with-me` cobrem a descoberta, e abrir só essa nota desequilibraria a página.

### Respostas às perguntas para UX/UI

1. **Bloco de instalação**: abas (Any agent, Claude Code, OpenCode, Codex, Other agents) com o universal pré-selecionado; plugin dentro da aba Claude Code, um botão por passo; prompt, manual e os Coulds em "Outras formas de instalar", recolhidos; "Copiar link do GitHub" no cabeçalho da seção.
2. **Card**: linha editorial com categoria, versão, data, nome em mono, resumo, compatibilidade curta e contagem de scripts e references. Sem cópia rápida.
3. **1, 8 e 30 skills**: ver "Comportamento por volume" na Lista.
4. **Home, `/about` e `/work-with-me`**: ver Pontos de entrada.
5. **SKILL.md**: mesma `.prose` do blog, `CodeBlock` nos blocos de código, H1 removido e headings deslocados, TOC lateral (a partir de 4 `h2`) que mapeia a página inteira.
6. **Arquivos**: lista plana agrupada por pasta, com tamanho, cada arquivo linkando o GitHub.
7. **Pesos**: aviso de scripts médio (`Callout warn`, logo abaixo do comando); nota de idioma baixa (uma linha `text-fg-muted` com ícone, só em PT, abaixo do resumo).
8. **Vazio e erro**: ver Estados.
9. **OG**: ver OG images.
10. **Mobile**: rolagem horizontal no `pre`; o botão de copiar fica na barra e por isso está sempre ao alcance; abas roláveis indo até a borda da tela.

## Decisões finais (v1)

Fechamento entre produto e design antes do desenvolvimento. Onde esta seção e o resto do documento divergem, esta seção vale.

### Pontos de alinhamento resolvidos

| # | Tema | Decisão |
|---|---|---|
| 1 | Keywords no cabeçalho | Saem do cabeçalho e vão para Detalhes, como o design propõe |
| 2 | Contraste AAA | O requisito vira AA (4.5:1), que é o padrão do resto do site. As partes novas usam `text-fg` e `text-fg-muted` em repouso. O `TableOfContents` do blog não muda nesta entrega |
| 3 | `aria-label` do footer | Troca para "More" / "Mais" junto com a entrada de Skills |
| 4 | 404 de skill | `NotFoundPage` com copy própria e link para o catálogo |
| 5 | Estado de erro com HTTP 200 | `robots: { index: false }` no `generateMetadata` desses casos |
| 6 | `loading.tsx` no detalhe | Não existe, para o 404 sair com status 404 |
| 7 | Cópia rápida no card | Não entra. A cópia fica no detalhe |
| 8 | Lembrar o agente escolhido | Fica para depois da v1, pelo risco de CLS |
| 9 | `CopyCodeButton` | Removido por estar sem uso. Entra o `CopyButton` genérico com i18n |
| 10 | H1 do SKILL.md | Sai, e os headings descem um nível |
| 11 | Categoria no PT | Aparece crua, como identificador |
| 12 | Link no `/about` | Dentro da nota fechada, como o design propõe |

### Escopo da v1

- **Entra:** todos os itens Must Have (lista, detalhe, instalação, SEO, analytics, webhook) e, dos Should Have, o TOC no detalhe, a contagem de arquivos no card, o JSON-LD e a chamada discreta na home.
- **Fica para depois:** lembrar o agente escolhido e todos os itens Could Have.
- **Atalho na home (Must, pedido do Juliano):** um link fixo para `/skills` no `HomeRail`, abaixo da navegação das seções, visível no desktop e no mobile. A linha no bloco "Studying" do `TechStack` é complementar.
- **Header:** sem link na v1, conforme a IA do PRD. A promoção acontece quando houver 3 skills.
- **Token do GitHub:** é opcional no código. Sem token, o catálogo funciona e omite as datas de atualização. Em produção, o recomendado é configurar o token.
- **Pasta manual do Codex:** vale o que a documentação oficial do Codex disser. Se divergir do README do repo de skills, o README é corrigido lá numa mudança separada.
- **Webhook configurado:** o webhook de `push` do repo `julianosirtori/skills` aponta para `https://www.julianosirtori.dev/api/webhooks/skills`. O domínio sem `www` responde 308, e o GitHub não segue redirect na entrega. O segredo vai em `SKILLS_WEBHOOK_SECRET` na Vercel.
