llback_data: "btn_date" }
      ],
      [
        { text: "⚡ تست وضعیت سرور", callback_data: "btn_ping" },
        { text: "ℹ️ راهنما", callback_data: "btn_info" }
      ]
    ]
  };
}

// تابع فرستادن اطلاعات به تلگرام
async function sendTelegram(token, method, data) {
  return await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}
