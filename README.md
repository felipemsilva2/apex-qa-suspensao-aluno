# Suspensão de aluno - QA Apex

Validação do fluxo de suspensão de aluno no painel do coach e do bloqueio apresentado no app mobile.

## O que foi validado

- O aluno continua visível no painel após a suspensão.
- O status muda de **Ativo** para **Suspenso**.
- O app mobile redireciona o aluno suspenso para a tela de bloqueio.
- O cenário `paused` foi comparado com `suspended`: hoje, `paused` mantém o acesso ao app.

## Cenários automatizados

- Web: [coach-suspend-student.cy.ts](cypress/e2e/coach-suspend-student.cy.ts)
- Mobile — suspenso com Maestro: [suspenso-bloqueia-app.yaml](maestro/suspenso-bloqueia-app.yaml)
- Mobile — pausado com Maestro: [pausado-mantem-acesso.yaml](maestro/pausado-mantem-acesso.yaml)
- Mobile — validação Appium: [acesso-suspenso.e2e.mjs](appium/acesso-suspenso.e2e.mjs)

## Evidência

[Vídeo do cenário web](evidencias/coach-suspend-student.cy.ts.mp4)

[Captura da tela mobile](evidencias/tela-acesso-suspenso.jpg)

[Evidência mobile antes da correção](evidencias/mobile-acesso-suspenso-antes.mp4)

[Evidência mobile depois da correção](evidencias/mobile-acesso-suspenso-depois.mp4)

[Comparativo e critério de aceite](docs/correcao-contraste-acesso-suspenso.md)

## Resultado encontrado e corrigido

O bloqueio funcional foi acionado, mas a primeira execução mostrou um problema de contraste: textos e ação de saída ficaram quase ilegíveis sobre o fundo claro. O defeito foi registrado na [issue #1](https://github.com/felipemsilva2/apex-qa-suspensao-aluno/issues/1) e no [Linear APE-17](https://linear.app/lupet/issue/APE-17/texto-da-tela-de-acesso-suspenso-fica-ilegivel).

A tela foi corrigida para usar as cores do tema ativo. O mesmo cenário foi repetido com Appium no simulador iOS e terminou aprovado, mantendo o bloqueio e recuperando a leitura da interface.

## Como executar

### Web

```bash
npx cypress run --spec cypress/e2e/coach-suspend-student.cy.ts
```

### Mobile

Os fluxos usam Maestro e recebem as credenciais de teste por variáveis de ambiente. Nunca coloque credenciais reais no repositório.

```bash
maestro test maestro/suspenso-bloqueia-app.yaml
maestro test maestro/pausado-mantem-acesso.yaml

# Appium/XCUITest
npm install
npm run test:appium:suspenso
```

O cenário mobile precisa de um simulador ou aparelho conectado e de um aluno preparado com o status correspondente. O Appium usa `APPIUM_TEST_USER` e `APPIUM_TEST_PASSWORD` somente no terminal quando a sessão não estiver ativa.

## Execução desta rodada

- Cypress web: 1 cenário aprovado.
- Appium mobile — antes da correção: bloqueio funcional aprovado e problema visual reproduzido.
- Appium mobile — depois da correção: 1 cenário aprovado no simulador iOS.
