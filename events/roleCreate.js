import setPerms from "../utils/setPerms.js";

export default {
    type: "on",
    name: "roleCreate",
    execute: async role => {
        // update command permissions
        await setPerms(role.guild);
    }
};