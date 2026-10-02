export async function handleTelegramUpdate(update, botToken) {
  if (!update.message || !update.message.text) return;

  const chatId = update.message.chat.id;
  const text = update.message.text;

  let replyText = "متوجه نشدم! از دکمه‌ها استفاده کن.";

  // اینجا دستورات و کلمات جدید رو اضافه کردیم
  if (text === "/start") {
    replyText = "سلام! ربات پیشرفته شما با موفقیت فعال شد. از دکمه‌های زیر استفاده کنید:";
  } else if (text === "ساعت") {
    const now = new Date();
    replyText = `⏰ ساعت فعلی: ${now.toLocaleTimeString('fa-IR', { timeZone: 'Asia/Tehran' })}`;
  } else if (text === "تقویم") {
    const today = new Date();
    replyText = `📅 تاریخ امروز: ${today.toLocaleDateString('fa-IR', { timeZone: 'Asia/Tehran' })}`;
  } else if (text === "آب و هوا") {
    // فعلاً یک پاسخ نمونه می‌ذاریم، بعداً می‌تونیم به API آب و هوا وصلش کنیم
    replyText = "🌤 وضعیت هوا: آفتابی و عالی! (به زودی اطلاعات آنلاین اضافه میشه)";
  } else if (text === "راهنما") {
    replyText = "💡 این ربات روی کلودفلر و گیت‌هاب میزبانی میشه. با استفاده از دکمه‌های پایین صفحه می‌تونی باهاش کار کنی.";
  }

  // کیبورد جدید با گزینه‌های بیشتر
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
