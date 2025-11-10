import { CommonColors } from "@/src/common/resource/colors";
import { ShopModel } from "@/src/data/model/shop.model"
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import * as ChatMessageMana from "@/src/data/management/chat-message.management";
import { router } from "expo-router";
import store from "@/src/data/store/store.config";

type Props = {
    shop: ShopModel | null;
    preImage: string;
}

const { width: WIDTH_SCREEN } = Dimensions.get('screen');

const ShopHeaderComponent = ({
    shop,
    preImage = ''
}: Props) => {
    const userSelector = store.getState().userLogged;

    const onCreateConversation = async () => {
        try {
            await ChatMessageMana.createConversation(shop?.ownerId ?? 0);
            router.push({
                pathname: '/(routes)/chat-detail',
                params: {
                    id: shop?.ownerId ?? 0,
                    shopId: shop?.id ?? 0
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    if (!shop) {

        return (
            <View>
                <Text>Không có dữ liệu</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Image style={styles.imageBackground} source={{ uri: `${preImage}/${shop.background_url}` }} />
            <View style={{ marginTop: 100, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={styles.shopInfo}>
                    <Image style={styles.imageLogo} source={{ uri: `${preImage}/${shop.logo_url}` }} />
                    <View style={styles.nameAndAddressContainer}>
                        <Text style={styles.name}>{shop.shop_name}</Text>
                        <Text style={styles.address}>{shop.contact_address}</Text>
                    </View>
                </View>
                {userSelector.isLogged && userSelector.id !== shop?.ownerId && (
                    <TouchableOpacity style={styles.btn} onPress={onCreateConversation}>
                        <MaterialCommunityIcons name="message-reply-text-outline" size={15} color="white" />
                        <Text style={styles.btnText}>Chat</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: WIDTH_SCREEN,
        height: 200
    },
    imageBackground: {
        position: 'absolute',
        width: WIDTH_SCREEN,
        height: '100%'
    },
    shopInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10
    },
    imageLogo: {
        width: 70,
        height: 70,
        borderRadius: 40,
        marginRight: 10
    },
    nameAndAddressContainer: {
        height: 70,
    },
    name: {
        marginTop: 10,
        marginBottom: 5,
        fontSize: 18,
        fontWeight: '700',
        color: CommonColors.white,
        letterSpacing: 1.8
    },
    address: {
        fontSize: 13,
        color: CommonColors.white,
        letterSpacing: 1.2
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        width: 80,
        height: 25,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: CommonColors.white,
        paddingHorizontal: 10
    },
    btnText: {
        color: CommonColors.white
    }
})

export default ShopHeaderComponent;
