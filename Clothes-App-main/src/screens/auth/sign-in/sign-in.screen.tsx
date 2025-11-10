import { Animated, ImageBackground, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import SignInStyle from "./sign-in.style";
import { router } from "expo-router";
import { CommonColors } from "@/src/common/resource/colors";
import * as AuthManagement from "../../../data/management/auth.management";
import { AuthModel } from "@/src/data/model/auth.model";
import { HttpCode } from "@/src/common/resource/http-code";
import { AppConfig } from "@/src/common/config/app.config";
import { UserModel } from "@/src/data/model/user.model";
import { useToast } from "@/src/customize/toast.context";
import { useDispatch, useSelector } from "react-redux";
import * as  UserActions from "@/src/data/store/actions/user/user.action";
import { RootState } from "@/src/data/types/global";
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

interface FormData {
    email: string;
    password: string;
}

const SignInScreen = () => {
    const { showToast } = useToast();
    const userSelector = useSelector((state: RootState) => state.userLogged) as UserStoreState;
    const dispatch = useDispatch();
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        setError
    } = useForm<FormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        reValidateMode: 'onChange',
        mode: 'onChange'
    });
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const onSubmit = async (data: FormData) => {
        try {
            let payload = new AuthModel(data.email, data.password);
            const response = await AuthManagement.signIn(payload);
            const userInfo = new UserModel().convertObj(response?.info);
            userInfo.expires = true;
            await new AppConfig().setAccessToken(response.access_token);
            await new AppConfig().setRefreshToken(response.refresh_token);
            await new AppConfig().setUserInfo(userInfo);
            dispatch(UserActions.UpdateExpiresLogged(true));
            dispatch(UserActions.UpdateLoggedStatus(true));
            router.navigate("/(tabs)");
        } catch (error: any) {
            console.log(error);
            const status = error?.status;
            const message = error?.message;
            if (status === HttpCode.BAD_REQUEST) {
                if (message?.includes('Thông tin đăng nhập không chính xác') || message?.includes('Người dùng không tồn tại')) {
                    setError('email', {
                        type: 'manual',
                        message: 'Thông tin đăng nhập không chính xác'
                    });
                    setError('password', {
                        type: 'manual',
                        message: 'Thông tin đăng nhập không chính xác'
                    });
                }
                return;
            }
            showToast('Oops! Hệ thống đang bận, quay lại sau', "error");
        }
    };

    return (
        <ImageBackground
            source={require('@/assets/images/ecommerce-splash.jpg')}
            style={styles.background}
        >
            <LinearGradient
                colors={['rgba(240,248,255,0.9)', 'rgba(224,242,254,0.95)']}
                style={styles.overlay}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Animated.View style={[styles.container, { opacity: fadeAnim, paddingTop: 30 }]}>
                        <Text style={styles.title}>Tham gia công đồng yêu thời trang</Text>

                        {/* Email */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Email</Text>
                            <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                                <Controller
                                    control={control}
                                    name="email"
                                    rules={{
                                        required: 'Địa chỉ Email không được bỏ trống',
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: 'Địa chỉ Email không hợp lệ',
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={styles.input}
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="Nhập địa chỉ Email"
                                            keyboardType="email-address"
                                            autoComplete="off"
                                            autoCorrect={false}
                                            placeholderTextColor="#a1a1aa"
                                        />
                                    )}
                                />
                                <View style={styles.icon}>
                                    <Ionicons name="mail" size={20} color={CommonColors.primary} />
                                </View>
                            </View>
                            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
                        </View>

                        {/* Password */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Mật khẩu</Text>
                            <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                                <Controller
                                    control={control}
                                    name="password"
                                    rules={{
                                        required: 'Mật khẩu không được bỏ trống',
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={styles.input}
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="Nhập mật khẩu"
                                            secureTextEntry
                                            autoComplete="off"
                                            autoCorrect={false}
                                            placeholderTextColor="#a1a1aa"
                                        />
                                    )}
                                />
                                <View style={styles.icon}>
                                    <FontAwesome5 name="lock" size={16} color={CommonColors.primary} />
                                </View>
                            </View>
                            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
                            <Text style={styles.submitButtonText}>Đăng nhập</Text>
                        </TouchableOpacity>
                        <View style={styles.signInWrapper}>
                            <Text style={styles.signInTxt}>
                                Bạn chưa có tài khoản?
                            </Text>
                            <TouchableOpacity onPress={() => router.navigate("/(routes)/sign-up")}>
                                <Text style={styles.signInTxtSpan}>Đăng ký</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            </LinearGradient>
        </ImageBackground>
    );
};

const styles = SignInStyle;

export default SignInScreen;
