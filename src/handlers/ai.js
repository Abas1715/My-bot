export async function getAiResponse(userMessage) {
  try {
    const apiKey = "AQ.Ab8RN6KpH-2fo3x8OLrbvXql8rXWiISCQbhTV9ilowOu_1XYAA";
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
    
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      return `خطای گوگل: ${data.error.message}`;
    } else {
      return "متوجه شدم، اما پاسخی دریافت نشد.";
    }

  } catch (error) {
    return `خطا: ${error.message}`;
  }
}
