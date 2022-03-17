import setPerms from "../utils/setPerms.js";

export default {
    type: "on",
    name: "roleUpdate",
    execute: async (oldrole, newRole) => {
        // update command permissions
        await setPerms(newRole.guild);
    }
};