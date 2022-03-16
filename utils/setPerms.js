import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dirFlat from "../utils/dirFlat.js";
import discord from "discord.js";

const commands = await Promise.all(dirFlat("./commands").map(async v => {
    const imported = await import("../" + v);

    return {
        command: v.replace(/\.[^\.]+$/, ""),
        file: v,
        ...imported.default
    };
}));

async function setPerms(guild) {
    const guildCommands = await guild.commands.fetch();

    await Promise.all(guildCommands.map(async guildCommand => {
        const command = commands.filter(v => v.data.name === guildCommand.name)[0];

        if(!command.permissions || command.DMs) return;

        const roles = await guild.roles.fetch();
        const members = await guild.members.fetch();
        const permissions = [
            ...roles.map(v => ({
                id: v.id,
                type: "ROLE",
                permission: v.permissions.has(command.permissions)
            })),
            {
                id: guild.ownerId,
                type: "USER",
                permission: true
            }
        ];

        await guildCommand.permissions.remove({ roles: roles.map(v => v.id), users: members.map(v => v.id) });
        await guildCommand.permissions.add({ permissions });
    }));
}

export default setPerms;