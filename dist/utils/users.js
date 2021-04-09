"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.removeUser = exports.addUser = void 0;
let onlineusers = [];
const addUser = (id, room) => {
    const index = onlineusers.findIndex(x => x.room_name === room);
    if (index < 0) {
        onlineusers.push({
            room_name: room,
            users: [id]
        });
    }
    else {
        onlineusers[index].users.push(id);
    }
};
exports.addUser = addUser;
const removeUser = (id, room) => {
    const index = onlineusers.findIndex(x => x.room_name === room);
    if (index >= 0) {
        for (var i = 0; i < onlineusers[index].users.length; i++) {
            if (onlineusers[index].users[i] === id) {
                onlineusers[index].users.splice(i, 1);
            }
        }
    }
};
exports.removeUser = removeUser;
const users = (room) => {
    const index = onlineusers.findIndex(x => x.room_name === room);
    if (index >= 0) {
        return onlineusers[index].users;
    }
};
exports.users = users;
//# sourceMappingURL=users.js.map