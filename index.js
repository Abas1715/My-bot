export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Telegram Bot Worker is active and running correctly!', { status: 200 });
    }

    try {
      const update = await request.json();
      
      if (update.message && update.message.chat) {
        const chatId = update.message.chat.id;
        const text = update.message.text ? update.message.text.trim() : "";
        
        let replyText = "سلام! من سیستم هوشمند شما هستم. چطور می‌توانم کمکتان کنم؟";
        
        if (text === '/start' || text.toLowerCase().startsWith('/start')) {
          replyText = "سلام! 🚀 ربات شما با موفقیت و به صورت کاملاً جدید فعال شد.";
        } else if (text === '/help' || text.toLowerCase().startsWith('/help')) {
          replyText = "راهنمای ربات:\n/start - شروع به کار\n/help - دریافت راهنمایی";
        } else if (text.includes('خوبی')) {
          replyText = "ممنون، من حالم عالیه! شما چطورید؟";
        } else if (text.length > 0) {
          replyText = `دستور یا پیام شما («${text}») دریافت شد. چطور می‌توانم در این زمینه کمکتان کنم؟`;
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
}
