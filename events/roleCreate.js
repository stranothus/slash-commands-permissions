import setPerms from "../utils/setPerms.js";

export default {
    type: "on",
    name: "roleCreate",
    execute: async role => {
        await setPerms(role.guild);
    }
};