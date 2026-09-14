# GA4 — configuração e relatórios preparados

Propriedade existente: measurement ID `G-VNFLVEVSCC`. Código central: `src/lib/analytics.ts`; pageviews e leitura em `src/components/Audience/Analytics.tsx`. Não há acesso administrativo à propriedade nesta sessão: as configurações abaixo estão **preparadas, não aplicadas**.

## Configuração antes de ativar

1. Em Administrador → Fluxos de dados → Web → Medição otimizada, desative os pageviews por carregamento e mudanças de histórico (e as medições automáticas de formulários, pesquisa, scroll e download que sobrepõem os eventos próprios). `send_page_view:false` desativa o pageview automático no código. A instrumentação própria envia um evento por navegação do Next.js.
2. Desative coleta de dados fornecidos pelo usuário. Não adicione parâmetros de email, nome, mensagem, query, token ou ID de sessão. Não configurar User-ID com o login do guestbook.
3. Definições personalizadas, escopo evento: `language`, `route`, `location`, `content_id`, `action_id`, `result`, `progress`, `target_language`, `theme`, `active`. Evite cadastrar IDs de visitante. `result_count` é numérico; se necessário, criar métrica personalizada, unidade padrão.
4. Eventos principais: `newsletter_confirmed` e `generate_lead`. Contagem uma vez por evento. O código emite sucesso somente depois da resposta bem-sucedida do backend; confirmação repetida de inscrição já ativa não gera nova conversão.
5. Depois das configurações, definir `NEXT_PUBLIC_ANALYTICS_ENABLED=true` **somente em produção** e reconstruir. Desenvolvimento e testes não enviam dados. Para DebugView, usar o preview autorizado com a flag ativada e a extensão Google Analytics Debugger; removê-la depois. Nenhuma chave administrativa pertence ao frontend.

## Explorações a criar

| Nome               | Técnica       | Etapas / dimensões                                                                     | Métricas e filtros                                                                                             |
| ------------------ | ------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Artigo → inscrição | Funil aberto  | `article_view` → `newsletter_form_view` → `newsletter_submit` → `newsletter_confirmed` | Usuários ativos; decompor por `content_id`, `language`, `location`; sequência indireta, janela 14 dias         |
| Página → contato   | Funil aberto  | `page_view` → `contact_form_start` → `generate_lead`                                   | Usuários ativos; decompor pela página inicial/rota e idioma; janela 7 dias; tabela complementar de `cta_click` |
| Playground         | Formato livre | Linhas `action_id`; colunas `result`; filtro `event_name` = `playground_command`       | Contagem de eventos e usuários; tabela adicional `playground_game_start`; comparar idioma                      |

Confirmação ocorre em outra rota e pode acontecer em outro dispositivo: o funil de usuários/sessões não equivale à base de assinantes. Use a rota/ID no início do funil para atribuição; o banco mantém origem e artigo de inscrição como fonte operacional. Bloqueadores geram subcontagem.

## Contrato dos eventos

Todos recebem idioma, rota sanitizada e localização quando pertinente. `page_location` não contém query ou fragmento; referrer também é sanitizado. URLs administrativas e callbacks são excluídos. Nenhum parâmetro deriva do texto de formulário.

- Navegação: `navigation_click`, `cta_click`, `project_click`, `social_click`, `cv_download_click` (download direto, sem e-mail).
- Leitura: `article_view`, `article_read_progress` em 25/50/75/100, `article_read_complete` somente no fim do artigo com ≥30 segundos visíveis; `comments_open` carrega Giscus.
- Descoberta: `blog_search` após 800ms com quantidade de resultados, sem query; `blog_filter_change`, `command_palette_open`, `command_palette_select`.
- Newsletter: `newsletter_form_view` quando visível, `newsletter_submit`, `newsletter_confirmed`, `newsletter_error`.
- Guestbook: `guestbook_login_start`, `guestbook_login_success`, `guestbook_submit`, `guestbook_error`.
- Interação: `reaction_change` após persistência; `playground_command` usa só nome reconhecido e resultado, comandos desconhecidos são `unknown`; `playground_game_start`.
- Contato/preferências: `contact_form_start`, `generate_lead`, `contact_form_error`, `theme_change`, `language_change`.

## DebugView e rede

Navegar home → artigo → newsletter → voltar: um `page_view` por mudança, nenhum extra de histórico automático. Abrir confirmação com query e âncora: verificar que nenhum request GA contém os valores. Em admin e callback: nenhum evento. Rolar até o fim antes de 30s: sem conclusão; alternar aba oculta: tempo oculto não conta. Testar erro de Resend: sem `generate_lead`. Pesquisar texto e digitar comando com argumentos: rede contém apenas contagem/nome permitido. Bloquear GA no navegador: ações continuam funcionando.

Referências: [Pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views) e [validação de SPA](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications).
