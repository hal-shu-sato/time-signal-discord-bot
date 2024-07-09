require("dotenv").config();
const log4js = require("log4js");
const cron = require("node-cron");
const Discord = require("discord.js");

const logger = log4js.getLogger();
logger.level = "debug";
const client = new Discord.Client();
const prefix = process.env.PREFIX;
const broadcast = client.voice.createBroadcast();

const joinList = [];
const isAddedInList = (voiceId) => {
  return joinList.some((value) => {
    return value.voice.id === voiceId;
  });
};

broadcast.on("subscribe", (dispatcher) => {
  logger.info("New broadcast subscriber!");
});
broadcast.on("unsubscribe", (dispatcher) => {
  logger.info("Channel unsubscribed from broadcast :(");
});

client.on("ready", () => {
  const now = new Date();
  client.user.setPresence({ activity: { name: `${now.getHours()}時` } });
  logger.info(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  if (msg.content === `${prefix}ping`) {
    msg.reply("pong");
    logger.info(`Pinged from ${msg.channel.name} in ${msg.guild}.`);
  }

  if (!msg.guild) return;

  if (msg.content === `${prefix}start`) {
    if (!msg.member.voice.channel) {
      msg.reply("You need to join a voice channel first!");
      logger.info(
        "Requested to set time signals but requester don't join any voice channel.",
      );
      return;
    }
    if (!msg.member.voice.channel.joinable) {
      msg.reply("I cannot join your voice channel!");
      logger.info(
        "Requested to set time signals but I can't join the voice channel.",
      );
      return;
    }
    if (!msg.member.voice.channel.speakable) {
      msg.reply("I cannot speak in your voice channel!");
      logger.info(
        "Requested to set time signals but I can't speak the voice channel.",
      );
      return;
    }
    if (isAddedInList(msg.member.voice.channel.id)) {
      msg.reply("Already setted time signals.");
      logger.info(
        "Requested to set time signals but already setted time signals.",
      );
    } else {
      joinList.push({ text: msg.channel, voice: msg.member.voice.channel });
      if (isAddedInList(msg.member.voice.channel.id)) {
        msg.reply("Successful in setting time signals.");
        logger.info(
          `Successful in setting time signals of ${msg.member.voice.channel.name} in ${msg.guild}.`,
        );
        logger.debug(joinList);
      } else {
        msg.reply("Couldn't add to joining list. Please contact a developer.");
        logger.error("Couldn't add to joining list.");
        logger.debug(joinList);
      }
    }
  }

  if (msg.content === `${prefix}stop`) {
    if (!isAddedInList(msg.member.voice.channel.id)) {
      msg.reply("Already canceled time signals.");
      logger.info(
        "Requested to cancel time signals but already canceled time signals.",
      );
    } else {
      const indexNumber = joinList.findIndex((element) => {
        return element.voice.id === msg.member.voice.channel.id;
      });
      joinList.splice(indexNumber, 1);
      if (!isAddedInList(msg.member.voice.channel.id)) {
        msg.reply("Successful in canceling time signals.");
        logger.info(
          `Successful in canceling time signals of ${msg.member.voice.channel.name} in ${msg.guild}.`,
        );
        logger.debug(joinList);
      } else {
        msg.reply(
          "Couldn't remove from joining list. Please contact a developer.",
        );
        logger.error(
          `Couldn't remove ${msg.member.voice.channel.name} in ${msg.guild} from joining list.`,
        );
        logger.debug(joinList);
      }
    }
  }

  if (msg.content === `${prefix}test`) {
    if (msg.member.voice.channel.members.size != 0) {
      const connection = await msg.member.voice.channel.join();
      const dispatcher = connection.play("audio/Zihou01-4.mp3", {
        volume: 0.5,
      });
      const now = new Date();
      msg.channel.send(
        `It is ${now.getHours()}:${now.getMinutes()} now!\nSignal sound: Otologic ( https://otologic.jp )`,
      );
      dispatcher.on("finish", () => {
        dispatcher.destroy();
        connection.disconnect();
      });
    } else {
      msg.channel.text.send("You need to be joining a voice channel!");
    }
  }
});

const options = { timezone: "Asia/Tokyo" };
const voiceConnectionArray = [];
cron.schedule(
  "50 59 * * * *",
  () => {
    if (joinList.length === 0) return;
    joinList.forEach(async (value) => {
      if (value.voice.members.size != 0) {
        const connection = await value.voice.join();
        voiceConnectionArray.push(connection);
        connection.play(broadcast);
        logger.info(
          `Connected to ${value.voice.name} in ${value.voice.guild}.`,
        );
      } else {
        value.text.send("You need to be joining a voice channel!");
      }
    });
  },
  options,
);
cron.schedule(
  `57 59 * * * *`,
  () => {
    const dispatcher = broadcast.play("audio/Zihou01-4.mp3", {
      volume: 0.5,
    });
    logger.info(`Played a time signal.`);
    dispatcher.on("finish", () => {
      voiceConnectionArray.forEach((connection) => connection.disconnect());
      voiceConnectionArray.length = 0;
    });
  },
  options,
);
cron.schedule(
  `0 0 * * * *`,
  () => {
    const now = new Date();
    client.user.setPresence({ activity: { name: `${now.getHours()}時` } });
    joinList.forEach((value) => {
      value.text.send(
        `It is ${now.getHours()}:00 now!\nSignal sound: Otologic ( https://otologic.jp )`,
      );
    });
    logger.info(`Sent a time signal.`);
  },
  options,
);

client.login();
