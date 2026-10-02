export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Telegram Bot Worker is active!', { status: 200 });
    }

    try {
      const update = await request.json();
      
      if (update.message && update.message.chat) {
        const chatId = update.message.chat.id;
        const text = update.message.text ? update.message.text.trim() : "";
        
        let replyText = "پیام شما دریافت شد. در حال حاضر ربات آماده دریافت دستورات است! ✨";
        
        if (text === '/start') {
          replyText = "سلام! 🚀 ربات شما با موفقیت فعال شد و آماده پاسخگویی است.";
        } else if (text === '/help') {
          replyText = "راهنما:\nدستورات معتبر:\n/start - شروع ربات\n/help - راهنما";
        } else if (text.length > 0) {
          replyText = `پیام شما با موفقیت دریافت شد: "${text}". چطور می‌توانم کمکتان کنم؟`;
        }

        const token = env.TELEGRAM_BOT_TOKEN;
        if (!token) {
          return new Response('Error: TELEGRAM_BOT_TOKEN is missing.', { status: 500 });
        }

        const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
        await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: replyText
          })
        });
      }
      
      return new Response('OK', { status: 200 });
    } catch (err) {
      return new Response('Error: ' + err.message, { status: 200 });
    }
  }
};
