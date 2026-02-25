// array para cada elemento
let usuarios = [];
let produtos = [];
let vendas = [];

// Usuários
const formUsuario = document.getElementById('formUsuario');
const tableUserBody = document.querySelector('#tableUsuarios tbody');
const selUserVenda = document.getElementById('selUserVenda');

// Produtos
const formProduto = document.getElementById('formProduto');
const tableProdBody = document.querySelector('#tableProdutos tbody');
const selProdVenda = document.getElementById('selProdVenda');

// Vendas
const formVenda = document.getElementById('formVenda');
const vendaQtd = document.getElementById('vendaQtd');
const totalDisplay = document.getElementById('totalDisplay');
const tableVendasBody = document.querySelector('#tableVendas tbody');

// --- FUNÇÕES DE USUÁRIO ---
formUsuario.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;

    //envia infos pra lista de usuarios
    usuarios.push({ id: Date.now(), nome, email });
    formUsuario.reset();
    renderUsuarios();
});

function deletarUsuario(id) {
    usuarios = usuarios.filter(u => u.id !== id);
    renderUsuarios();
}

function renderUsuarios() {
    tableUserBody.innerHTML = '';
    usuarios.forEach(u => {
        tableUserBody.innerHTML += `
            <tr>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td><button class="btn-delete" onclick="deletarUsuario(${u.id})">Excluir</button></td>
            </tr>`;
    });

    // Envia os usuários para o Registro de Vendas
    selUserVenda.innerHTML = '<option value="">Selecione o Cliente</option>';
    usuarios.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.id;
        opt.textContent = u.nome;
        selUserVenda.appendChild(opt);
    });
}

// --- FUNÇÕES DE PRODUTO ---
formProduto.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('prodName').value;
    const preco = parseFloat(document.getElementById('prodPreco').value);
    const estoque = parseInt(document.getElementById('prodEstoque').value);

    // Validação de números para ser correspodnente ao estoque e preço
    if (isNaN(preco) || isNaN(estoque)) {
        alert("Preço e Estoque devem ser valores numéricos válidos.");
        return;
    }

    produtos.push({ id: Date.now(), nome, preco, estoque });
    formProduto.reset();
    renderProdutos();
});

function deletarProduto(id) {
    produtos = produtos.filter(p => p.id !== id);
    renderProdutos();
}

function renderProdutos() {
    tableProdBody.innerHTML = '';
    produtos.forEach(p => {
        tableProdBody.innerHTML += `
            <tr>
                <td>${p.nome}</td>
                <td>R$ ${p.preco.toFixed(2)}</td>
                <td>${p.estoque}</td>
                <td><button class="btn-delete" onclick="deletarProduto(${p.id})">Excluir</button></td>
            </tr>`;
    });

    // Envia os produtos para o Registro de Vendas
    selProdVenda.innerHTML = '<option value="">Selecione o Produto</option>';
    produtos.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.nome} (Estoque: ${p.estoque})`;
        selProdVenda.appendChild(opt);
    });
}

// --- FUNÇÕES DE VENDA ---

// Cálculo do total na tela baseado na quantidade e valor
function atualizarPrecoTotal() {
    const prodId = selProdVenda.value;
    const qtd = parseInt(vendaQtd.value);
    const produto = produtos.find(p => p.id == prodId);

    if (produto && qtd > 0) {
        const total = produto.preco * qtd;
        totalDisplay.textContent = `R$ ${total.toFixed(2)}`;
    } else {
        totalDisplay.textContent = `R$ 0,00`;
    }
}

selProdVenda.addEventListener('change', atualizarPrecoTotal);
vendaQtd.addEventListener('input', atualizarPrecoTotal);

formVenda.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userId = selUserVenda.value;
    const prodId = selProdVenda.value;
    const qtd = parseInt(vendaQtd.value);

    const usuario = usuarios.find(u => u.id == userId);
    const produto = produtos.find(p => p.id == prodId);

    // Lógica de verificação do estoque
    if (qtd > produto.estoque) {
        alert("Erro: Estoque insuficiente!");
        return;
    }

    // Processar Venda
    const valorTotal = produto.preco * qtd;
    produto.estoque -= qtd; // Atualiza estoque

    //historico de vendas
    vendas.push({
        cliente: usuario.nome,
        produto: produto.nome,
        qtd: qtd,
        total: valorTotal
    });

    // Resetar interface de vendas
    formVenda.reset();
    totalDisplay.textContent = `R$ 0,00`;
    
    // Atualizar tudo para refletir as mudanças de estoque e vendas
    renderProdutos();
    renderVendas();
});

function renderVendas() {
    tableVendasBody.innerHTML = '';
    vendas.forEach(v => {
        tableVendasBody.innerHTML += `
            <tr>
                <td>${v.cliente}</td>
                <td>${v.produto}</td>
                <td>${v.qtd}</td>
                <td>R$ ${v.total.toFixed(2)}</td>
            </tr>`;
    });
}