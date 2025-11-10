import React, { useRef, useEffect, ReactNode } from 'react';
import {
    Animated,
    Dimensions,
    PanResponder,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type CustomBottomSheetProps = {
    isVisible: boolean;
    onClose: () => void;
    children: ReactNode;
    height?: number;
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
};

const CustomBottomSheet = ({
    isVisible,
    onClose,
    children,
    height = SCREEN_HEIGHT * 0.9,
    borderTopLeftRadius = 0,
    borderTopRightRadius = 0
}: CustomBottomSheetProps) => {
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isVisible) {
            openBottomSheet();
        } else {
            closeBottomSheet();
        }
    }, [isVisible]);

    const openBottomSheet = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: SCREEN_HEIGHT - height,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0.5,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeBottomSheet = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: SCREEN_HEIGHT,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                if (gesture.dy > 0) {
                    translateY.setValue(SCREEN_HEIGHT - height + gesture.dy);
                }
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dy > 100) {
                    closeBottomSheet();
                } else {
                    openBottomSheet();
                }
            },
        })
    ).current;

    if (!isVisible) return null;

    return (
        <View style={[styles.container]}>
            <TouchableWithoutFeedback onPress={closeBottomSheet}>
                <Animated.View
                    style={[styles.backdrop, { opacity: backdropOpacity }]}
                />
            </TouchableWithoutFeedback>

            <Animated.View
                {...panResponder.panHandlers}
                style={[
                    styles.sheet,
                    {
                        height,
                        transform: [{ translateY }],
                    },
                    {
                        borderTopLeftRadius: borderTopLeftRadius,
                        borderTopRightRadius: borderTopRightRadius
                    }
                ]}
            >
                {children}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        zIndex: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        paddingBottom: 30,
        overflow: 'hidden',
    },
});

export default CustomBottomSheet;