const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// ROTA TESTE
app.get('/', (req, res) => {
  res.send('API da Biblioteca Leitura funcionando!');
});

// ==================== ALUNOS ====================
app.get('/alunos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alunos ORDER BY id DESC');
    res.json(result.rows);
  } catch (erro) {
    console.error('Erro na rota /alunos:', erro.message);
    res.status(500).json({ erro: 'Erro ao buscar alunos: ' + erro.message });
  }
});

app.post('/alunos', async (req, res) => {
  const { nome, email, senha, numero, cpf, turma, curso } = req.body;
  try {
    const hashSenha = await bcrypt.hash(senha || '123456', 10);
    const result = await db.query(
      'INSERT INTO alunos (nome, email, senha, numero, cpf, turma, curso) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [nome, email || null, hashSenha, numero || null, cpf || null, turma || null, curso || null]
    );
    res.status(201).json({ id: result.rows[0].id, nome, email });
  } catch (erro) {
    console.error('Erro ao cadastrar aluno:', erro.message);
    res.status(500).json({ erro: 'Erro ao cadastrar aluno: ' + erro.message });
  }
});

// ==================== LIVROS ====================
app.get('/livros', async (req, res) => {
  const { categoria } = req.query;
  try {
    let queryText = 'SELECT * FROM livros';
    let queryParams = [];

    if (categoria && categoria !== 'todos') {
      queryText += ' WHERE LOWER(categoria) = LOWER($1)';
      queryParams.push(categoria);
    }

    queryText += ' ORDER BY id DESC';

    const result = await db.query(queryText, queryParams);
    res.json(result.rows);
  } catch (erro) {
    console.error('Erro na rota /livros:', erro.message);
    res.status(500).json({ erro: 'Erro ao buscar livros: ' + erro.message });
  }
});

app.post('/livros', async (req, res) => {
  const { numero_livro, titulo, autor, data_publicacao, categoria } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO livros (numero_livro, titulo, autor, data_publicacao, categoria) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [numero_livro || null, titulo, autor, data_publicacao || null, categoria || 'geral']
    );
    res.status(201).json({ id: result.rows[0].id, titulo, autor, categoria });
  } catch (erro) {
    console.error('Erro ao cadastrar livro:', erro.message);
    res.status(500).json({ erro: 'Erro ao cadastrar livro: ' + erro.message });
  }
});

// ==================== RESENHAS ====================
app.get('/resenhas', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM resenhas ORDER BY id DESC');
    res.json(result.rows);
  } catch (erro) {
    console.error('Erro na rota /resenhas:', erro.message);
    res.status(500).json({ erro: 'Erro ao buscar resenhas: ' + erro.message });
  }
});

app.post('/resenhas', async (req, res) => {
  const { livro, nota, texto, autor } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO resenhas (livro, nota, texto, autor) VALUES ($1, $2, $3, $4) RETURNING id',
      [livro, nota || 5, texto || '', autor || 'Anônimo']
    );
    res.status(201).json({ id: result.rows[0].id, livro, nota });
  } catch (erro) {
    console.error('Erro ao publicar resenha:', erro.message);
    res.status(500).json({ erro: 'Erro ao publicar resenha: ' + erro.message });
  }
});

// ==================== RESERVAS ====================
app.get('/reservas', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM reservas ORDER BY id DESC');
    res.json(result.rows);
  } catch (erro) {
    console.error('Erro na rota /reservas:', erro.message);
    res.status(500).json({ erro: 'Erro ao buscar reservas: ' + erro.message });
  }
});

app.post('/reservas', async (req, res) => {
  const { aluno_id, aluno_nome, livro_titulo } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO reservas (aluno_id, aluno_nome, livro_titulo) VALUES ($1, $2, $3) RETURNING id',
      [aluno_id || null, aluno_nome || 'Anônimo', livro_titulo]
    );
    res.status(201).json({ id: result.rows[0].id, mensagem: 'Reserva realizada com sucesso!' });
  } catch (erro) {
    console.error('Erro ao criar reserva:', erro.message);
    res.status(500).json({ erro: 'Erro ao criar reserva: ' + erro.message });
  }
});

// ==================== SUGESTÕES ====================
app.get('/sugestoes', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM sugestoes ORDER BY id DESC');
    res.json(result.rows);
  } catch (erro) {
    console.error('Erro na rota /sugestoes:', erro.message);
    res.status(500).json({ erro: 'Erro ao buscar sugestões: ' + erro.message });
  }
});

app.post('/sugestoes', async (req, res) => {
  const { titulo, autor, aluno_nome } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO sugestoes (titulo, autor, aluno_nome) VALUES ($1, $2, $3) RETURNING id',
      [titulo, autor || null, aluno_nome || 'Anônimo']
    );
    res.status(201).json({ id: result.rows[0].id, mensagem: 'Sugestão enviada com sucesso!' });
  } catch (erro) {
    console.error('Erro ao enviar sugestão:', erro.message);
    res.status(500).json({ erro: 'Erro ao enviar sugestão: ' + erro.message });
  }
});

// ==================== EMPRÉSTIMOS ====================
app.get('/emprestimos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM emprestimos ORDER BY id DESC');
    res.json(result.rows);
  } catch (erro) {
    console.error('Erro na rota /emprestimos:', erro.message);
    res.status(500).json({ erro: 'Erro ao buscar empréstimos: ' + erro.message });
  }
});

app.post('/emprestimos', async (req, res) => {
  const { livro_id, aluno_id, data_emprestimo, data_devolucao_prevista } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO emprestimos (livro_id, aluno_id, data_emprestimo, data_devolucao_prevista) VALUES ($1, $2, $3, $4) RETURNING id',
      [livro_id || null, aluno_id || null, data_emprestimo || new Date(), data_devolucao_prevista || null]
    );
    res.status(201).json({ id: result.rows[0].id, mensagem: 'Empréstimo registrado com sucesso!' });
  } catch (erro) {
    console.error('Erro ao registrar empréstimo:', erro.message);
    res.status(500).json({ erro: 'Erro ao registrar empréstimo: ' + erro.message });
  }
});

app.put('/emprestimos/:id/devolver', async (req, res) => {
  const { id } = req.params;
  const { data_devolucao_real } = req.body;
  try {
    await db.query(
      "UPDATE emprestimos SET data_devolucao_real = $1, status = 'Concluído' WHERE id = $2",
      [data_devolucao_real || new Date(), id]
    );
    res.json({ mensagem: 'Devolução registrada!' });
  } catch (erro) {
    console.error('Erro ao registrar devolução:', erro.message);
    res.status(500).json({ erro: 'Erro ao registrar devolução: ' + erro.message });
  }
});

// INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});