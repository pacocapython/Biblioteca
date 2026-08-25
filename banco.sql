CREATE DATABASE IF NOT EXISTS leitura;
USE leitura;

CREATE TABLE IF NOT EXISTS alunos (
=======
CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    numero VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf CHAR(11) NULL,
    turma VARCHAR(20),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Bibliotecárias
CREATE TABLE IF NOT EXISTS bibliotecaria (
=======
CREATE TABLE bibliotecaria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    numero VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf CHAR(11) NULL
);

-- 3. Tabela de Livros
CREATE TABLE IF NOT EXISTS livros (
=======
CREATE TABLE livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_livro VARCHAR(50),
    titulo VARCHAR(150) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    data_publicacao DATE NULL,
    categoria VARCHAR(50) DEFAULT 'geral'
);

CREATE TABLE IF NOT EXISTS resenhas (
CREATE TABLE emprestimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    livro VARCHAR(150) NOT NULL,
    nota INT NOT NULL,
    texto TEXT NOT NULL,
    autor VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de Reservas
CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NULL,
    aluno_nome VARCHAR(100) NOT NULL,
    livro_titulo VARCHAR(150) NOT NULL,
    data_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Pendente',
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE SET NULL
);

-- 6. Tabela de Sugestões (Adicionada)
CREATE TABLE IF NOT EXISTS sugestoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    autor VARCHAR(100) NULL,
    aluno_nome VARCHAR(100) DEFAULT 'Anônimo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabela de Empréstimos
CREATE TABLE IF NOT EXISTS emprestimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    livro_id INT NULL,
    aluno_id INT NULL,
    data_emprestimo DATE NOT NULL,
    data_devolucao_prevista DATE NOT NULL,
    data_devolucao_real DATE NULL,
    status VARCHAR(20) DEFAULT 'Ativo',

    FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE
);

-- Inserir Bibliotecária padrão para testes de Login
INSERT INTO bibliotecaria (nome, email, senha) 
VALUES ('Maria Bibliotecária', 'admin@ceep.com', '123')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

INSERT INTO livros (numero_livro, titulo, autor, data_publicacao, categoria) VALUES
('#1001', 'Matemática Escolar Avançada', 'Carlos Eduardo', '2020-01-01', 'didaticos'),
('#1002', 'Português & Gramática Completa', 'Ana Maria Machado', '2019-01-01', 'didaticos'),
('#1003', 'História do Brasil & Contemporânea', 'Boris Fausto', '2021-01-01', 'didaticos'),
('#1004', 'Geografia do Espaço Global', 'Milton Santos', '2018-01-01', 'didaticos'),

('#2001', 'Dom Casmurro', 'Machado de Assis', '1899-01-01', 'geral'),
('#2002', 'O Mulato', 'Aluísio Azevedo', '1881-01-01', 'geral'),
('#2003', 'O Cortiço', 'Aluísio Azevedo', '1890-01-01', 'geral'),
('#2004', 'Memórias Póstumas de Brás Cubas', 'Machado de Assis', '1881-01-01', 'geral'),

('#3001', 'Manejo e Produção de Soja', 'José Roberto', '2022-01-01', 'agricultura'),
('#3002', 'Cultivo de Trigo e Cereais', 'Fernanda Lima', '2020-01-01', 'agricultura'),
('#3003', 'Controle Integrado de Plantas Daninhas', 'Marcos Silva', '2021-01-01', 'agricultura'),
('#3004', 'Botânica e Ecologia de Vegetação', 'Cláudia Alencar', '2019-01-01', 'agricultura'),

('#4001', 'Anatomia e Fisiologia do Corpo Humano', 'Dr. Roberto Paes', '2023-01-01', 'enfermagem'),
('#4002', 'Cuidados Fundamentais em Enfermagem', 'Juliana Mendes', '2021-01-01', 'enfermagem'),
('#4003', 'Primeiros Socorros e Emergência', 'Carlos Andrade', '2020-01-01', 'enfermagem'),
('#4004', 'Farmacologia para Enfermagem', 'Renata Costa', '2022-01-01', 'enfermagem'),

('#5001', 'Linguagens de Programação & Lógica', 'Alan Turing', '2021-01-01', 'ds'),
('#5002', 'Redes de Computadores e Protocolos', 'Andrew Tanenbaum', '2020-01-01', 'ds'),
('#5003', 'Tecnologias Web e Banco de Dados', 'Lucas Rocha', '2023-01-01', 'ds'),
('#5004', 'Introdução à Inteligência Artificial', 'Stuart Russell', '2022-01-01', 'ds'),

('#6001', 'Contabilidade e Finanças Básicas', 'Osvaldo Garcia', '2020-01-01', 'adm'),
('#6002', 'Gestão do Dinheiro e Investimentos', 'Patrícia Ribeiro', '2021-01-01', 'adm'),
('#6003', 'Como Administrar Pequenas Empresas', 'Sérgio Santos', '2019-01-01', 'adm'),
('#6004', 'Planejamento Estratégico Empresarial', 'Philip Kotler', '2022-01-01', 'adm');


<<<<<<< HEAD
=======
    FOREIGN KEY (livro_id) REFERENCES livros(id),
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);
>>>>>>> 3990c70d2ee72e855a1bb8fdb2f54f801cb264ab
