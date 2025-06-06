const dotenv = require('dotenv');
dotenv.config();
const TelegramBot = require("node-telegram-bot-api");
const User = require("../models/user");
const { getWeather } = require("../services/weatherService");
const cron = require("node-cron");

function startBot() {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: true,
  });

  // Handle /start command
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      let user = await User.findOne({ chatId });

      if (!user) {
        user = new User({
          chatId,
          username: msg.from.username,
          firstName: msg.from.first_name,
          lastName: msg.from.last_name,
        });
        await user.save();
      }

      const message = user.isBlocked
        ? "Your account is blocked. Contact admin for assistance."
        : `Welcome ${user.firstName}! Use commands:
        /subscribe - Get weather updates
        /weather - Current weather
        /unsubscribe - Stop updates`;

      bot.sendMessage(chatId, message);
    } catch (error) {
      console.error("Error in /start:", error);
    }
  });

  // Handle /subscribe command
  bot.onText(/\/subscribe/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await User.findOne({ chatId });

      if (!user) return bot.sendMessage(chatId, "Please /start first");
      if (user.isBlocked) return bot.sendMessage(chatId, "Account blocked");
      if (user.isSubscribed)
        return bot.sendMessage(chatId, "Already subscribed");

      bot.sendMessage(chatId, "Enter your city name:");

      // Wait for city response
      bot.once("message", async (cityMsg) => {
        if (cityMsg.text.startsWith("/")) {
          return bot.sendMessage(chatId, "Please enter a city name only");
        }

        user.city = cityMsg.text;
        user.isSubscribed = true;
        await user.save();

        try {
          const weather = await getWeather(user.city);
          bot.sendMessage(
            chatId,
            `Subscribed to ${user.city} weather updates!`
          );
          bot.sendMessage(
            chatId,
            `Current weather: ${weather.temp}°C, ${weather.description}`
          );
        } catch (error) {
          bot.sendMessage(chatId, `Error: ${error.message}. Try again.`);
          user.isSubscribed = false;
          await user.save();
        }
      });
    } catch (error) {
      console.error("Error in /subscribe:", error);
    }
  });

  // Handle /weather command
  bot.onText(/\/weather/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await User.findOne({ chatId });

      if (!user || !user.city) {
        return bot.sendMessage(chatId, "Please /subscribe first");
      }

      const weather = await getWeather(user.city);
      bot.sendMessage(
        chatId,
        `Current weather in ${user.city}: ${weather.temp}°C, ${weather.description}`
      );
    } catch (error) {
      bot.sendMessage(chatId, `Weather error: ${error.message}`);
    }
  });

  // Handle /unsubscribe command
  bot.onText(/\/unsubscribe/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await User.findOne({ chatId });

      if (!user || !user.isSubscribed) {
        return bot.sendMessage(chatId, "Not subscribed");
      }

      user.isSubscribed = false;
      await user.save();
      bot.sendMessage(chatId, "Unsubscribed from weather updates");
    } catch (error) {
      console.error("Error in /unsubscribe:", error);
    }
  });

  // Scheduled daily updates

  cron.schedule("0 8 * * *", async () => {
    // 8 AM daily
    try {
      const users = await User.find({ isSubscribed: true, isBlocked: false });

      for (const user of users) {
        try {
          const weather = await getWeather(user.city);
          bot.sendMessage(
            user.chatId,
            `🌤️ Daily Weather Update for ${user.city}:\n${weather.temp}°C, ${weather.description}`
          );
        } catch (error) {
          console.error(`Failed to send to ${user.chatId}:`, error);
        }
      }
    } catch (error) {
      console.error("Cron job error:", error);
    }
  });

  return bot;
}

module.exports = startBot;
