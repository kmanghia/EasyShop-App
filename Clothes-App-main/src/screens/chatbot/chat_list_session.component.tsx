import React, { useRef, useEffect } from 'react';
import { Animated, View, Text, TouchableOpacity, Dimensions, StyleSheet, Pressable } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(320, SCREEN_WIDTH * 0.8);

export default function ChatListSession({
    visible,
    onClose,
    onSelectSession,
    sessions = [],
    currentSessionId
}: {
    visible: boolean,
    onClose: () => void,
    onSelectSession: (sessionId: string) => void,
    sessions: any[],
    currentSessionId?: string
}) {
    const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(translateX, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateX, {
                toValue: -DRAWER_WIDTH,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <View style={styles.overlay} pointerEvents="box-none">
            <Pressable style={styles.backdrop} onPress={onClose} />
            <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
                <Text style={styles.title}>Danh sách hội thoại</Text>
                {sessions.length === 0 && <Text style={{ color: '#888' }}>Chưa có hội thoại cũ</Text>}
                {sessions.map((session) => (
                    <TouchableOpacity
                        key={session.sessionId}
                        style={[
                            styles.sessionItem,
                            session.sessionId === currentSessionId && styles.sessionItemActive
                        ]}
                        onPress={() => {
                            onSelectSession(session.sessionId);
                            onClose();
                        }}
                    >
                        <Text style={styles.sessionTitle} numberOfLines={1}>
                            {session.title || 'Cuộc hội thoại'}
                        </Text>
                        <Text style={styles.sessionTime}>
                            {new Date(session.createdAt).toLocaleString()}
                        </Text>
                    </TouchableOpacity>
                ))}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        zIndex: 100,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    drawer: {
        width: DRAWER_WIDTH,
        backgroundColor: '#fff',
        paddingTop: 32,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
        height: '100%',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 16,
    },
    sessionItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sessionItemActive: {
        backgroundColor: '#e3f2fd',
    },
    sessionTitle: {
        fontWeight: '600',
        fontSize: 15,
    },
    sessionTime: {
        fontSize: 12,
        color: '#888',
    },
}); 