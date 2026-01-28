import { registerCommand } from "@vendetta/commands";
import { storage } from "@vendetta/plugin";
import { FluxDispatcher } from "@vendetta/metro/common";

const settings = storage.createProxy({ disabled: false });

let unregisterCommand;
let unpatch;

export default {
    onLoad: () => {
        // Intercept typing events
        unpatch = FluxDispatcher.addInterceptor((payload) => {
            // Block TYPING_START events when disabled
            if (settings.disabled && payload.type === "TYPING_START") {
                return false;
            }
            return true;
        });

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
