CREATE DATABASE IF NOT EXISTS gestao_academica;
USE gestao_academica;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    ra VARCHAR(20) UNIQUE,
    cpf VARCHAR(14) UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('aluno', 'professor', 'admin') NOT NULL DEFAULT 'aluno',
    telefone VARCHAR(20),
    data_nascimento DATE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE boletim (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    nota1 DECIMAL(4,2),
    nota2 DECIMAL(4,2),
    nota3 DECIMAL(4,2),
    frequencia INT,
    situacao ENUM('Aprovado', 'Recuperacao', 'Reprovado'),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id)
);

CREATE TABLE planejamento_aulas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_aula DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    serie VARCHAR(20) NOT NULL,
    status ENUM('Planejada', 'Realizada', 'Cancelada') DEFAULT 'Planejada',
    titulo VARCHAR(200) NOT NULL,
    objetivos TEXT ,
    metodologia TEXT ,
    recursos TEXT 
);

CREATE TABLE comunicados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    professor_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensagem VARCHAR(200) NOT NULL,
    data_publicacao DATE NOT NULL,
    turma VARCHAR(100) NOT NULL,
    tipo ENUM('importante', 'informacao', 'evento') NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES usuarios(id)
);

CREATE TABLE agenda_escolar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    professor_id INT NOT NULL,
    titulo VARCHAR(50) NOT NULL,
    descricao VARCHAR(100),
    turma VARCHAR(100) NOT NULL,
    data_evento DATE NOT NULL,
    horario_inicio TIME,
    horario_fim TIME,
    tipo ENUM('Prova', 'Trabalho', 'Reuniao', 'Evento') NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES usuarios(id)
);  