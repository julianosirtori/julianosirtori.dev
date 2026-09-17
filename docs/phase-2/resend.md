# Resend — configuração e ativação

## Estado em 17/09/2026

A configuração de Production está preparada na Vercel para o próximo deploy. O site publicado ainda responde `404` em `/api/webhooks/resend`; por isso o webhook permanece **desativado**. Nenhum e-mail foi enviado durante a configuração.

| Recurso                | Configuração                                                                     |
| ---------------------- | -------------------------------------------------------------------------------- |
| Domínio de envio       | `julianosirtori.dev`, verificado, região `sa-east-1`                             |
| Remetente              | `Notas do Juliano <website@julianosirtori.dev>`                                  |
| Rastreamento Resend    | Aberturas e cliques desativados                                                  |
| Origem Production      | `https://www.julianosirtori.dev`                                                 |
| Segmento PT Production | `julianosirtori-dev-production-pt` — `c896072d-f5bb-4dcc-944e-1104b8886c25`      |
| Segmento EN Production | `julianosirtori-dev-production-en` — `4e7630d9-885c-423d-9cf6-2c75b529fe48`      |
| API key Production     | `julianosirtori-dev-production`, `full_access`, armazenada como Secret           |
| Webhook Production     | `09e0b915-de74-4810-9421-981653d867f1`, desativado                               |
| Eventos do webhook     | `contact.updated`, `contact.deleted`                                             |
| Origem Preview         | `https://preview.julianosirtori.dev`, vinculada à branch `feat/phase-2-audience` |
| API key Preview        | `julianosirtori-dev-preview-newsletter`, `full_access`, armazenada como Secret   |

O domínio sem `www` redireciona para `www`. Use a origem final em `BETTER_AUTH_URL`, `NEXT_PUBLIC_LOCAL_DOMAIN`, no callback GitHub e no endpoint de produção do webhook, evitando redirecionamentos e falhas na validação de `Origin`.

## 1. Credenciais e cotas

Na Vercel, projeto `julianosirtori-dev`, ambiente **Production**:

- Secrets: `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET` e `NEWSLETTER_SECRET`, com valores independentes e sem prefixo `NEXT_PUBLIC_`.
- Configuração: `NEWSLETTER_FROM`, `RESEND_SEGMENT_PT`, `RESEND_SEGMENT_EN`, `BETTER_AUTH_URL` e `NEXT_PUBLIC_LOCAL_DOMAIN`.
- Newsletter: `NEWSLETTER_DAILY_LIMIT=60`, `NEWSLETTER_MONTHLY_LIMIT=1800`.
- Contato: `CONTACT_DAILY_LIMIT=10`, `CONTACT_MONTHLY_LIMIT=300`.

As cotas foram reduzidas em relação aos padrões do código para reservar capacidade para os demais projetos, testes e broadcasts. São limites deste banco/aplicação, não da conta Resend inteira. O endpoint beta `/usage` retornou `404` nesta conta; confira as cotas efetivas e a fatura em **Resend → Settings → Usage**. Não houve alteração de plano.

