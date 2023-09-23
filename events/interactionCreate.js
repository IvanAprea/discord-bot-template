import { Events } from "discord.js";

export default {
	name: Events.InteractionCreate,
	// Listener to respond to the interactions
	async execute(interaction) {
		// This if checks if the interaction is a command
		if (!interaction.isChatInputCommand()) return;
		// Get the command from the commands list
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(
				`No command matching ${interaction.commandName} was found.`
			);
			return;
		}

		try {
			// Execute the requested command.
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			}
		}
	},
};
