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