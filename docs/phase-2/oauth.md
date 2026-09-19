# GitHub OAuth no Preview

## Configuração em 17/09/2026

O projeto usa Better Auth com GitHub para autenticar no guestbook. O Preview tem banco e credenciais próprios.

| Configuração               | Valor / estado                                                                |
| -------------------------- | ----------------------------------------------------------------------------- |
| Projeto Vercel             | `julianosirtori-dev`, time `julianosirtoris-projects`                         |
| Ambiente                   | Preview                                                                       |
| Domínio                    | `https://preview.julianosirtori.dev`                                          |
| Branch do domínio          | `feat/phase-2-audience`                                                       |
| `BETTER_AUTH_URL`          | `https://preview.julianosirtori.dev`, confirmado na Vercel                    |
| `NEXT_PUBLIC_LOCAL_DOMAIN` | `https://preview.julianosirtori.dev`, confirmado na Vercel                    |
| `BETTER_AUTH_SECRET`       | Gerado com 48 bytes aleatórios e cadastrado como Secret exclusivo de Preview  |
| `ADMIN_GITHUB_ID`          | `13910051`, confirmado pela API autenticada como `julianosirtori`             |
| Aplicativo GitHub          | `Juliano Site Preview`, slug `juliano-site-preview`, App ID `4972859`         |
| `GITHUB_CLIENT_ID`         | Cadastrado em Preview como Config; identidade do aplicativo validada pela API |
| `GITHUB_CLIENT_SECRET`     | Cadastrado em Preview como Secret                                             |

