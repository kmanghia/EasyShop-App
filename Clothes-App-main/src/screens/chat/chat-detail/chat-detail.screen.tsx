import { router, useLocalSearchParams } from "expo-router";
import ChatDetailStyle from "./chat-detail.style";
import * as ChatMessageMana from "@/src/data/management/chat-message.management";
import * as UserActions from "@/src/data/store/actions/user/user.action";
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer";
import { useSelector } from "react-redux";
import { RootState } from "@/src/data/types/global";
import { useEffect, useRef, useState } from "react";
import { ChatAttachment, ChatMessageModel, StatusMessage } from "@/src/data/model/chat-message.model";
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useToast } from "@/src/customize/toast.context";
import { MessageError } from "@/src/common/resource/message-error";
import { ImageInfo } from "expo-image-picker";
import ChatImagePicker from "../image-picker/image-picker.component";
import { Ionicons } from "@expo/vector-icons";
import { AppConfig } from "@/src/common/config/app.config";
import { WebSocketNotificationType } from "@/src/common/resource/websocket";
import { UserModel } from "@/src/data/model/user.model";
import moment from "moment";
import * as FileSystem from "expo-file-system";
import { useWebSocket } from "@/src/customize/socket.context";
import { Subscription } from "rxjs";

type Props = {}

