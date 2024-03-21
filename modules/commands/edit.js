module.exports.config = {
  name: "تعديل",
  version: "1.0",
  hasPermssion: 0,
  credits: 'Yan Maglinte',
  description: `تعديل رسائل البوت!`,
  usePrefix: true,
  commandCategory: 'رسالة',
  usages: 'رد على الرسالة بالامر و رسالة التعديل',
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const reply = event.messageReply.body;
  const edit = `${args.join(" ")}`;
  
  if (!reply || !args || args.length === 0) {
    api.sendMessage("من فضلك قم بالرد على رسالة البوت التي تريد تعديلها.", event.threadID, event.messageID);
    return;
  }

  try {
    await api.editMessage(`${edit}`, event.messageReply.messageID);
    api.setMessageReaction('✅', event.messageID, () => {}, true);
  } catch (error) {
    console.error("خطأ في تعديل الرسالة", error);
    api.sendMessage("An error occurred while editing the message. Please try again later.", event.threadID);
  }
};
