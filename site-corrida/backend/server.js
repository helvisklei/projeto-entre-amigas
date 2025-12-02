require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const jwt = require('jsonwebtoken');

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
        cpf TEXT,
        cidade TEXT,
        tamanho_camisa TEXT,
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

    // Cria tabela de eventos
    (async () => {
      const createEvents = `
        CREATE TABLE IF NOT EXISTS events (
          id SERIAL PRIMARY KEY,
          titulo TEXT NOT NULL,
          data_evento DATE NOT NULL,
          descricao TEXT,
          local TEXT,
          ativo BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      try {
        await db.query(createEvents);
        console.log('Tabela events verificada/criada');

        const check = await db.query('SELECT COUNT(*) FROM events');
        if (check.rows[0].count === 0) {
          await db.query(
            'INSERT INTO events (titulo, data_evento, descricao, local, ativo) VALUES ($1, $2, $3, $4, $5)',
            ['Corrida Entre Amigas 2024', '2024-12-15', 'Corrida beneficente para as amigas', 'Recife - PE', true]
          );
          console.log('Evento padrão criado');
        }
      } catch (err) {
        console.error('Erro criando tabela events:', err);
      }
    })();

    // Cria tabela de testimonios
    (async () => {
      const createTestimonials = `
        CREATE TABLE IF NOT EXISTS testimonials (
          id SERIAL PRIMARY KEY,
          event_id INT NOT NULL,
          nome TEXT NOT NULL,
          categoria TEXT,
          depoimento TEXT,
          posicao INT,
          genero TEXT,
          foto_url TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (event_id) REFERENCES events(id)
        );
      `;
      try {
        await db.query(createTestimonials);
        console.log('Tabela testimonials verificada/criada');
      } catch (err) {
        console.error('Erro criando tabela testimonials:', err);
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
        const cpf = params[3];
        const cidade = params[4];
        const tamanho_camisa = params[5];
        const autorizado = params[6];
        const row = { id: mock.nextId++, nome, telefone, email, cpf, cidade, tamanho_camisa, autorizado: !!autorizado, pago: false, created_at: new Date() };
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

// Middleware para verificar JWT
const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token ausente' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu-segredo-secreto-aqui');
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

// Rota de login com JWT
app.post('/login', async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ message: 'Corpo da requisição vazio' });
    const { usuario, senha } = req.body;
    if (!usuario || !senha) return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });

    // Credencial padrão do sistema (sempre disponível como fallback)
    const DEFAULT_ADMIN_USER = 'admin';
    const DEFAULT_ADMIN_PASS = 'HVK1080hvk@@';
    
    if (usuario === DEFAULT_ADMIN_USER && senha === DEFAULT_ADMIN_PASS) {
      console.log('✅ Login com credencial padrão do sistema');
      const token = jwt.sign({ id: 1, usuario, email: 'admin@helvisklei.com' }, process.env.JWT_SECRET || 'seu-segredo-secreto-aqui', { expiresIn: '24h' });
      return res.json({ token, usuario, id: 1, email: 'admin@helvisklei.com' });
    }

    // Se está usando mock DB (sem PostgreSQL), rejeita qualquer outro login
    if (usingMockDb) {
      console.log('❌ Credenciais inválidas em modo mock:', usuario);
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Tentar com banco de dados real (para admins cadastrados na tabela)
    const result = await db.query('SELECT * FROM admins WHERE usuario = $1 AND ativo = true', [usuario]);
    if (result.rows.length === 0) {
      console.log('❌ Usuário não encontrado:', usuario);
      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }

    const admin = result.rows[0];
    console.log(`Validando senha para usuário cadastrado: ${usuario}`);
    
    // Admins cadastrados no banco devem usar EXATAMENTE a senha que cadastraram
    // Sem fallback para senha123 ou outras senhas fracas
    if (admin.senha === senha) {
      console.log(`✅ Login bem-sucedido: ${usuario} (admin cadastrado)`);
      const token = jwt.sign({ id: admin.id, usuario: admin.usuario, email: admin.email }, process.env.JWT_SECRET || 'seu-segredo-secreto-aqui', { expiresIn: '24h' });
      return res.json({ token, usuario: admin.usuario, id: admin.id, email: admin.email });
    }

    console.log('❌ Senha incorreta para usuário cadastrado:', usuario);
    return res.status(401).json({ message: 'Usuário ou senha inválidos' });
  } catch (err) {
    console.error('Erro em POST /login:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao processar login' });
  }
});

app.post('/inscricao', async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ message: 'Corpo da requisição vazio' });
    const { nome, telefone, email, cpf, cidade, tamanho_camisa, autorizado } = req.body;
    if (!nome || !telefone || !email) {
      return res.status(400).json({ message: 'nome, telefone, email são obrigatórios' });
    }

    // Verificar limite de 100 inscrições
    const countResult = await db.query('SELECT COUNT(*) as total FROM inscricoes');
    const total = parseInt(countResult.rows[0].total);
    if (total >= 100) {
      return res.status(400).json({ 
        message: 'Limite de 100 inscrições atingido. Próximo evento: Setembro 2025',
        eventoProximo: 'Setembro 2025'
      });
    }

    await db.query(
      'INSERT INTO inscricoes (nome, telefone, email, cpf, cidade, tamanho_camisa, autorizado, pago) VALUES ($1,$2,$3,$4,$5,$6,$7,false)',
      [nome, telefone, email, cpf || null, cidade || null, tamanho_camisa || null, autorizado ? true : false]
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
    sheet.addRow(['Nome', 'Telefone', 'Email', 'CPF', 'Cidade', 'Tamanho_camisa','Pago', 'Data']);
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
    doc.fontSize(14).font('Helvetica').text('Relatório de Inscrições 2024', { align: 'center' });
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
    doc.fontSize(10).font('Helvetica-Bold');
    const colX = { nome: doc.page.margins.left, telefone: 150, email: 240, cidade: 330, pago: 420, data: 500 };
    
    doc.text('Nome', colX.nome, doc.y, { width: 140 });
    doc.text('Telefone', colX.telefone, doc.y - doc.heightOfString('Nome'), { width: 80 });
    doc.text('Email', colX.email, doc.y - doc.heightOfString('Nome'), { width: 80 });
    doc.text('Cidade', colX.cidade, doc.y - doc.heightOfString('Nome'), { width: 80 });
    doc.text('Pago', colX.pago, doc.y - doc.heightOfString('Nome'), { width: 60 });
    doc.text('Data', colX.data, doc.y - doc.heightOfString('Nome'), { width: 60 });
    doc.moveDown(0.7);
    
    // Line separator
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
    doc.moveDown(0.5);
    
    // Table Rows
    doc.fontSize(9).font('Helvetica');
    rows.forEach((r) => {
      const dataFormatada = new Date(r.created_at).toLocaleDateString('pt-BR');
      doc.text(r.nome.substring(0, 20), colX.nome, doc.y, { width: 140 });
      doc.text(r.telefone, colX.telefone, doc.y - doc.heightOfString(r.nome.substring(0, 20)), { width: 80 });
      doc.text(r.email.substring(0, 20), colX.email, doc.y - doc.heightOfString(r.nome.substring(0, 20)), { width: 80 });
      doc.text(r.cidade || '-', colX.cidade, doc.y - doc.heightOfString(r.nome.substring(0, 20)), { width: 80 });
      doc.text(r.pago ? '✓ Sim' : '✗ Não', colX.pago, doc.y - doc.heightOfString(r.nome.substring(0, 20)), { width: 60 });
      doc.text(dataFormatada, colX.data, doc.y - doc.heightOfString(r.nome.substring(0, 20)), { width: 60 });
      doc.moveDown(0.6);
    });
    
    doc.moveDown(1);
    
    // Footer
    doc.fontSize(8).font('Helvetica').text(
      `© 2025 HVK Produção - Helvisklei. Todos os direitos reservados.`,
      doc.page.margins.left,
      doc.page.height - doc.page.margins.bottom + 10,
      { align: 'center' }
    );
    
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

// ===== ENDPOINTS DE EVENTOS =====

// GET /events - Listar eventos ativos
app.get('/events', async (req, res) => {
  try {
    if (usingMockDb) {
      return res.json([
        { id: 1, titulo: 'Corrida Entre Amigas 2024', data_evento: '2024-12-15', descricao: 'Corrida beneficente', local: 'Recife - PE', ativo: true }
      ]);
    }
    const { rows } = await db.query('SELECT * FROM events WHERE ativo = true ORDER BY data_evento DESC');
    res.json(rows);
  } catch (err) {
    console.error('Erro em GET /events:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao buscar eventos' });
  }
});

// GET /events/:id - Obter evento específico
app.get('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (usingMockDb) {
      return res.json({ id: 1, titulo: 'Corrida Entre Amigas 2024', data_evento: '2024-12-15', descricao: 'Corrida beneficente', local: 'Recife - PE', ativo: true });
    }
    const { rows } = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Evento não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Erro em GET /events/:id:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao buscar evento' });
  }
});

// POST /events - Criar evento (protegido)
app.post('/events', verifyJWT, async (req, res) => {
  try {
    const { titulo, data_evento, descricao, local } = req.body;
    if (!titulo || !data_evento) return res.status(400).json({ message: 'Título e data são obrigatórios' });
    
    if (usingMockDb) return res.status(400).json({ message: 'Não suportado em modo mock' });
    
    await db.query(
      'INSERT INTO events (titulo, data_evento, descricao, local, ativo) VALUES ($1, $2, $3, $4, true)',
      [titulo, data_evento, descricao || null, local || null]
    );
    res.json({ ok: true, message: 'Evento criado com sucesso' });
  } catch (err) {
    console.error('Erro em POST /events:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao criar evento' });
  }
});

// ===== ENDPOINTS DE TESTIMONIOS =====

// GET /testimonials/:eventId - Obter depoimentos do evento
app.get('/testimonials/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    if (usingMockDb) {
      return res.json([
        { id: 1, event_id: 1, nome: 'Ana Silva', categoria: '1º lugar feminino', depoimento: 'Que privilégio correr entre amigas!', posicao: 1, genero: 'F' }
      ]);
    }
    const { rows } = await db.query('SELECT * FROM testimonials WHERE event_id = $1 ORDER BY posicao ASC', [eventId]);
    res.json(rows);
  } catch (err) {
    console.error('Erro em GET /testimonials/:eventId:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao buscar depoimentos' });
  }
});

// POST /testimonials - Criar depoimento (protegido)
app.post('/testimonials', verifyJWT, async (req, res) => {
  try {
    const { event_id, nome, categoria, depoimento, posicao, genero } = req.body;
    if (!event_id || !nome || !depoimento) return res.status(400).json({ message: 'Campos obrigatórios: event_id, nome, depoimento' });
    
    if (usingMockDb) return res.status(400).json({ message: 'Não suportado em modo mock' });
    
    await db.query(
      'INSERT INTO testimonials (event_id, nome, categoria, depoimento, posicao, genero) VALUES ($1, $2, $3, $4, $5, $6)',
      [event_id, nome, categoria || null, depoimento, posicao || null, genero || null]
    );
    res.json({ ok: true, message: 'Depoimento criado com sucesso' });
  } catch (err) {
    console.error('Erro em POST /testimonials:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao criar depoimento' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
