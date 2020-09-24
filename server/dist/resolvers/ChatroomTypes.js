"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageInput = exports.CreateChatroom = exports.ChatroomRequest = void 0;
const type_graphql_1 = require("type-graphql");
let ChatroomRequest = class ChatroomRequest {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ChatroomRequest.prototype, "chatroomUUID", void 0);
ChatroomRequest = __decorate([
    type_graphql_1.InputType()
], ChatroomRequest);
exports.ChatroomRequest = ChatroomRequest;
let CreateChatroom = class CreateChatroom {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateChatroom.prototype, "title", void 0);
CreateChatroom = __decorate([
    type_graphql_1.InputType()
], CreateChatroom);
exports.CreateChatroom = CreateChatroom;
let MessageInput = class MessageInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], MessageInput.prototype, "chatroomUUID", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], MessageInput.prototype, "text", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], MessageInput.prototype, "username", void 0);
MessageInput = __decorate([
    type_graphql_1.InputType()
], MessageInput);
exports.MessageInput = MessageInput;
//# sourceMappingURL=ChatroomTypes.js.map