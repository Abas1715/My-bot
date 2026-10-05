export default {
  async fetch(request, env, ctx) {
    if (!env.TELEGRAM_BOT_TOKEN) {
      return new Response("Error: TELEGRAM_BOT_TOKEN is missing!", { status: 500 });
    }

    if (request.method !== "POST") {
      return new Response("Bot is active and running successfully!");
    }

    try {
      const update = await request.json();
      
      // بررسی پیام‌های متنی ارسالی از کاربر
      if (update.message && update.message.text) {
        const chatId = update.message.chat.id;
        const text = update.message.text;

        let replyText = "پیام شما دریافت شد. چه کمکی از دست من برمی‌آید؟";
        let replyMarkup = {
          inline_keyboard: [
            [
              { text: "⏰ ساعت", callback_data: "time" },
              { text: "📅 تقویم", callback_data: "date" }
            ]
          ]
        };

        if (text === "/start") {
          replyText = "سلام! ربات شما با موفقیت روی کلودفلر روشن شد و آماده‌ی کار است. از دکمه‌های زیر استفاده کنید:";
        } else if (text === "ساعت" || text === "⏰ ساعت") {
          const now = new Date().toLocaleTimeString("fa-IR", { timeZone: "Asia/Tehran" });
          replyText = `⏰ ساعت دقیق فعلی: ${now}`;
          replyMarkup = undefined;
        } else if (text === "تقویم" || text === "📅 تقویم") {
          const today = new Date().toLocaleDateString("fa-IR", { timeZone: "Asia/Tehran" });
          replyText = `📅 امروز تاریخ: ${today}`;
          replyMarkup = undefined;
        }

        // ارسال پاسخ به تلگرام
        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: replyText,
            reply_markup: replyMarkup
          })
        });
      } 
      // بررسی کلیک روی دکمه‌های شیشه‌ای
      else if (update.callback_query) {
        const callbackQuery = update.callback_query;
        const chatId = callbackQuery.message.chat.id;
        const data = callbackQuery.data;

        let answerText = "";
        if (data === "time") {
          const now = new Date().toLocaleTimeString("fa-IR", { timeZone: "Asia/Tehran" });
          answerText = `⏰ ساعت فعلی: ${now}`;
        } else if (data === "date") {
          const today = new Date().toLocaleDateString("fa-IR", { timeZone: "Asia/Tehran" });
          answerText = `📅 تاریخ امروز: ${today}`;
        }

        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: answerText
          })
        });
      }
    } catch (err) {
      return new Response("Error processing update: " + err.message, { status: 500 });
    }

    return new Response("OK");
  }
};
