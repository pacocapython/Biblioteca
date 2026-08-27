const API_URL = ' https://biblioteca-api-iv4s.onrender.com';
let usuarioAtual = null;

// BANCO DE DADOS LOCAL (LOCALSTORAGE)
const db = {
  get: (key) => JSON.parse(localStorage.getItem(`ceep_${key}`)) || [],
  set: (key, data) => localStorage.setItem(`ceep_${key}`, JSON.stringify(data)),
  add: (key, item) => {
    const list = db.get(key);
    list.push(item);
    db.set(key, list);
    return list;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  carregarDados();
  carregarResenhas();
  carregarReservas();
  carregarSugestoes();
  carregarCategorias();
});

// NAVEGAÇÃO DE ABAS
function mudarAbaAluno(aba, btn) {
  document.querySelectorAll('#visao-aluno .subview').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('#nav-aluno .nav-link').forEach(el => el.classList.remove('active'));

  const elAba = document.getElementById(`aluno-${aba}`);
  if (elAba) elAba.classList.remove('hidden');
  if (btn) btn.classList.add('active');

  // Se navegar para a aba de acervo/destaques, recarrega a lista completa
  if (aba === 'destaques') {
    carregarDados();
  }
}

function mudarAbaBiblio(aba, btn) {
  document.querySelectorAll('#visao-bibliotecaria .subview').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('#nav-biblio .nav-link').forEach(el => el.classList.remove('active'));

  const elAba = document.getElementById(`biblio-${aba}`);
  if (elAba) elAba.classList.remove('hidden');
  if (btn) btn.classList.add('active');
}

// MODAL DE AUTENTICAÇÃO
function abrirModal() {
  document.getElementById('modal-login')?.classList.remove('hidden');
}

function fecharModal() {
  document.getElementById('modal-login')?.classList.add('hidden');
}

function alternarAbaModal(aba) {
  if (aba === 'login') {
    document.getElementById('tab-modal-login')?.classList.add('active');
    document.getElementById('tab-modal-cadastro')?.classList.remove('active');
    document.getElementById('form-login')?.classList.remove('hidden');
    document.getElementById('form-cadastro')?.classList.add('hidden');
  } else {
    document.getElementById('tab-modal-login')?.classList.remove('active');
    document.getElementById('tab-modal-cadastro')?.classList.add('active');
    document.getElementById('form-login')?.classList.add('hidden');
    document.getElementById('form-cadastro')?.classList.remove('hidden');
  }
}

// LOGIN E CADASTRO
function efetuarLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;

  if (email === 'admin@ceep.com') {
    usuarioAtual = { nome: 'Maria Bibliotecária', email, tipo: 'admin' };
    document.getElementById('visao-aluno')?.classList.add('hidden');
    document.getElementById('visao-bibliotecaria')?.classList.remove('hidden');
    document.getElementById('nav-aluno')?.classList.add('hidden');
    document.getElementById('nav-biblio')?.classList.remove('hidden');

    document.getElementById('user-status').innerText = 'Bibliotecária (Maria)';
  } else {
    const alunos = db.get('alunos');
    const alunoEncontrado = alunos.find(a => a.email === email);
    
    usuarioAtual = { 
      nome: alunoEncontrado ? alunoEncontrado.nome : email.split('@')[0], 
      email, 
      tipo: 'aluno' 
    };
    
    document.getElementById('user-status').innerText = `Aluno (${usuarioAtual.nome})`;
  }

  document.getElementById('btn-auth').innerText = 'Sair';
  document.getElementById('btn-auth').onclick = deslogar;
  fecharModal();
}

