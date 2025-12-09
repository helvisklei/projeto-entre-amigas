/**
 * Google Forms Integration para "Corrida Entre Amigas"
 * Integração segura com Google Forms API
 * 
 * Requer:
 * 1. Google Cloud Project criado
 * 2. Google Forms API ativada
 * 3. Service Account com credenciais JSON
 * 4. Enviar dados de forma segura
 */

const https = require('https');
const querystring = require('querystring');

// Configuração segura via variáveis de ambiente
const GOOGLE_FORM_URL = process.env.GOOGLE_FORM_URL;
const GOOGLE_FORM_ENTRIES = process.env.GOOGLE_FORM_ENTRIES || JSON.parse('{}');

/**
 * Envia dados para Google Form de forma segura
 * @param {Object} data - Dados do formulário
 * @returns {Promise<Object>} Resposta da submissão
 */
async function submitToGoogleForm(data) {
  return new Promise((resolve, reject) => {
    if (!GOOGLE_FORM_URL) {
      return reject(new Error('GOOGLE_FORM_URL não configurada'));
    }

    try {
      // Mapear campos para IDs do formulário
      const formData = querystring.stringify({
        [GOOGLE_FORM_ENTRIES.nome || 'entry.123456789']: data.nome,
        [GOOGLE_FORM_ENTRIES.telefone || 'entry.987654321']: data.telefone,
        [GOOGLE_FORM_ENTRIES.email || 'entry.111111111']: data.email,
        [GOOGLE_FORM_ENTRIES.cpf || 'entry.222222222']: data.cpf,
        [GOOGLE_FORM_ENTRIES.cidade || 'entry.333333333']: data.cidade,
        [GOOGLE_FORM_ENTRIES.tamanho_camisa || 'entry.444444444']: data.tamanho_camisa,
        [GOOGLE_FORM_ENTRIES.timestamp]: new Date().toISOString(),
      });

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': formData.length
        }
      };

      const req = https.request(GOOGLE_FORM_URL, options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              success: true,
              message: 'Inscrição enviada com sucesso para Google Forms',
              timestamp: new Date().toISOString()
            });
          } else {
            reject(new Error(`Google Forms retornou status ${res.statusCode}`));
          }
        });
      });

      req.on('error', (error) => {
        console.error('Erro ao enviar para Google Forms:', error);
        reject(error);
      });

      // Enviar dados
      req.write(formData);
      req.end();

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Verifica limite de inscrições (100 pessoas)
 * Nota: Em produção, use Google Sheets API para contar respostas
 * @returns {Promise<number>} Número de inscrições
 */
async function getInscriptionCount() {
  // TODO: Implementar contagem real via Google Sheets API
  // Por enquanto, retorna 0 como placeholder
  return 0;
}

module.exports = {
  submitToGoogleForm,
  getInscriptionCount
};
