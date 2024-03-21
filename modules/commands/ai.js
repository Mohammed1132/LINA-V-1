const { Hercai } = require('hercai');
const herc = new Hercai();

module.exports.config = {
  name: 'يوكي',
  version: '1.1.0',
  hasPermssion: 0,
  credits: 'Yan Maglinte',
  description: 'تحدث مع الذكاء الاصطناعي!',
  usePrefix: false,
  commandCategory: 'شات بوت',
  usages: 'Ai [prompt]',
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const prompt = args.join(' ');

  try {
    // Available Models: "v3", "v3-32k", "turbo", "turbo-16k", "gemini"
    if (!prompt) {
      api.sendMessage('مرحبا كيف يمكنني مساعدتك اليوم؟', event.threadID, event.messageID);
      api.setMessageReaction('💓', event.messageID, () => {}, true);
    } else {
      api.setMessageReaction('⏱️', event.messageID, () => {}, true);
      const response = await herc.question({ model: 'v3', content: prompt });
      api.sendMessage(response.reply, event.threadID, event.messageID);
      api.setMessageReaction('', event.messageID, () => {}, true);
    }
  } catch (error) {
    api.sendMessage('⚠️ Something went wrong: ' + error, event.threadID, event.messageID);
    api.setMessageReaction('⚠️', event.messageID, () => {}, true);
  }
};