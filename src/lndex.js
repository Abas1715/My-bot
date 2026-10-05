export default {
  async fetch(request, env, ctx) {
    if (!env.TELEGRAM_BOT_TOKEN) {
      return new Response("Error: TELEGRAM_BOT_TOKEN is missing!", { status: 500 });
    }

    if (request.method !== "POST") {
      return new Response("Bot is active and running perfectly!");
    }

    try {
      const update = await request.json();
      
      if (update.message && update.message.text) {
        const chatId = update.message.chat.id;
        const text = update.message.text;

        let replyText = `پیام شما دریافت شد: ${text}`;
        if (text === "/start") {
          replyText = "سلام! ربات شما با موفقیت روی کلودفلر روشن است و کار می‌کند.";
        }

        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: replyText
          })
        });
      }
    } catch (err) {
      return new Response("Error processing update: " + err.message, { status: 500 });
    }

    return new Response("OK");
  }
};
