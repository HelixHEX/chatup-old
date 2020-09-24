"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateChatroom = void 0;
exports.validateChatroom = (input) => {
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
//# sourceMappingURL=validateChatroom.js.map