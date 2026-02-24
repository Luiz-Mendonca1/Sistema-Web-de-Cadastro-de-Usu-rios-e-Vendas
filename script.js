// Seletores de elementos
const userForm = document.getElementById('userForm');
const userTableBody = document.querySelector('#userTable tbody');
const selectUsuarios = document.getElementById('selectUsuarios');

// Inicialização: carrega os dados do localStorage ao abrir a página
document.addEventListener('DOMContentLoaded', atualizarInterface);

// Evento de submissão do formulário
userForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;

    const novoUsuario = {
        id: Date.now(), // ID único baseado no timestamp
        nome: nome,
        email: email
    };

    salvarUsuario(novoUsuario);
    userForm.reset();
});

// Salva no LocalStorage
function salvarUsuario(usuario) {
    const usuarios = obterUsuarios();
    usuarios.push(usuario);
    localStorage.setItem('meus_usuarios', JSON.stringify(usuarios));
    atualizarInterface();
}

// Remove do LocalStorage
function deletarUsuario(id) {
    let usuarios = obterUsuarios();
    usuarios = usuarios.filter(u => u.id !== id);
    localStorage.setItem('meus_usuarios', JSON.stringify(usuarios));
    atualizarInterface();
}

// Busca a lista atualizada
function obterUsuarios() {
    return JSON.parse(localStorage.getItem('meus_usuarios') || '[]');
}

// Atualiza a tabela e o select de vendas simultaneamente
function atualizarInterface() {
    const usuarios = obterUsuarios();

    // 1. Limpa e reconstrói a Tabela
    userTableBody.innerHTML = '';
    usuarios.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td>
                <button class="btn-delete" onclick="deletarUsuario(${user.id})">Excluir</button>
            </td>
        `;
        userTableBody.appendChild(tr);
    });

    // 2. Limpa e reconstrói o Select de Vendas
    selectUsuarios.innerHTML = '<option value="">Selecione um usuário...</option>';
    usuarios.forEach(user => {
        const option = document.createElement('option');
        option.value = user.nome;
        option.textContent = user.nome;
        selectUsuarios.appendChild(option);
    });
}

// Função auxiliar para o módulo de vendas
function iniciarVenda() {
    const usuarioSelecionado = selectUsuarios.value;
    if (!usuarioSelecionado) {
        alert("Por favor, selecione um cliente primeiro!");
        return;
    }
    alert(`Processando venda para: ${usuarioSelecionado}`);
}

/////////////////////// REGISTRO DE VENDAS ///////////////////////

// Array de vendas
let vendas = [];

// Elementos
const formVenda = document.getElementById("formVenda");
const selectUsuario = document.getElementById("selectUsuario");
const selectProduto = document.getElementById("selectProduto");
const quantidadeVenda = document.getElementById("quantidadeVenda");
const totalVendaSpan = document.getElementById("totalVenda");
const tabelaVendas = document.getElementById("tabelaVendas");

// Atualizar selects (chamar sempre que cadastrar/excluir usuário ou produto)
function atualizarSelects() {
    // Usuários
    selectUsuario.innerHTML = "";
    usuarios.forEach((usuario, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = usuario.nome;
        selectUsuario.appendChild(option);
    });

    // Produtos
    selectProduto.innerHTML = "";
    produtos.forEach((produto, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${produto.nome} (Estoque: ${produto.estoque})`;
        selectProduto.appendChild(option);
    });
}

// Calcular total automaticamente ao mudar quantidade ou produto
function calcularTotal() {
    const produtoIndex = selectProduto.value;
    const quantidade = Number(quantidadeVenda.value);

    if (produtoIndex === "" || quantidade <= 0) {
        totalVendaSpan.textContent = "0.00";
        return;
    }

    const produto = produtos[produtoIndex];
    const total = produto.preco * quantidade;

    totalVendaSpan.textContent = total.toFixed(2);
}

selectProduto.addEventListener("change", calcularTotal);
quantidadeVenda.addEventListener("input", calcularTotal);

// Registrar venda
formVenda.addEventListener("submit", function (e) {
    e.preventDefault();

    const usuarioIndex = selectUsuario.value;
    const produtoIndex = selectProduto.value;
    const quantidade = Number(quantidadeVenda.value);

    if (usuarioIndex === "" || produtoIndex === "" || quantidade <= 0) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    const usuario = usuarios[usuarioIndex];
    const produto = produtos[produtoIndex];

    // Verificar estoque
    if (quantidade > produto.estoque) {
        alert("Estoque insuficiente!");
        return;
    }

    const total = produto.preco * quantidade;

    // Atualizar estoque
    produto.estoque -= quantidade;

    // Registrar venda
    vendas.push({
        usuario: usuario.nome,
        produto: produto.nome,
        quantidade: quantidade,
        total: total
    });

    atualizarTabelaVendas();
    atualizarSelects();
    formVenda.reset();
    totalVendaSpan.textContent = "0.00";
});

// Atualizar tabela de vendas
function atualizarTabelaVendas() {
    tabelaVendas.innerHTML = "";

    vendas.forEach(venda => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${venda.usuario}</td>
            <td>${venda.produto}</td>
            <td>${venda.quantidade}</td>
            <td>R$ ${venda.total.toFixed(2)}</td>
        `;

        tabelaVendas.appendChild(linha);
    });
}