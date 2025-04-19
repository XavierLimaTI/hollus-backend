import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configurar o transporte de email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Função para enviar email
export const enviarEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: `"HOLLUS" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
};

// Função para enviar email de recuperação de senha
export const enviarEmailRecuperacaoSenha = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  
  const mailOptions = {
    from: `HOLLUS <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Recuperação de Senha - HOLLUS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #FF7F50;">HOLLUS - Recuperação de Senha</h2>
        <p>Você solicitou a recuperação de senha para sua conta na plataforma HOLLUS.</p>
        <p>Clique no botão abaixo para redefinir sua senha:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #FF7F50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Redefinir Senha
          </a>
        </p>
        <p style="color: #666;">Se você não solicitou a recuperação de senha, ignore este email.</p>
        <p style="color: #666;">Este link expirará em 1 hora.</p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          &copy; ${new Date().getFullYear()} HOLLUS. Todos os direitos reservados.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Falha ao enviar email de recuperação');
  }
};

// Função para enviar email de confirmação de sessão
export const enviarEmailConfirmacaoSessao = async (email, sessao, terapeuta) => {
  const dataFormatada = new Date(sessao.data).toLocaleString('pt-BR');
  
  const mailOptions = {
    from: `HOLLUS <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Confirmação de Sessão - HOLLUS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #FF7F50;">HOLLUS - Sessão Confirmada</h2>
        <p>Sua sessão foi confirmada com sucesso!</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Terapeuta:</strong> ${terapeuta.nome}</p>
          <p><strong>Especialidade:</strong> ${terapeuta.especialidade}</p>
          <p><strong>Data e Hora:</strong> ${dataFormatada}</p>
        </div>
        <p>Caso precise reagendar ou cancelar, entre em contato conosco com pelo menos 24 horas de antecedência.</p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          &copy; ${new Date().getFullYear()} HOLLUS. Todos os direitos reservados.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Falha ao enviar email de confirmação');
  }
};

// Função para enviar email de cancelamento de sessão
export const enviarEmailCancelamentoSessao = async (email, sessao, terapeuta) => {
  const dataFormatada = new Date(sessao.data).toLocaleString('pt-BR');
  
  const mailOptions = {
    from: `HOLLUS <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Cancelamento de Sessão - HOLLUS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #FF7F50;">HOLLUS - Sessão Cancelada</h2>
        <p>Sua sessão foi cancelada.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Terapeuta:</strong> ${terapeuta.nome}</p>
          <p><strong>Especialidade:</strong> ${terapeuta.especialidade}</p>
          <p><strong>Data e Hora:</strong> ${dataFormatada}</p>
        </div>
        <p>Se desejar reagendar, acesse sua conta na plataforma HOLLUS.</p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          &copy; ${new Date().getFullYear()} HOLLUS. Todos os direitos reservados.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Falha ao enviar email de cancelamento');
  }
};

// Adicionar função para envio de email de confirmação de pagamento
export const enviarEmailComprovantePagamento = async (email, sessao, terapeuta, pagamento) => {
  const dataFormatada = new Date(sessao.data).toLocaleString('pt-BR');
  
  const mailOptions = {
    from: `HOLLUS <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Comprovante de Pagamento - HOLLUS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #FF7F50;">HOLLUS - Pagamento Confirmado</h2>
        <p>Seu pagamento foi processado com sucesso!</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Terapeuta:</strong> ${terapeuta.nome}</p>
          <p><strong>Especialidade:</strong> ${terapeuta.especialidade || 'Não especificada'}</p>
          <p><strong>Data e Hora:</strong> ${dataFormatada}</p>
          <p><strong>Valor Pago:</strong> R$ ${pagamento.valor.toFixed(2)}</p>
          <p><strong>Método de Pagamento:</strong> ${
            pagamento.metodo === 'credit_card' ? 'Cartão de Crédito' : 
            pagamento.metodo === 'pix' ? 'PIX' : 'Boleto'
          }</p>
          <p><strong>Código da Transação:</strong> ${pagamento.comprovante}</p>
        </div>
        
        <p>Agradecemos pela confiança!</p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          &copy; ${new Date().getFullYear()} HOLLUS. Todos os direitos reservados.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Falha ao enviar email de comprovante');
  }
};