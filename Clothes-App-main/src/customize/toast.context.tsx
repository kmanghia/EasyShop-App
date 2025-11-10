import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { createContext, useContext, useRef, useState } from "react";
import { Animated, TouchableOpacity, Text, StyleSheet, Dimensions, View } from "react-native";

type ToastContextType = {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void
};

const ToastContext = createContext<ToastContextType>({
    showToast: () => { }
});

type Props = {
    children: React.ReactNode
}

export const ToastProvider = ({ children }: Props) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error' | 'info'>('info');
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const opacity = useRef(new Animated.Value(0)).current;

    const hideToast = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start(() => setVisible(false));
    }

    const showToast = (msg: string, toastType: 'success' | 'error' | 'info' = 'info') => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setMessage(msg);
        setType(toastType);
        setVisible(true);

        Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        timeoutRef.current = setTimeout(() => {
            hideToast();
        }, 2000);
    }

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <Ionicons
                        name="checkmark-sharp"
                        size={35}
                        color={'#f8f8f8'}
                    />
                );
            case 'error':
                return (
                    <Feather
                        name="alert-triangle"
                        size={35}
                        color={'#f8f8f8'}
                    />
                );
            case 'info':
                return (
                    <Ionicons
                        name="information-circle-outline"
                        size={35}
                        color={'#f8f8f8'}
                    />
                );
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {visible && (
                <Animated.View
                    style={[
                        styles.toast,
                        styles[type],
                        { opacity: opacity }
                    ]}
                >
                    <TouchableOpacity style={styles.btn} onPress={hideToast}>
                        {getIcon()}
                        <View style={{ marginTop: 'auto' }}>
                            <Text style={styles.text}>{message}</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </ToastContext.Provider>
    )
}

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        top: Dimensions.get('window').height / 2 - 120,
        alignSelf: 'center',
        padding: 12,
        borderRadius: 8,
        zIndex: 1000000,
        minWidth: Dimensions.get('window').width * 0.60,
        maxWidth: 300,
        minHeight: 100,
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10
    },
    text: {
        color: '#f8f8f8',
        fontSize: 16,
        wordWrap: 'wrap',
        textAlign: 'center'
    },
    success: {
        backgroundColor: 'rgba(75, 181, 67, 0.8)',
        borderWidth: 1,
        borderColor: 'rgba(75, 181, 67, 0.5)',
    },
    error: {
        backgroundColor: 'rgba(34, 34, 34, 0.7)',
        borderWidth: 1,
        borderColor: 'rgba(34, 34, 34, 0.5)',
    },
    info: {
        backgroundColor: 'rgba(0, 149, 255, 0.8)',
        borderWidth: 1,
        borderColor: 'rgba(0, 149, 255, 0.5)',
    },
});