Não rotacione `BETTER_AUTH_SECRET` em cada deploy: ele também protege os tokens OAuth persistidos. Consulte [segurança e migração de tokens](security.md#tokens-oauth-existentes).

## Aplicativo no GitHub

O proprietário criou um **GitHub App**, compatível com o provedor GitHub do Better Auth. Ele pertence à conta `julianosirtori`; a API autenticada confirmou a identidade usando a chave privada fornecida. A chave `.pem` serve para autenticar o aplicativo na API e não é usada pelo login do site nem foi cadastrada na Vercel.

- Application name: `Juliano Site Preview`
- Homepage URL: `https://preview.julianosirtori.dev`
- Authorization callback URL: `https://preview.julianosirtori.dev/api/auth/callback/github`

Em [Permissions & events](https://github.com/settings/apps/juliano-site-preview/permissions), mantenha **Account permissions → Email addresses → Read-only**. O proprietário confirmou ter salvo essa permissão e o callback acima nas [configurações do aplicativo](https://github.com/settings/apps/juliano-site-preview). A consulta `GET /app` retornou `permissions: {}` mesmo após essa confirmação; portanto, ela não foi usada como prova de que a leitura de e-mail está habilitada. O login real foi validado após o tratamento de e-mail ausente descrito abaixo.

O Client ID e o Client Secret foram lidos do arquivo local indicado pelo proprietário e enviados à Vercel por stdin, sem imprimir seus valores. O endpoint OAuth do GitHub respondeu `bad_verification_code` a uma tentativa com código deliberadamente inválido, sem erro de credenciais e sem emitir token de usuário.

### E-mail ausente no login

O primeiro login real retornou `email_not_found`. O log do callback confirmou que o provedor não forneceu um e-mail. O Better Auth 1.7.5 já consulta `/user/emails` além do perfil público; ainda assim, esse fluxo chegou sem endereço.

O guestbook autentica pela identidade GitHub, e a autorização administrativa compara o ID numérico da conta. Quando o provedor não entrega um e-mail, `mapProfileToUser` agora preenche `<id-numérico>@github.placeholder.invalid`, com `emailVerified: false`. É um identificador interno sem caixa de entrada, não um contato para envio. Quando o GitHub fornece um e-mail real, o endereço e seu estado de verificação são preservados. O vínculo automático entre contas continua desabilitado.

Um teste de regressão reproduziu a falha com perfil sem e-mail e resposta `403` de `/user/emails`; após a correção, o callback completa o login e cria a sessão com a identidade GitHub correta. Outro teste confirma a preservação do endereço privado verificado retornado pela API. Esse tratamento segue a [orientação do Better Auth para provedores sem e-mail](https://better-auth.com/docs/concepts/oauth#handling-providers-without-email).

Para um novo ambiente, use um aplicativo e segredos próprios. Os comandos para cadastrar credenciais nos prompts são:

```bash
vercel env add GITHUB_CLIENT_ID preview --no-sensitive
vercel env add GITHUB_CLIENT_SECRET preview --sensitive
```

Não coloque o client secret em argumentos de comandos, documentação ou mensagens. Se as variáveis já existirem, confira a configuração antes de usar `vercel env update`.

## Publicação e validação

As credenciais foram publicadas inicialmente no deployment `dpl_J4ac2K4RKWDrG3DNUSaRkGeMRRwM`, com a versão já em Preview, commit `407385f623e3f8490d8fd594b8e3b98d1271f0fb`.

A correção de `email_not_found` foi publicada no deployment `dpl_5FAFHpzAAsHJhk6TZz5zJcKjm3Yw` (`julianosirtori-bvev8t73b-julianosirtoris-projects.vercel.app`). O código publicado partiu de uma cópia isolada desse commit, acrescida apenas da alteração de autenticação e seus testes de regressão. O build e a verificação TypeScript passaram. A API Vercel confirmou que `preview.julianosirtori.dev` aponta para esse deployment.

O proprietário repetiu o login em `/pt/guestbook` e confirmou que **o login e o painel `/pt/admin/guestbook` funcionaram** após a correção. O fluxo completo de autenticação e acesso administrativo está validado em Preview.

Em futuras alterações de variáveis, publique um novo deployment e confirme o domínio fixo, seguindo o [procedimento de alias](resend.md#3-dns-do-preview-validado).

Verificações remotas após a publicação:

- `/pt/guestbook`: `200`.
- `/api/auth/get-session` sem sessão: `200` com `null`; deixou de retornar `503`.
- `/api/guestbook/session` e `/api/admin/guestbook` sem sessão: `401`.
- Início do OAuth: `200`, com o Client ID correto e callback `https://preview.julianosirtori.dev/api/auth/callback/github`.
- Cookie de estado OAuth com `Secure`, `HttpOnly` e `SameSite=Lax`.
- Origem externa em requisição com cookie: `403 INVALID_ORIGIN`. O Better Auth verifica a origem dessas requisições; uma chamada de CLI sem cookies não reproduz essa condição.
- Callback externo: `403 INVALID_CALLBACK_URL`.

Roteiro de validação:

1. `GET /api/auth/get-session` sem sessão deve responder `200` com `null`.
2. `POST /api/auth/sign-in/social`, com a origem de Preview e o provedor `github`, deve gerar uma URL de autorização do GitHub com o client ID cadastrado e o callback exato acima.
3. Requisições com cookies e origem externa devem ser rejeitadas, assim como callbacks externos. Os cookies OAuth devem usar HTTPS.
4. No navegador, autentique primeiro na proteção Vercel, abra `/pt/guestbook` e entre com GitHub. Confirme o retorno ao guestbook e a sessão.
5. A conta `julianosirtori` deve acessar `/pt/admin/guestbook`; outra conta não deve receber acesso administrativo.

Validação local da correção: `pnpm lint` aprovado e `pnpm test run` com **147 testes passando em 24 arquivos**. Os 8 testes de autenticação e autorização incluem o provedor GitHub real com respostas HTTP simuladas sem e-mail, callback, persistência cifrada e restrição administrativa. O login real e o acesso administrativo foram confirmados pelo proprietário no navegador. O teste com outra conta real continua sendo parte do roteiro de lançamento; a rejeição por ID incorreto já é coberta pelos testes automatizados.

Referências: [cadastro do OAuth App no GitHub](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app), [provedor GitHub do Better Auth](https://better-auth.com/docs/authentication/github).
