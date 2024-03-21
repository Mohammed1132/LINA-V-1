module.exports.config = {
    name: "السجن",
    eventType: ["log:unsubscribe"],
    version: "0.0.1",
    credits: "القروي العشوائي",
    description: "Listen events"
};

module.exports.run = async({ event, api, Threads, Users }) => {
    let data = (await Threads.getData(event.threadID)).data || {};
    if (!data.antiout) return;
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
    const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
    const type = (event.author == event.logMessageData.leftParticipantFbId) ? "self-separation" : "got kicked out by the admin";
    if (type == "self-separation") {
        api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (error, info) => {
            if (error) {
                api.sendMessage(`ما قدرت ارجعه  ${name}انا اسفة جدا 😭😞 `, event.threadID)
            } else api.sendMessage('وين رايح يا حبيبي رجعتك لاني ما اقدر اعيش بدونك 😭', event.threadID);
        })
    }
}