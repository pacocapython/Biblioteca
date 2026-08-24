CREATE DATABASE IF NOT EXISTS leitura;
USE leitura;

CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    numero VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    cpf CHAR(11) UNIQUE NOT NULL,
    turma VARCHAR(20) NOT NULL
);

CREATE TABLE bibliotecaria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    numero VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    cpf CHAR(11) UNIQUE NOT NULL
);

CREATE TABLE livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    data_publicacao DATE
);

CREATE TABLE emprestimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    livro_id INT NOT NULL,
    aluno_id INT NOT NULL,
    data_emprestimo DATE NOT NULL,
    data_devolucao_prevista DATE NOT NULL,
    data_devolucao_real DATE NULL,
    status VARCHAR(20) DEFAULT 'Ativo', 

    FOREIGN KEY (livro_id) REFERENCES livros(id),
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);