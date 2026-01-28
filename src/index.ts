import { registerCommand } from "@vendetta/commands";
import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";
import { before } from "@vendetta/patcher";

const settings = storage.createProxy({ 
    enabled: false 
});

let unregisterCommandOn;
let unregisterCommandOff;
let unpatch;

// Store the original startTyping function
let TypingModule;

function startTyping(channelId) {
    // If enabled (typing hidden), don't dispatch the typing event
    if (settings.enabled) return;
    
    // Otherwise, dispatch the typing event normally
    const FluxDispatcher = findByProps("dispatch", "subscribe");
    FluxDispatcher?.dispatch({ 
        type: "TYPING_START_LOCAL", 
        channelId 
    });
}

export default {
    onLoad: () => {
        // Find the typing module
        TypingModule = findByProps("startTyping", "stopTyping");
        
        if (TypingModule?.startTyping) {
            // Patch the startTyping function
            unpatch = before("startTyping", TypingModule, (args) => {
                if (settings.enabled) {
                    // Block the original function from running
                    return [];
                }
            });
        }
        
        // Register /typingoff command
        unregisterCommandOff = registerCommand({
            name: "typingoff",
            displayName: "Typing Off",
            description: "Hide your typing indicator from others",
            options: [],
            execute: async (args, ctx) => {
                settings.enabled = true;
            },
            applicationId: "-1",
            inputType: 1,
            type: 1,
        });
        
        // Register /typingon command
        unregisterCommandOn = registerCommand({
            name: "typingon",
            displayName: "Typing On",
            description: "Show your typing indicator to others",
            options: [],
            execute: async (args, ctx) => {
                settings.enabled = false;
            },
            applicationId: "-1",
            inputType: 1,
            type: 1,
        });
    },
    
    onUnload: () => {
        unpatch?.();
        unregisterCommandOff?.();
        unregisterCommandOn?.();
    }
};
