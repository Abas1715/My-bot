export async function getAiResponse(userMessage) {
  try {
    const apiKey = "AQ.Ab8RN6LBjDcOhQ8IgceQlFw7x4l-py2itu6aDaZpiZVPX36HPw";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
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
    
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return "متوجه شدم، اما پاسخی از هوش مصنوعی دریافت نشد.";
    }

  } catch (error) {
    return "خطا در ارتباط با سرویس هوش مصنوعی.";
  }
}
