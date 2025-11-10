import { Text, TouchableOpacity, View } from "react-native";
import SocialSignInButtonStyle from "./socialSignInButtons.style";
import Animated, { FadeInDown } from "react-native-reanimated";
import { CommonColors } from "@/src/common/resource/colors";
import { FontAwesome } from "@expo/vector-icons";
import Google from "@/assets/images/google-logo.svg";
import { Href, Link } from "expo-router";

type Props = {
    emailHref: Href
};

const SocialSignInButtons = (props: Props) => {

    const { emailHref } = props;

    return (
        <View style={styles.socialSignInWrapper}>
            <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                <Link href={emailHref} asChild>
                    <TouchableOpacity style={styles.button}>
                        <FontAwesome name="envelope-o" size={20} color={CommonColors.black} />
                        <Text style={styles.btnTxt}>Đăng nhập với Email</Text>
                    </TouchableOpacity>
                </Link>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(700).duration(500)}>
                <TouchableOpacity style={styles.button}>
                    <Google width={20} height={20} />
                    <Text style={styles.btnTxt}>Đăng nhập với Google</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>

    )
}

const styles = SocialSignInButtonStyle;

export default SocialSignInButtons;