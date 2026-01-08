const axios = require("axios");

async function testTelegram() {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log("❌ Telegram bot konfiguratsiyasi topilmadi!");
    console.log("");
    console.log(".env fayliga quyidagilarni qo'shing:");
    console.log("TELEGRAM_BOT_TOKEN=your_bot_token");
    console.log("TELEGRAM_CHAT_ID=your_chat_id");
    return;
  }

  try {
    console.log("📱 Telegram botni tekshirish...");
    console.log("Token:", TELEGRAM_BOT_TOKEN.substring(0, 10) + "...");
    console.log("Chat ID:", TELEGRAM_CHAT_ID);
    console.log("");

    const message = `
🧪 <b>Test Xabar</b>

✅ Telegram bot muvaffaqiyatli sozlandi!
⏰ Vaqt: ${new Date().toLocaleString("uz-UZ")}

Bu test xabar. Zayavkalar shu formatda yuboriladi.
`;

    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }
    );

    console.log("✅ Xabar muvaffaqiyatli yuborildi!");
    console.log("Message ID:", response.data.result.message_id);
  } catch (error) {
    console.log("❌ Xatolik yuz berdi:");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Xato:", error.response.data.description);

      if (error.response.data.description.includes("bot was blocked")) {
        console.log("\n⚠️  Bot bloklangan yoki guruhdan chiqarilgan.");
        console.log("Botni guruhga qayta qo'shing va admin qiling.");
      } else if (error.response.data.description.includes("chat not found")) {
        console.log("\n⚠️  Chat ID noto'g'ri yoki bot guruhda emas.");
        console.log("Chat ID ni to'g'ri kiriting va botni guruhga qo'shing.");
      } else if (error.response.data.description.includes("Unauthorized")) {
        console.log("\n⚠️  Bot token noto'g'ri.");
        console.log("BotFather dan yangi token oling.");
      }
    } else {
      console.log(error.message);
    }
  }
}

require("dotenv").config();
testTelegram();
