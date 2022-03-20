import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("admintease")
        .setDescription("Tease the Discord admins"),
    // server only
    DMs: false,
    // nonadmin only
    permissions: permissions => !permissions.has(Permissions.FLAGS.ADMINISTRATOR),
    execute: function(interaction) {
        interaction.reply("Admins suck");
    },
    executeText: function(msg, args) {
        msg.reply("Admins suck");
    }
}