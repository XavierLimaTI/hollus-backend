/**
 * Email templates for the application
 */

export const getSessionConfirmationTemplate = (sessao, terapeuta) => {
  const dataFormatada = new Date(sessao.data).toLocaleString('pt-BR');
  
  return {
    subject: 'Confirmação de Sessão - HOLLUS',
    text: `Sua sessão com ${terapeuta.nome} foi confirmada para ${dataFormatada}. Observações: ${sessao.observacoes || 'Nenhuma'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #f97316; margin: 0;">HOLLUS</h1>
          <p style="color: #666; font-size: 14px;">Saúde e bem-estar</p>
        </div>
        
        <h2 style="color: #f97316;">Confirmação de Sessão</h2>
        <p>Olá!</p>
        <p>Sua sessão foi confirmada com sucesso!</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Terapeuta:</strong> ${terapeuta.nome}</p>
          <p><strong>Especialidade:</strong> ${terapeuta.especialidade || 'Não especificada'}</p>
          <p><strong>Data e Hora:</strong> ${dataFormatada}</p>
          <p><strong>Observações:</strong> ${sessao.observacoes || 'Nenhuma'}</p>
        </div>
        
        <p>Lembre-se de chegar com 10 minutos de antecedência.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0; text-align: center; color: #666; font-size: 12px;">
          <p>Atenciosamente,<br>Equipe HOLLUS</p>
          <p>Se tiver dúvidas, entre em contato conosco respondendo este email.</p>
        </div>
      </div>
    `
  };
};

export const getSessionReminderTemplate = (sessao, terapeuta) => {
  const dataFormatada = new Date(sessao.data).toLocaleString('pt-BR');
  
  return {
    subject: 'Lembrete de Sessão - HOLLUS',
    text: `Lembrete: Você tem uma sessão agendada com ${terapeuta.nome} para ${dataFormatada}.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #f97316; margin: 0;">HOLLUS</h1>
          <p style="color: #666; font-size: 14px;">Saúde e bem-estar</p>
        </div>
        
        <h2 style="color: #f97316;">Lembrete de Sessão</h2>
        <p>Olá!</p>
        <p>Este é um lembrete para sua sessão agendada para amanhã:</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Terapeuta:</strong> ${terapeuta.nome}</p>
          <p><strong>Especialidade:</strong> ${terapeuta.especialidade || 'Não especificada'}</p>
          <p><strong>Data e Hora:</strong> ${dataFormatada}</p>
          <p><strong>Observações:</strong> ${sessao.observacoes || 'Nenhuma'}</p>
        </div>
        
        <p>Lembre-se de chegar com 10 minutos de antecedência.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0; text-align: center; color: #666; font-size: 12px;">
          <p>Atenciosamente,<br>Equipe HOLLUS</p>
          <p>Se precisar reagendar, entre em contato conosco o mais breve possível.</p>
        </div>
      </div>
    `
  };
};

export const getSessionCancellationTemplate = (sessao, terapeuta) => {
  const dataFormatada = new Date(sessao.data).toLocaleString('pt-BR');
  
  return {
    subject: 'Sessão Cancelada - HOLLUS',
    text: `Sua sessão com ${terapeuta.nome} agendada para ${dataFormatada} foi cancelada.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #f97316; margin: 0;">HOLLUS</h1>
          <p style="color: #666; font-size: 14px;">Saúde e bem-estar</p>
        </div>
        
        <h2 style="color: #f97316;">Sessão Cancelada</h2>
        <p>Olá!</p>
        <p>Informamos que sua sessão foi cancelada.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Terapeuta:</strong> ${terapeuta.nome}</p>
          <p><strong>Data e Hora:</strong> ${dataFormatada}</p>
        </div>
        
        <p>Se desejar reagendar, por favor acesse nossa plataforma.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0; text-align: center; color: #666; font-size: 12px;">
          <p>Atenciosamente,<br>Equipe HOLLUS</p>
          <p>Se tiver dúvidas, entre em contato conosco respondendo este email.</p>
        </div>
      </div>
    `
  };
};

export const getPasswordResetTemplate = (resetUrl) => {
  return {
    subject: 'Recuperação de Senha - HOLLUS',
    text: `Você solicitou a recuperação de senha. Por favor, clique no link a seguir para redefinir sua senha: ${resetUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #f97316; margin: 0;">HOLLUS</h1>
          <p style="color: #666; font-size: 14px;">Saúde e bem-estar</p>
        </div>
        
        <h2 style="color: #f97316;">Recuperação de Senha</h2>
        <p>Olá!</p>
        <p>Você solicitou a recuperação de senha.</p>
        <p>Clique no botão abaixo para redefinir sua senha:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="display: inline-block; background-color: #f97316; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Redefinir Senha
          </a>
        </div>
        
        <p>Se você não solicitou esta recuperação, por favor ignore este email.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0; text-align: center; color: #666; font-size: 12px;">
          <p>Atenciosamente,<br>Equipe HOLLUS</p>
          <p>Este link expira em 1 hora por motivos de segurança.</p>
        </div>
      </div>
    `
  };
};