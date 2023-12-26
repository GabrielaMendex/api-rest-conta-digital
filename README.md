# API de Banco Digital

Bem-vindo à API de Banco Digital. Esta API é um projeto piloto para um banco digital, projetado com a versatilidade em mente para futuras expansões. Os dados essenciais do banco, como nome e agência, validações de senhas e operações tradicionais.

## :credit_card: Principais Funcionalidades  
A API oferece um conjunto completo de funcionalidades para contas bancárias, permitindo que você gerencie as operações de forma conveniente e eficaz. Aqui estão os principais recursos:

-   Criar Conta Bancária 
-   Listar Contas Bancárias
-   Atualizar Dados do Usuário da Conta Bancária
-   Excluir uma Conta Bancária
-   Depositar em uma Conta Bancária
-   Sacar de uma Conta Bancária
-   Transferir Valores entre Contas Bancárias
-   Consultar Saldo da Conta Bancária
-   Emitir Extrato Bancário

## :computer: Desenvolvimento
Desenvolvido em JavaScript, usando Express.js, e dados persistidos em memória.
A API segue o padrão REST, e o código está organizado, delimitando as responsabilidades de cada arquivo adequadamente
Qualquer valor (dinheiro) deverá ser representado em centavos.
As respostas são retornadas em formato JSON ou XML e contêm os resultados das operações solicitadas.

## :arrow_upper_right: Rotas Disponíveis

```javascript
rotas.get('/contas', listarContasBancarias);
rotas.post('/contas', criarContaBancaria);
rotas.put('/contas/:numeroConta/usuario', atualizarDadosUsuario);
rotas.delete('/contas/:numeroConta', excluirContaBancaria);
rotas.post('/transacoes/depositar', depositarValor);
rotas.post('/transacoes/sacar', saqueValor);
rotas.post('/transacoes/transferir', transferirValor);
rotas.get('/contas/saldo', exibirSaldoConta);
rotas.get('/contas/extrato', listarTransacoesRealizadas);
```


