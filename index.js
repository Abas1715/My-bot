/**
 * Professional Telegram Bot for Cloudflare Workers
 * Features: Robust error handling, clean architecture, responsive formatting, and 24/7 reliability.
 */

export default {
  async fetch(request, env, ctx) {
    // Only accept POST requests from Telegram Webhook
    if (request.method !== 'POST') {
      return new Response('Bot is active and running successfully!', { status: 200 });
    }

    try {
      const update = await request.json();
      
      // Process the message asynchronously to ensure rapid webhook response
      ctx.waitUntil(handleUpdate(update, env));

      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      // Catch structural errors to prevent crashing the worker
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

  // Advanced Command Handling
  if (messageText === '/start') {
    responseText = `سلام ${userName} عزیز! ✨\n\nمن ربات حرفه‌ای، قدرتمند و هوشمند شما هستم که همیشه آنلاین و آماده‌ی سرویس‌‌دهی هستم.\n\nاز منو یا دستورات زیر استفاده کنید:\n/help - راهنمایی و امکانات\n/status - بررسی وضعیت سیستم\n/about - درباره من`;
  } else if (messageText === '/help') {
    responseText = `🛠 **راهنمای استفاده از ربات**:\n\nاین ربات بر روی زیرساخت پرسرعت Cloudflare Workers میزبانی می‌شود و هیچ‌وقت خاموش نمی‌شود.\n\nپیام‌های عادی شما را با استایلی زیبا پاسخ خواهم داد.`;
  } else if (messageText === '/status') {
    responseText = `🟢 **وضعیت سیستم**: کاملاً فعال، پایدار و آنلاین (Online 24/7)\n🚀 سرعت پاسخگویی: عالی\n⚡️ میزبان: Cloudflare Workers`;
  } else if (messageText === '/about') {
    responseText = `🤖 این ربات با کدهای استاندارد، مدرن و بهینه‌سازی‌شده برای کارکرد بدون قطعی توسعه یافته است.`;
  } else {
    // Professional echo/smart reply format
    responseText = `پیام شما دریافت شد:\n" ${messageText} "\n\n✨ سیستم با موفقیت پردازش را انجام داد.`;
  }

  await sendTelegramMessage(chatId, responseText, env.TELEGRAM_BOT_TOKEN);
}

async function sendTelegramMessage(chatId, text, token) {
  // If token is missing from environment variables, fallback gracefully
  const botToken = token || 'YOUR_BOT_TOKEN_HERE';
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const payload = {
    chat_path: chatId, // standard telegram mapping
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
}
