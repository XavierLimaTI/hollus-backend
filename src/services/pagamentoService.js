import axios from 'axios';
import logger from '../utils/logger.js';

// Configure environment variables in your .env file:
// MERCADO_PAGO_ACCESS_TOKEN=TEST-0000000000000000-000000-00000000000000000000000000000000-000000000
// MERCADO_PAGO_PUBLIC_KEY=TEST-00000000-0000-0000-0000-000000000000

export async function processarPagamento(metodo, valor, dados) {
  try {
    if (metodo === 'credit_card') {
      return await processarCartaoCredito(valor, dados);
    } else if (metodo === 'pix') {
      return await processarPix(valor, dados);
    } else if (metodo === 'boleto') {
      return await processarBoleto(valor, dados);
    }
    throw new Error('Método de pagamento não suportado');
  } catch (error) {
    logger.error('Erro no processamento de pagamento', { error: error.message, metodo });
    
    // Durante desenvolvimento, ainda podemos usar o fallback simulado
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Usando simulação de pagamento em ambiente de desenvolvimento');
      return simularPagamento(metodo, valor);
    }
    
    throw error;
  }
}

// Implementação do MercadoPago para cartão de crédito
async function processarCartaoCredito(valor, dados) {
  try {
    const response = await axios.post(
      'https://api.mercadopago.com/v1/payments',
      {
        transaction_amount: Number(valor),
        token: dados.token,
        description: 'Sessão de terapia HOLLUS',
        installments: dados.parcelas || 1,
        payment_method_id: dados.paymentMethodId,
        payer: {
          email: dados.email
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      success: response.data.status === 'approved',
      transactionId: response.data.id,
      message: response.data.status_detail,
      paymentData: response.data
    };
  } catch (error) {
    logger.error('Erro ao processar pagamento com cartão', error);
    throw new Error(`Erro ao processar pagamento: ${error.message}`);
  }
}

// Implementação para PIX
async function processarPix(valor, dados) {
  try {
    const response = await axios.post(
      'https://api.mercadopago.com/v1/payments',
      {
        transaction_amount: Number(valor),
        payment_method_id: 'pix',
        description: 'Sessão de terapia HOLLUS',
        payer: {
          email: dados.email,
          first_name: dados.nome,
          identification: {
            type: 'CPF',
            number: dados.cpf
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      success: true,
      transactionId: response.data.id,
      message: 'PIX gerado com sucesso',
      qrCode: response.data.point_of_interaction.transaction_data.qr_code,
      qrCodeBase64: response.data.point_of_interaction.transaction_data.qr_code_base64,
      expiresAt: response.data.date_of_expiration,
      paymentData: response.data
    };
  } catch (error) {
    logger.error('Erro ao gerar PIX', error);
    throw new Error(`Erro ao gerar PIX: ${error.message}`);
  }
}

// Implementação para boleto
async function processarBoleto(valor, dados) {
  try {
    const response = await axios.post(
      'https://api.mercadopago.com/v1/payments',
      {
        transaction_amount: Number(valor),
        payment_method_id: 'bolbradesco',
        description: 'Sessão de terapia HOLLUS',
        payer: {
          email: dados.email,
          first_name: dados.nome,
          identification: {
            type: 'CPF',
            number: dados.cpf
          },
          address: {
            zip_code: dados.cep,
            street_name: dados.rua,
            street_number: dados.numero
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      success: true,
      transactionId: response.data.id,
      message: 'Boleto gerado com sucesso',
      boletoUrl: response.data.transaction_details.external_resource_url,
      barCode: response.data.barcode.content,
      expiresAt: response.data.date_of_expiration,
      paymentData: response.data
    };
  } catch (error) {
    logger.error('Erro ao gerar boleto', error);
    throw new Error(`Erro ao gerar boleto: ${error.message}`);
  }
}

// Função de simulação para desenvolvimento/testes
function simularPagamento(metodo, valor) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% de chance de sucesso
      resolve({
        success,
        transactionId: success ? `tx_${Date.now()}` : null,
        message: success ? 'Pagamento aprovado' : 'Pagamento recusado',
        simulation: true
      });
    }, 1500);
  });
}