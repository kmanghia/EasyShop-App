import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";
import { ChatAttachment, ChatMessageModel } from "../model/chat-message.model";

export const createMessage = async (chatMessage: ChatMessageModel) => {
    try {
        const domain = new AppConfig().getDomain();

        const formData = new FormData();
        formData.append('receiverId', chatMessage.receiverId + '');
        if (chatMessage.attachments.length === 0) {
            formData.append('message', chatMessage.message);
        } else if (chatMessage.attachments.length > 0) {
            formData.append('message', '');
            chatMessage.attachments.forEach((attachment: ChatAttachment) => {
                formData.append('chatAttachments', {
                    uri: attachment.url,
                    type: attachment.type, // 'image/png'
                    name: attachment.name,  // 'Filename.png'
                    size: attachment.size,  // 75016
                } as any);
            })
        }
        const response = await ServiceCore.POST(
            `${domain}`,
            `chat/send`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const createConversation = async (shopOwnerId: number) => {
    try {
        const domain = new AppConfig().getDomain();

        const response = await ServiceCore.POST(
            `${domain}`,
            `chat/conversation`,
            { shopOwnerId }
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchConversations = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `chat/conversations`
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchChatHistory = async (receiverId: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `chat/history/${receiverId}`
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const markMessageAsRead = async (messageId: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.PATCH(
            `${domain}`,
            `chat/read/${messageId}`,
            {}
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const markConversationAsRead = async (receiverId: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.PATCH(
            `${domain}`,
            `chat/read-conversation/${receiverId}`,
            {}
        );

        return response;
    } catch (error) {
        throw error;
    }
}