import { UserModel } from "./user.model";

export enum StatusMessage {
    SENDING = 'sending',
    SENT = 'sent',
    FAILED = 'failed'
}

export interface Conversation {
    otherUser: UserModel;
    lastMessage: ChatMessageModel;
    unreadCount: number;
}

export interface ChatAttachment {
    url: string;
    type: string;
    name: string;
    size: number;
}

export class ChatMessageModel {
    id: number;
    senderId: number;
    receiverId: number;
    message: string;
    messageType: 'text' | 'image';
    attachments: ChatAttachment[];
    createdAt: string;
    status?: string;
    sender: UserModel;
    receiver: UserModel;
    isRead: boolean;

    constructor(
        id?: number,
        senderId?: number,
        receiverId?: number,
        message?: string,
        messageType?: 'text' | 'image',
        attachments?: ChatAttachment[],
        createdAt?: string,
        status?: string,
        sender?: UserModel,
        receiver?: UserModel,
        isRead?: boolean,
    ) {
        this.id = id ?? 0;
        this.senderId = senderId ?? 0;
        this.receiverId = receiverId ?? 0;
        this.message = message ?? '';
        this.messageType = messageType ?? 'text';
        this.attachments = attachments ?? [];
        this.createdAt = createdAt ?? new Date().toISOString();
        this.status = status;
        this.sender = sender ?? new UserModel();
        this.receiver = receiver ?? new UserModel();
        this.isRead = isRead ?? false;
    }

    fromJson(data: any, preImage: string, status?: string) {
        const obj = new ChatMessageModel();
        obj.id = data?.id ?? 0;
        obj.senderId = data?.senderId ?? 0;
        obj.receiverId = data?.receiverId ?? 0;
        obj.message = data?.message ?? '';
        obj.messageType = data?.messageType ?? 'text';
        if (data?.attachments && typeof data.attachments === 'string') {
            try {
                obj.attachments = JSON.parse(data.attachments)?.map((att: any) => ({
                    ...att,
                    url: `${preImage}/${att.url}`
                } as ChatAttachment)) ?? [];
            } catch (error) {
                console.log('Lỗi parse attachments: ', error);
            }
        }
        obj.createdAt = data?.createdAt ?? new Date().toISOString();
        obj.status = status;
        obj.sender = data?.sender ?? new UserModel();
        obj.receiver = data?.receiver ?? new UserModel();
        obj.isRead = data?.isRead ?? false;

        return obj;
    }

    static createMessage(data: {
        senderId: number;
        receiverId: number;
        message: string;
        messageType: 'text' | 'image';
        attachments?: ChatAttachment[];
    }): ChatMessageModel {
        const obj = new ChatMessageModel();
        obj.id = Date.now();
        obj.senderId = data.senderId;
        obj.receiverId = data.receiverId;
        obj.message = data.message;
        obj.messageType = data.messageType;
        obj.attachments = data?.attachments ?? [];
        obj.createdAt = new Date().toISOString();
        obj.status = StatusMessage.SENDING;

        return obj;
    }
}