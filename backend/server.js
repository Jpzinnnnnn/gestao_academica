const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const db = require('./db');

const app = express();

/* =========================
   MIDDLEWARESS
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   REGISTRO
========================= */

app.post('/register', async (req, res) => {

  const { tipo, ra, email, password } = req.body;

  // validações básicas
  if (!tipo || !password) {
    return res.status(400).send('Preencha todos os campos');
  }

  try {

    /* =========================
       ALUNO
    ========================= */

    if (tipo === 'aluno') {

      if (!ra) {
        return res.status(400).send('RA obrigatório');
      }

      // verifica RA duplicado
      const verifica = 'SELECT * FROM users WHERE ra = ?';

      db.query(verifica, [ra], async (erro, results) => {

        if (erro) {
          console.log(erro);
          return res.status(500).send('Erro no servidor');
        }

        if (results.length > 0) {
          return res.status(400).send('RA já cadastrado');
        }

        // criptografa senha
        const hash = await bcrypt.hash(password, 10);

        // salva aluno
        const sql = `
          INSERT INTO users (tipo, ra, password)
          VALUES (?, ?, ?)
        `;

        db.query(sql, [tipo, ra, hash], (err) => {

          if (err) {
            console.log(err);
            return res.status(500).send('Erro ao cadastrar aluno');
          }

          res.send('Aluno registrado com sucesso!');
        });

      });

    }

    /* =========================
       PROFESSOR
    ========================= */

    else if (tipo === 'professor') {

      if (!email) {
        return res.status(400).send('Email obrigatório');
      }

      // verifica email duplicado
      const verifica = 'SELECT * FROM users WHERE email = ?';

      db.query(verifica, [email], async (erro, results) => {

        if (erro) {
          console.log(erro);
          return res.status(500).send('Erro no servidor');
        }

        if (results.length > 0) {
          return res.status(400).send('Email já cadastrado');
        }

        // criptografa senha
        const hash = await bcrypt.hash(password, 10);

        // salva professor
        const sql = `
          INSERT INTO users (tipo, email, password)
          VALUES (?, ?, ?)
        `;

        db.query(sql, [tipo, email, hash], (err) => {

          if (err) {
            console.log(err);
            return res.status(500).send('Erro ao cadastrar professor');
          }

          res.send('Professor registrado com sucesso!');
        });

      });

    }

    else {
      return res.status(400).send('Tipo inválido');
    }

  } catch (err) {

    console.log(err);
    res.status(500).send('Erro no servidor');

  }

});

/* =========================
   LOGIN
========================= */

app.post('/login', (req, res) => {

  const { tipo, ra, email, password } = req.body;

  let sql = '';
  let valor = '';

  /* =========================
     LOGIN ALUNO
  ========================= */

  if (tipo === 'aluno') {

    sql = 'SELECT * FROM users WHERE ra = ?';
    valor = ra;

  }

  /* =========================
     LOGIN PROFESSOR
  ========================= */

  else if (tipo === 'professor') {

    sql = 'SELECT * FROM users WHERE email = ?';
    valor = email;

  }

  else {
    return res.status(400).send('Tipo inválido');
  }

  db.query(sql, [valor], async (err, results) => {

    if (err) {
      console.log(err);
      return res.status(500).send('Erro no servidor');
    }

    if (results.length === 0) {
      return res.status(401).send('Usuário não encontrado');
    }

    const user = results[0];

    // compara senha
    const senhaCorreta = await bcrypt.compare(password, user.password);

    if (!senhaCorreta) {
      return res.status(401).send('Senha inválida');
    }

    // login OK
    res.send({

      message: 'Login realizado com sucesso!',

      user: {
        id: user.id,
        tipo: user.tipo,
        ra: user.ra,
        email: user.email
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