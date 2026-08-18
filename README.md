# Suspensão de aluno - QA Apex

Eu acompanhei o fluxo completo de suspensão: alterei o status no painel do coach e depois conferi o que o aluno enxerga no app mobile.

## O que eu conferi

- O aluno continua visível no painel após a suspensão.
- O status muda de **Ativo** para **Suspenso**.
- O app mobile redireciona o aluno suspenso para a tela de bloqueio.
- O cenário `paused` foi comparado com `suspended`: hoje, `paused` mantém o acesso ao app.

## Cenários automatizados

- Web: [coach-suspend-student.cy.ts](cypress/e2e/coach-suspend-student.cy.ts)
- Mobile — suspenso com Maestro: [suspenso-bloqueia-app.yaml](maestro/suspenso-bloqueia-app.yaml)
- Mobile — pausado com Maestro: [pausado-mantem-acesso.yaml](maestro/pausado-mantem-acesso.yaml)
- Mobile — validação Appium: [acesso-suspenso.e2e.mjs](appium/acesso-suspenso.e2e.mjs)

## Evidências

[Vídeo do cenário web](evidencias/coach-suspend-student.cy.ts.mp4)

[Captura da tela mobile](evidencias/tela-acesso-suspenso.jpg)

[Evidência mobile antes da correção](evidencias/mobile-acesso-suspenso-antes.mp4)

[Evidência mobile depois da correção](evidencias/mobile-acesso-suspenso-depois.mp4)

[Comparativo e critério de aceite](docs/correcao-contraste-acesso-suspenso.md)

## O que encontrei

O bloqueio funcionou desde o começo. O problema apareceu na interface: na primeira execução, os textos e a ação de saída ficaram quase ilegíveis sobre o fundo claro. Registrei o caso na [issue #1](https://github.com/felipemsilva2/apex-qa-suspensao-aluno/issues/1) e no [Linear APE-17](https://linear.app/lupet/issue/APE-17/texto-da-tela-de-acesso-suspenso-fica-ilegivel).

Depois do ajuste, a tela passou a usar as cores do tema ativo. Rodei o mesmo cenário com Appium no simulador iOS e o bloqueio continuou funcionando, agora com a leitura normalizada. A issue foi encerrada depois do reteste.

## Como executar

### Web

```bash
npx cypress run --spec cypress/e2e/coach-suspend-student.cy.ts
```

### Mobile

Os fluxos recebem as credenciais por variáveis de ambiente. Não coloco credenciais reais no repositório.

```bash
maestro test maestro/suspenso-bloqueia-app.yaml
maestro test maestro/pausado-mantem-acesso.yaml

# Appium/XCUITest
npm install
npm run test:appium:suspenso
```

Para rodar no mobile, é preciso ter um simulador ou aparelho conectado e um aluno preparado com o status correspondente. O Appium usa `APPIUM_TEST_USER` e `APPIUM_TEST_PASSWORD` somente no terminal quando a sessão não está ativa.

## Execução desta rodada

- Cypress web: 1 cenário aprovado.
- Appium mobile antes do ajuste: bloqueio aprovado e problema visual reproduzido.
- Appium mobile depois do ajuste: 1 cenário aprovado no simulador iOS.
