require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

async function checkAdmins() {
  try {
    console.log('🔍 Verificando tabela admins...\n');
    
    const result = await pool.query('SELECT id, usuario, email, ativo, created_at FROM admins ORDER BY id');
    
    if (result.rows.length === 0) {
      console.log('⚠️ Nenhum admin encontrado na tabela!');
    } else {
      console.log(`✅ Encontrados ${result.rows.length} admin(ns):\n`);
      result.rows.forEach(admin => {
        console.log(`ID: ${admin.id}`);
        console.log(`Usuário: ${admin.usuario}`);
        console.log(`Email: ${admin.email}`);
        console.log(`Ativo: ${admin.ativo}`);
        console.log(`Criado em: ${admin.created_at}\n`);
      });
    }
    
    await pool.end();
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

checkAdmins();
