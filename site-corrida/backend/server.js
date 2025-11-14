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

    // Cria tabela de admins
    (async () => {
      const createAdmins = `
        CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          usuario TEXT UNIQUE NOT NULL,
          senha TEXT NOT NULL,
          email TEXT,
          ativo BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      try {
        await db.query(createAdmins);
        console.log('Tabela admins verificada/criada');
      
        // Inserir admin padrão se não existir nenhum
        const check = await db.query('SELECT COUNT(*) FROM admins');
        if (check.rows[0].count === 0) {
          await db.query(
            'INSERT INTO admins (usuario, senha, email, ativo) VALUES ($1, $2, $3, $4)',
            ['admin', 'HVK1080hvk@@', 'admin@helvisklei.com', true]
          );
          console.log('Admin padrão criado');
        }
      } catch (err) {
        console.error('Erro criando tabela admins:', err);
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

// Rota de login usando tabela admins
app.post('/login', async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ message: 'Corpo da requisição vazio' });
    const { usuario, senha } = req.body;
    if (!usuario || !senha) return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });

    if (usingMockDb) {
      // Em modo mock, usa credenciais do .env
      const ADMIN_USER = process.env.ADMIN_USER || 'admin';
      const ADMIN_PASS = process.env.ADMIN_PASS || 'senha123';
      if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
        const token = `token_${Date.now()}`;
        return res.json({ token, usuario, id: 1, email: 'admin@local' });
      }
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Buscar admin no banco de dados
    const result = await db.query('SELECT * FROM admins WHERE usuario = $1 AND ativo = true', [usuario]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }

    const admin = result.rows[0];
    // Comparação simples (em produção, usar bcrypt)
    if (admin.senha === senha) {
      const token = `token_${Date.now()}_${admin.id}`;
      return res.json({ token, usuario: admin.usuario, id: admin.id, email: admin.email });
    }

    return res.status(401).json({ message: 'Usuário ou senha inválidos' });
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
    console.error(err);
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
    console.error(err);
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
    console.error(err);
    res.status(500).json({ message: 'Erro ao gerar PDF' });
  }
});

// Versão melhorada do relatorio/pdf
app.get('/relatorio/pdf', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM inscricoes ORDER BY created_at DESC');
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="relatorio_inscricoes.pdf"');
    doc.pipe(res);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('🏃 CORRIDA ENTRE AMIGAS', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('Relatório de Inscrições', { align: 'center' });
    doc.moveDown(0.5);
    
    // Data
    const dataGeracao = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.fontSize(10).font('Helvetica').text(`Gerado em: ${dataGeracao}`, { align: 'center' });
    doc.moveDown(1);
    
    // Line separator
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
    doc.moveDown(0.5);
    
    // Stats
    const totalPagos = rows.filter(r => r.pago).length;
    const totalPendente = rows.filter(r => !r.pago).length;
    const totalInscritos = rows.length;
    
    doc.fontSize(11).font('Helvetica-Bold').text(`📊 RESUMO EXECUTIVO`, { align: 'left' });
    doc.fontSize(10).font('Helvetica').text(`Total de Inscritos: ${totalInscritos}`, { indent: 10 });
    doc.text(`Pagamentos Confirmados: ${totalPagos}`, { indent: 10 });
    doc.text(`Pagamentos Pendentes: ${totalPendente}`, { indent: 10 });
    doc.moveDown(1);
    
    // Line separator
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
    doc.moveDown(0.5);
    
    // Table Header
    doc.fontSize(11).font('Helvetica-Bold');
    const colX = { nome: doc.page.margins.left, telefone: 180, email: 290, pago: 450, data: 530 };
    const rowHeight = 20;
    
    doc.text('Nome', colX.nome, doc.y);
    doc.text('Telefone', colX.telefone, doc.y);
    doc.text('Email', colX.email, doc.y);
    doc.text('Pago', colX.pago, doc.y);
    doc.text('Data', colX.data, doc.y);
    doc.moveDown(0.7);
    
    // Line separator
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
    doc.moveDown(0.5);
    
    // Table Rows
    doc.fontSize(9).font('Helvetica');
    rows.forEach((r, idx) => {
      const dataFormatada = new Date(r.created_at).toLocaleDateString('pt-BR');
      doc.text(r.nome.substring(0, 25), colX.nome, doc.y, { width: 100 });
      doc.text(r.telefone, colX.telefone, doc.y - doc.heightOfString(r.nome));
      doc.text(r.email.substring(0, 28), colX.email, doc.y - doc.heightOfString(r.nome), { width: 150 });
      doc.text(r.pago ? '✓ Sim' : '✗ Não', colX.pago, doc.y - doc.heightOfString(r.nome));
      doc.text(dataFormatada, colX.data, doc.y - doc.heightOfString(r.nome));
      doc.moveDown(1);
    });
    
    doc.moveDown(1);
    
    // Footer
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 1; i <= pageCount; i++) {
      doc.switchToPage(i - 1);
      doc.fontSize(8).font('Helvetica').text(
        `© 2025 HVK Produção - Helvisklei. Página ${i} de ${pageCount}`,
        doc.page.margins.left,
        doc.page.height - doc.page.margins.bottom + 10,
        { align: 'center' }
      );
    }
    
    doc.end();
  } catch (err) {
    console.error('Erro em GET /relatorio/pdf:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao gerar PDF' });
  }
});

// Opção: endpoint para marcar pagamento (simula confirmação via webhook)
app.post('/admin/pagamento', async (req, res) => {
  const { id, pago } = req.body;
  if (!id) return res.status(400).json({ message: 'id obrigatório' });
  try {
    await db.query('UPDATE inscricoes SET pago = $1 WHERE id = $2', [!!pago, id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar pagamento' });
  }
});


// ===== ENDPOINTS DE GERENCIAMENTO DE ADMINS =====

// GET /admins - Listar todos os admins (apenas informações não sensíveis)
app.get('/admins', async (req, res) => {
  try {
    if (usingMockDb) return res.json([{ id: 1, usuario: 'admin', email: 'admin@local', ativo: true }]);
    const { rows } = await db.query('SELECT id, usuario, email, ativo, created_at FROM admins ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Erro em GET /admins:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao buscar admins' });
  }
});

// POST /admins - Criar novo admin
app.post('/admins', async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ message: 'Corpo da requisição vazio' });
    const { usuario, senha, email } = req.body;
    if (!usuario || !senha) return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });

    if (usingMockDb) return res.status(400).json({ message: 'Não suportado em modo mock' });
    
    await db.query(
      'INSERT INTO admins (usuario, senha, email, ativo) VALUES ($1, $2, $3, $4)',
      [usuario, senha, email || null, true]
    );
    res.json({ ok: true, message: 'Admin criado com sucesso' });
  } catch (err) {
    if (err.message.includes('duplicate key')) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }
    console.error('Erro em POST /admins:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao criar admin' });
  }
});

// PUT /admins/:id - Atualizar admin (usuario, email, senha)
app.put('/admins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.body) return res.status(400).json({ message: 'Corpo da requisição vazio' });
    const { usuario, email, senha } = req.body;

    if (usingMockDb) return res.status(400).json({ message: 'Não suportado em modo mock' });
    
    if (usuario) {
      await db.query('UPDATE admins SET usuario = $1, updated_at = NOW() WHERE id = $2', [usuario, id]);
    }
    if (email) {
      await db.query('UPDATE admins SET email = $1, updated_at = NOW() WHERE id = $2', [email, id]);
    }
    if (senha) {
      await db.query('UPDATE admins SET senha = $1, updated_at = NOW() WHERE id = $2', [senha, id]);
    }
    
    res.json({ ok: true, message: 'Admin atualizado com sucesso' });
  } catch (err) {
    console.error('Erro em PUT /admins/:id:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao atualizar admin' });
  }
});

// PUT /admins/:id/toggle - Ativar/inativar admin
app.put('/admins/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.body) return res.status(400).json({ message: 'Corpo da requisição vazio' });
    const { ativo } = req.body;

    if (usingMockDb) return res.status(400).json({ message: 'Não suportado em modo mock' });
    
    await db.query('UPDATE admins SET ativo = $1, updated_at = NOW() WHERE id = $2', [!!ativo, id]);
    res.json({ ok: true, message: `Admin ${ativo ? 'ativado' : 'inativado'}` });
  } catch (err) {
    console.error('Erro em PUT /admins/:id/toggle:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao atualizar status do admin' });
  }
});

// DELETE /admins/:id - Deletar admin
app.delete('/admins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (usingMockDb) return res.status(400).json({ message: 'Não suportado em modo mock' });
    
    const result = await db.query('DELETE FROM admins WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Admin não encontrado' });
    }
    res.json({ ok: true, message: 'Admin deletado com sucesso' });
  } catch (err) {
    console.error('Erro em DELETE /admins/:id:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao deletar admin' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
