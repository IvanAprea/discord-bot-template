import { Events } from "discord.js";

// This code is run when the client is ready and connected to Discord
export default {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