`full_access` é necessário para ler e atualizar Contacts e associá-los aos segmentos; `sending_access` permite apenas envio. O proprietário autorizou esse escopo. O Resend não restringe uma chave `full_access` a um domínio ou segmento: ela alcança os demais recursos da conta. Chaves próprias facilitam revogação e identificação, mas não isolam projetos. As chaves antigas de outros projetos foram preservadas. [Permissões Resend](https://resend.com/docs/api-reference/api-keys/create-api-key).

Os Secrets da Vercel não podem ser lidos de volta por `env pull` ou `env run`. Não copie a chave de produção para `.env.local`. Para trocar uma chave, crie a substituta, salve-a por entrada padrão no CLI, faça novo deploy e valide antes de revogar a anterior. [Secrets na Vercel](https://vercel.com/docs/environment-variables/sensitive-environment-variables).

## 2. Newsletter de Preview restrita a testes

A conta permite **3 segmentos**: `General` e os dois segmentos PT/EN de Production. O proprietário autorizou usar esses mesmos segmentos no Preview, mantendo o plano atual, com restrição a endereços exclusivos de teste. O banco Turso e os segredos continuam próprios de cada ambiente.

Na Vercel, **Preview**:

- `RESEND_API_KEY`: chave própria `julianosirtori-dev-preview-newsletter`, com `full_access` para contatos e segmentos.
- `NEWSLETTER_SECRET` e `RESEND_WEBHOOK_SECRET`: novos Secrets exclusivos do Preview.
- `NEWSLETTER_ALLOWED_EMAILS`: Secret com a lista de endereços de teste autorizados, separados por vírgula. Não publique a lista; ela fica somente no servidor.
- `RESEND_SEGMENT_PT` / `RESEND_SEGMENT_EN`: os mesmos IDs de Production, mostrados na tabela acima.
- Newsletter: `NEWSLETTER_DAILY_LIMIT=6`, `NEWSLETTER_MONTHLY_LIMIT=60`. Contato: `CONTACT_DAILY_LIMIT=2`, `CONTACT_MONTHLY_LIMIT=20`.

O servidor exige a lista em `VERCEL_ENV=preview`. Endereços fora dela recebem `403 newsletter_test_recipient` antes de escrever uma inscrição ou consumir o limitador. A comparação usa o endereço completo, ignorando apenas espaços nas extremidades e maiúsculas/minúsculas; não aceita curingas nem remove aliases `+...`. O provedor também verifica o destinatário antes de enviar, ativar ou cancelar contatos, cobrindo reprocessamentos. O webhook ignora eventos de outros contatos da conta.

A chave anterior `julianosirtori-dev-preview-contact` fica disponível aos deployments antigos. A configuração de Development foi preservada. Em Production, mantenha `NEWSLETTER_ALLOWED_EMAILS` ausente para inscrições públicas.

A falha original de Preview foi confirmada nos logs como `503` em `/api/newsletter/subscribe`: faltavam `NEWSLETTER_SECRET`, os IDs dos segmentos e uma chave capaz de gerenciar contatos. Agora a inscrição verifica a configuração antes de criar a fila. Erros de configuração registram apenas os nomes das variáveis ausentes, sem valores, endereços ou tokens.

Os contatos e o estado `unsubscribed` continuam globais na conta Resend. Nunca use endereços de outros projetos nos testes. Ao preparar broadcasts de produção, exclua os contatos de teste dos destinatários, pois eles pertencem aos segmentos compartilhados. Uma equipe Resend separada oferece isolamento real.

## 3. DNS do Preview validado

O domínio foi cadastrado na Vercel e vinculado à branch do PR. O proprietário criou o registro na Cloudflare; a consulta DNS confirmou o CNAME abaixo, e a Vercel retornou `verified=true`, `configuredBy=CNAME` e `misconfigured=false`, sem conflitos.

Registro cadastrado em **Cloudflare → julianosirtori.dev → DNS → Records**:

| Campo        | Valor                                 |
| ------------ | ------------------------------------- |
| Type         | `CNAME`                               |
| Name         | `preview`                             |
| Target       | `7d854a448861b773.vercel-dns-017.com` |
| Proxy status | DNS only, nuvem cinza                 |
| TTL          | Auto                                  |

O DNS e a verificação de propriedade estão concluídos. O primeiro Preview foi publicado com o commit `c499c43`, deployment `dpl_CKNsCHbBEEmVhgrwPu5NQF2Szg5E`, com build aprovado usando Node 24 e pnpm 11.0.9. O domínio [preview.julianosirtori.dev](https://preview.julianosirtori.dev/pt) atende por HTTPS e exige login Vercel. O build recebeu somente arquivos versionados, com `ENABLE_EXPERIMENTAL_COREPACK=1` e `NEXT_PUBLIC_ANALYTICS_ENABLED=false` em Preview.

Para próximos deployments, mantenha a origem e reaplique o alias se necessário. Neste cadastro, `vercel alias set` falhou na consulta ao domínio da equipe; o vínculo foi concluído pela API oficial usando o domínio já verificado no projeto:

```bash
vercel api /v2/deployments/ID_DO_NOVO_PREVIEW/aliases \
  --scope julianosirtoris-projects \
  --method POST \
  --raw-field alias=preview.julianosirtori.dev
```

[API de aliases Vercel](https://vercel.com/docs/rest-api/aliases/assign-an-alias).

Verificações após o deploy, usando o acesso autenticado do CLI Vercel:

- Páginas `/pt`, `/en`, `/pt/guestbook` e `/pt/newsletter`: `200`.
- Consultas de reações e guestbook no Turso: `200`.
- Contato: origem inválida rejeitada com `403`; payload inválido rejeitado com `400`, sem envio.
- Sessão GitHub e inscrição na newsletter: `503 unavailable`, conforme as configurações ainda pendentes.
- Acesso sem sessão Vercel: redirecionamento para o login. Nenhum segredo de bypass foi publicado.

A proteção Vercel foi ajustada para **Standard Protection** (`prod_deployment_urls_and_all_previews`), cobrindo também o domínio personalizado de Preview. Os navegadores de teste precisam autenticar na Vercel. Os domínios públicos de produção continuam públicos. [Proteção dos deployments](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication).

## 4. Ativar o webhook após o deploy

1. Faça o deploy da implementação com as variáveis acima. Alterar variáveis não atualiza um deployment existente.
2. Confirme que `https://www.julianosirtori.dev/api/webhooks/resend` não redireciona e que um POST sem assinatura recebe `400`, em vez de `404` ou `503`.
3. Ative o webhook de produção pelo CLI autenticado:

   ```bash
   resend webhooks update 09e0b915-de74-4810-9421-981653d867f1 --status enabled
   ```

4. Com um endereço de teste autorizado, complete inscrição, confirmação e cancelamento. Confira os segmentos e a entrega `200` no histórico do webhook. Não use contatos pertencentes a outros projetos.
5. Valide também repetição do evento e assinatura inválida; monitore falhas antes do lançamento.

O webhook recebe eventos de contatos da conta; a aplicação só altera assinantes que existem no seu banco. A assinatura Svix permanece obrigatória. Não habilite o webhook enquanto a rota estiver ausente. [Webhooks Resend](https://resend.com/docs/webhooks/introduction).

O webhook de Preview foi preparado em `https://preview.julianosirtori.dev/api/webhooks/resend`, ID `f2095e47-95d4-4609-80c2-9bd5e7b0abba`, com assinatura própria e os eventos `contact.updated` e `contact.deleted`. O endpoint salvo no Resend inclui um segredo de **Protection Bypass for Automation** exclusivo dessa integração. A URL completa é privada; não a copie para documentação, prints ou logs. A assinatura Resend continua obrigatória.

Mantenha o webhook desativado até publicar a versão que restringe os destinatários e conferir que um POST sem assinatura recebe `400`. Ative-o após essa verificação. Para um executor externo de reprocessamento do banco de Preview, configure também `VERCEL_ENV=preview` e a mesma lista privada `NEWSLETTER_ALLOWED_EMAILS`. [Bypass para automação](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation).

## 5. Pendências externas ao Resend

Em Preview, `BETTER_AUTH_SECRET` e `ADMIN_GITHUB_ID` estão cadastrados; faltam as credenciais do OAuth App GitHub e um novo deployment para habilitar o guestbook. Os campos do aplicativo e a validação estão no [guia OAuth](oauth.md). A newsletter usa `BETTER_AUTH_URL` como origem, mas não exige login GitHub. Consulte também [operação e validação antes do lançamento](operations.md) e [Turso](turso.md).
