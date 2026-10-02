/**
 * Professional Telegram Bot for Cloudflare Workers
 * Robust, secure, and ready for production.
 */

export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Bot is online and running successfully!', { status: 200 });
    }

    try {
      const update = await request.json();
      ctx.waitUntil(handleUpdate(update, env));

      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 200 });
    }
  },
};

async function handleUpdate(update, env) {
  if (!update.message || !update.message.text) return;

  const chatId = update.message.chat.id;
  const messageText = update.message.text.trim();
  const userName = update.message.from.first_name || 'دوست عزیز';

  let responseText = '';

  if (messageText === '/start') {
    responseText = `سلام ${userName} عزیز! ✨\n\nمن ربات حرفه‌ای، قدرتمند و هوشمند شما هستم که روی کلودفلر میزبانی می‌شوم.\n\nاز دستورات زیر استفاده کنید:\n/help - راهنمایی و امکانات\n/status - بررسی وضعیت سیستم`;
  } else if (messageText === '/help') {
    responseText = `🛠 **راهنمای استفاده از ربات**:\n\nاین ربات ۲۴ ساعته آنلاین، فعال و بدون قطعی است.`;
  } else if (messageText === '/status') {
    responseText = `🟢 **وضعیت سیستم**: کاملاً فعال و پایدار (Online 24/7)\n🚀 سرعت پاسخگویی: عالی`;
  } else {
    responseText = `پیام شما دریافت شد: "${messageText}"\n\n✨ ربات حرفه‌ای شما به صورت پایدار در حال اجراست.`;
  }

  await sendTelegramMessage(chatId, responseText, env.TELEGRAM_BOT_TOKEN);
}

async function sendTelegramMessage(chatId, text, token) {
  const botToken = token;
  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN is not defined in environment variables.');
    return;
  }
  
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
  };

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Failed to send message to Telegram:', error);
  }
