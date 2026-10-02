export default {
  async fetch(request, env, ctx) {
    if (request.method === "POST") {
      const update = await request.json();
      
      if (update.message && update.message.text) {
        const chatId = update.message.chat.id;
        const text = update.message.text;

        const replyText = `سلام! پیام شما را دریافت کردم: ${text}`;

        await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: replyText
          })
        });
      }
      return new Response("OK");
    }
    return new Response("Bot is running!");
  }
};
