import { Bot, session } from "grammy";
import { Hono } from "hono";
import { callLLM, transcribeVoice } from "./llm.js";

const app = new Hono();

app.post("/webhook", async (c) => {
  const env = c.env;
  const bot = new Bot(env.BOT_TOKEN);

  bot.use(
    session({
      initial: () => ({ history: [] }),
      getSessionKey: (ctx) => ctx.from?.id.toString(),
      storage: {
        read: async (key) => {
          const data = await env.MEMORY.get(`user:${key}`, "json");
          return data || { history: [] };
        },
        write: async (key, value) => {
          const toSave = {
            history: (value.history || []).slice(-40),
          };
          await env.MEMORY.put(`user:${key}`, JSON.stringify(toSave), {
            expirationTtl: 60 * 60 * 24 * 120,
          });
        },
        delete: async (key) => await env.MEMORY.delete(`user:${key}`),
      },
    })
  );

  // متن
  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text.trim();

    if (text === "/reset" || text === "/پاکسازی") {
      ctx.session.history = [];
      await ctx.reply("حافظه پاک شد.");
      return;
    }

    ctx.session.history.push({ role: "user", content: text });

    try {
      await ctx.replyWithChatAction("typing");
      const reply = await callLLM(env, ctx.session.history);
      ctx.session.history.push({ role: "assistant", content: reply });

      if (reply.length > 4000) {
        for (const chunk of reply.match(/[\s\S]{1,4000}/g) || []) {
          await ctx.reply(chunk);
        }
      } else {
        await ctx.reply(reply);
      }
    } catch (err) {
      console.error(err);
      await ctx.reply("خطا رخ داد. دوباره تلاش کن.");
    }
  });

  // عکس
  bot.on("message:photo", async (ctx) => {
    try {
      await ctx.replyWithChatAction("typing");

      const photo = ctx.message.photo[ctx.message.photo.length - 1];
      const file = await ctx.api.getFile(photo.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${env.BOT_TOKEN}/${file.file_path}`;

      const caption = ctx.message.caption || "این عکس را کامل و دقیق تحلیل کن.";

      const messages = [
        ...ctx.session.history,
        {
          role: "user",
          content: [
            { type: "text", text: caption },
            { type: "image_url", image_url: { url: fileUrl } },
          ],
        },
      ];

      const reply = await callLLM(env, messages);

      ctx.session.history.push({ role: "user", content: `[عکس] ${caption}` });
      ctx.session.history.push({ role: "assistant", content: reply });

      await ctx.reply(reply);
    } catch (err) {
      console.error(err);
      await ctx.reply("نتونستم عکس را پردازش کنم.");
    }
  });

  // ویس و فایل صوتی
  bot.on(["message:voice", "message:audio"], async (ctx) => {
    try {
      await ctx.replyWithChatAction("typing");

      const fileId = ctx.message.voice?.file_id || ctx.message.audio?.file_id;
      const file = await ctx.api.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${env.BOT_TOKEN}/${file.file_path}`;

      const transcribed = await transcribeVoice(env, fileUrl);

      ctx.session.history.push({ role: "user", content: `[ویس] ${transcribed}` });

      const reply = await callLLM(env, ctx.session.history);
      ctx.session.history.push({ role: "assistant", content: reply });

      await ctx.reply(`متن ویس شما:\n${transcribed}\n\n${reply}`);
    } catch (err) {
      console.error(err);
      await ctx.reply("نتونستم ویس را تبدیل به متن کنم.");
    }
  });

  const update = await c.req.json();
  await bot.handleUpdate(update);
  return c.text("ok");
});

app.get("/", (c) => c.text("Ultimate Modular Bot is online"));

export default app;
