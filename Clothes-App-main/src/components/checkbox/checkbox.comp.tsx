import { CommonColors } from "@/src/common/resource/colors";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

type Props = {
    stateChecked: boolean,
    toggleCheckedFunc: (isChecked: boolean) => void,
    disabled?: boolean,
    circle?: boolean
}

const CheckboxComponent = ({
    stateChecked,
    toggleCheckedFunc,
    disabled,
    circle
}: Props) => {

    return (
        <TouchableOpacity style={{ width: 26 }}>
            <BouncyCheckbox
                size={24}
                fillColor={CommonColors.primary}
                unFillColor={CommonColors.white}
                isChecked={stateChecked}
                disabled={disabled}
                onPress={(isChecked: boolean) => !disabled && toggleCheckedFunc(isChecked)}
                iconStyle={{
                    borderColor: CommonColors.primary,
                    backgroundColor: disabled
                        ? CommonColors.extraLightGray
                        : stateChecked
                            ? CommonColors.primary
                            : CommonColors.white,
                    borderRadius: circle ? '50%' : 3
                }}
                innerIconStyle={{
                    borderWidth: 1,
                    borderRadius: circle ? '50%' : 3,
                    borderColor: stateChecked ? 'transparent' : CommonColors.gray
                }}
            />
        </TouchableOpacity>
    )
}

export default CheckboxComponent;