import dotenv from "dotenv";
import {
  Client,
  GatewayIntentBits,
  Message,
  User,
  TextChannel,
  PartialUser,
  PartialMessage,
} from "discord.js";
import { runGlif, glifOfTheDay, glifs } from "./glif";

dotenv.config();

const { DISCORD_BOT_TOKEN, DISCORD_APPLICATION_ID, GLIF_API_TOKEN } =
  process.env;
if (!DISCORD_BOT_TOKEN || !DISCORD_APPLICATION_ID) {
  throw new Error("missing required ENV vars");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    // GatewayIntentBits.DirectMessages,
    // GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});

client.login(DISCORD_BOT_TOKEN);

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) {
    // console.debug("ignoring bot user (possibly self)");
    return;
  }

  if (message.content === "!selfie") {
    processMessage(message, message.author);
  } else if (message.content === "!glifs") {
    await message.channel.send(
      "Available selfie glifs:\n" +
        glifs.map((glif) => `- [${glif.name}](<${glif.url}>)`).join("\n")
    );
  } else if (message.content == "!help") {
    await message.channel.send(`Commands:
- !selfie
- !glifs
- !help`);
  } else {
    // debugMessage();
    // console.debug("ignoring message");
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return;
  if (reaction.emoji.name === "🖼️") {
    processMessage(reaction.message, user);
  }
});

function debugMessage(message: Message | PartialMessage) {
  if (!message?.author) {
    console.warn(
      "debugMessage: message.author is blank, it's partial, aborting for now"
    );
    return;
  }

  const data = {
    content: message.content,
    channel: {
      type: message.channel.type,
      name:
        message.channel instanceof TextChannel ? message.channel.name : "???",
    },
    author: {
      username: message.author.username,
      displayName: message.author.displayName,
      globalName: message.author.globalName,
      avatarRaw: message.author.displayAvatarURL(),
      avatar: message.author.displayAvatarURL({ extension: "jpg", size: 1024 }),
    },
  };
  console.debug("debugMessage", data);
}

async function processMessage(
  message: Message | PartialMessage,
  user: User | PartialUser
) {
  // abort if partial (for now)
  if (!user?.username) {
    console.warn("processMessage: missing data, skipping", { message, user });
    return;
  }

  const glif = await glifOfTheDay();
  // console.log("processMessage glif =>", glif);

  const userProfilePhoto = user.displayAvatarURL({
    extension: "png",
    size: 512,
    forceStatic: true,
  });

  const addonMessages = [
    "you look nice today btw",
    "did you get a haircut? looks great",
    "so cute <3",
    "reticulating splines lol",
    "nice photo you've got there",
    "doo doo dee doo",
    "*taps foot impatiently*",
    "this won't take long",
    "omg look out behind you! just kidding",
  ];
  const addonMessage =
    addonMessages[Math.floor(Math.random() * addonMessages.length)];

  const processingMessage = await message.channel.send(`Let's try using [${
    glif.name
  }](<${glif.url}>) by [@${glif.username}](<${glif.userUrl}>)
Processing [${user.username}](${userProfilePhoto})... ${
    addonMessage ? `${addonMessage}...` : ""
  }`);

  // TODO add my "...1s, 2s" update message a la /glif command

  let imageUrl;
  try {
    imageUrl = await runGlif(glif.id, user.username, userProfilePhoto);
  } catch (e: any) {
    console.error("runGlif error", e);
    await processingMessage.edit(
      `Error processing image :(: ${e?.message ?? "unknown error idk"}`
    );
    return;
  }

  await processingMessage.delete();

  // const generatedImageEmbed = new EmbedBuilder()
  //   .setImage(imageUrl)
  //   .setTimestamp();

  await message.channel.send({
    content: `<@${user.id}> run through [${glif.name}](<${glif.url}>) by [@${glif.username}](<${glif.userUrl}>)`,
    // embeds: [generatedImageEmbed],
    // @ts-ignore FIXME this works, but tsc doesn't like it
    files: [imageUrl],
  });
}
