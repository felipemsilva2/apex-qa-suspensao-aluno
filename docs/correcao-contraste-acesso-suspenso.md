# Correção do contraste na tela de acesso suspenso

## O que foi observado

O aluno suspenso era bloqueado corretamente, mas a primeira versão da tela usava textos brancos em um tema claro. O conteúdo principal ficava difícil de ler, embora o bloqueio estivesse funcionando.

## Como o defeito foi reproduzido

1. Suspender um aluno no painel do coach.
2. Abrir o aplicativo mobile com esse aluno.
3. Fazer login.
4. Conferir a tela exibida após a autenticação.

O comportamento foi confirmado visualmente e também durante o cenário automatizado com Appium.

## Correção aplicada

A tela passou a usar os tokens de cor do tema ativo para:

- título e mensagem principal;
- mensagem de apoio;
- caixa de informações;
- ícone e separador;
- ação de saída e rodapé.

Assim, o mesmo componente funciona nos temas claro e escuro sem perder legibilidade.

## Evidência antes e depois

- [Antes — vídeo](../evidencias/mobile-acesso-suspenso-antes.mp4)
- [Antes — captura](../evidencias/mobile-acesso-suspenso-antes.png)
- [Depois — vídeo](../evidencias/mobile-acesso-suspenso-depois.mp4)
- [Depois — captura](../evidencias/mobile-acesso-suspenso-depois.png)

## Resultado

O cenário Appium `aluno suspenso vê o bloqueio de acesso no aplicativo` terminou com `1 passed` depois da correção. O bloqueio continuou funcionando e a tela voltou a apresentar título, instruções e saída com leitura adequada.
