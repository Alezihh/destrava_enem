// Facebook Conversions API
// IMPORTANTE: Este token pode expirar. Verifique no Facebook Business Manager
const ACCESS_TOKEN = 'EAAQxPpZAWT1sBQB0sdj3eMor2kDEv3aklyy8SKHPHCEjuQWKHeDYuA8MvqDQLeR66RY1cZALykJZATQgMUfKQMZC5qgfjnqldWYjvrcVWVh23uN9tgFvFxoNV93FnIRCuclEhTSSxX1aWfyup3gdioyZCw0dLhWpHQQ3d2BGXpDr50SCuqLodCtWjzxUcGbIsggZDZD';
const PIXEL_ID = '845736898104589';

// TikTok Conversions API
const TIKTOK_ACCESS_TOKEN = 'f5379a926a1c0f3fc5c9af69aed5cf56e18715ea';
const TIKTOK_PIXEL_ID = 'D4IQ403C77UBQQ2RBCVG';

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

// Função para enviar evento de conversão (Facebook)
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
      console.error('Erro ao enviar evento de conversão (Facebook):', await response.text());
    } else {
      console.log('Evento de conversão enviado com sucesso (Facebook):', eventName);
    }
  } catch (error) {
    console.error('Erro ao enviar evento de conversão (Facebook):', error);
  }
}

// Função para enviar evento de conversão (TikTok)
export async function sendTikTokConversionEvent(
  eventName: string,
  value: number,
  currency: string = 'BRL',
  email?: string,
  phone?: string
) {
  try {
    const userData: any = {};
    
    if (email) {
      userData.email = [await hashEmail(email)];
    }
    
    if (phone) {
      userData.phone_number = [await hashPhone(phone)];
    }

    const payload = {
      pixel_code: TIKTOK_PIXEL_ID,
      event: eventName,
      event_id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      context: {
        page: {
          url: typeof window !== 'undefined' ? window.location.href : '',
        },
        user: userData,
      },
      properties: {
        value: value,
        currency: currency,
      }
    };

    const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': TIKTOK_ACCESS_TOKEN
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao enviar evento de conversão (TikTok):', errorText);
    } else {
      console.log('Evento de conversão enviado com sucesso (TikTok):', eventName);
    }
  } catch (error) {
    console.error('Erro ao enviar evento de conversão (TikTok):', error);
  }
}

// Função para rastrear clique no botão de compra
export function trackPurchaseClick(planType: 'basic' | 'complete', value: number) {
  console.log('🛒 Debug: trackPurchaseClick chamado', { planType, value });
  // Eventos de tracking removidos
}

// Função para rastrear visualização da página
export function trackPageView() {
  console.log('🔍 Debug: trackPageView chamado');
  console.log('🔍 Debug: window disponível:', typeof window !== 'undefined');
  console.log('🔍 Debug: fbq disponível:', typeof window !== 'undefined' && (window as any).fbq);
  
  if (typeof window !== 'undefined' && (window as any).fbq) {
    console.log('✅ Enviando PageView para Facebook Pixel');
    (window as any).fbq('track', 'PageView');
  } else {
    console.error('❌ Facebook Pixel não está disponível');
  }

  // TikTok Pixel já rastreia PageView automaticamente no carregamento, mas podemos garantir
  if (typeof window !== 'undefined' && (window as any).ttq) {
    console.log('✅ TikTok Pixel disponível (PageView já foi enviado automaticamente)');
  }
}

// Função para rastrear visualização do conteúdo
export function trackViewContent(contentName: string) {
  console.log('👁️ Debug: trackViewContent chamado', { contentName });
  
  if (typeof window !== 'undefined' && (window as any).fbq) {
    console.log('✅ Enviando ViewContent para Facebook Pixel');
    (window as any).fbq('track', 'ViewContent', {
      content_name: contentName,
      content_category: 'Education'
    });
  } else {
    console.error('❌ Facebook Pixel não está disponível para trackViewContent');
  }

  // Rastrear no TikTok Pixel
  if (typeof window !== 'undefined' && (window as any).ttq) {
    console.log('✅ Enviando ViewContent para TikTok Pixel');
    (window as any).ttq.track('ViewContent', {
      content_name: contentName,
      content_category: 'Education'
    });
  } else {
    console.error('❌ TikTok Pixel não está disponível para trackViewContent');
  }
}

// Função para verificar se o Pixel está funcionando
export function checkPixelStatus() {
  console.log('🔍 Verificando status do Facebook Pixel...');
  console.log('Pixel ID:', PIXEL_ID);
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
          (window as any).fbq('track', 'PageView');
        }
      }, 1000);
    }
  }, 3000);
}

// Declaração global para o fbq e ttq
declare global {
  interface Window {
    fbq: any;
    ttq: any;
  }
}
