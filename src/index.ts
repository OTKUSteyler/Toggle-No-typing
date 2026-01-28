import { registerCommand } from "@vendetta/commands";
import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

const settings = storage.createProxy({ disabled: false });

let unregisterCommand;
let TypingModule;
let originalStartTyping;

export default {
    onLoad: () => {
        // Find the typing module
        TypingModule = findByProps("startTyping");
        
        // Only patch if module exists
        if (TypingModule && TypingModule.startTyping) {
            originalStartTyping = TypingModule.startTyping;
            
            TypingModule.startTyping = function(...args) {
                if (settings.disabled) {
                    return;
                }
                return originalStartTyping.apply(this, args);
            };
        }
        
        // Register command
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
        if (TypingModule && originalStartTyping) {
            TypingModule.startTyping = originalStartTyping;
        }
        
        if (unregisterCommand) {
            unregisterCommand();
        }
    }
};
