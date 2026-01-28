import { registerCommand } from "@vendetta/commands";
import { findByProps } from "@vendetta/metro";
import { before } from "@vendetta/patcher";

let unregisterCommandOn;
let unregisterCommandOff;
let unpatch;
let typingDisabled = false;

export default {
    onLoad: () => {
        // Find and patch the typing module
        const TypingModule = findByProps("startTyping", "stopTyping");
        
        if (TypingModule?.startTyping) {
            unpatch = before("startTyping", TypingModule, (args) => {
                if (typingDisabled) {
                    return [];
                }
            });
        }
        
        unregisterCommandOff = registerCommand({
            name: "typingoff",
            displayName: "Typing Off",
            description: "Disable typing indicators",
            options: [],
            execute: async (args, ctx) => {
                typingDisabled = true;
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
                typingDisabled = false;
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
