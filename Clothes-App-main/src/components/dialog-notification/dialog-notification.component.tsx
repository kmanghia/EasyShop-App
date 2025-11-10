import React from 'react';
import { CommonColors } from "@/src/common/resource/colors";
import { Dimensions, TouchableOpacity, Platform } from "react-native";
import { Text } from "react-native";
import { Modal, StyleSheet, View, StatusBar } from "react-native";

type Props = {
    message?: string;
    textClose?: string;
    textConfirm?: string;
    onConfirm?: () => void;
    onClose?: () => void;
    visible?: boolean;
    type?: "warning" | "warning-confirm"
}

const DialogNotification = ({
    message = '',
    textClose = 'Hủy',
    textConfirm = 'Đồng ý',
    onConfirm,
    onClose,
    visible = false,
    type = "warning-confirm"
}: Props) => {
    return (
        <>
            {visible && <StatusBar backgroundColor="transparent" />}
            <Modal
                transparent={true}
                visible={visible}
                animationType="fade"
                onRequestClose={onClose}
                statusBarTranslucent={true}
            >
                <View style={styles.container}>
                    <View style={styles.backdrop}>
                        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />
                    </View>
                    <View style={styles.dialogWrapper}>
                        <View style={styles.dialog}>
                            <View style={{ paddingHorizontal: 16 }}>
                                <Text style={styles.message}>{message}</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                {type === "warning-confirm" ? (
                                    <>
                                        <TouchableOpacity style={[styles.button]} onPress={onClose}>
                                            <Text style={styles.buttonText}>
                                                {textClose}
                                            </Text>
                                        </TouchableOpacity>
                                        <View style={styles.buttonDivider}></View>
                                        <TouchableOpacity style={styles.button} onPress={onConfirm}>
                                            <Text style={styles.buttonText}>{textConfirm}</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <TouchableOpacity style={styles.button} onPress={onConfirm}>
                                        <Text style={styles.buttonText}>{textConfirm}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
    backdropTouch: {
        flex: 1,
    },
    dialogWrapper: {
        flex: 1,
        alignItems: 'center',
        marginTop: Dimensions.get('window').height / 2 - 120,
        zIndex: 2,
    },
    dialog: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '80%',
        maxWidth: 400,
        paddingTop: 20,
        paddingBottom: 0,
        overflow: 'hidden',

        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    message: {
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
        fontWeight: '400',
    },
    buttonContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonDivider: {
        borderRightWidth: 1,
        borderRightColor: '#eee',
    },
    buttonText: {
        fontSize: 16,
        color: CommonColors.primary,
        fontWeight: '500',
    },
    confirmText: {
        fontWeight: '700',
    },
});

export default DialogNotification;