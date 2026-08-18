// netlify/functions/send-email.js
// Esta função envia emails usando a API Resend (gratuita)
// Você precisa criar uma conta gratuita em https://resend.com

const handler = async (event) => {
  // Apenas POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { respondent, report } = JSON.parse(event.body);

    // Validar dados
    if (!respondent.email || !respondent.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email e nome são obrigatórios' })
      };
    }

    // Dados do admin (você)
    const adminEmail = process.env.ADMIN_EMAIL || 'paulo@pauloalbuquerque.com.br';
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('RESEND_API_KEY não configurada');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Serviço de email não configurado' })
      };
    }

    // Email para o respondente (com relatório HTML)
    const respondentEmailHtml = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0; opacity: 0.9; }
          .content { padding: 30px 0; }
          .section { margin-bottom: 30px; }
          .section h2 { color: #1e3a5f; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
          .score { color: #7c3aed; font-weight: bold; font-size: 18px; }
          .profile-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #7c3aed; }
          .profile-box h3 { color: #1e3a5f; margin-top: 0; }
          .characteristics { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
          .char-item { font-size: 14px; }
          .char-item:before { content: "✓ "; color: #10b981; font-weight: bold; margin-right: 5px; }
          .button { display: inline-block; background: linear-gradient(135deg, #2c5aa0, #7c3aed); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 10px 0; }
          .footer { text-align: center; padding-top: 30px; border-top: 1px solid #e2e8f0; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Seu Diagnóstico de Liderança</h1>
            <p>Modelo LEAD - Hersey e Blanchard</p>
          </div>

          <div class="content">
            <p>Olá <strong>${respondent.name}</strong>,</p>
            <p>Parabéns por completar o Diagnóstico de Liderança Situacional! Aqui está seu resultado personalizado.</p>

            <div class="section">
              <h2>Seus Resultados</h2>
              <div class="profile-box">
                <h3>${respondent.dominantStyle === 'E1' ? 'ESTILO 1: DETERMINAR (DIRIGIR)' : respondent.dominantStyle === 'E2' ? 'ESTILO 2: PERSUADIR (VENDER)' : respondent.dominantStyle === 'E3' ? 'ESTILO 3: COMPARTILHAR (APOIAR)' : 'ESTILO 4: DELEGAR'}</h3>
                <div class="score">Pontuação: ${respondent.scores[respondent.dominantStyle]} de 12</div>
                <p><strong>Seu Estilo Dominante:</strong> Você possui uma tendência forte para o estilo ${respondent.dominantStyle}.</p>
                <p><strong>Cargo:</strong> ${respondent.position}</p>
                <p><strong>Data da Avaliação:</strong> ${respondent.reportDate}</p>
              </div>
            </div>

            <div class="section">
              <h2>Distribuição de Estilos</h2>
              <p>Sua pontuação em cada estilo de liderança:</p>
              <ul>
                <li><strong>E1 (Determinar):</strong> ${respondent.scores.E1} de 12</li>
                <li><strong>E2 (Persuadir):</strong> ${respondent.scores.E2} de 12</li>
                <li><strong>E3 (Compartilhar):</strong> ${respondent.scores.E3} de 12</li>
                <li><strong>E4 (Delegar):</strong> ${respondent.scores.E4} de 12</li>
              </ul>
            </div>

            <div class="section">
              <p>Para ver o relatório completo com análises detalhadas, gráficos e recomendações, você pode:</p>
              <ul>
                <li>Abrir o PDF anexado a este email</li>
                <li>Voltar para a ferramenta e fazer download novamente</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <p>Diagnóstico de Liderança Situacional | Modelo LEAD (Hersey & Blanchard)</p>
            <p>Este é um diagnóstico de autoavaliação. Use os insights para seu desenvolvimento contínuo.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email para o admin (você)
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e3a5f; color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { padding: 20px 0; }
          .info-box { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #7c3aed; margin-bottom: 15px; }
          .info-box strong { color: #1e3a5f; }
          .stats { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin-top: 10px; }
          .stat { background: white; padding: 10px; text-align: center; border-radius: 4px; border: 1px solid #e2e8f0; }
          .stat-value { font-size: 18px; font-weight: bold; color: #7c3aed; }
          .stat-label { font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Nova Resposta Recebida</h1>
            <p>Diagnóstico de Liderança Situacional</p>
          </div>

          <div class="content">
            <div class="info-box">
              <strong>Respondente:</strong> ${respondent.name}
            </div>

            <div class="info-box">
              <strong>E-mail:</strong> ${respondent.email}
            </div>

            <div class="info-box">
              <strong>Cargo/Posição:</strong> ${respondent.position}
            </div>

            <div class="info-box">
              <strong>Estilo Dominante:</strong> ${respondent.dominantStyle} (${respondent.scores[respondent.dominantStyle]} de 12)
            </div>

            <div class="info-box">
              <strong>Data:</strong> ${respondent.reportDate}
              <div class="stats">
                <div class="stat">
                  <div class="stat-value">${respondent.scores.E1}</div>
                  <div class="stat-label">E1</div>
                </div>
                <div class="stat">
                  <div class="stat-value">${respondent.scores.E2}</div>
                  <div class="stat-label">E2</div>
                </div>
                <div class="stat">
                  <div class="stat-value">${respondent.scores.E3}</div>
                  <div class="stat-label">E3</div>
                </div>
                <div class="stat">
                  <div class="stat-value">${respondent.scores.E4}</div>
                  <div class="stat-label">E4</div>
                </div>
              </div>
            </div>

            <p>O relatório completo foi enviado para ${respondent.email}.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 1. Enviar email para o respondente
    const respondentResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@diagnostico-lead.com',
        to: respondent.email,
        subject: `Seu Diagnóstico de Liderança Situacional - ${respondent.name}`,
        html: respondentEmailHtml,
      })
    });

    if (!respondentResponse.ok) {
      console.error('Erro ao enviar email para respondente:', await respondentResponse.text());
    }

    // 2. Enviar email para o admin
    const adminResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@diagnostico-lead.com',
        to: adminEmail,
        subject: `[LEAD] Nova Resposta: ${respondent.name} - ${respondent.dominantStyle}`,
        html: adminEmailHtml,
      })
    });

    if (!adminResponse.ok) {
      console.error('Erro ao enviar email para admin:', await adminResponse.text());
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Emails enviados com sucesso'
      })
    };

  } catch (error) {
    console.error('Erro na função:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

exports.handler = handler;
