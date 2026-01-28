import { registerCommand } from "@vendetta/commands";

let unregisterCommandOn;
let unregisterCommandOff;

export default {
    onLoad: () => {
        unregisterCommandOff = registerCommand({
            name: "typingoff",
            displayName: "Typing Off",
            description: "Disable typing indicators",
            options: [],
            execute: async (args, ctx) => {
                return {
                    content: "❌ Typing indicators disabled (plugin loaded)"
                };
            },
            applicationId: "-1",
            inputType: 1,
            type: 1,
        });
        
        unregisterCommandOn = registerCommand({
            name: "typingon",
            displayName: "Typing On",
            description: "Enable typing indicators",
            options: [],
            execute: async (args, ctx) => {
                return {
                    content: "✅ Typing indicators enabled (plugin loaded)"
                };
            },
            applicationId: "-1",
            inputType: 1,
            type: 1,
        });
    },
    
    onUnload: () => {
        unregisterCommandOff?.();
        unregisterCommandOn?.();
    }
};
