require('dotenv').config();
const { Pool } = require('pg');

async function checkAdmins() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL não definido no .env');
      console.log('\nPara usar este script:');
      console.log('1. Certifique-se que DATABASE_URL está definida em .env');
      console.log('2. O host PostgreSQL deve estar acessível da sua máquina');
      console.log('3. Se estiver usando RDS/ElephantSQL em produção, execute este script de um ambiente com acesso');
      process.exit(1);
    }

    console.log('🔍 Conectando ao banco de dados...\n');
    
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 5000
    });

    console.log('✅ Verificando tabela admins...\n');
    
    const result = await pool.query('SELECT id, usuario, email, ativo, created_at FROM admins ORDER BY id');
    
    if (result.rows.length === 0) {
      console.log('⚠️ Nenhum admin encontrado na tabela!');
      console.log('\nPara adicionar um admin:');
      console.log('INSERT INTO admins (usuario, senha, email, ativo) VALUES (\'seu_usuario\', \'sua_senha\', \'email@exemplo.com\', true);');
    } else {
      console.log(`✅ Encontrados ${result.rows.length} admin(ns):\n`);
      result.rows.forEach((admin, idx) => {
        console.log(`[${idx + 1}] ${admin.usuario}`);
        console.log(`    Email: ${admin.email}`);
        console.log(`    Ativo: ${admin.ativo ? '✅' : '❌'}`);
        console.log(`    Criado: ${new Date(admin.created_at).toLocaleString('pt-BR')}\n`);
      });
    }
    
    await pool.end();
    
  } catch (err) {
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      console.error('❌ Não foi possível conectar ao banco de dados');
      console.log('\nPossíveis causas:');
      console.log('- Host não é acessível da sua rede');
      console.log('- DATABASE_URL está incorreta');
      console.log('- Banco de dados está offline');
      console.log('\nSe estiver em desenvolvimento local, verifique se PostgreSQL está rodando.');
      console.log('Se estiver em produção (RDS), este script deve ser executado de um host com acesso.');
    } else {
      console.error('❌ Erro:', err.message);
    }
    process.exit(1);
  }
}

checkAdmins();
