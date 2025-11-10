import { Platform, StyleSheet } from "react-native";

const CategoryListComponentStyle = StyleSheet.create({
    container: {
        marginBottom: 8
    },
    titleWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        marginHorizontal: 20,
        marginTop: 10
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: '#1f2937',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
        borderBottomWidth: 2,
        borderBottomColor: '#33adff',
    },
    titleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    titleBtn: {
        fontSize: 15,
        fontWeight: '500',
        color: '#33adff',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
    },
});

export default CategoryListComponentStyle;