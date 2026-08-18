# Cenários — suspensão de aluno

## Suspenso — bloqueio esperado

**Dado que** o coach possui um aluno ativo

**Quando** altera o status para `Suspenso` e confirma a ação

**Então** o aluno continua na lista do painel com o status `Suspenso`

**E** ao fazer login no app mobile é direcionado para a tela `ACESSO SUSPENSO`

## Pausado — comportamento observado

**Dado que** o coach mobile possui um aluno ativo

**Quando** seleciona `Pausar aluno`

**Então** o status gravado é `paused`

**E** o app mobile não direciona o aluno para a tela de bloqueio

Esse segundo cenário ainda precisa de uma decisão de negócio para ser classificado como aprovado ou defeito. A automação registra o comportamento observado sem assumir que `paused` tenha o mesmo significado de `suspended`.
