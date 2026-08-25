const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// INICIALIZAR TABELAS AUTOMATICAMENTE NO MYSQL
async function initDB() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS sugestoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(150) NOT NULL,
        autor VARCHAR(100) NULL,
        aluno_nome VARCHAR(100) DEFAULT 'Anônimo',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabela de sugestões verificada com sucesso.');
  } catch (erro) {
    console.error('Erro ao inicializar tabelas:', erro.message);
  }
}
initDB();

// ROTA TESTE
app.get('/', (req, res) => {
  res.send('API da Biblioteca Leitura funcionando!');
});

// ==================== ALUNOS ====================
app.get('/alunos', async (req, res) => {
  try {
    const [alunos] = await db.query('SELECT id, nome, email, numero, cpf, turma FROM alunos ORDER BY id DESC');
    res.json(alunos);
  } catch (erro) {
    console.error('Erro na rota /alunos:', erro.message);
    res.json([]);
  }
});

app.post('/alunos', async (req, res) => {
  const { nome, email, senha, numero, cpf, turma } = req.body;
  try {
    const hashSenha = await bcrypt.hash(senha || '123456', 10);
    const [resultado] = await db.query(
      'INSERT INTO alunos (nome, email, senha, numero, cpf, turma) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, email, hashSenha, numero || null, cpf || null, turma || null]
    );
    res.status(201).json({ id: resultado.insertId, nome, email });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cadastrar aluno: ' + erro.message });
  }
});

// ==================== LIVROS (COM CATEGORIA) ====================
app.get('/livros', async (req, res) => {
  try {
    const [livros] = await db.query('SELECT * FROM livros ORDER BY id DESC');
    res.json(livros);
  } catch (erro) {
    console.error('Erro na rota /livros:', erro.message);
    res.json([]);
  }
});

// Permite o cadastro manual pela bibliotecária
app.post('/livros', async (req, res) => {
  const { numero_livro, titulo, autor, data_publicacao, categoria } = req.body;
  try {
    const [resultado] = await db.query(
      'INSERT INTO livros (numero_livro, titulo, autor, data_publicacao, categoria) VALUES (?, ?, ?, ?, ?)',
      [numero_livro || null, titulo, autor, data_publicacao || null, categoria || 'geral']
    );
    res.status(201).json({ id: resultado.insertId, titulo, autor, categoria });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cadastrar livro: ' + erro.message });
  }
});

// ==================== RESENHAS ====================
app.get('/resenhas', async (req, res) => {
  try {
    const [resenhas] = await db.query('SELECT * FROM resenhas ORDER BY id DESC');
    res.json(resenhas);
  } catch (erro) {
    console.error('Erro na rota /resenhas:', erro.message);
    res.json([]);
  }
});

app.post('/resenhas', async (req, res) => {
  const { livro, nota, texto, autor } = req.body;
  try {
    const [resultado] = await db.query(
      'INSERT INTO resenhas (livro, nota, texto, autor) VALUES (?, ?, ?, ?)',
      [livro, nota, texto, autor || 'Anônimo']
    );
    res.status(201).json({ id: resultado.insertId, livro, nota });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao publicar resenha: ' + erro.message });
  }
});

// ==================== RESERVAS ====================
app.get('/reservas', async (req, res) => {
  try {
    const [reservas] = await db.query('SELECT * FROM reservas ORDER BY id DESC');
    res.json(reservas);
  } catch (erro) {
    console.error('Erro na rota /reservas:', erro.message);
    res.json([]);
  }
});

app.post('/reservas', async (req, res) => {
  const { aluno_id, aluno_nome, livro_titulo } = req.body;
  try {
    const [resultado] = await db.query(
      'INSERT INTO reservas (aluno_id, aluno_nome, livro_titulo) VALUES (?, ?, ?)',
      [aluno_id || null, aluno_nome, livro_titulo]
    );
    res.status(201).json({ id: resultado.insertId, mensagem: 'Reserva realizada com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao criar reserva: ' + erro.message });
  }
});

// ==================== SUGESTÕES ====================
app.get('/sugestoes', async (req, res) => {
  try {
    const [sugestoes] = await db.query('SELECT * FROM sugestoes ORDER BY id DESC');
    res.json(sugestoes);
  } catch (erro) {
    console.error('Erro na rota /sugestoes:', erro.message);
    res.json([]);
  }
});

app.post('/sugestoes', async (req, res) => {
  const { titulo, autor, aluno_nome } = req.body;
  try {
    const [resultado] = await db.query(
      'INSERT INTO sugestoes (titulo, autor, aluno_nome) VALUES (?, ?, ?)',
      [titulo, autor || null, aluno_nome || 'Anônimo']
    );
    res.status(201).json({ id: resultado.insertId, mensagem: 'Sugestão enviada com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao enviar sugestão: ' + erro.message });
  }
});

// ==================== EMPRÉSTIMOS ====================
app.get('/emprestimos', async (req, res) => {
  try {
    const [emprestimos] = await db.query('SELECT * FROM emprestimos');
    res.json(emprestimos);
  } catch (erro) {
    console.error('Erro na rota /emprestimos:', erro.message);
    res.json([]);
  }
});

app.post('/emprestimos', async (req, res) => {
  const { livro_id, aluno_id, data_emprestimo, data_devolucao_prevista } = req.body;
  try {
    const [resultado] = await db.query(
      'INSERT INTO emprestimos (livro_id, aluno_id, data_emprestimo, data_devolucao_prevista) VALUES (?, ?, ?, ?)',
      [livro_id, aluno_id, data_emprestimo, data_devolucao_prevista]
    );
    res.status(201).json({ id: resultado.insertId, mensagem: 'Empréstimo registrado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao registrar empréstimo' });
  }
});

app.put('/emprestimos/:id/devolver', async (req, res) => {
  const { id } = req.params;
  const { data_devolucao_real } = req.body;
  try {
    await db.query(
      'UPDATE emprestimos SET data_devolucao_real = ?, status = "Concluído" WHERE id = ?',
      [data_devolucao_real, id]
    );
    res.json({ mensagem: 'Devolução registrada!' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao registrar devolução' });
  }
});

// INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});