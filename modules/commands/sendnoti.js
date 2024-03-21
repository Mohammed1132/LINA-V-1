module.exports.config = {
    name: "اشعار",
    version: "1.0.0",
    hasPermssion: 2,
    credits: ".",
    description: "ارسال اشعار الى كل المجموعات.",
    usePrefix: true,
    commandCategory: "رسالة",
    usages: "[Text]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const threadList = await api.getThreadList(25, null, ['INBOX']);
    let sentCount = 0;
    const custom = args.join(' ');

    async function sendMessage(thread) {
        try {
            await api.sendMessage(`› رسالة من سيدي القروي 🤭:\n\n${custom}`, thread.threadID);
            sentCount++;
        } catch (error) {
            console.error("حدث خطأ في ارسال الرسالة:", error);
        }
    }

    for (const thread of threadList) {
        if (sentCount >= 20) {
            break;
        }
        if (thread.isGroup && thread.name != thread.threadID && thread.threadID != event.threadID) {
            await sendMessage(thread);
        }
    }

    if (sentCount > 0) {
        api.sendMessage(`› نجح ارسال الاشعار لكل المجموعات.`, event.threadID);
    } else {
        api.sendMessage("› لم يتم العثور على مجموعات لأرسال الاشعار إليها!.", event.threadID);
    }
};
