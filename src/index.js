export default {
  async fetch(request, env, ctx) {
    if (!env.TELEGRAM_BOT_TOKEN) {
      return new Response("Error: TELEGRAM_BOT_TOKEN is missing!", { status: 500 });
    }

    if (request.method !== "POST") {
      return new Response("Enterprise Bot is active, secure, and running!");
    }

    try {
      const update = await request.json();
      
      // بررسی پیام‌های گروه یا چت خصوصی
      const message = update.message || update.edited_message;
      if (message && message.text) {
        const chatId = message.chat.id;
        const text = message.text;
        const userName = message.from.first_name || "کاربر عزیز";
        const chatType = message.chat.type; // 'private', 'group', 'supergroup'

        let replyText = `درود ${userName}! پیام شما دریافت شد و در صف پردازش قرار گرفت.`;
        let replyMarkup = undefined;

        // دستورات مدیریتی و عمومی شرکت
        if (text === "/start") {
          replyText = `سلام ${userName} عزیز! 🤖\nمن دستیار هوشمند و رسمی شرکت هستم. آماده‌ام تا به سوالات شما در گروه پاسخ دهم و امور را مدیریت کنم.`;
          replyMarkup = {
            inline_keyboard: [
              [
                { text: "📊 وضعیت سیستم", callback_data: "status" },
                { text: "ℹ️ راهنما", callback_data: "help" }
              ]
            ]
          };
        } else if (text === "/help" || text === "راهنما") {
          replyText = `📋 **راهنمای ربات سازمانی:**\n- برای شروع کار: /start\n- برای استعلام وضعیت: /status\n- ربات به صورت هوشمند پیام‌های گروه را رصد و پاسخ می‌دهد.`;
        } else if (text === "/status") {
          const time = new Date().toLocaleTimeString("fa-IR", { timeZone: "Asia/Tehran" });
          replyText = `🟢 سیستم کاملاً فعال است.\n⏰ زمان سرور: ${time}\n⚡️ بستر: Cloudflare Workers (پایدار و پرسرعت)`;
        } else {
          // اگر پیام عادی بود، پاسخ سازمانی استاندارد بدهد
          replyText = `مدیر گرامی / همکار عزیز (${userName})، پیام شما ثبت شد: "${text}". به زودی بررسی و پاسخ داده خواهد شد.`;
        }

        // ارسال پاسخ به تلگرام با ساختار امن
        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: replyText,
            parse_mode: "Markdown",
            reply_markup: replyMarkup
          })
        });
      } 
      // مدیریت دکمه‌های شیشه‌ای (اینلاین)
      else if (update.callback_query) {
        const cb = update.callback_query;
        const chatId = cb.message.chat.id;
        const data = cb.data;

        let answer = "عملیات با موفقیت انجام شد.";
        if (data === "status") {
          answer = "🟢 وضعیت سرور و پایگاه داده: پایدار و بدون قطعی.";
        } else if (data === "help") {
          answer = "💡 این ربات جهت پشتیبانی گروه شرکت طراحی شده است.";
        }

        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callback_query_id: cb.id,
            text: answer,
            show_alert: true
          })
        });
      }
    } catch (err) {
      return new Response("Critical Error: " + err.message, { status: 500 });
    }

    return new Response("OK", { status: 200 });
  }
};
