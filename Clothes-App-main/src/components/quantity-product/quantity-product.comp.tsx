import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";

type Props = {
    initialQuantity?: number;
    min?: number;
    max?: number;
    onQuantityChange?: (quantity: number) => void;
    resetQuantity?: boolean;
    setResetQuantity?: (isReset: boolean) => void
}

const QuantityProductComponent = ({
    initialQuantity = 1,
    min = 1,
    max = 99,
    onQuantityChange,
    resetQuantity,
    setResetQuantity
}: Props) => {
    const [quantity, setQuantity] = useState(initialQuantity);

    // useEffect(() => {
    //     /** Chả để làm gì cả, chỉ để nó nhận initialQuantity */
    // }, [quantity])

    useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity])

    useEffect(() => {
        if (resetQuantity) {
            setQuantity(min);
            onQuantityChange?.(min);
            setResetQuantity?.(false);
        }
    }, [resetQuantity, min, onQuantityChange, setResetQuantity]);

    const handleIncrease = () => {
        if (quantity < max) {
            const newQuantity = quantity + 1;
            setQuantity(newQuantity);
            onQuantityChange?.(newQuantity);
        }
    };

    const handleDecrease = () => {
        if (quantity > min) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            onQuantityChange?.(newQuantity);
        }
    };

    const handleInputChange = (text: string) => {
        if (text === "") {
            setQuantity(min);
            onQuantityChange?.(min);
            return;
        }

        const num = parseInt(text, 10);
        if (!isNaN(num) && num >= min && num <= max) {
            setQuantity(num);
            onQuantityChange?.(num);
        }
    };

    return (
        <View style={styles.quantityWrapper}>
            <TouchableOpacity style={styles.quantityButton} onPress={handleDecrease} disabled={quantity <= min}>
                <AntDesign name="minus" size={16} color={quantity <= min ? CommonColors.gray : CommonColors.black} />
            </TouchableOpacity>
            <TextInput
                style={styles.quantityInput}
                value={quantity + ""}
                keyboardType="numeric"
                onChangeText={handleInputChange}
            />
            <TouchableOpacity style={styles.quantityButton} onPress={handleIncrease} disabled={quantity >= max}>
                <AntDesign name="plus" size={16} color={quantity >= max ? CommonColors.gray : CommonColors.black} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    quantityWrapper: {
        width: 114,
        height: 25,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        overflow: "hidden",
    },
    quantityButton: {
        backgroundColor: CommonColors.white,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    quantityInput: {
        width: 50,
        height: 25,
        padding: 0,
        textAlign: "center",
        verticalAlign: "middle",
        fontSize: 14,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: "#ccc",
        color: CommonColors.primary
    },
});

export default QuantityProductComponent;
