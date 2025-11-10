import { CommonColors } from "@/src/common/resource/colors";
import { useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Animated } from "react-native";

const SwitchComponent = (
    { value, onChange }: { value: boolean, onChange: (value: boolean) => void }
) => {
    const animationRef = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animationRef, {
            toValue: value ? 1 : 0,
            duration: 200,
            useNativeDriver: false, // false vì backgroundColor không hỗ trợ useNativeDriver
        }).start();
    }, [value]);

    const toggleSwitch = () => {
        onChange(!value); // Cập nhật state cha, useEffect sẽ xử lý animation
    };

    const translateX = animationRef.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 23],
    });

    const backgroundColor = animationRef.interpolate({
        inputRange: [0, 1],
        outputRange: ['#ccc', CommonColors.primary],
    });

    return (
        <TouchableOpacity activeOpacity={1} onPress={toggleSwitch}>
            <Animated.View style={[styleToggles.track, { backgroundColor }]}>
                <Animated.View
                    style={[
                        styleToggles.thumb,
                        {
                            transform: [{ translateX }],
                            backgroundColor: CommonColors.white,
                        },
                    ]}
                />
            </Animated.View>
        </TouchableOpacity>
    );
};

const styleToggles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
    },
    track: {
        width: 55,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        padding: 2,
    },
    thumb: {
        width: 26,
        height: 26,
        borderRadius: 13,
    },

});

export default SwitchComponent;