const axios = require("axios");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendToTelegram(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log("Telegram not configured");
    return;
  }

  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }
    );
    console.log("Message sent to Telegram");
  } catch (error) {
    console.error("Failed to send to Telegram:", error.message);
  }
}

function formatApplicationMessage(application) {
  const typeText =
    application.type === "standard"
      ? "📋 Standart zayavka"
      : "🧮 Loyihani hisoblash zayavkasi";

  return `
🔔 <b>Yangi zayavka!</b>

${typeText}

👤 <b>Ism:</b> ${application.name}
📧 <b>Email:</b> ${application.email}
📱 <b>Telefon:</b> ${application.phone}
${application.message ? `💬 <b>Xabar:</b> ${application.message}` : ""}

📅 <b>Sana:</b> ${new Date().toLocaleString("uz-UZ")}
`;
}

module.exports = {
  sendToTelegram,
  formatApplicationMessage,
};