const ChatDetailScreen = (props: Props) => {
    const { id: receiverId, shopId } = useLocalSearchParams<{
        id: string,
        shopId: string,
    }>();
    const { showToast } = useToast();
    const userSelector: UserStoreState = useSelector((state: RootState) => state.userLogged);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessageModel[]>([]);
    const [otherUser, setOtherUser] = useState<UserModel | null>(null);
    const [isOtherUserOnline, setIsOtherUserOnline] = useState<boolean>(false);
    const inputRef = useRef<TextInput>(null);
    const flatListRef = useRef<FlatList>(null);
    const { subscribe, sendMessage, lastCheckedShopId, setLastCheckedShopId } = useWebSocket();
    const subscriptionRef = useRef<Subscription | null>(null);
    useEffect(() => {
        markConversationOnEnter();
        fetchMessages();
        subscriptionRef.current = subscribe().subscribe((data: any) => {
            switch (data.type) {
                case WebSocketNotificationType.NEW_MESSAGE: {
                    const newMessage = new ChatMessageModel().fromJson(data.data, new AppConfig().getPreImage());
                    if (
                        parseInt(receiverId) &&
                        (newMessage.receiverId === userSelector.id || newMessage.senderId === userSelector.id) &&
                        (newMessage.senderId === parseInt(receiverId) || newMessage.receiverId === parseInt(receiverId))
                    ) {
                        console.log("Tin nhắn khớp, cập nhật UI");
                        if (newMessage.senderId !== userSelector.id) {
                            setMessages(prev => [...prev, newMessage]);
                            flatListRef.current?.scrollToEnd();
                        }
                        if (newMessage.receiverId === userSelector.id) {
                            ChatMessageMana.markMessageAsRead(newMessage.id)
                                .then(() => console.log("Đánh dấu tin nhắn đã đọc"))
                                .catch((err) => console.error("Lỗi đánh dấu:", err));
                        }
                    }
                    break;
                }
                case WebSocketNotificationType.MESSAGE_READ: {
                    setMessages(prev => prev.map(
                        msg => {
                            if (msg.id === data.data.messageId) {
                                // let chat = new ChatMessageModel().fromJson(msg, new AppConfig().getPreImage(), StatusMessage.SENT);
                                let chat = { ...msg } as ChatMessageModel;
                                chat.isRead = true;
                                return chat;
                            }
                            return msg;
                        }
                    ));
                    break;
                }
                case WebSocketNotificationType.CONVERSATION_READ: {
                    console.log("Cuộc trò chuyện đã được đánh dấu đã đọc:", data);
                    const { userId1, userId2 } = data.data;

                    if (userId2 !== userSelector.id || userId1 !== parseInt(receiverId)) {
                        console.log("Thông báo không khớp với cuộc trò chuyện hiện tại:", { userId1, userId2, userSelectorId: userSelector.id, receiverId });
                        break;
                    }

                    setMessages(prevMessages =>
                        prevMessages.map(msg => {
                            if (msg.senderId === userSelector.id && !msg.isRead) {
                                console.log(`Cập nhật tin nhắn ${msg.id} thành đã đọc`);
                                return { ...msg, isRead: true } as ChatMessageModel;
                            }
                            return msg;
                        })
                    );
                    break;
                }
                case WebSocketNotificationType.SHOP_STATUS: {
                    console.log('Trạng thái Shop: ', data.shopId, data.isOnline);
                    const targetShopId: number = parseInt(shopId) || (otherUser && otherUser.shopId ? otherUser.shopId : 0);
                    if (targetShopId && data.shopId === targetShopId) {
                        setIsOtherUserOnline(data.isOnline);
                        setLastCheckedShopId(data.shopId);
                    }
                    break;
                }
                default:
                    console.log("Loại thông báo khác:", data.type);
            }
        })

        return () => {
            subscriptionRef.current?.unsubscribe();
            setLastCheckedShopId(null); /** Quan trọng vì để tìm trạng thái shop khi mount lại **/
        };
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            flatListRef.current?.scrollToEnd();
        }
    }, [messages]);

    useEffect(() => {
        const targetShopId = shopId ? parseInt(shopId) : otherUser?.shopId;
        if (targetShopId && !isNaN(targetShopId) && targetShopId !== lastCheckedShopId) {
            console.log("Gửi yêu cầu CHECK_SHOP_STATUS:", targetShopId);
            sendMessage({ type: WebSocketNotificationType.CHECK_SHOP_STATUS, shopId: targetShopId });
            setTimeout(() => {
                if (isOtherUserOnline === undefined) {
                    setIsOtherUserOnline(false);
                }
            }, 5000);
        } else if (!targetShopId || isNaN(targetShopId)) {
            setIsOtherUserOnline(false);
        }
    }, [shopId, otherUser?.shopId, lastCheckedShopId, sendMessage]);

    const markConversationOnEnter = async () => {
        try {
            await ChatMessageMana.markConversationAsRead(parseInt(receiverId));
        } catch (error) {
            console.log("Lỗi khi đánh dấu cuộc trò chuyện đã đọc:", error);
            showToast(MessageError.BUSY_SYSTEM, "error");
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await ChatMessageMana.fetchChatHistory(+receiverId);
            setMessages(response);
            if (response.length > 0) {
                const user = response[0].senderId === parseInt(receiverId)
                    ? response[0].sender
                    : response[0].receiver;
                setOtherUser(user);
            } else {
                setOtherUser(null);
            }
        } catch (error: any) {
            console.log(error);
            if (error?.message === 'Unauthorized to view these messages') {
                showToast(MessageError.UNAUTHORIZED_VIEW_MESSAGES, 'error');
                return;
            }
            showToast(MessageError.BUSY_SYSTEM, 'error');
            setIsOtherUserOnline(false);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || (!userSelector.isLogged && !userSelector.expires)) {
            return;
        }

        const tempMessage = ChatMessageModel.createMessage({
            senderId: userSelector.id,
            receiverId: parseInt(receiverId),
            message: message.trim(),
            messageType: 'text'
        });

        setMessages(prev => [...prev, tempMessage]);
        setMessage('');

        flatListRef.current?.scrollToEnd();

        try {
            const response = await ChatMessageMana.createMessage(tempMessage);
            setMessages(prev => prev.map(msg =>
                msg.id === tempMessage.id
                    ? { ...response, status: StatusMessage.SENT } as ChatMessageModel
                    : msg
            ));
            sendMessage({
                type: WebSocketNotificationType.NEW_MESSAGE,
                data: response
            });
        } catch (error) {
            console.log(error);
            showToast(MessageError.BUSY_SYSTEM, 'error');
        }
    };

    const handleImageSelect = async (images: Array<{ uri: string }>) => {
        if (!images && !userSelector.isLogged && !userSelector.expires) {
            return;
        }

        const imagesInfo: ChatAttachment[] = await Promise.all(
            images.map(async (img) => {
                const fileInfo = await FileSystem.getInfoAsync(img.uri);
                const fileName = img.uri.split("/").pop() || `image_${Date.now()}.jpg`;
                const fileType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
                const fileSize = fileInfo.exists && fileInfo.size !== undefined ? fileInfo.size : 0;

                return {
                    url: img.uri,
                    type: fileType,
                    name: fileName,
                    size: fileSize,
                } as ChatAttachment;
            })
        );

        const tempMessage = ChatMessageModel.createMessage({
            senderId: userSelector.id,
            receiverId: parseInt(receiverId),
            message: '',
            messageType: 'image',
            attachments: imagesInfo
        });

        setMessages(prev => [...prev, tempMessage]);

        flatListRef.current?.scrollToEnd();

        try {
            const response = await uploadWithRetry(tempMessage);
            setMessages(prev => prev.map(msg =>
                msg.id === tempMessage.id
                    ? { ...response, status: StatusMessage.SENT } as ChatMessageModel
                    : msg
            ));
            sendMessage({
                type: WebSocketNotificationType.NEW_MESSAGE,
                data: response
            });
        } catch (error) {
            console.log(error);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === tempMessage.id
                        ? { ...msg, status: StatusMessage.FAILED } as ChatMessageModel
                        : msg
                )
            );
            showToast(MessageError.BUSY_SYSTEM, 'error');
        }
    };

    const uploadWithRetry = async (message: ChatMessageModel, retries = 2, delay = 2000) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await ChatMessageMana.createMessage(message);
                return response;
            } catch (error) {
                console.log(`Lỗi upload (thử lần ${i + 1}):`, error);
                if (i === retries - 1) throw error;
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    };

    const groupMessages = () => {
        const grouped: { timestamp: string; messages: ChatMessageModel[] }[] = [];
        let currentGroup: ChatMessageModel[] = [];
        let lastTimestamp: moment.Moment | null = null;
        const timeThreshold = 15;
        const today = moment().startOf('day');

        messages.forEach((msg, index) => {
            const currentTime = moment(msg.createdAt);

            if (lastTimestamp === null) {
                currentGroup.push(msg);
                lastTimestamp = currentTime;
            } else if (currentTime.diff(lastTimestamp, 'minutes') >= timeThreshold) {
                if (currentGroup.length > 0) {
                    grouped.push({
                        timestamp: currentTime.isSame(today, 'day')
                            ? lastTimestamp.format('HH:mm')
                            : lastTimestamp.format('DD/MM/YYYY HH:mm'),
                        messages: currentGroup,
                    });
                }
                currentGroup = [msg];
                lastTimestamp = currentTime;
            } else {
                currentGroup.push(msg);
            }

            if (index === messages.length - 1 && currentGroup.length > 0) {
                grouped.push({
                    timestamp: currentTime.isSame(today, 'day')
                        ? lastTimestamp.format('HH:mm')
                        : lastTimestamp.format('DD/MM/YYYY HH:mm'),
                    messages: currentGroup,
                });
            }
        });

        return grouped;
    };

    const renderMessageGroup = ({ item, index: groupIndex }: { item: { timestamp: string; messages: ChatMessageModel[] }; index: number }) => {
        const isLastGroup = groupIndex === groupMessages().length - 1;

        return (
            <View style={styles.messageGroup}>
                <View style={styles.timestampContainer}>
                    <Text style={styles.timestampText}>{item.timestamp}</Text>
                </View>
                {item.messages.map((msg, index) => {
                    const isOwnMessage = msg.senderId === userSelector.id;
                    const isLastMessageInGroup = index === item.messages.length - 1;

                    return (
                        <View
                            key={msg.id}
                            style={[
                                styles.messageContainer,
                                isOwnMessage ? styles.ownMessage : styles.otherMessage,
                            ]}
                        >
                            {!isOwnMessage && (
                                <Image
                                    source={{ uri: `${new AppConfig().getPreImage()}/${otherUser?.shop?.logo_url || otherUser?.image_url}` }}
                                    style={styles.avatar}
                                    defaultSource={{ uri: `${new AppConfig().getPreImage()}/${otherUser?.shop?.logo_url}` }}
                                />
                            )}
                            {isOwnMessage && !msg.message && !msg.attachments && (
                                <View style={styles.avatarSpacer} />
                            )}
                            <View style={styles.messageWrapper}>
                                <View
                                    style={[
                                        styles.messageBubble,
                                        isOwnMessage ? styles.ownBubble : styles.otherBubble,
                                        index === 0 && styles.firstBubble,
                                        index === item.messages.length - 1 && styles.lastBubble,
                                    ]}
                                >
                                    {msg.messageType === 'image' && msg.attachments?.map((att, attIndex) => (
                                        <Image
                                            key={attIndex}
                                            source={{ uri: att.url }}
                                            style={styles.imageMessage}
                                            resizeMode="cover"
                                        />
                                    ))}
                                    {msg.message && (
                                        <Text
                                            style={[
                                                styles.messageText,
                                                isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
                                            ]}
                                        >
                                            {msg.message}
                                        </Text>
                                    )}
                                </View>
                                {isOwnMessage && isLastMessageInGroup && isLastGroup && msg.status && (
                                    <View style={styles.statusContainer}>
                                        {msg.status === StatusMessage.SENDING && (
                                            <ActivityIndicator size="small" color="#0084ff" />
                                        )}
                                        {msg.status === StatusMessage.SENT && !msg.isRead && (
                                            <Text style={styles.statusText}>Đã gửi</Text>
                                        )}
                                        {msg.status === StatusMessage.SENT && msg.isRead && (
                                            <Ionicons name="checkmark-done" size={16} color="#4CAF50" />
                                        )}
                                        {msg.status === StatusMessage.FAILED && (
                                            <Text style={[styles.statusText, styles.errorText]}>
                                                lỗi gửi tin nhắn
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };

    const groupedMessages = groupMessages();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                <Image
                    source={{ uri: `${new AppConfig().getPreImage()}/${otherUser?.shop?.logo_url || otherUser?.image_url}` }}
                    style={styles.headerAvatar}
                    defaultSource={{ uri: `${new AppConfig().getPreImage()}/${otherUser?.shop?.logo_url || otherUser?.image_url}` }}
                />
                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>{otherUser?.shop?.shop_name || otherUser?.name || 'Cửa hàng'}</Text>
                    {otherUser && (
                        <View style={styles.onlineStatusContainer}>
                            <View style={[
                                styles.onlineIndicator,
                                isOtherUserOnline ? styles.onlineIndicatorActive : styles.onlineIndicatorInactive
                            ]} />
                            <Text style={styles.headerStatus}>
                                {isOtherUserOnline ? 'Đang hoạt động' : 'Không hoạt động'}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
            <FlatList
                ref={flatListRef}
                data={groupedMessages}
                renderItem={renderMessageGroup}
                keyExtractor={(item, index) => `group-${index}`}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />
            <View style={styles.inputContainer}>
                <ChatImagePicker onImageSelect={handleImageSelect} />
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder="Aa"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                />
                {message.trim() ? (
                    <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                        <Ionicons name="send" size={24} color="#0084ff" />
                    </TouchableOpacity>
                ) : null}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = ChatDetailStyle;

export default ChatDetailScreen;