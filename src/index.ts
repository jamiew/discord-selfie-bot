import dotenv from "dotenv";
import {
  Client,
  GatewayIntentBits,
  Message,
  EmbedBuilder,
  MessageReaction,
  User,
  CommandInteraction,
  SlashCommandBuilder,
  PartialMessageReaction,
} from "discord.js";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

const IMAGE_FILE = "path/to/image.png";

// Replace the function that generates the image
async function runGlif(
  username: string,
  userProfilePhoto: string
): Promise<string> {
  // Implement your image generation logic here
  // and return the path to the generated image
  return "path/to/generated/image.png";
}

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("Pong!");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;

  if (message.content === "!postimage") {
    const imageEmbed = new EmbedBuilder()
      .setImage("attachment://image.png")
      .setTimestamp();

    const sentMessage = await message.channel.send({
      embeds: [imageEmbed],
      files: [IMAGE_FILE],
    });

    await sentMessage.react("🖼️");
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return;

  if (reaction.emoji.name === "🖼️") {
    const message = reaction.message;
    const processingMessage = await message.channel.send(
      `Processing for ${user.username}...`
    );

    const userProfilePhoto = user.displayAvatarURL();
    const generatedImagePath = await runGlif(user.username, userProfilePhoto);

    await processingMessage.delete();

    const generatedImageEmbed = new EmbedBuilder()
      .setImage("attachment://generated_image.png")
      .setTimestamp();

    await message.channel.send({
      content: `<@${user.id}>`,
      embeds: [generatedImageEmbed],
      files: [generatedImagePath],
    });
  }
});

client.login(DISCORD_TOKEN);
