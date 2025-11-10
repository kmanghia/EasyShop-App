import { StyleSheet, Dimensions, Platform } from 'react-native';

const width = Dimensions.get('window').width - 40;

const ProductItemStyle = StyleSheet.create({
    container: {
        width: width / 2 - 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        marginBottom: 15,
    },
    imageContainer: {
        position: 'relative',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    productImg: {
        width: '100%',
        height: 240,
        borderRadius: 10,
    },
    bookmarkBtn: {
        position: 'absolute',
        right: 12,
        top: 12,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 8,
        borderRadius: 20,
    },
    productInfo: {
        padding: 10,
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1f2937',
        marginBottom: 6,
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#33adff',
        marginBottom: 6,
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto-Bold',
    },
    ratingSoldWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingTxt: {
        fontSize: 13,
        color: '#6b7280',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
    },
    soldWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    soldTxt: {
        fontSize: 13,
        color: '#6b7280',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
    },
});

export default ProductItemStyle;