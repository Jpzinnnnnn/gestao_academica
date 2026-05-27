create database if not exists gestao_academica;
use	gestao_academica;
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    ra VARCHAR(20) UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('aluno', 'professor', 'admin') NOT NULL DEFAULT 'aluno',
    matricula VARCHAR(20) UNIQUE,
    telefone VARCHAR(20),
    data_nascimento DATE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);