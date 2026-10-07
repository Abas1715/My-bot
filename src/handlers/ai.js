export async function getAiResponse(userMessage, env) {
  try {
    const accessToken = env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userMessage }]
          }
        ]
      })
    });

    const data = await response.json();
    
    // چاپ کل ساختار برای دیباگ و پیدا کردن محل پاسخ
    return `پاسخ خام گوگل: ${JSON.stringify(data)}`;

  } catch (error) {
    return `خطا: ${error.message}`;
  }
}
