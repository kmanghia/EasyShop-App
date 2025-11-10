import { CommonColors } from "@/src/common/resource/colors";
import { StyleSheet } from "react-native";

const ChatbotStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: CommonColors.primary,
        paddingBottom: 15,
        paddingHorizontal: 20,
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    headerText: {
        fontSize: 20,
        fontWeight: '500',
        color: CommonColors.white,
    },
    messageList: {
        flex: 1,
    },
    messageListContent: {
        padding: 15,
        paddingBottom: 30,
    },
    messageBubble: {
        padding: 12,
        borderRadius: 20,
        marginBottom: 10,
        maxWidth: '80%',
    },
    userBubble: {
        backgroundColor: CommonColors.primary,
        alignSelf: 'flex-end',
        borderBottomRightRadius: 5,
    },
    botBubble: {
        backgroundColor: '#e0e0e0',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 5,
    },
    messageText: {
        fontSize: 18,
    },
    userText: {
        color: CommonColors.white,
    },
    botText: {
        color: CommonColors.black,
    },
    typingText: {
        color: '#555',
        fontSize: 14,
        marginLeft: 5,
    },
    productLink: {
        color: CommonColors.primary,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    messageImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 8,
        marginBottom: 4,
        resizeMode: 'cover',
        backgroundColor: '#f0f0f0',
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    productCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 10,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    productTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    productPrice: {
        fontSize: 14,
        color: CommonColors.primary,
        fontWeight: 'bold',
    },
    productButton: {
        backgroundColor: CommonColors.primary,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginVertical: 8,
        width: '100%'
    },
    productButtonText: {
        color: CommonColors.white,
        fontSize: 15,
        fontWeight: '400',
        alignSelf: 'center'
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: CommonColors.white,
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
    },
    sendButton: {
        width: 80,
        backgroundColor: CommonColors.primary,
        borderRadius: 5,
        padding: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.7
    },
    sendButtonText: {
        color: CommonColors.white,
        fontWeight: '500',
    },
});

export default ChatbotStyle;