export async function handleTelegramUpdate(update, botToken) {
  if (!update.message || !update.message.text) return;

  const chatId = update.message.chat.id;
  const text = update.message.text;

  let replyText = "متوجه نشدم! از دکمه‌ها استفاده کن.";

  if (text === "/start") {
    replyText = "سلام! ربات با موفقیت فعال شد. از دکمه‌های زیر استفاده کن:";
  } else if (text === "ساعت") {
    const now = new Date();
    replyText = `⏰ ساعت فعلی: ${now.toLocaleTimeString('fa-IR', { timeZone: 'Asia/Tehran' })}`;
  } else if (text === "تقویم") {
    const today = new Date();
    replyText = `📅 تاریخ امروز: ${today.toLocaleDateString('fa-IR', { timeZone: 'Asia/Tehran' })}`;
  }

  // ساخت کیبورد برای تعامل ساده با ربات
  const keyboard = {
    reply_markup: {
      keyboard: [
        [{ text: "ساعت" }, { text: "تقویم" }],
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
