require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

const REMINDER_DELAY = 60 * 60 * 1000; // 1 hour

client.once("ready", async () => {
  console.log(`Bot online as ${client.user.tag}`);

  // TEMPORARY permission test
  try {
    const channel = await client.channels.fetch(
      process.env.REMINDER_CHANNEL_ID
    );

    if (!channel || !channel.isTextBased()) {
      console.error("Reminder channel not found or isn't text-based.");
      return;
    }

    await channel.send("Permissions are working.");
    console.log("Test message sent successfully.");
  } catch (error) {
    console.error("Test message failed:", error);
  }
});

client.on("guildMemberAdd", (member) => {
  console.log(`New member joined: ${member.user.tag}`);

  setTimeout(async () => {
    try {
      const currentMember = await member.guild.members.fetch(member.id);

      const nickname = (currentMember.nickname || "").trim();
      const nameParts = nickname.split(/\s+/).filter(Boolean);

      const hasValidName =
        nameParts.length === 2 &&
        nameParts[0].length >= 2 &&
        nameParts[1].length >= 2;

      if (hasValidName) {
        console.log("Nickname looks okay. No reminder needed.");
        return;
      }

      const channel = await client.channels.fetch(
        process.env.REMINDER_CHANNEL_ID
      );

      if (!channel || !channel.isTextBased()) {
        console.error("Reminder channel not found.");
        return;
      }

      await channel.send(
        `${currentMember} Please change your username to your first and last name ASAP to remain in the server.\n\n` +
        `To do so, follow these steps:\n\n` +
        `1. Click "Higgsfield x GOOD Marketing" in the top left.\n` +
        `2. Click "Edit Per-server Profile".\n` +
        `3. Change your name to your first and last name.`
      );

      console.log(`Reminder sent to ${currentMember.user.tag}`);
    } catch (error) {
      console.error("Reminder failed:", error);
    }
  }, REMINDER_DELAY);
});

client.login(process.env.DISCORD_TOKEN);
