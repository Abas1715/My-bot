import { handleTelegramUpdate } from './handlers.js';

export default {
  async fetch(request, env, ctx) {
    if (request.method === "POST") {
      try {
        const update = await request.json();
        await handleTelegramUpdate(update, env.TELEGRAM_BOT_TOKEN);
        return new Response("OK", { status: 200 });
      } catch (err) {
        return new Response("Error processing update", { status: 500 });
      }
    }

    // مسیر کمکی برای ست کردن خودکار وب‌هوک تلگرام
    const url = new URL(request.url);
    if (url.pathname === "/set-webhook") {
      const webhookUrl = `${url.origin}/`;
      const setUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
      const res = await fetch(setUrl);
      const data = await res.json();
      return new Response(JSON.stringify(data, null, 2), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Telegram Bot is running on Cloudflare Workers!", { status: 200 });
  }
};
