import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("adminflex")
        .setDescription("Flex your admin"),
    // server only
    DMs: false,
    // admin only
    permissions: permissions => permissions.has(Permissions.FLAGS.ADMINISTRATOR),
    execute: function(interaction) {
        interaction.reply("Admin swag");
    },
    executeText: function(msg, args) {
        msg.reply("Admin swag");
    }
}