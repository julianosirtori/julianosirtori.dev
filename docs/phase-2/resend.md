# Resend — configuração e ativação

## Estado em 16/09/2026

A configuração de Production está preparada na Vercel para o próximo deploy. O site publicado ainda responde `404` em `/api/webhooks/resend`; por isso o webhook permanece **desativado**. Nenhum e-mail foi enviado durante a configuração.

| Recurso                | Configuração                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| Domínio de envio       | `julianosirtori.dev`, verificado, região `sa-east-1`                                                 |
| Remetente              | `Notas do Juliano <website@julianosirtori.dev>`                                                      |
| Rastreamento Resend    | Aberturas e cliques desativados                                                                      |
| Origem Production      | `https://www.julianosirtori.dev`                                                                     |
| Segmento PT Production | `julianosirtori-dev-production-pt` — `c896072d-f5bb-4dcc-944e-1104b8886c25`                          |
| Segmento EN Production | `julianosirtori-dev-production-en` — `4e7630d9-885c-423d-9cf6-2c75b529fe48`                          |
| API key Production     | `julianosirtori-dev-production`, `full_access`, armazenada como Secret                               |
| Webhook Production     | `09e0b915-de74-4810-9421-981653d867f1`, desativado                                                   |
| Eventos do webhook     | `contact.updated`, `contact.deleted`                                                                 |
| Origem Preview         | `https://preview.julianosirtori.dev`, vinculada à branch `feat/phase-2-audience`                     |
| API key Preview        | `julianosirtori-dev-preview-contact`, somente envio por `julianosirtori.dev`, armazenada como Secret |

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

## 2. Resolver a limitação de segmentos do Preview

A conta permite **3 segmentos**. O segmento preexistente `General` e os dois novos segmentos de produção ocupam essa cota. A criação de segmentos exclusivos para Preview foi rejeitada pelo Resend. Nenhum segmento existente foi apagado.

O proprietário optou por manter o plano atual e deixar a newsletter de Preview pendente. Uma equipe Resend separada oferece isolamento real dos contatos; usar a mesma conta exige endereços exclusivos de teste, pois `unsubscribed` pertence ao contato global e pode afetar outras aplicações. Nunca reutilize endereços reais de assinantes em testes de cancelamento ou reinscrição.

O formulário de contato do Preview tem uma chave própria com `sending_access`, restrita a `julianosirtori.dev`, e cotas `CONTACT_DAILY_LIMIT=2` / `CONTACT_MONTHLY_LIMIT=20`. A chave antiga compartilhada com Development foi preservada somente em Development. Não foram configurados `NEWSLETTER_SECRET`, segmentos ou webhook em Preview: a newsletter retorna indisponibilidade antes de criar a inscrição. Quando houver capacidade para seus segmentos, configure a integração completa com uma chave `full_access` e segredos próprios.

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

Quando o Preview tiver seus recursos de newsletter, crie outro webhook em `https://preview.julianosirtori.dev/api/webhooks/resend`, com outro signing secret. Como esse domínio exige login Vercel, configure **Protection Bypass for Automation** para o provedor. Se usar o parâmetro `x-vercel-protection-bypass` na URL do Resend, trate a URL completa como segredo: não a publique em documentação, prints ou logs. A assinatura Resend continua obrigatória. [Bypass para automação](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation).

## 5. Pendências externas ao Resend

GitHub OAuth e `BETTER_AUTH_SECRET` ainda precisam de configuração para habilitar o guestbook. A newsletter usa `BETTER_AUTH_URL` como origem, mas não exige login GitHub. Consulte também [operação e validação antes do lançamento](operations.md) e [Turso](turso.md).
