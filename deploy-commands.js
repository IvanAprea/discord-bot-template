import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
import fs from "node:fs";
import path from "node:path";
import FileDirName from "./file-dir-name.js";

// This file should be run onceyou want to deploy your commands to Discord.
const { __dirname } = FileDirName(import.meta);
const commands = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

const deployCommands = async () => {
	// Construct and prepare an instance of the REST module
	const rest = new REST().setToken(process.env.DISCORD_TOKEN);

	// and deploy your commands!
	(async () => {
		try {
			console.log(
				`Started refreshing ${commands.length} application (/) commands.`
			);
			console.log(commands);
			// The put method is used to fully refresh all commands in the guild with the current set
			const data = await rest.put(
				Routes.applicationGuildCommands(
					process.env.APP_ID,
					process.env.SERVER_ID
				),
				{ body: commands }
			);

			console.log(
				`Successfully reloaded ${data.length} application (/) commands.`
			);
		} catch (error) {
			// And of course, make sure you catch and log any errors!
			console.error(error);
		}
	})();
};

const generateCommands = async () => {
	for (const folder of commandFolders) {
		// Grab all the command files from the commands directory you created earlier
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs
			.readdirSync(commandsPath)
			.filter((file) => file.endsWith(".js"));
		// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			await import(`file://${filePath}`)
				.then(({ default: command }) => {
					if ("data" in command && "execute" in command) {
						commands.push(command.data.toJSON());
					} else {
						console.log(
							`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
						);
					}
				})
				.catch((error) => {
					console.log(`[ERROR] ${error}`);
				});
		}
	}
	await deployCommands();
};

generateCommands();
