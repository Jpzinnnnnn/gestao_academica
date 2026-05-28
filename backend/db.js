const mysql = require('mysql2/promise'); // ✅ /promise aqui

async function conectar() {
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'gestao_academica'
    });
    console.log('Banco conectado com sucesso');
    return db;
  } catch (err) {
    console.error('Erro ao conectar no banco:', err);
    process.exit(1);
  }
}

module.exports = conectar();