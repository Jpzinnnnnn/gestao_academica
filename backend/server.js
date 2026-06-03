const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   REGISTRO
========================= */

app.post('/register', async (req, res) => {
  const db = require('./db');

  console.log('📥 Body recebido:', req.body);

  let { nome, ra, cpf, email, password, tipo_usuario } = req.body;

  console.log('RA:', ra);
  console.log('CPF:', cpf);
  console.log('BODY:', JSON.stringify(req.body, null, 2));

  if (!nome || !email || !password || !tipo_usuario) {
    return res.status(400).send('Preencha todos os campos obrigatórios');
  }

  try {

    // Remove máscara do CPF
    if (cpf) {
      cpf = cpf.replace(/\D/g, '');
    }

    const [emailExiste] = await db.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (emailExiste.length > 0) {
      return res.status(400).send('Email já cadastrado');
    }

    if (ra) {
      const [raExiste] = await db.query(
        'SELECT id FROM usuarios WHERE ra = ?',
        [ra]
      );

      if (raExiste.length > 0) {
        return res.status(400).send('RA já cadastrado');
      }
    }

    if (cpf) {
      const [cpfExiste] = await db.query(
        'SELECT id FROM usuarios WHERE cpf = ?',
        [cpf]
      );

      if (cpfExiste.length > 0) {
        return res.status(400).send('CPF já cadastrado');
      }
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `
      INSERT INTO usuarios
      (
        nome,
        ra,
        cpf,
        email,
        senha,
        tipo_usuario
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        nome,
        ra || null,
        cpf || null,
        email,
        hash,
        tipo_usuario
      ]
    );

    console.log('✅ Usuário inserido com ID:', result.insertId);

    return res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      user: {
        id: result.insertId,
        nome,
        email,
        ra,
        cpf,
        tipo_usuario
      }
    });

  } catch (err) {
    console.error('❌ Erro no registro:', err);
    return res.status(500).send(err.sqlMessage || 'Erro no servidor');
  }
});

/* =========================
   LOGIN
========================= */

app.post('/login', async (req, res) => {
  const db = require('./db');

  console.log('📥 Login recebido:', req.body);

  let { login, password, tipo_usuario } = req.body;

  if (!login || !password || !tipo_usuario) {
    return res.status(400).send('Preencha todos os campos');
  }

  try {

    let sql;
    let params;

    if (tipo_usuario === 'aluno') {

      sql = `
        SELECT *
        FROM usuarios
        WHERE ra = ?
        AND tipo_usuario = 'aluno'
      `;

      params = [login];

    } else if (tipo_usuario === 'professor') {

      // Remove pontos e traços do CPF
      login = login.replace(/\D/g, '');

      sql = `
        SELECT *
        FROM usuarios
        WHERE cpf = ?
        AND tipo_usuario = 'professor'
      `;

      params = [login];

    } else {
      return res.status(400).send('Tipo de usuário inválido');
    }

    const [results] = await db.query(sql, params);

    if (results.length === 0) {
      return res.status(401).send('Usuário não encontrado');
    }

    const user = results[0];

    const senhaCorreta = await bcrypt.compare(
      password,
      user.senha
    );

    if (!senhaCorreta) {
      return res.status(401).send('Senha incorreta');
    }

    return res.json({
      message: 'Login realizado com sucesso!',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        ra: user.ra,
        cpf: user.cpf,
        tipo_usuario: user.tipo_usuario
      }
    });

  } catch (err) {
    console.error('❌ Erro no login:', err);
    return res.status(500).send(
      err.sqlMessage || 'Erro no servidor'
    );
  }
});

/* =========================
   USUARIO
========================= */

app.get('/user/:id', async (req, res) => {
  const db = require('./db');

  const { id } = req.params;

  try {

    const [results] = await db.query(
      `
      SELECT
        id,
        nome,
        email,
        ra,
        cpf,
        tipo_usuario
      FROM usuarios
      WHERE id = ?
      `,
      [id]
    );

    if (results.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    return res.json(results[0]);

  } catch (err) {
    console.error(err);
    return res.status(500).send('Erro no servidor');
  }
});

/* =========================
   START SERVER
========================= */

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});