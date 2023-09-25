// Require the necessary discord.js classes
import { Client, IntentsBitField } from "discord.js";
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

const importEvent = async (filePath) => {
	try {
		const { default: event } = await import(filePath);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	} catch (error) {
		console.error(error);
	}
};

const loadEvents = async () => {
	const eventsPath = path.join(__dirname, "events");
	const eventFiles = fs
		.readdirSync(eventsPath)
		.filter((file) => file.endsWith(".js"));
	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		await importEvent(`file://${filePath}`);
	}
};

await createCommandsCollection(client);
client.login(process.env.DISCORD_TOKEN);

// Log in to Discord with your client's token
loadEvents().then(async () => {
	// Load command files as commands on startup
  await createCommandsCollection(client);
	client.login(process.env.DISCORD_TOKEN);
});
