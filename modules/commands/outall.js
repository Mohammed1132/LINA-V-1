module.exports.config = {
	name: "مغادرة الكل",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "محتوى عشوائي",
	description: "مغادرة كل المجموعات!",
  usePrefix: true,
	commandCategory: "الادمن",
	usages: "sendnoti [Text]",
	cooldowns: 5,
	info: [
		{
			key: "Text",
			prompt: "The text you want to send to everyone",
			type: 'Document',
			example: 'Hello Em'
		}
	]
};

module.exports.run = async ({ api, event, args }) => {
	return api.getThreadList(200, null, ["INBOX"], (err, list) => {
		if (err) throw err;
		list.forEach(item => (item.isGroup == true && item.threadID != event.threadID) ? api.removeUserFromGroup(api.getCurrentUserID(), item.threadID) : '');
		api.sendMessage(' تم الخروج من كل المجموعات ⚜️', event.threadID);
	});
}