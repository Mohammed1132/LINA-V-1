const fs = require('fs-extra');
const ytdl = require('@distube/ytdl-core');
const Youtube = require('youtube-search-api');
const axios = require('axios');
const convertHMS = (value) => new Date(value * 1000).toISOString().slice(11, 19);

const config = {
     name: "صوت",
     version: "1.0.0",
     hasPermssion: 0,
     credits: "قروي",
     description: "تشغيل موسيقى من اليوتيوب",
     usePrefix: true,
     commandCategory: "تنزيل",
     usages: "[searchMusic]",
     cooldowns: 0
};

const downloadMusicFromYoutube = async (link, path, itag = 249) => {
     try {
         var timestart = Date.now();
         var data = await ytdl.getInfo(link);
         var result = {
             title: data.videoDetails.title,
             dur: Number(data.videoDetails.lengthSeconds),
             viewCount: data.videoDetails.viewCount,
             likes: data.videoDetails.likes,
             author: data.videoDetails.author.name,
             timestart: timestart
         };
         return new Promise((resolve, reject) => {
             ytdl(link, {
                 filter: format => format.itag == itag
             }).pipe(fs.createWriteStream(path)).on('finish', () => {
                 resolve({
                     data: path,
                     info: result
                 });
             });
         });
     } catch (e) {
         return console.log(e);
     }
};

const handleReply = async ({ api, event, handleReply }) => {
     try {
         const path = `${__dirname}/cache/audio-${event.senderID}.mp3`;
         const { data, info } = await downloadMusicFromYoutube("https://www.youtube.com/watch?v=" + handleReply.link[event.body - 1], path);

         if (fs.statSync(data).size > 26214400) return api.sendMessage('⚠️تعذر إرسال الملف لأن حجمه أكبر من 25 ميجابايت..', event.threadID, () => fs.unlinkSync(path), event.messageID);
         api.unsendMessage(handleReply.messageID);

         const message = {
             body: `❍━━━━━━━━━━━━❍\n🎵 عنوان: ${info.title}\n⏱️ المدة: ${convertHMS(info.dur)}\n⏱️ وقت المعالجة: ${Math.floor((Date.now() - info.timestart) / 1000)} ثواني\n❍━━━━━━━━━━━━❍`,
             attachment: fs.createReadStream(data),
         };
         return api.sendMessage(message, event.threadID, async () => {
             fs.unlinkSync(path);
         }, event.messageID);
     } catch (error) {
         console.log(error);
     }
};

const run = async function ({ api, event, args }) {
     if (!args?.length) return api.sendMessage('❯ اكتب عن ماذا تبحث!', event.threadID, event.messageID);

     const keywordSearch = args.join(" ");
     const path = `${__dirname}/cache/sing-${event.senderID}.mp3`;

     if (args[0]?.startsWith("https://")) {
         try {
             const { data, info } = await downloadMusicFromYoutube(args[0], path);
             const body = `❍━━━━━━━━━━━━❍\n🎵 عنوان: ${info.title}\n⏱️ المدة: ${convertHMS(info.dur)}\n⏱️ وقت المعالجة: ${Math.floor((Date.now() - info.timestart) / 1000)} ثواني\n❍━━━━━━━━━━━━❍`;

             if (fs.statSync(data).size > 26214400) {
                 return api.sendMessage('⚠️تعذر إرسال الملف لأن حجمه أكبر من 25 ميجابايت..', event.threadID, () => fs.unlinkSync(data), event.messageID);
             }

             return api.sendMessage({ body, attachment: fs.createReadStream(data) }, event.threadID, () => fs.unlinkSync(data), event.messageID);
         } catch (e) {
             console.log(e);
         }
     } else {
         try {
             const data = (await Youtube.GetListByKeyword(keywordSearch, false, 6))?.items ?? [];
             const link = data.map(value => value?.id);
             const thumbnails = [];

             for (let i = 0; i < data.length; i++) {
                 const thumbnailUrl = `https://i.ytimg.com/vi/${data[i]?.id}/hqdefault.jpg`;
                 const thumbnailPath = `${__dirname}/cache/thumbnail-${event.senderID}-${i + 1}.jpg`;
                 const response = await axios.get(thumbnailUrl, { responseType: 'arraybuffer' });
                 fs.writeFileSync(thumbnailPath, Buffer.from(response.data, 'binary'));
                 thumbnails.push(fs.createReadStream(thumbnailPath));
             }

             const body = `هناك  ${link.length} نتيجة بحث للكلمة التى طلبتها :\n\n${data.map((value, index) => `❍━━━━━━━━━━━━❍\n${index + 1} - ${value?.title} (${value?.length?.simpleText})\n\n`).join('')}❯ يرجى الرد واختيار واحدة من النتائج اعلاه`;

             return api.sendMessage({ attachment: thumbnails, body }, event.threadID, (error, info) => {
                 for (let i = 0; i < thumbnails.length; i++) {
                     fs.unlinkSync(`${__dirname}/cache/thumbnail-${event.senderID}-${i + 1}.jpg`);
                 }

                 global.client.handleReply.push({
                     type: 'reply',
                     name: config.name,
                     messageID: info.messageID,
                     author: event.senderID,
                     link
                 });
             }, event.messageID);
         } catch (e) {
             return api.sendMessage(`⚠️حدث خطأ، يرجى المحاولة مرة أخرى لاحقا!\n${e}`, event.threadID, event.messageID);
         }
     }
};

module.exports = { config, run, handleReply };
