import setPerms from "../utils/setPerms.js";

export default {
    type: "on",
    name: "roleUpdate",
    execute: async (oldrole, newRole) => {
        await setPerms(newRole.guild);
    }
};