 // import packages and utils
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dirFlat from "dirflat";
import discord from "discord.js";
import setPerms from "../utils/setPerms.js";

 // set up our on ready event
export default {
    type: "once",
    name: "ready",
    execute: async client => {
        console.log("Logged in as " + client.user.tag);

        client.commands = new discord.Collection();
        
        // load all the commands
        Promise.all((await dirFlat("./commands")).map(async v => {
            const imported = await import("../" + v);
        
            return {
                command: v.replace(/\.[^\.]+$/, ""),
                file: v,
                ...imported.default
            };
        })).then(async commands => {
            // register the commands with Discord 
            commands.forEach(command => {
                if(command.permissions && !command.DMs) command.data.setDefaultPermission(false);

                client.commands.set(command.data.name, command);
            });

            const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

            const DMs = commands.filter(v => v.DMs);
            const server = commands.filter(v => !v.DMs);

            try {
                // register commands in DMs
                await rest.put(Routes.applicationCommands(client.user.id), { body: DMs.map(v => v.data.toJSON()) });
            } catch (error) {
                console.error(error);
            }

            client.guilds.cache.forEach(async guild => {
                try {
                    // register commands in servers
                    await rest.put(
                        Routes.applicationGuildCommands(client.user.id, guild.id), {
                            body: server.map(v => v.data.toJSON())
                        }
                    );

                    // set command permissions
                    await setPerms(guild);
                } catch (error) {
                    console.error(error);
                }
            });

            console.log("Commands loaded");
        });
    }
}