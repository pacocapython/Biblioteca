const db = require('./db');

async function limparBanco() {
  try {
    console.log('Limpando o banco de dados Supabase...');
    
    // O TRUNCATE ... CASCADE limpa as tabelas e remove as relações automaticamente
    await db.query('TRUNCATE TABLE emprestimos, reservas, sugestoes, resenhas, alunos RESTART IDENTITY CASCADE');

    console.log('✅ Banco de dados zerado com sucesso!');
    process.exit(0);
  } catch (erro) {
    console.error('❌ Erro ao limpar:', erro.message);
    process.exit(1);
  }
}

limparBanco();