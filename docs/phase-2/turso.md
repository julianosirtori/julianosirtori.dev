# Turso — configuração do projeto

## Estado conferido em 16/09/2026

| Ambiente          | Banco                           | Credencial da aplicação                 |
| ----------------- | ------------------------------- | --------------------------------------- |
| Desenvolvimento   | SQLite local: `file:./local.db` | Sem token remoto                        |
| Vercel Preview    | `julianosirtori-dev-preview`    | Token próprio, expira em **16/10/2026** |
| Vercel Production | `julianosirtori-dev-production` | Token próprio, expira em **15/12/2026** |

- Conta Turso: `julianosirtori`; grupo `julianosirtori-dev`, região `aws-us-east-1` (Virgínia), próxima das funções Vercel em `iad1`.
- Plano encontrado: `starter`, com cobranças excedentes desativadas. Cada banco remoto tem limite de 256 MB. Não houve mudança de plano.
- Projeto Vercel: `julianosirtori-dev`, time `julianosirtoris-projects`. A cópia local está vinculada por `.vercel/project.json`, ignorado pelo Git.
- `TURSO_DATABASE_URL` e `TURSO_AUTH_TOKEN` estão cadastradas separadamente em Preview e Production. Tokens são do tipo **Secret**, enviados por stdin e sem prefixo `NEXT_PUBLIC_`. Development tem URL de SQLite local.
- As duas migrações foram aplicadas nos três bancos. Cada um contém as 12 tabelas da aplicação e a tabela de controle de migrações. Nenhum dado real de usuário foi importado.
- Testes remotos confirmaram leitura, inserção, atualização e exclusão, com remoção dos dados de teste. Criação de tabela foi negada aos tokens da aplicação; acesso de um token ao banco do outro ambiente recebeu HTTP 401.
- Nenhum deploy foi disparado nesta configuração. Variáveis novas passam a valer em novos deployments. A ativação dos fluxos ainda exige os demais serviços do [guia operacional](operations.md).

O CLI Turso foi encontrado em `~/.turso/turso`. Caso o terminal não encontre `turso`, use `export PATH="$HOME/.turso:$PATH"` na sessão. Os exemplos abaixo pressupõem esse PATH e os CLIs autenticados.

## Desenvolvimento local

`.env.local` contém a URL local e está ignorado pelo Git, com permissão `600`. O arquivo de banco também está privado e ignorado. Para preparar uma nova cópia:

```bash
cp .env.example .env.local
chmod 600 .env.local
pnpm db:migrate
pnpm audience:status
```

Mantenha `TURSO_DATABASE_URL=file:./local.db` e `TURSO_AUTH_TOKEN=`. Não use este arquivo SQLite em funções Vercel, cujo armazenamento é efêmero.

## Migrações futuras nos bancos remotos

Os tokens usados pela aplicação permitem somente operações de dados: `data_read`, `data_add`, `data_update`, `data_delete`. Alterações de schema usam uma credencial temporária de administração emitida pelo Turso CLI. O CLI v1.0.32 aceita a expiração em dias; usamos `1d` para migrações.

Não execute migrações com o token restrito da Vercel. Para Preview, a partir da raiz do projeto:

```bash
(
  set -e
  TURSO_DATABASE_URL="$(turso db show julianosirtori-dev-preview --url)"
  TURSO_AUTH_TOKEN="$(turso db tokens create julianosirtori-dev-preview --expiration 1d)"
  export TURSO_DATABASE_URL TURSO_AUTH_TOKEN
  pnpm db:migrate
  pnpm audience:status
)
```

Para Production, substitua o nome por `julianosirtori-dev-production` e use somente migrações já validadas em Preview. O subshell limita as credenciais à execução; não use `set -x`, não imprima as variáveis e não grave o token administrativo na Vercel. As variáveis exportadas têm precedência sobre `.env.local`.

## Renovar os tokens da aplicação

Renove **antes das datas acima** e publique um novo deployment com o valor atualizado. Não há renovação automática configurada. Os valores de Secrets na Vercel não podem ser recuperados para leitura depois de gravados; emita um token novo para a rotação.

Preview:

```bash
(
  set -eo pipefail
  turso db tokens create julianosirtori-dev-preview \
    --expiration 30d \
    --permissions all:data_read,data_add,data_update,data_delete |
    vercel env update TURSO_AUTH_TOKEN preview --sensitive --yes
)
```

Production:

```bash
(
  set -eo pipefail
  turso db tokens create julianosirtori-dev-production \
    --expiration 90d \
    --permissions all:data_read,data_add,data_update,data_delete |
    vercel env update TURSO_AUTH_TOKEN production --sensitive --yes
)
```

Execute na cópia vinculada a este projeto. Depois do novo deploy, valide os fluxos do ambiente. Tokens antigos continuam válidos até expirar; `turso db tokens invalidate` pode afetar todos os tokens daquele banco e exige uma rotação coordenada.

## Inspeção sem expor credenciais

```bash
turso db list
turso plan show
vercel env ls preview
vercel env ls production
pnpm audience:status
```

O último comando usa o banco configurado no processo; com o `.env.local` atual, consulta o SQLite de desenvolvimento. Para contagens remotas, use o subshell da seção de migrações. Não execute `turso auth token` nem `turso db tokens create` sem redirecionar/capturar sua saída ao compartilhar um terminal ou logs.

Referências: [permissões Turso](https://docs.turso.tech/sdk/authorization/fine-grained-permissions), [tokens por banco](https://docs.turso.tech/cli/db/tokens/create), [Secrets na Vercel](https://vercel.com/docs/environment-variables/sensitive-environment-variables).
