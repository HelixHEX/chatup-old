import { ChatroomRequest } from "../resolvers/ChatroomTypes";

export const validateChatroom = (input: ChatroomRequest) => {
  if (!input.chatroomUUID) {
    return [
      {
        field: "Chat",
        message: "Chatroom not specified"
      },
    ]
  }

  return null;
};