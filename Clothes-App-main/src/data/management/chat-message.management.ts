import * as ChatMessageService from "@/src/data/service/chat-message.service";
import { ChatMessageModel, Conversation, StatusMessage } from "../model/chat-message.model";
import { UserModel } from "../model/user.model";
import { AppConfig } from "@/src/common/config/app.config";

export const createMessage = async (chatMessage: ChatMessageModel) => {
    try {
        const result = await ChatMessageService.createMessage(chatMessage);
        return new ChatMessageModel().fromJson(result?.chatInfo, new AppConfig().getPreImage());
    } catch (error) {
        throw error;
    }
}

export const createConversation = async (shopOwnerId: number) => {
    try {
        const result = await ChatMessageService.createConversation(shopOwnerId);
        return new ChatMessageModel().fromJson(result?.chatInfo, new AppConfig().getPreImage());
    } catch (error) {
        throw error;
    }
}


export const fetchConversations = async () => {
    try {
        const result = await ChatMessageService.fetchConversations();
        const response: Conversation[] = result?.conversations?.map(
            (conversation: any) => ({
                otherUser: new UserModel().convertObj(conversation.otherUser),
                lastMessage: new ChatMessageModel().fromJson(conversation.lastMessage, new AppConfig().getPreImage()),
                unreadCount: conversation.unreadCount ?? 0
            } as Conversation)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchChatHistory = async (receiverId: number) => {
    try {
        const result = await ChatMessageService.fetchChatHistory(receiverId);
        const response: ChatMessageModel[] = result?.messages?.map(
            (message: any) => new ChatMessageModel().fromJson(message, new AppConfig().getPreImage(), StatusMessage.SENT)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}

export const markMessageAsRead = async (messageId: number) => {
    try {
        await ChatMessageService.markMessageAsRead(messageId);
        return true;
    } catch (error) {
        throw error;
    }
}

export const markConversationAsRead = async (receiverId: number) => {
    try {
        await ChatMessageService.markConversationAsRead(receiverId);
        return true;
    } catch (error) {
        throw error;
    }
}