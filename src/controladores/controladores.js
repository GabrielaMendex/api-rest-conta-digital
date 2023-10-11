const { format } = require('date-fns');
const { banco, contas, saques, depositos, transferencias } = require('../bancodedados/bancodedados');
const {
    senhaBancoEstaValida,
    senhaUsuarioEstaValida,
    registrarDeposito,
    registrarSaque,
    registrarTransferencias,
    existeContaComMesmoCPF,
    existeContaComMesmoEmail
} = require('../funcoes');
let numeroUnicoIdentificador = 3;


const listarContasBancarias = (req, res) => {
    const { senha_banco } = req.query;
    const resultado = contas;

    if (!senha_banco) {
        return res.status(400).json({ mensagem: "A senha é obrigatória. Por favor, insira sua senha." });
    }
    if (!senhaBancoEstaValida(banco.senha, senha_banco)) {
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" });
    }

    if (resultado.length === 0) {
        return res.status(400).json({ mensagem: "Nenhuma conta encontrada" });
    }
    res.status(200).send(resultado);
}


const criarContaBancaria = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "As seguintes informações são obrigatórias: nome, cpf, data_nascimento, telefone, email e senha" })
    }

    if (existeContaComMesmoCPF(cpf) || existeContaComMesmoEmail(email)) {
        return res.status(403).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });
    }

    const novaConta = {
        numero: String(numeroUnicoIdentificador++),
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    contas.push(novaConta);
    return res.status(201).send();
}


const atualizarDadosUsuario = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "As seguintes informações são obrigatórias: nome, cpf, data_nascimento, telefone, email e senha" })
    }

    const numeroContaEncontrado = contas.find((conta) => conta.numero === numeroConta);
    if (!numeroContaEncontrado) {
        return res.status(400).json({ mensagem: 'Conta não encontrada.' });
    }

    if (existeContaComMesmoCPF(cpf) || existeContaComMesmoEmail(email)) {
        return res.status(403).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });
    }

    numeroContaEncontrado.usuario.nome = nome;
    numeroContaEncontrado.usuario.cpf = cpf;
    numeroContaEncontrado.usuario.data_nascimento = data_nascimento;
    numeroContaEncontrado.usuario.telefone = telefone;
    numeroContaEncontrado.usuario.email = email;
    numeroContaEncontrado.usuario.senha = senha;

    return res.status(204).send();
}


const excluirContaBancaria = (req, res) => {
    const { numeroConta } = req.params;

    const numeroIndexConta = contas.findIndex((conta) => conta.numero === numeroConta);
    if (numeroIndexConta === -1) {
        return res.status(400).json({ mensagem: 'Conta não encontrada.' });
    }

    if (contas[numeroIndexConta].saldo !== 0) {
        return res.status(403).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
    }
    contas.splice(numeroIndexConta, 1);
    return res.status(204).send();
}


const depositarValor = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: "As seguintes informações são obrigatórias: numero_conta e valor" })
    }
    const numeroContaEncontrado = contas.find((conta) => conta.numero === numero_conta);
    if (!numeroContaEncontrado) {
        return res.status(400).json({ mensagem: 'Conta não encontrada.' });
    }
    if (valor <= 0) {
        return res.status(400).json({ mensagem: "O valor do depósito não pode ser menor que zero!" });
    }
    numeroContaEncontrado.saldo += valor;

    const dataAtual = new Date();
    const dataFormatada = format(dataAtual, 'yyyy-MM-dd HH:mm:ss');
    const registro = {
        data: dataFormatada,
        numero_conta,
        valor
    }
    registrarDeposito(registro);
    return res.status(204).send();
}


