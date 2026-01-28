import { registerCommand } from "@vendetta/commands";
import { storage } from "@vendetta/plugin";
import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

const settings = storage.createProxy({ disabled: false });

let unregisterCommand;
let unpatch;

export default {
    onLoad: () => {
        // Find and patch the typing module
        const TypingModule = findByProps("startTyping");
        
        if (TypingModule) {
            unpatch = after("startTyping", TypingModule, (args, ret) => {
                // Block typing if disabled
                if (settings.disabled) {
                    return;
                }
                return ret;
            });
        }

        // Register /typing command
        unregisterCommand = registerCommand({
            name: "typing",
            displayName: "Typing Toggle",
            description: "Toggle typing indicators on/off",
            options: [],
            execute: async (args, ctx) => {
                settings.disabled = !settings.disabled;
                
                return {
                    content: `🔄 Typing indicators are now **${settings.disabled ? 'DISABLED ❌' : 'ENABLED ✅'}**`
                };
            },
            applicationId: "-1",
            inputType: 1,
            type: 1,
        });
    },
    
    onUnload: () => {
        if (unregisterCommand) {
            unregisterCommand();
        }
        if (unpatch) {
            unpatch();
        }
    }
};
