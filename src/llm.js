import { SYSTEM_PROMPT } from "./config.js";

export async function callLLM(env, messages) {
  const res = await fetch(`${env.LLM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.LLM_MODEL || "grok-2-vision-1212",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.55,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LLM Error: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export async function transcribeVoice(env, fileUrl) {
  const audioRes = await fetch(fileUrl);
  const audioBlob = await audioRes.blob();

  const form = new FormData();
  form.append("file", audioBlob, "voice.ogg");
  form.append("model", "whisper-1");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.WHISPER_API_KEY || env.LLM_API_KEY}`,
    },
    body: form,
  });

  if (!res.ok) throw new Error("Voice transcription failed");

  const data = await res.json();
  return data.text;
}
