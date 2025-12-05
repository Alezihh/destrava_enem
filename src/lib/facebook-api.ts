// Facebook Conversions API
// IMPORTANTE: Este token pode expirar. Verifique no Facebook Business Manager
const PIXEL_ID_OLD = '1822278489164552'; // Pixel antigo
const PIXEL_ID_THIRD = '1207950487964826'; // Terceiro pixel
const ACCESS_TOKEN_THIRD = 'EAASsfLae6dkBQPBW4VOwOLxdHz2CXqZBnbGgd5oZAf78BxIhJE8doSR8aZCJnguH4pUSDx3ijhKeoDw5NKam7kGRWX33OGSfGqGfKA95yHQ33Cd6KZADTADf95k5SnfdVDcJeLxBxQJ39jW7q9yQHgS6PxkFYQfKbsySI6mq5qZBbVl5R50Gd0ZCbmFlOTG1kxPwZDZD'; // Token do terceiro pixel

// Função para hash de email (SHA256)
async function hashEmail(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(email.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Função para hash de telefone (SHA256)
async function hashPhone(phone: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(phone.replace(/\D/g, '')); // Remove caracteres não numéricos
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Função para enviar evento de conversão
export async function sendConversionEvent(
  eventName: string,
  value: number,
  currency: string = 'BRL',
  email?: string,
  phone?: string
) {
  try {
    const userData: any = {};
    
    if (email) {
      userData.em = [await hashEmail(email)];
    }
    
    if (phone) {
      userData.ph = [await hashPhone(phone)];
    }

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          user_data: userData,
          custom_data: {
            currency: currency,
            value: value.toString()
          }
        }
      ]
    };

    // Enviar para o terceiro pixel
    const responseThird = await fetch(`https://graph.facebook.com/v18.0/${PIXEL_ID_THIRD}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN_THIRD}`
      },
      body: JSON.stringify(payload)
    });

    if (!responseThird.ok) {
      console.error('Erro ao enviar evento de conversão (terceiro pixel):', await responseThird.text());
    } else {
      console.log('Evento de conversão enviado com sucesso (terceiro pixel):', eventName);
    }
  } catch (error) {
    console.error('Erro ao enviar evento de conversão:', error);
  }
}

// Função para rastrear clique no botão de compra
export function trackPurchaseClick(planType: 'basic' | 'complete', value: number) {
  console.log('🛒 Debug: trackPurchaseClick chamado', { planType, value });
  
  // Rastrear no pixel do Facebook (ambos os pixels)
  if (typeof window !== 'undefined' && (window as any).fbq) {
    console.log('✅ Enviando InitiateCheckout para Facebook Pixel');
    const eventData = {
      content_name: `Enem Nota Mil ${planType === 'basic' ? 'Básico' : 'Completo'}`,
      content_category: 'Education',
      value: value,
      currency: 'BRL'
    };
    // Enviar para todos os pixels
    (window as any).fbq('track', 'InitiateCheckout', eventData, { eventID: `${PIXEL_ID_OLD}_${Date.now()}` });
    (window as any).fbq('track', 'InitiateCheckout', eventData, { eventID: `${PIXEL_ID_THIRD}_${Date.now()}` });
  } else {
    console.error('❌ Facebook Pixel não está disponível para trackPurchaseClick');
  }

  // Enviar para Conversions API
  console.log('📡 Enviando para Conversions API');
  sendConversionEvent('InitiateCheckout', value, 'BRL');
}

// Função para rastrear visualização da página
export function trackPageView() {
  console.log('🔍 Debug: trackPageView chamado');
  console.log('🔍 Debug: window disponível:', typeof window !== 'undefined');
  console.log('🔍 Debug: fbq disponível:', typeof window !== 'undefined' && (window as any).fbq);
  
  if (typeof window !== 'undefined' && (window as any).fbq) {
    console.log('✅ Enviando PageView para Facebook Pixel');
    // PageView é enviado automaticamente na inicialização, mas podemos forçar se necessário
    (window as any).fbq('track', 'PageView');
  } else {
    console.error('❌ Facebook Pixel não está disponível');
  }
}

// Função para rastrear visualização do conteúdo
export function trackViewContent(contentName: string) {
  console.log('👁️ Debug: trackViewContent chamado', { contentName });
  
  if (typeof window !== 'undefined' && (window as any).fbq) {
    console.log('✅ Enviando ViewContent para Facebook Pixel');
    const eventData = {
      content_name: contentName,
      content_category: 'Education'
    };
    // Enviar para todos os pixels
    (window as any).fbq('track', 'ViewContent', eventData, { eventID: `${PIXEL_ID_OLD}_${Date.now()}` });
    (window as any).fbq('track', 'ViewContent', eventData, { eventID: `${PIXEL_ID_THIRD}_${Date.now()}` });
  } else {
    console.error('❌ Facebook Pixel não está disponível para trackViewContent');
  }
}

// Função para verificar se o Pixel está funcionando
export function checkPixelStatus() {
  console.log('🔍 Verificando status do Facebook Pixel...');
  console.log('Pixel ID (Antigo):', PIXEL_ID_OLD);
  console.log('Pixel ID (Terceiro):', PIXEL_ID_THIRD);
  console.log('Window disponível:', typeof window !== 'undefined');
  console.log('fbq disponível:', typeof window !== 'undefined' && (window as any).fbq);
  
  if (typeof window !== 'undefined' && (window as any).fbq) {
    console.log('fbq loaded:', (window as any).fbq.loaded);
    console.log('fbq queue:', (window as any).fbq.queue);
    return true;
  }
  return false;
}

// Função para forçar o carregamento do Pixel se não estiver disponível
export function ensurePixelLoaded() {
  if (typeof window === 'undefined') return;
  
  // Se o fbq não estiver disponível após 3 segundos, tentar recarregar
  setTimeout(() => {
    if (!(window as any).fbq) {
      console.warn('⚠️ Facebook Pixel não carregou, tentando recarregar...');
      
      // Recarregar o script do Facebook
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
      
      // Re-inicializar o Pixel
      setTimeout(() => {
        if ((window as any).fbq) {
          console.log('✅ Facebook Pixel recarregado com sucesso');
          (window as any).fbq('init', PIXEL_ID_OLD);
          (window as any).fbq('init', PIXEL_ID_THIRD);
          (window as any).fbq('track', 'PageView');
        }
      }, 1000);
    }
  }, 3000);
}

// Declaração global para o fbq
declare global {
  interface Window {
    fbq: any;
  }
}
