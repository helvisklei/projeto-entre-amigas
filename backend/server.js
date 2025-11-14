require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const app = express();
app.use(cors());
app.use(express.json({ strict: true }));
app.use(express.urlencoded({ extended: true }));

// Middleware para log de requisições
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log(`${req.method} ${req.path} - Body:`, req.body);
  }
  next();
});

let db;
let usingMockDb = false;
if (process.env.DATABASE_URL) {
  db = new Pool({ connectionString: process.env.DATABASE_URL });

  // Cria tabela se não existir
  (async () => {
    const create = `
      CREATE TABLE IF NOT EXISTS inscricoes (
        id SERIAL PRIMARY KEY,
        nome TEXT,
        telefone TEXT,
        email TEXT,
        autorizado BOOLEAN,
        pago BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    try {
      await db.query(create);
      console.log('Tabela inscricoes verificada/criada');
    } catch (err) {
      console.error('Erro criando tabela:', err);
    }
  })();
} else {
  // Mock DB em memória para facilitar testes locais sem Postgres
  console.warn('DATABASE_URL não definido — usando banco em memória (apenas para testes)');
  usingMockDb = true;
  const mock = { rows: [], nextId: 1 };
  db = {
    query: async (text, params) => {
      const q = text.toLowerCase();
      if (q.startsWith('insert into inscricoes')) {
        const nome = params[0];
        const telefone = params[1];
        const email = params[2];
        const autorizado = params[3];
        const row = { id: mock.nextId++, nome, telefone, email, autorizado: !!autorizado, pago: false, created_at: new Date() };
        mock.rows.unshift(row);
        return { rows: [], rowCount: 1 };
      }
      if (q.startsWith('select * from inscricoes')) {
        return { rows: mock.rows };
      }
      if (q.startsWith('update inscricoes set pago')) {
        const pago = params[0];
        const id = params[1];
        const r = mock.rows.find(x => x.id === Number(id));
        if (r) r.pago = !!pago;
        return { rows: [], rowCount: r ? 1 : 0 };
      }
      return { rows: [] };
    }
  };
}

// Rota de login simples (usa credenciais do .env)
app.post('/login', async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ message: 'Corpo da requisição vazio' });
    const { usuario, senha } = req.body;
    if (!usuario || !senha) return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });

    const ADMIN_USER = process.env.ADMIN_USER || 'admin';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'senha123';

    if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
      // Em produção, gere JWT; aqui usamos token simples
      const token = `token_${Date.now()}`;
      return res.json({ token, usuario });
    }

    return res.status(401).json({ message: 'Credenciais inválidas' });
  } catch (err) {
    console.error('Erro em POST /login:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao processar login' });
  }
});

app.post('/inscricao', async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ message: 'Corpo da requisição vazio' });
    const { nome, telefone, email, autorizado } = req.body;
    if (!nome || !telefone || !email) {
      return res.status(400).json({ message: 'nome, telefone e email são obrigatórios' });
    }
    await db.query(
      'INSERT INTO inscricoes (nome, telefone, email, autorizado, pago) VALUES ($1,$2,$3,$4,false)',
      [nome, telefone, email, autorizado]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error('Erro em POST /inscricao:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao salvar inscrição' });
  }
});

app.get('/admin', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM inscricoes ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Erro em GET /admin:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao buscar inscritos' });
  }
});

app.get('/relatorio/excel', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM inscricoes ORDER BY created_at DESC');
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Inscrições');
    sheet.addRow(['Nome', 'Telefone', 'Email', 'Pago', 'Data']);
    rows.forEach(r => sheet.addRow([r.nome, r.telefone, r.email, r.pago ? 'Sim' : 'Não', r.created_at]));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="relatorio_inscricoes.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Erro em GET /relatorio/excel:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao gerar Excel' });
  }
});

app.get('/relatorio/pdf', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM inscricoes ORDER BY created_at DESC');
    const doc = new PDFDocument({ margin: 30 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="relatorio_inscricoes.pdf"');
    doc.pipe(res);
    doc.fontSize(18).text('Relatório de Inscrições', { align: 'center' });
    doc.moveDown();
    rows.forEach(r => {
      doc.fontSize(12).text(`${r.nome} — ${r.email} — ${r.telefone} — Pago: ${r.pago ? 'Sim' : 'Não'}`);
    });
    doc.end();
  } catch (err) {
    console.error('Erro em GET /relatorio/pdf:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao gerar PDF' });
  }
});

// Opção: endpoint para marcar pagamento (simula confirmação via webhook)
app.post('/admin/pagamento', async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ message: 'Corpo da requisição vazio' });
    const { id, pago } = req.body;
    if (!id) return res.status(400).json({ message: 'id obrigatório' });
    await db.query('UPDATE inscricoes SET pago = $1 WHERE id = $2', [!!pago, id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Erro em POST /admin/pagamento:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao atualizar pagamento' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
