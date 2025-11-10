import { StyleSheet, Platform } from 'react-native';

const SearchStyle = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    headerWrapper: {
        marginTop: 20,
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 12,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto-Bold',
    },
    flatListContent: {
        paddingBottom: 20,
    },
    itemWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(51,173,255,0.1)',
    },
    textWrapper: {
        flex: 1,
        justifyContent: 'center',
        paddingRight: 12,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1f2937',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
        marginBottom: 6,
    },
    titleHighlight: {
        color: '#33adff',
        fontWeight: '700',
    },
    itemCountWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    itemCount: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6b7280',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
    },
    itemImage: {
        width: 140,
        height: 120,
    },
});

export default SearchStyle;