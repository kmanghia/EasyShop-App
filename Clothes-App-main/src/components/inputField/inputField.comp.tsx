import React from "react";
import { TextInput } from "react-native";
import InputFieldStyle from "./inputField.style";

type Props = {
    invalid?: boolean
} & React.ComponentProps<typeof TextInput>;

const InputField = ({ invalid, ...props }: Props) => {
    return (
        <TextInput
            style={[styles.inputField, invalid && styles.borderRed]}
            {...props}
        />
    )
}

const styles = InputFieldStyle;

export default InputField;