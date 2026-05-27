USE gestao_academica;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    ra VARCHAR(14) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(20) NOT NULL,
    tipo_usuario ENUM('aluno', 'professor', 'admin') NOT NULL DEFAULT 'aluno',
    matricula VARCHAR(20) UNIQUE,
    telefone VARCHAR(20),
    data_nascimento DATE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alunos (
    id INT PRIMARY KEY AUTO_INCREMENT,

    usuario_id INT NOT NULL,

    ra VARCHAR(14) UNIQUE NOT NULL,

    curso VARCHAR(100),

    turma VARCHAR(50),

    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
);

CREATE TABLE professores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    usuario_id INT NOT NULL,
    
    cpf VARCHAR(11) UNIQUE NOT NULL,
    
    especialidade VARCHAR(101),
    
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
);