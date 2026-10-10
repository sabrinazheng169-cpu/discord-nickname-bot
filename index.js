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

const REMINDER_DELAY = 60 * 1000; // 1 minute for testing

client.on("guildMemberAdd", (member) => {
  console.log(`New member joined: ${member.user.tag}`);

  setTimeout(async () => {
    try {
      // Fetch the member's latest server nickname
      const currentMember =
        await member.guild.members.fetch(member.id);

      const nickname = (currentMember.nickname || "").trim();
      const nameParts = nickname.split(/\s+/).filter(Boolean);

      // Exactly 2 words, each at least 2 characters
      const hasValidName =
        nameParts.length === 2 &&
        nameParts[0].length >= 2 &&
        nameParts[1].length >= 2;

      if (hasValidName) {
        console.log("Nickname looks okay.");
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
        `${currentMember} Please change your username to your first and last name ASAP to remain in the server.\n\nTo do so, do the following:\n\nClick "Higgsfield x GOOD Marketing" in the top left\nClick "Edit Per-server Profile"\nChange your name to your First & Last name`
      );

      console.log(`Reminder sent to ${currentMember.user.tag}`);
    } catch (error) {
      console.error("Reminder failed:", error);
    }
  }, REMINDER_DELAY);
});

client.once("ready", () => {
  console.log(`Bot online as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
