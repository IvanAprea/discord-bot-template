import { Collection } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

/**
 * This function will load all command files from the commands
 * directory and add them to the client.commands collection.
 * @param client The Discord client instance
 */
export const createCommandsCollection = (client) => {
	client.commands = new Collection();
	const commandsPath = path.join(__dirname, 'commands');
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
};
