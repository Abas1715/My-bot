import { getStartResponse } from './handlers/start.js';
import { handleToolRequest } from './handlers/tools.js';
import { getAiResponse } from './handlers/ai.js';

const BOT_TOKEN = "8679743132:AAEntzXsHdX6cV8MMUdtcL_u5iORdjd-g9s";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // تنظیم خودکار وبهوک با باز کردن لینک همراه با ?setWebhook=true
    if (url.searchParams.has('setWebhook')) {
      const workerUrl = `${url.protocol}//${url.host}`;
      const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${workerUrl}`;
      
      const response = await fetch(telegramApiUrl);
      const result = await response.json();
      
      return new Response(JSON.stringify({
        success: result.ok,
        message: result.ok ? "Webhook was set successfully!" : "Failed to set webhook",
        details: result
      }, null, 2), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    // دریافت و پردازش پیام‌های تلگرام
    if (request.method === 'POST') {
      try {
        const update = await request.json();
        
        let chatId = null;
        let textToSend = "";
        let replyMarkup = null;

        if (update.message) {
          chatId = update.message.chat.id;
          const text = update.message.text;

          if (text === '/start') {
            const res = getStartResponse();
            textToSend = res.text;
            replyMarkup = res.reply_markup;
          } else {
            // ارسال پیام به هوش مصنوعی جمینای
            textToSend = await getAiResponse(text);
          }
        } 
        else if (update.callback_query) {
          chatId = update.callback_query.message.chat.id;
          const data = update.callback_query.data;
          
          textToSend = handleToolRequest(data);
        }

        if (chatId && textToSend) {
          await sendTelegramMessage(chatId, textToSend, replyMarkup);
        }

        return new Response('OK', { status: 200 });
      } catch (err) {
        return new Response(`Error: ${err.message}`, { status: 500 });
      }
    }

    return new Response('AI Telegram Bot Worker is Running! Add ?setWebhook=true to initialize.', { status: 200 });
  }
};

async function sendTelegramMessage(chatId, text, replyMarkup = null) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const body = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown'
  };

  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}
