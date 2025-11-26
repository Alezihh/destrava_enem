// Facebook Conversions API
// IMPORTANTE: Este token pode expirar. Verifique no Facebook Business Manager
const ACCESS_TOKEN = 'EAAQxPpZAWT1sBQB0sdj3eMor2kDEv3aklyy8SKHPHCEjuQWKHeDYuA8MvqDQLeR66RY1cZALykJZATQgMUfKQMZC5qgfjnqldWYjvrcVWVh23uN9tgFvFxoNV93FnIRCuclEhTSSxX1aWfyup3gdioyZCw0dLhWpHQQ3d2BGXpDr50SCuqLodCtWjzxUcGbIsggZDZD';
const PIXEL_ID = '845736898104589';
const PIXEL_ID_OLD = '1822278489164552'; // Pixel antigo

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

    const response = await fetch(`https://graph.facebook.com/v18.0/${PIXEL_ID}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('Erro ao enviar evento de conversão:', await response.text());
    } else {
      console.log('Evento de conversão enviado com sucesso:', eventName);
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
    // Enviar para ambos os pixels
    (window as any).fbq('track', 'InitiateCheckout', eventData, { eventID: `${PIXEL_ID}_${Date.now()}` });
    (window as any).fbq('track', 'InitiateCheckout', eventData, { eventID: `${PIXEL_ID_OLD}_${Date.now()}` });
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
    // Enviar para ambos os pixels
    (window as any).fbq('track', 'ViewContent', eventData, { eventID: `${PIXEL_ID}_${Date.now()}` });
    (window as any).fbq('track', 'ViewContent', eventData, { eventID: `${PIXEL_ID_OLD}_${Date.now()}` });
  } else {
    console.error('❌ Facebook Pixel não está disponível para trackViewContent');
  }
}

// Função para verificar se o Pixel está funcionando
export function checkPixelStatus() {
  console.log('🔍 Verificando status do Facebook Pixel...');
  console.log('Pixel ID (Novo):', PIXEL_ID);
  console.log('Pixel ID (Antigo):', PIXEL_ID_OLD);
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
          (window as any).fbq('init', PIXEL_ID);
          (window as any).fbq('init', PIXEL_ID_OLD);
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
