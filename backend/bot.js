require("dotenv").config();
const connectDB = require("./config/databaseConnection");
const startBot = require("./controllers/botController");

async function main() {
  try {
    // Connect to database first
    await connectDB();
    console.log("Database connected successfully........");

    // Start the Telegram bot
    const bot = startBot();
    console.log("Telegram bot started......");

    // Handle graceful shutdown
    process.on("SIGINT", () => {
      console.log("Stopping bot...");
      bot.stopPolling();
      process.exit();
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

main()
