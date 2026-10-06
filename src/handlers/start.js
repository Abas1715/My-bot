export function getStartResponse() {
  return {
    text: "سلام! به ربات هوشمند و پیشرفته ما خوش آمدید. یکی از گزینه‌های زیر را انتخاب کنید یا پیام خود را برای پاسخگویی هوش مصنوعی بنویسید:",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "⏰ ساعت جاری", callback_data: "get_time" },
          { text: "📅 تقویم و تاریخ", callback_data: "get_date" }
        ],
        [
          { text: "🛠 وضعیت سیستم", callback_data: "get_status" }
        ]
      ]
    }
  };
}
