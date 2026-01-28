import { registerCommand } from "@vendetta/commands";
import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

const settings = storage.createProxy({ disabled: false });

let unregisterCommandOn;
let unregisterCommandOff;
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
        
        // Register /typingoff command
        unregisterCommandOff = registerCommand({
            name: "typingoff",
            displayName: "Typing Off",
            description: "Disable typing indicators",
            options: [],
            execute: async (args, ctx) => {
                settings.disabled = true;
                
                return {
                    content: `❌ Typing indicators are now **DISABLED**`
                };
            },
            applicationId: "-1",
            inputType: 1,
            type: 1,
        });
        
        // Register /typingon command
        unregisterCommandOn = registerCommand({
            name: "typingon",
            displayName: "Typing On",
            description: "Enable typing indicators",
            options: [],
            execute: async (args, ctx) => {
                settings.disabled = false;
                
                return {
                    content: `✅ Typing indicators are now **ENABLED**`
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
        
        if (unregisterCommandOff) {
            unregisterCommandOff();
        }
        
        if (unregisterCommandOn) {
            unregisterCommandOn();
        }
    }
};
