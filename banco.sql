CREATE DATABASE IF NOT EXISTS leitura;
USE leitura;

-- 1. Tabela de Alunos
CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    numero VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    cpf CHAR(11) UNIQUE NOT NULL,
    turma VARCHAR(20) NOT NULL
);

-- 2. Tabela de Bibliotecárias
CREATE TABLE bibliotecaria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    numero VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    cpf CHAR(11) UNIQUE NOT NULL
);

-- 3. Tabela de Livros
CREATE TABLE livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    data_publicacao DATE
);

-- 4. Tabela de Empréstimos (Corrigida)
CREATE TABLE emprestimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    livro_id INT NOT NULL,
    aluno_id INT NOT NULL,
    data_emprestimo DATE NOT NULL,
    data_devolucao_prevista DATE NOT NULL,
    data_devolucao_real DATE NULL,
    status VARCHAR(20) DEFAULT 'Ativo', 

    -- Ajustado para usar os nomes corretos das colunas e tabelas
    FOREIGN KEY (livro_id) REFERENCES livros(id),
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);