export async function handleTelegramUpdate(update, botToken) {
  if (!update.message || !update.message.text) return;

  const chatId = update.message.chat.id;
  const text = update.message.text;

  let replyText = "";

  // دستورات ثابت ربات
  if (text === "/start") {
    replyText = "سلام! من معلم هوشمند و آنلاین شما هستم 🎓\nهر سوالی در هر زمینه‌ای (درس، برنامه‌نویسی، زبان و...) داری ازم بپرس یا از دکمه‌های زیر استفاده کن:";
  } else if (text === "ساعت") {
    const now = new Date();
    replyText = `⏰ ساعت فعلی: ${now.toLocaleTimeString('fa-IR', { timeZone: 'Asia/Tehran' })}`;
  } else if (text === "تقویم") {
    const today = new Date();
    replyText = `📅 تاریخ امروز: ${today.toLocaleDateString('fa-IR', { timeZone: 'Asia/Tehran' })}`;
  } else if (text === "آب و هوا") {
    replyText = "🌤 وضعیت هوا: آفتابی و عالی!";
  } else if (text === "راهنما") {
    replyText = "💡 من به عنوان یک معلم آنلاین اینجا هستم تا به هر سوال علمی، فنی یا عمومی شما پاسخ دهم. کافی است پیام خود را بنویسید.";
  } else {
    // 🧠 بخش هوشمند و معلم آنلاین: اگر دکمه نبود، به عنوان سوال تلقی میشه و پاسخ داده میشه
    // فعلاً یک پاسخ هوشمند نمونه پویا می‌ذاریم، یا می‌تونیم به API هوش مصنوعی متصلش کنیم
    replyText = `👨‍🏫 معلم آنلاین:\nسوال شما را دریافت کردم: "${text}"\n\nبرای پاسخ‌دهی هوشمند کامل به هر سوال پیچیده، سیستم در حال تحلیل است. (در حال حاضر آماده‌ی دریافت تمرین‌ها و سوالات شما هستم!)`;
  }

  // کیبورد تعاملی ربات
  const keyboard = {
    reply_markup: {
      keyboard: [
        [{ text: "ساعت" }, { text: "تقویم" }],
        [{ text: "آب و هوا" }, { text: "راهنما" }],
        [{ text: "/start" }]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  };

  await sendTelegramMessage(botToken, chatId, replyText, keyboard);
}

async function sendTelegramMessage(token, chatId, text, extra = {}) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      ...extra
    })
  });
}
