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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatroomResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Message_1 = require("../entities/Message");
const Chatroom_1 = require("../entities/Chatroom");
const ChatroomTypes_1 = require("./ChatroomTypes");
const ChatroomTypes_2 = require("./ChatroomTypes");
const validateChatroom_1 = require("../utilities/validateChatroom");
let ChatroomErrors = class ChatroomErrors {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ChatroomErrors.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ChatroomErrors.prototype, "message", void 0);
ChatroomErrors = __decorate([
    type_graphql_1.ObjectType()
], ChatroomErrors);
let ChatroomResponse = class ChatroomResponse {
};
__decorate([
    type_graphql_1.Field(() => [ChatroomErrors], { nullable: true }),
    __metadata("design:type", Array)
], ChatroomResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Message_1.Message, { nullable: true }),
    __metadata("design:type", Message_1.Message)
], ChatroomResponse.prototype, "message", void 0);
__decorate([
    type_graphql_1.Field(() => [Message_1.Message], { nullable: true }),
    __metadata("design:type", Array)
], ChatroomResponse.prototype, "messages", void 0);
__decorate([
    type_graphql_1.Field(() => [Message_1.Message], { nullable: true }),
    __metadata("design:type", Array)
], ChatroomResponse.prototype, "messages2", void 0);
__decorate([
    type_graphql_1.Field(() => Chatroom_1.Chatroom, { nullable: true }),
    __metadata("design:type", Chatroom_1.Chatroom)
], ChatroomResponse.prototype, "chatroom", void 0);
__decorate([
    type_graphql_1.Field(() => [Chatroom_1.Chatroom], { nullable: true }),
    __metadata("design:type", Array)
], ChatroomResponse.prototype, "chatrooms", void 0);
ChatroomResponse = __decorate([
    type_graphql_1.ObjectType()
], ChatroomResponse);
let ChatroomResolver = class ChatroomResolver {
    send(publish, input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userUUID) {
                return {
                    errors: [
                        {
                            field: 'login',
                            message: 'user not logged in'
                        }
                    ]
                };
            }
            const message = yield Message_1.Message.create({
                text: input.text,
                userUUID: req.session.userUUID,
                chatroomUUID: input.chatroomUUID,
                username: input.username
            }).save();
            yield publish({ field: "New Message", message: input.text });
            return { message };
        });
    }
    chatroom(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = validateChatroom_1.validateChatroom(input);
            if (errors) {
                return { errors };
            }
            if (!req.session.userUUID) {
                return {
                    errors: [
                        {
                            field: "login",
                            message: "user not logged in"
                        }
                    ]
                };
            }
            let messages;
            if (!input.chatroomUUID) {
                messages = yield Message_1.Message.find({ where: { chatroomUUID: input.chatroomUUID }, relations: ['Chatroom'] });
            }
            else {
            }
            return { messages };
        });
    }
    createChatroom(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userUUID) {
                return {
                    errors: [
                        {
                            field: 'login',
                            message: 'user not logged in'
                        }
                    ]
                };
            }
            const chatroom = yield Chatroom_1.Chatroom.create({
                title: input.title,
                creatorUUID: req.session.userUUID
            }).save();
            return { chatroom };
        });
    }
    allchatrooms({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.session.userUUID);
            const chatrooms = yield Chatroom_1.Chatroom.find({ relations: ['messages'] });
            chatrooms.forEach(user => {
                user.messages.forEach(message => console.log(message.text));
            });
            return { chatrooms };
        });
    }
    allmessages({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userUUID) {
                return {
                    errors: [
                        {
                            field: 'login',
                            message: 'user not logged in'
                        }
                    ]
                };
            }
            const messages2 = yield Message_1.Message.find({ relations: ['chatroom'] });
            console.log(messages2);
            return { messages2 };
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => ChatroomResponse, { nullable: true }),
    __param(0, type_graphql_1.PubSub("NOTIFICATIONS")),
    __param(1, type_graphql_1.Arg('input')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, ChatroomTypes_1.MessageInput, Object]),
    __metadata("design:returntype", Promise)
], ChatroomResolver.prototype, "send", null);
__decorate([
    type_graphql_1.Query(() => ChatroomResponse, { nullable: true }),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatroomTypes_2.ChatroomRequest, Object]),
    __metadata("design:returntype", Promise)
], ChatroomResolver.prototype, "chatroom", null);
__decorate([
    type_graphql_1.Mutation(() => ChatroomResponse, { nullable: true }),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatroomTypes_2.CreateChatroom, Object]),
    __metadata("design:returntype", Promise)
], ChatroomResolver.prototype, "createChatroom", null);
__decorate([
    type_graphql_1.Query(() => ChatroomResponse, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatroomResolver.prototype, "allchatrooms", null);
__decorate([
    type_graphql_1.Query(() => ChatroomResponse, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatroomResolver.prototype, "allmessages", null);
ChatroomResolver = __decorate([
    type_graphql_1.Resolver(Chatroom_1.Chatroom)
], ChatroomResolver);
exports.ChatroomResolver = ChatroomResolver;
//# sourceMappingURL=chatroom.js.map