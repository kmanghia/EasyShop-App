import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { StyleSheet } from "react-native";

const NotificationStyle = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        position: 'relative',
        height: 80,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: Fonts.ROBOTO_BOLD,
        color: "#000",
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 10
    },
    notificationItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#fff",
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        padding: 5,
    },
    contentContainer: {
        flex: 1,
        marginLeft: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    message: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    time: {
        fontSize: 12,
        color: "#999",
        marginTop: 2,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: CommonColors.primary,
        position: "absolute",
        right: 10,
    },
    emptyText: {
        textAlign: "center",
        color: "#666",
        padding: 20,
    },
});

export default NotificationStyle;