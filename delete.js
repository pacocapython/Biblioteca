const db = require('./db');

async function limparBanco() {
  try {
    console.log('Limpando o banco de dados MySQL...');
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('TRUNCATE TABLE emprestimos');
    await db.query('TRUNCATE TABLE reservas');
    await db.query('TRUNCATE TABLE sugestoes');
    await db.query('TRUNCATE TABLE resenhas');
    await db.query('TRUNCATE TABLE alunos');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('✅ Banco MySQL zerado com sucesso!');
    console.log('💡 DICA: Para limpar a tela do navegador, abra o Inspecionar (F12) -> Aplicação (Application) -> Limpar dados do LocalStorage.');
    process.exit();
  } catch (erro) {
    console.error('❌ Erro ao limpar:', erro.message);
    process.exit(1);
  }
}

limparBanco();