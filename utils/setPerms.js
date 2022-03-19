import dirFlat from "dirflat";

// loads commands
const commands = await Promise.all((await dirFlat("./commands")).map(async v => {
    const imported = await import("../" + v);

    return {
        command: v.replace(/\.[^\.]+$/, ""),
        file: v,
        ...imported.default
    };
}));

async function setPerms(guild) {
    // fetch all commands in the guild and loop through them
    const guildCommands = await guild.commands.fetch();

    await Promise.all(guildCommands.map(async guildCommand => {
        // find the matching command object
        const command = commands.filter(v => v.data.name === guildCommand.name)[0];

        // return if the command is intended for DMs or has no permissions
        if(!(command.permissions && command.notpermissions) || command.DMs) return;

        // fetch roles and members
        const roles = await guild.roles.fetch();
        const members = await guild.members.fetch();
        const permissions = [
            ...roles.map(v => ({
                id: v.id,
                type: "ROLE",
                permission: command.permissions ? v.permissions.has(command.permissions) : !v.permissions.has(command.notpermissions) // allow roles with matching permissions to use the command
            })),
            {
                id: guild.ownerId,
                type: "USER",
                permission: !!command.permissions
            }
        ];

        // remove all other roles from the permissions
        await guildCommand.permissions.remove({ roles: roles.map(v => v.id), users: members.map(v => v.id) });
        // add the new roles to the permissions
        await guildCommand.permissions.add({ permissions });
    }));
}

export default setPerms;