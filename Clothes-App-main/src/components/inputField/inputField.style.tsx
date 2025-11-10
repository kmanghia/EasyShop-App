import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { StyleSheet } from "react-native";

const InputFieldStyle = StyleSheet.create({
    inputField: {
        backgroundColor: CommonColors.white,
        paddingVertical: 14,
        paddingHorizontal: 18,
        alignSelf: 'stretch',
        borderRadius: 5,
        fontSize: 14,
        borderWidth: 1,
        borderColor: CommonColors.extraLightGray,
        color: CommonColors.black,
    },
    borderRed: {
        borderColor: '#FF0000'
    }
});

export default InputFieldStyle;