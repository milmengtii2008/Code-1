require("dotenv").config()
const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
const slotMachine = require("./commands/slotMachine.js");

const {DISCORD_TOKEN: token, MONGODB_SRV: database } = process.env;

// Map to store user balances
const userBalances = new Map();

//Require the necessary discord.js classes
const {Client, GatewayIntentBits, Collection} = require("discord.js");

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

//Load the events file on startup
const eventsPath = path.join(__dirname, "events");
const eventsFile = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for(const file of eventsFile) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

//Load the command file on startup
client.commands = new Collection();
const commandPath = path.join(__dirname, "commands")
const commandFile = fs.readdirSync(commandPath).filter((file) => file.endsWith(".js"));

for(const file of commandFile) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    if("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(
            `[WARNING] the command at ${filePath} is missing a required "data" or "execute property"`
        );
    };
};

mongoose.connect(database, {
    useNewUrlParser: true,
})
.then(() => {
    console.log("Connected to the database!");
})
.catch((err) => {
    console.log(err);
});


// Event: Bot is ready
client.once('ready', () => {
    console.log(`Bot is ready! ${client.user.tag}`);
    client.user.setActivity(`Testing`)
  });

client.login(token);