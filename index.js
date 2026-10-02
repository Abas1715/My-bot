export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('ربات تلگرام فعال است و آماده دریافت پیام‌هاست.', { status: 200 });
    }

    try {
      const update = await request.json();
      
      if (update.message && update.message.chat) {
        const chatId = update.message.chat.id;
        const text = update.message.text ? update.message.text.trim() : "";
        
        let replyText = "متوجه شدم. لطفاً دستورات صحیح را ارسال کنید.";
        
        if (text === '/start' || text.toLowerCase().startsWith('/start')) {
          replyText = "سلام! 🚀 ربات هوشمند شما با موفقیت از طریق گیت‌هاب فعال شد و آماده پاسخگویی است.";
        } else if (text === '/help' || text.toLowerCase().startsWith('/help')) {
          replyText = "راهنمای ربات:\n/start - شروع به کار\n/help - دریافت راهنمایی\n\nمی‌توانید سوالات خود را بپرسید.";
        } else if (text.includes('خوبی') || text.includes('چطورید')) {
          replyText = "ممنون، من یک دستیار دیجیتال هستم و حالم عالیست! شما چطورید؟";
        } else if (text.includes('سلام') || text.includes('درود')) {
          replyText = "سلام و درود بر شما! روزتون بخیر، چطور می‌توانم کمکتان کنم؟";
        } else if (text.length > 0) {
          replyText = "درخواست شما با موفقیت دریافت شد. چطور می‌توانم بیشتر راهنمایی‌تان کنم؟";
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
