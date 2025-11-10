import { CartItemType } from "@/src/data/types/global"
import CartItemComponentStyle from "./cart-item.style";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";

type Props = {
    item: CartItemType;
}

const CartItemComponent = ({ item }: Props) => {

    return (
        <View style={styles.cartItemWrapper}>
            <Image style={styles.cartItemImage} source={{ uri: item.image }} />
            <View style={styles.cartItemInfoWrapper}>
                <Text
                    style={[styles.cartItemText, { width: 220 }]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {item.title}
                </Text>
                <Text style={styles.cartItemText}>${item.price}</Text>
                <View style={styles.cartItemControlWrapper}>
                    <TouchableOpacity>
                        <Ionicons name="trash-outline" size={20} color={CommonColors.red} />
                    </TouchableOpacity>
                    <View style={styles.quantityControlWrapper}>
                        <TouchableOpacity style={styles.quantityControl}>
                            <Ionicons name="remove-outline" size={20} color={CommonColors.black} />
                        </TouchableOpacity>
                        <Text>1</Text>
                        <TouchableOpacity style={styles.quantityControl}>
                            <Ionicons name="add-outline" size={20} color={CommonColors.black} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="heart-outline" size={20} color={CommonColors.black} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = CartItemComponentStyle;

export default CartItemComponent;