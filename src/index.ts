import { registerCommand } from "@vendetta/commands";
import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

const TypingModule = findByProps("startTyping");
const settings = storage.createProxy({ disabled: false });

function toggleTyping() {
    settings.disabled = !settings.disabled;
    
    return `🔄 Typing indicators are now **${settings.disabled ? 'DISABLED ❌' : 'ENABLED ✅'}**`;
}

let unregisterCommand;
let originalStartTyping;

export default {
    onLoad: () => {
        // Save original function and replace it
        if (TypingModule && TypingModule.startTyping) {
            originalStartTyping = TypingModule.startTyping;
            
            TypingModule.startTyping = function(...args) {
                // If disabled, don't call the original function
                if (settings.disabled) {
                    return;
                }
                return originalStartTyping.apply(this, args);
            };
        }
        
        unregisterCommand = registerCommand({
            name: "typing",
            displayName: "Typing Toggle",
            description: "Toggle typing indicators on/off",
            options: [],
            execute: async (args, ctx) => {
                const content = toggleTyping();
                
                return {
                    content: content
                };
            },
            applicationId: "-1",
            inputType: 1,
            type: 1,
        });
    },
    
    onUnload: () => {
        // Restore original function
        if (TypingModule && originalStartTyping) {
            TypingModule.startTyping = originalStartTyping;
        }
        
        if (unregisterCommand) {
            unregisterCommand();
        }
    }
};
