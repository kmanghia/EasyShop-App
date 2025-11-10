import { Text, TouchableOpacity, View } from "react-native";
import HeaderStyle from "./header.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import { useSelector } from "react-redux";
import { RootState } from "@/src/data/types/global";
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer";
import { router } from "expo-router";

type Props = {
    openSearch: () => void
};

const HeaderComponent = (props: Props) => {
    const insets = useSafeAreaInsets();
    const userSelector: UserStoreState = useSelector((state: RootState) => state.userLogged);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Text style={styles.logo}>FZ</Text>
            <TouchableOpacity onPress={props.openSearch} style={styles.searchBar}>
                <Text style={styles.searchTxt}>Tìm kiếm sản phẩm</Text>
                <FontAwesome name="search" size={20} color={CommonColors.gray} />
            </TouchableOpacity>
            {userSelector.isLogged && (
                <TouchableOpacity style={styles.buttonMessage} onPress={() => router.navigate('/(routes)/list-chat')}>
                    <Fontisto name="messenger" size={20} color={CommonColors.white} />
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = HeaderStyle;

export default HeaderComponent;