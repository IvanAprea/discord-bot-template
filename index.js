// Require the necessary discord.js classes
import { Client, Events, IntentsBitField } from "discord.js";
import dotenv from "dotenv";
import { createCommandsCollection } from "./utils/index.js";
import FileDirName from "./file-dir-name.js";
import path from "node:path";
import fs from "node:fs";

dotenv.config();
const { __dirname } = FileDirName();

// Create a new client instance
// Intents define which events Discord should send to your bot
const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
	],
});

// Load command files as commands on startup
createCommandsCollection(client);

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = import(`file://${filePath}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on("messageCreate", async (message) => {
	console.log(message);
	if (message.content === "4") {
		await message.reply("te pongo");
	}
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
