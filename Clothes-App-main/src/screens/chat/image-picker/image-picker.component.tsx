import { ActionSheetIOS, Platform, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";

type Props = {
    onImageSelect: (images: any[]) => void;
}

const ChatImagePicker = ({
    onImageSelect
}: Props) => {

    const handleImagePicker = async () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Hủy', 'Chụp ảnh', 'Chọn từ thư viện'],
                    cancelButtonIndex: 0
                },
                async (buttonIndex) => {
                    if (buttonIndex === 1) {
                        const { status } = await ImagePicker.requestCameraPermissionsAsync();
                        if (status !== 'granted') {
                            alert('Cần cấp quyền truy cập camera để chụp ảnh!');
                            return;
                        }

                        const result = await ImagePicker.launchCameraAsync({
                            mediaTypes: ['images'],
                            allowsEditing: true,
                            aspect: [4, 3],
                            quality: 0.8
                        })

                        if (!result.canceled) {
                            onImageSelect([result.assets[0]]);
                        }
                    } else if (buttonIndex === 2) {
                        // Chọn từ thư viện
                        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (status !== 'granted') {
                            alert('Cần cấp quyền truy cập thư viện ảnh!');
                            return;
                        }

                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ['images'],
                            allowsMultipleSelection: true,
                            selectionLimit: 5,
                            quality: 0.8
                        })

                        if (!result.canceled) {
                            onImageSelect(result.assets);
                        }
                    }
                }
            )
        } else {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                alert('Cần cấp quyền truy cập thư viện ảnh!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsMultipleSelection: true,
                selectionLimit: 5,
                quality: 0.8
            })

            if (!result.canceled) {
                onImageSelect(result.assets);
            }
        }
    }

    return (
        <TouchableOpacity onPress={handleImagePicker} style={styles.button}>
            <Ionicons name="images-outline" size={24} color="#0084ff" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
    },
});

export default ChatImagePicker;