async function efetuarCadastro(e) {
  e.preventDefault();
  const nome = document.getElementById('cad-nome').value;
  const email = document.getElementById('cad-email').value;
  const senha = document.getElementById('cad-senha').value;

  const novoAluno = { nome, email, senha };
  db.add('alunos', novoAluno);

  try {
    await fetch(`${API_URL}/alunos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoAluno)
    });
  } catch (err) {
    console.warn('Banco MySQL desconectado. Salvo no navegador.');
  }

  alert(`Aluno ${nome} cadastrado com sucesso!`);
  document.getElementById('form-cadastro').reset();
  alternarAbaModal('login');
  carregarDados();
}

function deslogar() {
  usuarioAtual = null;
  document.getElementById('visao-aluno')?.classList.remove('hidden');
  document.getElementById('visao-bibliotecaria')?.classList.add('hidden');
  document.getElementById('nav-aluno')?.classList.remove('hidden');
  document.getElementById('nav-biblio')?.classList.add('hidden');

  document.getElementById('user-status').innerText = 'Visitante';
  document.getElementById('btn-auth').innerText = 'Entrar / Cadastrar';
  document.getElementById('btn-auth').onclick = abrirModal;
}

// CARREGAR LIVROS E ALUNOS (VERSÃO CORRIGIDA)
async function carregarDados() {
  let livros = db.get('livros');
  let alunos = db.get('alunos');

  try {
    const resL = await fetch(`${API_URL}/livros`);
    if (resL.ok) {
      const dadosL = await resL.json();
      if (dadosL.length > 0) livros = dadosL;
    }

    const resA = await fetch(`${API_URL}/alunos`);
    if (resA.ok) {
      const dadosA = await resA.json();
      if (dadosA.length > 0) alunos = dadosA;
    }
  } catch (e) {
    console.log('Usando dados locais.');
  }

  // 1. Renderizar Livros
  const gridAluno = document.getElementById('grid-livros-aluno');
  const listaBiblio = document.getElementById('lista-acervo-biblio');

  if (livros.length > 0) {
    const htmlLivros = livros.map(l => renderizarCardBook(l)).join('');
    if (gridAluno) gridAluno.innerHTML = htmlLivros;
    if (listaBiblio) listaBiblio.innerHTML = htmlLivros;
  } else {
    const vazio = '<p style="padding:15px;">Nenhum livro cadastrado.</p>';
    if (gridAluno) gridAluno.innerHTML = vazio;
    if (listaBiblio) listaBiblio.innerHTML = vazio;
  }

  // 2. Renderizar Alunos (Rodando de forma independente!)
  const listaAlunos = document.getElementById('lista-alunos-biblio');
  if (listaAlunos) {
    if (alunos.length > 0) {
      listaAlunos.innerHTML = alunos.map(a => `
        <div class="cat-card" style="padding:12px; margin-bottom:10px; border:1px solid #cbd5e1; border-radius:8px; background:#ffffff;">
          👤 <strong>${a.nome}</strong><br>
          <small style="font-size:13px; color:#64748b;">${a.email}</small>
        </div>
      `).join('');
    } else {
      listaAlunos.innerHTML = '<p style="padding:15px;">Nenhum aluno cadastrado no momento.</p>';
    }
  }
}

function renderizarCardBook(l) {
  const capa = l.imagem_url && l.imagem_url.trim() !== '' ? l.imagem_url : 'https://via.placeholder.com/150x220?text=Sem+Capa';
  const numero = l.numero_livro || l.numero ? `<span class="book-tag">Nº ${l.numero_livro || l.numero}</span>` : '';
  return `
    <div class="book-card" style="border:1px solid #e2e8f0; padding:12px; border-radius:8px; background:#fff;">
      ${numero}
      <img src="${capa}" alt="${l.titulo}" class="book-cover" style="max-width:100%; height:auto;">
      <div class="book-title" style="font-weight:bold; margin-top:8px;">${l.titulo}</div>
      <div class="book-author" style="color:#64748b; font-size:13px;">${l.autor}</div>
      <button class="btn-reserve" onclick="reservarLivro('${l.titulo}')" style="margin-top:8px; cursor:pointer;">Reservar</button>
    </div>
  `;
}

// CADASTRAR LIVRO
async function cadastrarLivro(e) {
  e.preventDefault();
  const numero_livro = document.getElementById('biblio-numero')?.value || '';
  const titulo = document.getElementById('biblio-titulo').value;
  const autor = document.getElementById('biblio-autor').value;
  const ano = document.getElementById('biblio-ano')?.value || '2024';
  const imagem_url = document.getElementById('biblio-imagem')?.value || '';

  const novoLivro = { numero_livro, titulo, autor, data_publicacao: `${ano}-01-01`, imagem_url };
  db.add('livros', novoLivro);

  try {
    await fetch(`${API_URL}/livros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoLivro)
    });
  } catch (err) {
    console.warn('Livro salvo no navegador.');
  }

  document.getElementById('form-cadastrar-livro')?.reset();
  alert('Livro cadastrado com sucesso!');
  carregarDados();
}

