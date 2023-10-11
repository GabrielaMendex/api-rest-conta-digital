const express = require("express");
const {
    listarContasBancarias,
    criarContaBancaria,
    atualizarDadosUsuario,
    excluirContaBancaria,
    depositarValor,
    saqueValor,
    transferirValor,
    exibirSaldoConta,
    listarTransacoesRealizadas
} = require("../controladores/controladores");


const rotas = express();

rotas.get('/contas', listarContasBancarias);

rotas.post('/contas', criarContaBancaria);

rotas.put('/contas/:numeroConta/usuario', atualizarDadosUsuario);

rotas.delete('/contas/:numeroConta', excluirContaBancaria);

rotas.post('/transacoes/depositar', depositarValor);

rotas.post('/transacoes/sacar', saqueValor);

rotas.post('/transacoes/transferir', transferirValor);

rotas.get('/contas/saldo', exibirSaldoConta);

rotas.get('/contas/extrato', listarTransacoesRealizadas);


module.exports = rotas;