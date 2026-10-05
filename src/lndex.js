import { Bot } from "grammy";
import { Hono } from "hono";

const app = new Hono();

app.post("/webhook", async (c) => {
  const env = c.env;
  const bot = new Bot(env.TELEGRAM_BOT_TOKEN);

  bot.command("start", async (ctx) => {
    await ctx.reply("سلام! ربات ساده شما روشن است و کار می‌کند.");
  });

  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text;
    await ctx.reply(`پیام شما دریافت شد: ${text}`);
  });

  try {
    const update = await c.req.json();
    await bot.handleUpdate(update);
  } catch (err) {
    console.error(err);
  }

  return c.text("ok");
});

app.get("/", (c) => c.text("Bot is alive"));

export default app;