// CATEGORIAS E MODAL (NÃO MUDA DE ABA)
const CATEGORIAS_CEEP = {
  geral: [
    { id: 'didaticos', nome: '📚 Livros Didáticos' },
    { id: 'geral', nome: '📖 Livros no Geral (Literatura / Obras)' }
  ],
  cursos: [
    { id: 'agricultura', nome: '🌱 Agricultura' },
    { id: 'enfermagem', nome: '🩺 Enfermagem' },
    { id: 'ds', nome: '💻 Desenvolvimento de Sistemas' },
    { id: 'adm', nome: '📊 Administração' }
  ]
};

function carregarCategorias() {
  const container = document.getElementById('aluno-categorias');
  if (!container) return;

  container.innerHTML = `
    <h3 class="section-title">Categorias & Cursos</h3>
    
    <p style="margin-bottom: 8px; color: #64748b; font-weight: 600;">Geral</p>
    <div class="categories-grid" style="margin-bottom: 24px; display:flex; gap:12px; flex-wrap:wrap;">
      ${CATEGORIAS_CEEP.geral.map(cat => `
        <div class="cat-card" onclick="abrirModalCategoria(event, '${cat.id}')" style="cursor:pointer; padding:15px; border:1px solid #e2e8f0; border-radius:8px; background:#fff;">
          ${cat.nome}
        </div>
      `).join('')}
    </div>

    <p style="margin-bottom: 8px; color: #64748b; font-weight: 600;">Por Cursos TÉCNICOS</p>
    <div class="categories-grid" style="display:flex; gap:12px; flex-wrap:wrap;">
      ${CATEGORIAS_CEEP.cursos.map(cat => `
        <div class="cat-card" onclick="abrirModalCategoria(event, '${cat.id}')" style="cursor:pointer; padding:15px; border:1px solid #e2e8f0; border-radius:8px; background:#fff;">
          ${cat.nome}
        </div>
      `).join('')}
    </div>
  `;
}

async function abrirModalCategoria(event, categoriaId) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const modal = document.getElementById('modal-categoria-livros');
  const tituloModal = document.getElementById('titulo-modal-cat');
  const containerModal = document.getElementById('conteudo-modal-cat');

  if (!modal || !containerModal) return;

  if (tituloModal) tituloModal.innerText = `Categoria: ${categoriaId.toUpperCase()}`;
  containerModal.innerHTML = '<p style="padding: 15px;">Carregando livros...</p>';
  modal.style.display = 'flex';

  let livros = db.get('livros');
  try {
    const res = await fetch(`${API_URL}/livros`);
    if (res.ok) {
      const dados = await res.json();
      if (dados.length > 0) livros = dados;
    }
  } catch (e) {}

  const livrosFiltrados = livros.filter(l => l.categoria && l.categoria.toLowerCase() === categoriaId.toLowerCase());

  if (livrosFiltrados.length === 0) {
    containerModal.innerHTML = `<p style="padding: 15px;">Nenhum livro encontrado para "${categoriaId}".</p>`;
    return;
  }

  containerModal.innerHTML = livrosFiltrados.map(l => renderizarCardBook(l)).join('');
}

function fecharModalCategoria() {
  const modal = document.getElementById('modal-categoria-livros');
  if (modal) modal.style.display = 'none';
}

