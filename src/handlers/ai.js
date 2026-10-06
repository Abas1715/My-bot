export async function getAiResponse(userMessage) {
  try {
    const apiKey = "AQ.Ab8RN6LBjDcOhQ8IgceQlFw7x4l-py2itu6aDaZpiZVPX36HPw";
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: userMessage }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      return `خطای گوگل: ${data.error.message}`;
    } else {
      return "پاسخی از هوش مصنوعی دریافت نشد.";
    }

  } catch (error) {
    return `خطای سیستمی: ${error.message}`;
  }
}
