# Fase 2 — segurança

## Proteções implementadas

- Banco e provedor Resend têm a barreira `server-only`: o Next.js rejeita imports desses módulos em componentes cliente. Segredos continuam sem prefixo `NEXT_PUBLIC_`.
- O contato exige a origem configurada, JSON válido e leitura limitada a 32 KiB. Há limites persistentes de 3 tentativas/hora por IP confiável e por e-mail normalizado, além de cotas globais diárias/mensais. Se o banco falhar, o envio é negado. O destinatário permanece fixo.
- `Origin` reduz abuso por outros sites no navegador; scripts podem forjar esse header. Os limites globais também restringem remetentes que variam IP/e-mail. Não há CAPTCHA nesta implementação.
- O webhook lê no máximo 64 KiB antes da verificação da assinatura Svix. A contagem usa bytes recebidos, inclusive em streaming, independentemente de `Content-Length`.
- Better Auth cifra os tokens de acesso/renovação GitHub com `account.encryptOAuthTokens`. A configuração recusa um `BETTER_AUTH_SECRET` menor que 32 caracteres. Use um segredo aleatório; tamanho sozinho não garante entropia.
- Respostas públicas do guestbook projetam somente campos autorizados. APIs continuam com validação de sessão/admin, consultas parametrizadas e erros sem credenciais.

Os limites usam janelas fixas. Na Vercel, apenas `x-vercel-forwarded-for` identifica o IP; fora dela há uma chave compartilhada até integrar um proxy confiável. Defaults e comportamento operacional estão em [operação e cotas](operations.md#envios-recuperação-e-cotas).

## Tokens OAuth existentes

Um banco novo não precisa de conversão. Se a versão anterior já recebeu logins:

1. Proteja o Preview/coloque o ambiente em manutenção para impedir logins concorrentes durante a atualização. Faça um backup privado do banco conforme a política de retenção.
2. Configure as credenciais do ambiente correto e o **mesmo `BETTER_AUTH_SECRET` original**. Não misture Preview e Production.
3. Execute `pnpm db:migrate` e `pnpm db:encrypt-oauth-tokens` usando a versão corrigida. O segundo comando cifra tokens GitHub antigos numa transação e informa somente o número de contas alteradas.
4. Repita `pnpm db:encrypt-oauth-tokens`: o resultado esperado é `encryptedAccounts: 0`. Valores já cifrados são autenticados com a chave original; chave incorreta, cifra inválida ou formato desconhecido cancela toda a transação.
5. Publique a versão corrigida, teste login/logout GitHub e libere o ambiente. Se houver falha de chave, recupere o segredo original; não substitua tokens cegamente.

A migração aceita tokens GitHub antigos de 40 caracteres hexadecimais, tokens atuais e cifras legadas/versionadas do Better Auth. O provedor GitHub usado aqui não emite `id_token`; a conversão trata `accessToken` e `refreshToken`. Backups anteriores continuam contendo seus dados originais: restrinja acesso e aplique a retenção definida.

Rotacionar `BETTER_AUTH_SECRET` exige preservar as chaves de leitura/converter os tokens conforme o mecanismo de rotação do Better Auth. Trocar somente a variável pode impedir sua leitura. [Criptografia de tokens](https://better-auth.com/docs/reference/options#encryptoauthtokens), [segurança do Better Auth](https://better-auth.com/docs/reference/security).

Os scripts usam `--conditions=react-server` para executar módulos protegidos fora do Next.js. Prefira os comandos `pnpm` versionados; ao executar Node diretamente num agendador, mantenha essa opção.

## Dependências — 15/09/2026

Next.js e pacotes correspondentes foram atualizados para 16.3.5, Sharp para 0.35.4 e Better Auth para 1.7.5. Também foram atualizados React Email, Vite/Vitest, PostCSS e dependências transitivas compatíveis.

Há três overrides restritos em `pnpm-workspace.yaml`: `@esbuild-kit/core-utils > esbuild`, `mdx-bundler > uuid` e `remark-mdx-frontmatter > toml`. Os pais ainda pedem versões antigas; os substitutos preservam as APIs usadas pelo projeto. Sua validação cobre a compilação MDX e os comandos Drizzle. Não há override global de OpenTelemetry entre versões principais.

A auditoria inicial de produção tinha **63 avisos**, incluindo 2 críticos. Após as atualizações, `pnpm audit --prod` e `pnpm audit` retornam **2 avisos: 1 alto e 1 moderado, nenhum crítico**. Não foram ocultados por uma lista de exceções:

| Dependência restante                      | Caminho / situação                                                                                                      |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `@opentelemetry/propagator-jaeger` 1.30.1 | Contentlayer → utilitários de telemetria → SDK 1.x. O aviso sobre processamento de header Jaeger tem correção em 2.9.0. |
| `@opentelemetry/core` 1.30.1              | Mesma árvore de telemetria do Contentlayer. O aviso sobre processamento de W3C Baggage tem correção em 2.8.0.           |

A versão mais recente do Contentlayer2 consultada, 0.5.8, ainda depende dessa árvore 1.x. Ela participa da compilação dos artigos locais; as APIs de contato, newsletter e banco não a importam. Isso reduz a exposição, mas não equivale a corrigir os avisos. A resolução completa exige atualizar/substituir a integração de telemetria ou o gerador de conteúdo e validar sua compatibilidade. Não processe conteúdo nem configuração de build de origem não confiável.

Referências: [Next.js/AVIF](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4), [Sharp/libheif](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c), [Jaeger](https://github.com/advisories/GHSA-45rx-2jwx-cxfr), [W3C Baggage](https://github.com/advisories/GHSA-8988-4f7v-96qf).

## Verificação e limites da revisão

Os testes de regressão usam banco libSQL local migrado, concorrência real no limitador, callback/sessão reais do Better Auth com somente a troca GitHub simulada, cifras autenticadas e assinaturas reais Svix. Nenhum e-mail real é enviado.

Validação local em 15/09/2026: lint, TypeScript, build e 62 cenários Chromium aprovados. O build com segredos fictícios foi inspecionado em 35 arquivos estáticos do navegador e 321 artefatos públicos HTML/RSC/body: nenhum marcador privado nem URL de banco de teste foi encontrado. Os pacotes de telemetria afetados não apareceram nos manifestos de arquivos das rotas inspecionados nesse build. A conversão AVIF → PNG com Sharp 0.35.4 também passou.

A revisão não constitui garantia de ausência de vulnerabilidades. A ativação ainda exige validar credenciais, isolamento dos ambientes, login real, entrega de e-mail, permissões e domínio no Preview. Nunca publique tokens, arquivos `.env` ou dumps de banco no PR.
