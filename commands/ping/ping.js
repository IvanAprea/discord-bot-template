import { SlashCommandBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		// Command name
		.setName("ping")
		// Command description when listing all commands
		.setDescription("Replies with Pong!"),
	execute: async (interaction) => {
		await interaction.reply("Pong!");
	},
};
