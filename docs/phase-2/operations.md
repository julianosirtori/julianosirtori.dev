# Fase 2 — operação e ativação

## Entrega local e dependências externas

Implementados: newsletter PT/EN, confirmação explícita, fila persistente de envios, cancelamento, webhook assinado, guestbook GitHub moderado, reações persistentes, mural de três recomendações e instrumentação GA4. Home/artigos são estáticos e carregam os dados interativos pelo cliente. Sem configuração, os formulários indicam indisponibilidade e o conteúdo continua acessível.

Em 16/09/2026, os bancos Turso de Preview e Production foram criados e migrados, com credenciais distintas cadastradas como Secrets na Vercel. O desenvolvimento usa SQLite local. Nomes, vencimentos, permissões e comandos de migração/renovação estão no [guia Turso](turso.md).

O Resend de Production também está preparado: domínio verificado, segmentos PT/EN, chave própria e segredos na Vercel. O webhook está desativado até o deploy da rota. O plano limita a conta a três segmentos; o proprietário autorizou compartilhar os segmentos PT/EN com Preview, restringindo a newsletter a uma lista privada de endereços exclusivos de teste. O primeiro Preview foi publicado em [preview.julianosirtori.dev](https://preview.julianosirtori.dev/pt), com DNS validado, HTTPS e proteção por login Vercel. Recursos, cotas configuradas e passos restantes estão no [guia Resend](resend.md). Ainda faltam GitHub OAuth, validação real dos fluxos de envio e GA4. Nenhum e-mail foi enviado durante a configuração e os testes de publicação.

O canvas Superdesign foi criado em https://superdesign.dev/teams/8c9c9e2a-b917-4a10-bf51-11c45b8119dc/projects/e1643d9e-b8ca-41bd-87b4-544b55f27777. A geração remota foi bloqueada pela revisão automática por exigir autorização explícita para enviar fontes ao serviço. A interface local segue os layouts já definidos no plano. Os arquivos propostos para envio eram `.superdesign/design-system.md`, `src/app/globals.css` e `src/components/Footer/Footer.tsx`.

## Ambiente local

1. Copie `.env.example` para `.env.local` e preencha os valores necessários. Os comandos de operação carregam `.env.local`; CI usa variáveis de ambiente.
2. Use Node 22+ e `pnpm install --frozen-lockfile`.
3. Execute `pnpm db:migrate`, seguido de `pnpm dev`.
4. Para testes: `pnpm lint`, `pnpm test run`, `pnpm build`, `pnpm exec playwright test --project=chromium`.

`TURSO_DATABASE_URL=file:./local.db` usa libSQL local. Não use arquivo local na Vercel: as funções são efêmeras. Em Preview e Production, configure URLs `libsql://...` e tokens separados. Migrações ficam em `drizzle/`; novas alterações usam `pnpm db:generate`.

## Ativação de preview e produção

- Turso: banco e token por ambiente, aplicar `pnpm db:migrate` **antes** da publicação. Nos bancos remotos, use o [token administrativo temporário via CLI](turso.md#migrações-futuras-nos-bancos-remotos); as credenciais da aplicação não podem alterar o schema. O comando é versionado/idempotente e não roda automaticamente no build estático.
- GitHub OAuth: aplicação separada para desenvolvimento/preview/produção, callback `<BETTER_AUTH_URL>/api/auth/callback/github`. Configure um domínio de preview estável; não aceite origens arbitrárias. Use apenas o ID numérico da conta do proprietário em `ADMIN_GITHUB_ID`, nunca login, nome ou e-mail. Sessão independente do Giscus. Entre pelo guestbook e acesse `/<lang>/admin/guestbook`.
- Resend: domínio de envio verificado, remetente autorizado em `NEWSLETTER_FROM`, API key com acesso a Contacts/Segments e envio. Crie dois segmentos exclusivos e configure `RESEND_SEGMENT_PT` / `RESEND_SEGMENT_EN`. O contato só é ativado após confirmação; a troca de idioma exige confirmação e remove o segmento anterior.
- Webhook: `<origem>/api/webhooks/resend`, eventos `contact.updated` e `contact.deleted`, segredo de assinatura em `RESEND_WEBHOOK_SECRET`. Eventos atrasados anteriores à confirmação e repetições não anulam consentimento mais recente. Desativar um contato manualmente no Resend também sincroniza pelo webhook.
- Segredos: `BETTER_AUTH_SECRET` e `NEWSLETTER_SECRET`, independentes e aleatórios com pelo menos 32 caracteres. Nenhum usa prefixo `NEXT_PUBLIC_`. Rotacionar o segundo invalida links de cancelamento e payloads pendentes: drene a fila antes de uma rotação planejada.
- Tokens de acesso/renovação GitHub são cifrados pelo Better Auth com `BETTER_AUTH_SECRET`. Para um banco que já recebeu logins na versão anterior, execute `pnpm db:encrypt-oauth-tokens` conforme o [procedimento de migração](security.md#tokens-oauth-existentes). Não troque o segredo sem planejar a migração dos tokens.
- Defina `BETTER_AUTH_URL` com a origem exata: `https://www.julianosirtori.dev` em Production e `https://preview.julianosirtori.dev` em Preview. O domínio de produção sem `www` redireciona para o endereço final. Requisições mutáveis exigem mesma origem. Na Vercel, o limitador usa `x-vercel-forwarded-for` sobrescrito pela plataforma; qualquer outra hospedagem precisa fornecer uma origem de IP confiável.
- Atualize os segredos do workflow de deploy e aplique a migração antes de permitir o CD existente em main. Não fazer merge até validar os fluxos reais no preview.

## Envios, recuperação e cotas

`pnpm audience:status` mostra contagens de inscrições, etapas de envio e recados pendentes, sem dados pessoais.

`pnpm newsletter:retry` processa até 100 etapas pendentes, sequencialmente, sem imprimir e-mails, tokens ou mensagens. Rode novamente para etapas de boas-vindas que tenham sido criadas durante o lote. Execute pelo menos a cada minuto com um executor autorizado se precisar manter a meta de recuperação de um minuto; a requisição normal já tenta confirmação/boas-vindas imediatamente. Não foi adicionado serviço pago ou cron remoto nesta entrega.

`deliveries` registra `confirmation`, `activate`, `welcome`, `unsubscribe`, primeira tentativa, aceitação, ID do provedor e estado. Payloads de e-mail pendentes são cifrados com AES-256-GCM; tokens de confirmação são aleatórios e armazenados somente como hash na tabela de confirmações. Payloads cifrados são apagados após aceitação/cancelamento. Tokens duram 24h. GET nunca confirma nem cancela: o usuário precisa pressionar o botão da página.

As transações de escrita serializam cancelamento, confirmação e processamento. O provedor recebe uma chave de idempotência estável por envio. Se houver resultado ambíguo e a primeira tentativa tiver mais de 23 horas, o envio passa para `review`: não é reenviado automaticamente, pois o Resend retém chaves por 24h. Confira o log do provedor; marque como `sent` apenas com evidência de aceitação, ou solicite uma nova confirmação após expiração. Não resete automaticamente chaves de envios ambíguos.

Em falha de ativação, o consentimento fica `confirmed` até reprocessar. Falha de boas-vindas não desfaz uma inscrição ativa. A meta de um minuto é uma meta operacional, não uma garantia de entrega de e-mail. Monitore disponibilidade, fila e latência dos serviços. Transações com chamadas externas podem precisar de reprocessamento em caso de timeout do Turso.

Newsletter: até 80 novos envios/dia e 2.400/mês (`NEWSLETTER_DAILY_LIMIT` / `NEWSLETTER_MONTHLY_LIMIT`). Contato: até 20 tentativas/dia e 600/mês (`CONTACT_DAILY_LIMIT` / `CONTACT_MONTHLY_LIMIT`), além de 3 por hora por IP confiável e por e-mail normalizado. As cotas são persistentes, usam janelas fixas e reservam capacidade antes de chamar o provedor; tentativas que falham também consomem a reserva. Erro do banco impede o envio. A soma padrão é 100/dia e 3.000/mês: reduza os limites se precisar reservar capacidade do provedor para broadcasts, testes e novas tentativas. Confira as cotas efetivas no painel; não há upgrade automático. Cancelamentos e sincronização não consomem cota de envio. Meta de 500 assinantes e teto conjunto de US$20/mês mantidos; acompanhe semanalmente contatos, envios, armazenamento, operações e fatura. A cota de contatos não é estimada a partir do GA.

Na configuração real de Production, os limites foram reduzidos para **60/dia e 1.800/mês na newsletter**, mais **10/dia e 300/mês no contato**, reservando capacidade para outros usos da conta compartilhada. Preview tem **2/dia e 20/mês para contato**, mais **6/dia e 60/mês para newsletter**, restrita aos endereços de teste autorizados. Esses valores na Vercel substituem os padrões acima após o próximo deploy.

O contato exige `Origin` igual a `BETTER_AUTH_URL`, JSON e corpo de até 32 KiB, mantendo o destinatário fixo. Responde 403 para origem inválida, 415 para outro formato, 413 para corpo excessivo, 400 para dados inválidos, 429 para limite e 503 se o controle persistente estiver indisponível. A verificação de origem protege o navegador, mas pode ser imitada por bots; os limites por remetente e globais restringem os envios. Fora da Vercel, o código agrupa requisições na chave `local` até haver uma integração explícita com proxy confiável.

Edições: escrever no painel Resend, selecionar **somente** o segmento do idioma correspondente e incluir o cancelamento nativo em cada broadcast. As boas-vindas transacionais usam o link próprio, que atualiza o contato como `unsubscribed` no Resend. Nunca envie a primeira edição automaticamente como parte do deploy.

## Conteúdo pendente

Três recomendações já publicadas e autorizadas pelo plano foram preservadas integralmente, em seus idiomas originais. Não há traduções inventadas. Avatar com iniciais porque não há fotos autorizadas. Para acrescentar conteúdo, preencher `src/data/testimonials.ts` e definir `publicationAuthorized` apenas depois da permissão. Fotos exigem também `photoAuthorized`. **Faltam dois depoimentos e suas permissões** para a meta editorial de cinco.

Pautas preparadas em `editorial.md`. A primeira edição não precisa ser enviada nesta fase.

## Validação real antes do lançamento

- Inscrição PT e EN; verificar remetente, links, idioma, consentimento e segmentação; confirmação repetida e expirada.
- Cancelar no site e no link nativo de broadcast; verificar webhook e banco. Reinscrever com nova confirmação.
- Simular indisponibilidade do Resend no preview e reprocessar sem duplicar a mensagem aceita.
- Login GitHub em dois dispositivos, publicar recado, verificar invisibilidade antes da moderação; aprovar/rejeitar/retirar e conferir log. Confirmar negação a outra conta GitHub.
- Reações no mesmo slug PT/EN, recarregar, remover e verificar agregado. Importação local preserva somente escolhas; nunca totais antigos.
- DebugView e explorações conforme `analytics.md`; não registrar e-mails, mensagens, pesquisa, argumentos de terminal ou tokens.
- Revisão visual PT/EN, claro/escuro, foco e leitor de tela. Guardar medianas de três auditorias Lighthouse do estado anterior e do preview. Meta: performance ≥90, acessibilidade ≥95, regressão ≤2 pontos. Sem uma mediana anterior comparável, não afirmar ausência de regressão.

## Referências de implementação

- Drizzle/libSQL: https://orm.drizzle.team/docs/sqlite/connect-turso
- Better Auth/Drizzle: https://better-auth.com/docs/adapters/drizzle
- GitHub OAuth: https://better-auth.com/docs/authentication/github
- Resend Contacts: https://resend.com/docs/api-reference/contacts/create-contact
- Segmentos: https://resend.com/docs/api-reference/contacts/add-contact-to-segment
- Idempotência: https://resend.com/docs/dashboard/emails/idempotency-keys
- Webhooks: https://resend.com/docs/webhooks/event-types
