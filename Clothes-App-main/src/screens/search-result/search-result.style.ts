import { CommonColors } from "@/src/common/resource/colors";
import { Dimensions, StyleSheet } from "react-native";

const { width: WIDTH_SCREEN } = Dimensions.get('window');

const SearchResultStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: CommonColors.white,
        paddingHorizontal: 20,
        paddingBottom: 10,
        gap: 15,

        // Shadow cho Android
        elevation: 3,
        // Shadow cho iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,

    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        marginTop: 40,
    },
    input: {
        marginHorizontal: 10,
        fontSize: 16,
        flex: 1,
        backgroundColor: CommonColors.background,
        borderRadius: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },

    btnSearchMore: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        width: WIDTH_SCREEN,
        height: 50
    },
    btnSearchMoreText: {
        fontSize: 18,
        color: CommonColors.primary
    },
    emptyText: {
        textAlign: "center",
        color: "#666",
        fontSize: 15
    },
});

export default SearchResultStyle;