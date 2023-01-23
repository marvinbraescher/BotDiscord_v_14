// ID: 1051294699459203112
// TOKEN: MTA1MTI5NDY5OTQ1OTIwMzExMg.GGF7xa.uMRZcQfpa_ZUaUAfp-qCeBkQlqZ1J40DEo_LyU
// I-LINK:https://discord.com/oauth2/authorize?client_id=1051294699459203112&scope=bot&permissions=1

const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');




const { Client, GatewayIntentBits, Events, EmbedBuilder, PermissionsBitField, Permissions, Collection } = require(`discord.js`);
// const prefix = "$";
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


//LOAD COMMAND FILES
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
//EVENT LISTNER
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}

//	console.log(interaction);
});

 client.once(Events.ClientReady, c => {
 	console.log(`Ready! Logged in as ${c.user.tag}`);
 });




client.login(token);