const { contas, depositos, saques, transferencias } = require('./bancodedados/bancodedados');


function senhaBancoEstaValida(senhaBanco, senhaInformada) {
    return senhaBanco === senhaInformada;
}

function senhaUsuarioEstaValida(senhaInformada, senhaUsuario) {
    return senhaInformada === senhaUsuario;
}

function registrarDeposito(deposito) {
    depositos.push(deposito);
}

function registrarSaque(saque) {
    saques.push(saque);
}

function registrarTransferencias(transferencia) {
    transferencias.push(transferencia);
}

function existeContaComMesmoCPF(cpf) {
    return contas.find((conta) => conta.usuario.cpf === cpf);
}

function existeContaComMesmoEmail(email) {
    return contas.find((conta) => conta.usuario.email === email);
}

module.exports = {
    senhaBancoEstaValida,
    senhaUsuarioEstaValida,
    registrarDeposito,
    registrarSaque,
    registrarTransferencias,
    existeContaComMesmoCPF,
    existeContaComMesmoEmail
};

