// Require the necessary discord.js classes
import { Client, Events, IntentsBitField } from 'discord.js';
import dotenv from 'dotenv';
import { createCommandsCollection } from './utils/index.js';
dotenv.config();

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

// This code is run when the client is ready and connected to Discord
client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Load command files as commands on startup
createCommandsCollection(client);

// Listener to respond to the interactions
client.on(Events.InteractionCreate, async (interaction) => {
	// This if checks if the interaction is a command
	if (!interaction.isChatInputCommand()) return;
	// Get the command from the commands list
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		// Execute the requested command.
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
		else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	}
});

client.on('messageCreate', async (message) => {
	console.log(message);
	if (message.content === '4') {
		await message.reply('te pongo');
	}
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
