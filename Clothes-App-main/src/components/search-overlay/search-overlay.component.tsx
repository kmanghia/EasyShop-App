import { CommonColors } from "@/src/common/resource/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

type Props = {
    isVisible: boolean;
    onClose: () => void;
    onHandleSearch: (searchValue: string) => void
    initialQuery?: string;
}

const { height: HEIGHT_SCREEN } = Dimensions.get('window');

const SearchOverlayComponent = ({
    isVisible,
    onClose,
    onHandleSearch,
    initialQuery
}: Props) => {
    const inputRef = useRef<TextInput>(null);
    const opacity = useSharedValue(0);
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    /** Tự động focus vào TextInput khi overlay xuất hiện */
    useEffect(() => {
        if (isVisible && inputRef.current) {
            inputRef.current.focus();
            setSearchQuery(initialQuery);
            opacity.value = withTiming(1, { duration: 150 });
        } else {
            setSearchQuery('')
            opacity.value = withTiming(0, { duration: 150 });
        }
    }, [isVisible])

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    const handleSearch = () => {
        onHandleSearch(searchQuery ?? '');
    }

    if (!isVisible) return null;

    return (
        <Animated.View style={styles.container}>
            <Animated.View style={[styles.innerContainer, animatedStyle]} >
                <View style={styles.searchBar}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="arrow-back" size={24} color={CommonColors.primary} />
                    </TouchableOpacity>
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Tìm kiếm sản phẩm"
                        autoFocus={Platform.OS === 'web'}
                        onSubmitEditing={handleSearch} // Xử lý khi nhấn Enter trên bàn phím
                    />
                    <TouchableOpacity onPress={handleSearch}>
                        <Ionicons name="search" size={24} color={CommonColors.primary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    {/* Thêm gợi ý tìm kiếm hoặc lịch sử tại đây */}
                </View>
            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
    innerContainer: {
        flex: 1,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginTop: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    input: {
        marginHorizontal: 10,
        fontSize: 16,
        flex: 1,
        backgroundColor: CommonColors.background,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default SearchOverlayComponent;