 // import packages
import discord from "discord.js";
import dotenv from "dotenv";
import dirFlat from "dirflat";

 // load env variables
dotenv.config();

 // create the Discord client with basic intents
const client = new discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS"
    ],
    partials: [
        "CHANNEL"
    ]
});

 // load all events and set them up
await Promise.all((await dirFlat("./events")).map(async v => {
    const imported = await import(v);

    return {
        command: v.replace(/\.[^\.]+$/, ""),
        file: v,
        ...imported.default
    };
})).then(events => events.forEach(event => client[event.type](event.name, event.execute)));

 // log the bot in
client.login(process.env.TOKEN);