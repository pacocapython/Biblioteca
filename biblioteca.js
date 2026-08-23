const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API da Biblioteca Leitura funcionando!');
});

app.get('/livros', async (req, res) => {
  try {
    const [livros] = await db.query('SELECT * FROM livros');
    res.json(livros);
  } catch (erro) {
    console.error('Erro ao buscar livros:', erro);
    res.status(500).json({ erro: 'Erro no servidor ao buscar livros' });
  }
});

app.get('/alunos', async (req, res) => {
  try {
    const [alunos] = await db.query('SELECT * FROM alunos');
    res.json(alunos);
  } catch (erro) {
    console.error('Erro ao buscar alunos:', erro);
    res.status(500).json({ erro: 'Erro no servidor ao buscar alunos' });
  }
});

app.get('/emprestimos', async (req, res) => {
  try {
    const [emprestimos] = await db.query('SELECT * FROM emprestimos');
    res.json(emprestimos);
  } catch (erro) {
    console.error('Erro ao buscar empréstimos:', erro);
    res.status(500).json({ erro: 'Erro no servidor ao buscar empréstimos' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});