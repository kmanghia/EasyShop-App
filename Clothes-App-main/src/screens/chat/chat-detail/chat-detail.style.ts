import { StyleSheet } from "react-native";

const ChatDetailStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 5,
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: 16,
        fontWeight: '600',
    },
    onlineStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    onlineIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    onlineIndicatorActive: {
        backgroundColor: '#4CAF50',
    },
    onlineIndicatorInactive: {
        backgroundColor: '#9E9E9E',
    },
    headerStatus: {
        fontSize: 12,
        color: '#666',
    },
    messagesList: {
        padding: 16,
    },
    messageGroup: {
        marginBottom: 20,
    },
    timestampContainer: {
        alignSelf: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 10,
    },
    timestampText: {
        fontSize: 12,
        color: '#666',
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 4,
        alignItems: 'flex-start',
    },
    ownMessage: {
        justifyContent: 'flex-end',
    },
    otherMessage: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 8,
        marginTop: 3,
    },
    avatarSpacer: {
        width: 36,
        height: 36,
        marginLeft: 8,
    },
    messageWrapper: {
        flexDirection: 'column',
        maxWidth: '70%',
    },
    messageBubble: {
        padding: 12,
        borderRadius: 16,
    },
    ownBubble: {
        backgroundColor: '#0084ff',
        borderBottomRightRadius: 0,
    },
    otherBubble: {
        backgroundColor: '#f0f0f0',
        borderBottomLeftRadius: 0,
    },
    firstBubble: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    lastBubble: {
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    messageText: {
        fontSize: 16,
    },
    ownMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: '#000',
    },
    imageMessage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 5,
    },
    statusContainer: {
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    statusText: {
        fontSize: 12,
        color: '#8e8e8e',
    },
    errorText: {
        color: '#ff3b30',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        marginHorizontal: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        fontSize: 16,
    },
    sendButton: {
        padding: 10,
    },
});

export default ChatDetailStyle;