const saqueValor = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: "O número da conta, valor e senha são obrigatórios!" })
    }
    const numeroContaEncontrado = contas.find((conta) => conta.numero === numero_conta);
    if (!numeroContaEncontrado) {
        return res.status(400).json({ mensagem: 'Conta não encontrada.' });
    }
    if (!senhaUsuarioEstaValida(senha, numeroContaEncontrado.usuario.senha)) {
        return res.status(401).json({ mensagem: "A senha informada é inválida para este usuário!" });
    }

    if (numeroContaEncontrado.saldo <= 0 || numeroContaEncontrado.saldo < valor) {
        return res.status(400).json({ mensagem: "O usuário não tem saldo suficiênte." });
    }

    numeroContaEncontrado.saldo -= valor;

    const dataAtual = new Date();
    const dataFormatada = format(dataAtual, 'yyyy-MM-dd HH:mm:ss');

    const registro = {
        data: dataFormatada,
        numero_conta,
        valor
    }

    registrarSaque(registro);
    return res.status(204).send();
}


const transferirValor = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: "Os números das contas, valor e senha são obrigatórios!" });

    }
    if (numero_conta_origem === numero_conta_destino) {
        return res.status(400).json({ mensagem: 'A conta de destino deve ser diferente da conta de origem.' });
    }

    const numeroContaOrigem = contas.find((conta) => conta.numero === numero_conta_origem);
    const numeroContaDestino = contas.find((conta) => conta.numero === numero_conta_destino);
    if (!numeroContaOrigem || !numeroContaDestino) {
        return res.status(400).json({ mensagem: 'Conta de origem ou destino não encontradas.' });
    }


    if (!senhaUsuarioEstaValida(senha, numeroContaOrigem.usuario.senha)) {
        return res.status(401).json({ mensagem: "A senha informada é inválida para este usuário!" });
    }

    if (numeroContaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: "Saldo insuficiente!" });
    }
    numeroContaOrigem.saldo -= valor;
    numeroContaDestino.saldo += valor;

    const dataAtual = new Date();
    const dataFormatada = format(dataAtual, 'yyyy-MM-dd HH:mm:ss');

    const registroTransferencia = {
        data: dataFormatada,
        numero_conta_origem,
        numero_conta_destino,
        valor
    }

    registrarTransferencias(registroTransferencia);
    return res.status(204).send();
}


const exibirSaldoConta = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O número da conta e senha são obrigatórios!" })
    }
    const numeroContaEncontrado = contas.find((conta) => conta.numero === numero_conta);
    if (!numeroContaEncontrado) {
        return res.status(400).json({ mensagem: "Conta bancária não encontada!" });
    }
    if (!senhaUsuarioEstaValida(senha, numeroContaEncontrado.usuario.senha)) {
        return res.status(401).json({ mensagem: "A senha informada é inválida para este usuário!" });
    }

    res.status(200).json({ saldo: numeroContaEncontrado.saldo });
}


const listarTransacoesRealizadas = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O número da conta e senha são obrigatórios!" })
    }
    const numeroContaEncontrado = contas.find((conta) => conta.numero === numero_conta);
    if (!numeroContaEncontrado) {
        return res.status(400).json({ mensagem: "Conta bancária não encontada!" });
    }
    if (!senhaUsuarioEstaValida(senha, numeroContaEncontrado.usuario.senha)) {
        return res.status(401).json({ mensagem: "A senha informada é inválida para este usuário!" });
    }
    const depositosEncontrados = depositos.find((deposito) => deposito.numero_conta === numero_conta);
    const saquesEncontrados = saques.find((saque) => saque.numero_conta === numero_conta);
    const transferenciasEnviadasEncontradas = transferencias.find((transferencia) => transferencia.numero_conta_origem === numero_conta);
    const transferenciasRecebidasEncontradas = transferencias.find((transferencia) => transferencia.numero_conta_destino === numero_conta);

    if (depositosEncontrados || saquesEncontrados || transferenciasEnviadasEncontradas || transferenciasRecebidasEncontradas) {
        return res.status(200).json({
            depositos: depositosEncontrados,
            saques: saquesEncontrados,
            transferenciasEnviadas: transferenciasEnviadasEncontradas,
            transferenciasRecebidas: transferenciasRecebidasEncontradas
        });
    } else {
        return res.status(401).json({ mensagem: "Não existem operações para a conta informada." });
    }
}


module.exports = {
    listarContasBancarias,
    criarContaBancaria,
    atualizarDadosUsuario,
    excluirContaBancaria,
    depositarValor,
    saqueValor,
    transferirValor,
    exibirSaldoConta,
    listarTransacoesRealizadas
}