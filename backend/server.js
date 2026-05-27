const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const db = require('./db');

const app = express();

/* =========================
   MIDDLEWARES
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   REGISTRO
========================= */

app.post('/register', async (req, res) => {

  const {
    nome,
    ra,
    email,
    password,
    tipo_usuario
  } = req.body;

  // validações
  if (!nome || !email || !password || !tipo_usuario) {
    return res.status(400).send('Preencha todos os campos obrigatórios');
  }

  try {

    // verifica email duplicado
    const verificaEmail = `
      SELECT * FROM usuarios
      WHERE email = ?
    `;

    db.query(verificaEmail, [email], async (erro, results) => {

      if (erro) {
        console.log(erro);
        return res.status(500).send(erro.sqlMessage);
      }

      if (results.length > 0) {
        return res.status(400).send('Email já cadastrado');
      }

      // criptografa senha
      const hash = await bcrypt.hash(password, 10);

      // salva usuário
      const sqlUsuario = `
        INSERT INTO usuarios
        (nome, ra, email, senha, tipo_usuario)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        sqlUsuario,
        [
          nome,
          ra || null,
          email,
          hash,
          tipo_usuario
        ],
        (err, result) => {

          if (err) {
            console.log(err);
            return res.status(500).send(err.sqlMessage);
          }

          return res.status(201).send({
            message: 'Usuário registrado com sucesso!',
            user: {
              id: result.insertId,
              nome,
              email,
              ra,
              tipo_usuario
            }
          });

        }
      );

    });

  } catch (err) {

    console.log(err);

    return res.status(500).send('Erro no servidor');

  }

});

/* =========================
   LOGIN
========================= */

app.post('/login', (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Preencha email e senha');
  }

  const sql = `
    SELECT * FROM usuarios
    WHERE email = ?
  `;

  db.query(sql, [email], async (err, results) => {

    if (err) {
      console.log(err);
      return res.status(500).send(err.sqlMessage);
    }

    if (results.length === 0) {
      return res.status(401).send('Usuário não encontrado');
    }

    const user = results[0];

    // compara senha
    const senhaCorreta = await bcrypt.compare(
      password,
      user.senha
    );

    if (!senhaCorreta) {
      return res.status(401).send('Senha inválida');
    }

    return res.send({

      message: 'Login realizado com sucesso!',

      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        ra: user.ra,
        tipo_usuario: user.tipo_usuario
      }

    });

  });

});

/* =========================
   TESTE API
========================= */

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

/* =========================
   START SERVER
========================= */

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});