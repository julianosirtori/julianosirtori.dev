# Validação da fase 2

Validação local em 14/09/2026. Serviços de e-mail simulados, banco libSQL de teste, sem envios reais e sem publicação na Vercel.

## Verificações

- ESLint com zero warnings; TypeScript; build Next.js/Turbopack.
- 117 testes unitários/de integração: confirmação, expiração, repetição, idioma, falhas e reprocessamento, cancelamento e reinscrição, assinatura de webhook, identidade administrativa, OAuth com schema real sem chamadas externas, moderação, paginação, reações concorrentes, migração local e contrato GA.
- 61 cenários Playwright Chromium aprovados: navegação existente, PT/EN, formulários, responsividade e temas, confirmação explícita, preservação do token na troca de idioma, rascunhos locais, administração privada, reações persistentes entre contextos independentes e totais compartilhados PT/EN. O último cenário passou em execução isolada após corrigir a capitalização do seletor de idioma no teste; os outros 60 passaram na execução conjunta.
- Migrações aplicadas no banco local. Comandos de status e reprocessamento executados com fila vazia, sem credenciais de envio.

## Revalidação em desenvolvimento no WSL

Após o relato de 404, a resposta mostrava a rota `[...rest]` no lugar do artigo, embora os dados estivessem presentes. Desativar `turbopackFileSystemCacheForDev` restaurou as rotas. Todas as 29 URLs de artigos publicados retornaram HTTP 200 com conteúdo. A suíte do blog passou em 15 cenários: 13 na execução inicial e dois na execução complementar, incluindo a regressão de acessar uma rota inexistente antes de um artigo PT/EN. A navegação repetida havia excedido o limite de cinco segundos durante a primeira compilação e passou após aquecimento. ESLint dos arquivos alterados e `git diff --check` passaram. Newsletter PT/EN conferida no navegador após revisão do texto.

## Lighthouse

Três execuções por rota, Lighthouse 13.4.1, Chromium local, perfil mobile padrão com throttling simulado. Baseline: cópia do HEAD anterior às alterações, usando a mesma versão do Next.js e o mesmo Turbopack. Requisições Google Analytics bloqueadas nas auditorias. Dados de laboratório local, não Core Web Vitals de usuários reais nem validação de preview Vercel. Os relatórios completos estão em `/tmp/phase2-audits` nesta sessão.

| Rota | Performance anterior | Performance final | Acessibilidade final |
| --- | ---: | ---: | ---: |
| `/pt` | 82 | 94 | 100 |
| `/pt/blog/hello-world` | 80 | 92 | 100 |
| `/pt/work-with-me` | 75 | 93 | 100 |
| `/pt/newsletter` | Nova rota | 94 | 100 |
| `/pt/guestbook` | Nova rota | 92 | 100 |

As cinco rotas medidas atingiram performance ≥90 e acessibilidade ≥95. Não houve regressão de performance nas três rotas com baseline; as medianas subiram 12, 12 e 18 pontos. Resultados individuais em `lighthouse-results.json`. PT/EN e temas foram verificados no Playwright; as medianas Lighthouse locais cobrem as cinco rotas PT da tabela.

## Capturas da interface implementada

As capturas da newsletter foram atualizadas após a revisão de texto solicitada: dois parágrafos em primeira pessoa substituem o roteiro numerado.

- [Newsletter PT, desktop claro](previews/newsletter-pt-1440.png)
- [Newsletter EN, celular escuro](previews/newsletter-en-390.png)
- [Guestbook PT, celular claro](previews/guestbook-pt-390.png)
- [Mural EN, desktop escuro](previews/work-with-me-en-1440.png)

## Verificações externas pendentes

OAuth real com duas contas, domínio e entregabilidade Resend, latência real de boas-vindas, assinatura do webhook no preview, migração Turso remota, GA4 DebugView/configurações/explorações, leitor de tela manual e preview Vercel. Ver `operations.md` e `analytics.md`. A geração remota Superdesign depende da autorização específica de transferência de arquivos bloqueada pela revisão automática.
