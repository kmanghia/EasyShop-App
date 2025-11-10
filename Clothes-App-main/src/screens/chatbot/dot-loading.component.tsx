import { CommonColors } from '@/src/common/resource/colors';
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const DotPulse: React.FC = () => {
    const scale1 = useRef(new Animated.Value(1)).current;
    const scale2 = useRef(new Animated.Value(1)).current;
    const scale3 = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const createAnimation = (scale: Animated.Value): Animated.CompositeAnimation => {
            return Animated.sequence([
                // Shrink
                Animated.timing(scale, {
                    toValue: 0.3,
                    duration: 300,
                    useNativeDriver: true,
                }),
                // Expand
                Animated.timing(scale, {
                    toValue: 1.2,
                    duration: 300,
                    useNativeDriver: true,
                }),
                // Return to normal
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                // Pause before next cycle
                Animated.delay(100),
            ]);
        };

        const startAnimation = () => {
            Animated.loop(
                Animated.stagger(200, [
                    createAnimation(scale1),
                    createAnimation(scale2),
                    createAnimation(scale3),
                ])
            ).start();
        };

        startAnimation();

        return () => {
            scale1.stopAnimation();
            scale2.stopAnimation();
            scale3.stopAnimation();
        };
    }, [scale1, scale2, scale3]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.dot,
                    {
                        transform: [{ scale: scale1 }],
                        opacity: scale1.interpolate({
                            inputRange: [0.3, 1],
                            outputRange: [0.3, 1],
                        }),
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.dot,
                    {
                        transform: [{ scale: scale2 }],
                        opacity: scale2.interpolate({
                            inputRange: [0.3, 1],
                            outputRange: [0.3, 1],
                        }),
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.dot,
                    {
                        transform: [{ scale: scale3 }],
                        opacity: scale3.interpolate({
                            inputRange: [0.3, 1],
                            outputRange: [0.3, 1],
                        }),
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: CommonColors.primary,
    },
});

export default DotPulse;