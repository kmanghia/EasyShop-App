import { StyleSheet, Platform } from 'react-native';
import { CommonColors } from '@/src/common/resource/colors';

const MeStyle = StyleSheet.create({
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
    registerShopButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#33adff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    registerShopText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#33adff',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 20,
    },
    buttonWrapper: {
        gap: 12,
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 12,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1f2937',
        flex: 1,
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
    },
    recentlyViewedSection: {
        marginTop: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto-Bold',
    },
    viewAllText: {
        fontSize: 14,
        color: '#33adff',
        fontWeight: '500',
    },
    productCarousel: {
        flexGrow: 0,
    },
    productCard: {
        width: 140,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    productImage: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
    },
    productName: {
        fontSize: 12,
        color: '#1f2937',
        marginBottom: 4,
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
    },
    productPrice: {
        fontSize: 12,
        fontWeight: '600',
        color: '#33adff',
    },
    emptyContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: 'transparent'
    },
    emptyText: {
        textAlign: "center",
        color: "#666",
        fontSize: 15
    },
});

export default MeStyle;