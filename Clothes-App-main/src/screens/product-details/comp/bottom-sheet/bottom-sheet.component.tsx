import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    height?: number;
}

const BottomSheetComponent: React.FC<BottomSheetProps> = ({
    isOpen,
    onClose,
    children,
    height = SCREEN_HEIGHT * 0.5,
}) => {
    const adjustedScreenHeight = SCREEN_HEIGHT;
    const translateY = useRef(new Animated.Value(adjustedScreenHeight)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const isAnimating = useRef(false);
    const [localIsOpen, setLocalIsOpen] = useState(isOpen);

    const resetPosition = useCallback(() => {
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [translateY]);

    const closeSheet = useCallback(() => {
        if (isAnimating.current) return;

        isAnimating.current = true;
        setLocalIsOpen(false);

        Animated.parallel([
            Animated.timing(translateY, {
                toValue: adjustedScreenHeight,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(({ finished }) => {
            if (finished) {
                isAnimating.current = false;
                onClose();
            }
        });
    }, [adjustedScreenHeight, onClose, backdropOpacity, translateY]);

    const openSheet = useCallback(() => {
        if (isAnimating.current) return;

        isAnimating.current = true;
        setLocalIsOpen(true);

        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(({ finished }) => {
            if (finished) {
                isAnimating.current = false;
            }
        });
    }, [backdropOpacity, translateY]);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Chỉ phản ứng khi vuốt xuống mạnh và theo chiều dọc
                return gestureState.dy > 30 && Math.abs(gestureState.dx) < Math.abs(gestureState.dy);
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                // Tăng ngưỡng đáng kể để tránh đóng bottom sheet khi vuốt nhẹ
                if (gestureState.dy > 200 || gestureState.vy > 1.0) {
                    closeSheet();
                } else {
                    resetPosition();
                }
            },
        })
    ).current;

    const show = useCallback(() => {
        openSheet();
    }, [openSheet]);

    const hide = useCallback(() => {
        closeSheet();
    }, [closeSheet]);

    useEffect(() => {
        if (isOpen && !localIsOpen && !isAnimating.current) {
            show();
        } else if (!isOpen && localIsOpen && !isAnimating.current) {
            hide();
        }
    }, [isOpen, localIsOpen, show, hide]);

    // Nếu component bị unmount khi đang mở, đảm bảo gọi onClose
    useEffect(() => {
        return () => {
            if (localIsOpen) {
                onClose();
            }
        };
    }, [localIsOpen, onClose]);

    return (
        <>
            {/* Backdrop */}
            <Animated.View
                pointerEvents={localIsOpen ? 'auto' : 'none'}
                style={[
                    styles.backdrop,
                    {
                        opacity: backdropOpacity,
                    },
                ]}
            >
                <TouchableWithoutFeedback onPress={hide}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
            </Animated.View>

            {/* Bottom Sheet */}
            <Animated.View
                style={[
                    styles.bottomSheet,
                    {
                        height: height,
                        transform: [{ translateY }],
                    },
                ]}
            >
                <View style={styles.handlerContainer} {...panResponder.panHandlers}>
                    <View style={styles.handler} />
                </View>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={{ paddingBottom: 20, minHeight: height - 20 }}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                >
                    {children}
                </ScrollView>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10,
    },
    bottomSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        zIndex: 20,
        overflow: 'hidden',
    },
    handlerContainer: {
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 4,
    },
    handler: {
        width: 50,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ccc',
    },
    scrollView: {
        flex: 1,
    },
});

export default BottomSheetComponent;