// OUTRAS FUNÇÕES
async function cadastrarResenha(e) {
  e.preventDefault();
  const livro = document.getElementById('resenha-livro').value;
  const nota = document.getElementById('resenha-nota').value;
  const texto = document.getElementById('resenha-texto').value;
  const autor = usuarioAtual ? usuarioAtual.nome : 'Anônimo';

  const novaResenha = { livro, nota, texto, autor };
  db.add('resenhas', novaResenha);

  try {
    await fetch(`${API_URL}/resenhas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaResenha)
    });
  } catch (err) {}

  document.getElementById('form-resenha').reset();
  alert('Resenha publicada com sucesso!');
  carregarResenhas();
}

async function carregarResenhas() {
  const container = document.getElementById('lista-resenhas');
  if (!container) return;
  let resenhas = db.get('resenhas');
  try {
    const res = await fetch(`${API_URL}/resenhas`);
    if (res.ok) {
      const dados = await res.json();
      if (dados.length > 0) resenhas = dados;
    }
  } catch (e) {}

  if (resenhas.length > 0) {
    container.innerHTML = resenhas.map(r => `
      <div class="review-card">
        <div class="review-header">
          <span><strong>${r.livro}</strong> (${'⭐'.repeat(r.nota || 5)})</span>
          <small>Por: ${r.autor || 'Anônimo'}</small>
        </div>
        <p class="review-text">${r.texto}</p>
      </div>
    `).join('');
  } else {
    container.innerHTML = '<p>Nenhuma resenha cadastrada ainda.</p>';
  }
}

async function reservarLivro(titulo) {
  if (!usuarioAtual) {
    alert('Você precisa fazer Login primeiro para reservar um livro!');
    abrirModal();
    return;
  }

  // Calcula a data de hoje e adiciona 7 dias de prazo
  const hoje = new Date();
  const prazoDevolucao = new Date();
  prazoDevolucao.setDate(hoje.getDate() + 7);

  // Formata a data para o padrão brasileiro (DD/MM/AAAA)
  const dataFormatada = prazoDevolucao.toLocaleDateString('pt-BR');

  const novaReserva = { 
    aluno_nome: usuarioAtual.nome, 
    livro_titulo: titulo,
    prazo: dataFormatada 
  };
  
  db.add('reservas', novaReserva);

  try {
    await fetch(`${API_URL}/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaReserva)
    });
  } catch (err) {}

  alert(`Livro "${titulo}" reservado! Devolução até: ${dataFormatada}`);
  carregarReservas();
}

async function carregarReservas() {
  const container = document.getElementById('lista-reservas-biblio') || document.getElementById('listaReservas');
  if (!container) return;
  let reservas = db.get('reservas');
  try {
    const res = await fetch(`${API_URL}/reservas`);
    if (res.ok) {
      const dados = await res.json();
      if (dados.length > 0) reservas = dados;
    }
  } catch (e) {}

  if (reservas.length > 0) {
    container.innerHTML = reservas.map(r => `
      <div class="cat-card" style="padding:12px; margin-bottom:10px; border:1px solid #cbd5e1; border-radius:8px; background:#fff;">
        <strong>Livro:</strong> ${r.livro_titulo || r.livro}<br>
        <small><strong>Solicitante:</strong> ${r.aluno_nome || r.aluno}</small><br>
        <span style="color: #dc2626; font-weight: bold; font-size: 13px;">
          📅 Devolver até: ${r.prazo || '7 dias após retirada'}
        </span>
      </div>
    `).join('');
  } else {
    container.innerHTML = '<p>Nenhuma reserva pendente no momento.</p>';
  }
}

async function sugerirLivro(e) {
  e.preventDefault();
  const titulo = document.getElementById('sugestao-titulo')?.value || '';
  const autor = document.getElementById('sugestao-autor')?.value || '';
  const aluno_nome = usuarioAtual ? usuarioAtual.nome : 'Anônimo';

  const novaSugestao = { titulo, autor, aluno_nome };
  db.add('sugestoes', novaSugestao);

  try {
    await fetch(`${API_URL}/sugestoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaSugestao)
    });
  } catch (err) {}

  alert('Sugestão enviada com sucesso!');
  e.target.reset();
  carregarSugestoes();
}

async function carregarSugestoes() {
  const container = document.getElementById('lista-sugestoes-biblio');
  if (!container) return;
  let sugestoes = db.get('sugestoes');
  try {
    const res = await fetch(`${API_URL}/sugestoes`);
    if (res.ok) {
      const dados = await res.json();
      if (dados.length > 0) sugestoes = dados;
    }
  } catch (e) {}

  if (sugestoes.length > 0) {
    container.innerHTML = sugestoes.map(s => `
      <div class="cat-card">
        📖 <strong>${s.titulo}</strong> ${s.autor ? `- <em>${s.autor}</em>` : ''}<br>
        <small style="color:#64748b;">Sugerido por: ${s.aluno_nome || 'Anônimo'}</small>
      </div>
    `).join('');
  } else {
    container.innerHTML = '<p>Nenhuma sugestão enviada no momento.</p>';
  }
}
