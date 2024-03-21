module.exports.config = {
	name: "مسح",
	version: "1.0.1",
	hasPermssion: 0,
	credits: ".",
	description: "مسح رسائل البوت",
    usePrefix: true,
	commandCategory: "رسالة",
	usages: "unsend",
	cooldowns: 0
};

module.exports.run = function({ api, event, getText }) {
	if (!event.messageReply) {
		return api.sendMessage(getText("missingReply"), event.threadID, event.messageID);
	}

	if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage(getText("returnCant"), event.threadID, event.messageID);
	
	return api.unsendMessage(event.messageReply.messageID);
}

module.exports.languages = {
	"en": {
		"returnCant": "Can't remove other people's messages.",
		"missingReply": "You can't unsend a message out of nowhere. Please reply to a message first."
	}
}
