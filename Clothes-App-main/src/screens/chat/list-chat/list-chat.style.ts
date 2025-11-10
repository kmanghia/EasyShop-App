import { Platform, StyleSheet } from "react-native";

const ListChatStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(240,248,255,0.95)',
    },
    header: {
        padding: 30,
        paddingTop: 40,
        paddingBottom: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    infoImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#fff',
    },
    username: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto-Bold',
    },
    tagline: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
    },
    messagesList: {
        padding: 10,
    },
    conversationItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e0e0e0',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    conversationContent: {
        flex: 1,
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
    },
    timeAgo: {
        fontSize: 12,
        color: '#666',
    },
    messagePreview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lastMessage: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        marginRight: 10,
    },
    unreadMessage: {
        color: '#313131',
        fontWeight: '500',
    },
    unreadBadge: {
        backgroundColor: '#0084ff',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    unreadCount: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
})

export default ListChatStyle;