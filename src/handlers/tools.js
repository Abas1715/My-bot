export function handleToolRequest(action) {
  const now = new Date();
  
  const optionsTime = { timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const optionsDate = { timeZone: 'Asia/Tehran', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };

  const timeStr = new Intl.DateTimeFormat('fa-IR', optionsTime).format(now);
  const dateStr = new Intl.DateTimeFormat('fa-IR', optionsDate).format(now);

  if (action === 'get_time') {
    return `⏰ ساعت دقیق در ایران: \n${timeStr}`;
  } else if (action === 'get_date') {
    return `📅 امروز:\n${dateStr}`;
  } else if (action === 'get_status') {
    return `🟢 وضعیت ربات: کاملاً فعال و پایدار\n🚀 در حال اجرا روی Cloudflare Workers با هوش مصنوعی جمینای`;
  }
  
  return "دستور نامعتبر است.";
}
