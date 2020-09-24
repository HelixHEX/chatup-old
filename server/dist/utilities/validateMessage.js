"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMessage = void 0;
exports.validateMessage = (input) => {
    if (!input.chatroomUUID) {
        return [
            {
                field: "Chat",
                message: "Chatroom not specified"
            },
        ];
    }
    return null;
};
//# sourceMappingURL=validateMessage.js.map