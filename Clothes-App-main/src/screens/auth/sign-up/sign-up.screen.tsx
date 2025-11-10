import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Image,
    Platform,
    Alert,
    ScrollView,
    Animated,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5, FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonColors } from '@/src/common/resource/colors';
import { Gender } from '@/src/common/resource/gender';
import SignUpStyle from './sign-up.style';
import { useToast } from '@/src/customize/toast.context';
import { UserModel } from '@/src/data/model/user.model';
import { AuthModel } from '@/src/data/model/auth.model';
import * as AuthManagement from "@/src/data/management/auth.management";
import { router } from 'expo-router';
import { MessageError } from '@/src/common/resource/message-error';

interface FormData {
    name: string;
    email: string;
    password: string;
    phone: string;
    avatar: string | null;
}

const SignUpScreen = () => {
    const { showToast } = useToast();
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        setError
    } = useForm<FormData>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            phone: '',
            avatar: null,
        },
        reValidateMode: 'onChange',
        mode: 'onChange'
    });

    const [gender, setGender] = useState<Gender>(Gender.MALE);
    const [avatarPreview, setAvatarPreview] = useState<ImagePicker.ImagePickerResult & { assets?: ImagePicker.ImagePickerAsset[] } | null>(null);
    const [fadeAnim] = useState(new Animated.Value(0));

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission denied', 'Please allow access to the photo library.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets[0].uri) {
            setAvatarPreview(result);
        }
    };

    const onSubmit = async (data: FormData) => {
        if (!avatarPreview || avatarPreview.canceled || !avatarPreview.assets || !avatarPreview.assets[0]) {
            console.log(avatarPreview);
            console.log(avatarPreview?.canceled);
            console.log(avatarPreview?.assets);
            console.log(avatarPreview?.assets[0]);
            showToast('Hình đại diện không được bỏ trống', 'error');
            return;
        }

        const imageFile = {
            uri: avatarPreview.assets[0].uri,
            type: avatarPreview.assets[0].mimeType,
            name: avatarPreview.assets[0].fileName,
            size: avatarPreview.assets[0].fileSize,
        };

        const authModel = new AuthModel();
        authModel.email = data.email;
        authModel.password = data.password;
        const registerModel = new UserModel();
        registerModel.name = data.name;
        registerModel.gender = gender;
        registerModel.phone = `+84${data.phone}`;
        registerModel.address = '';

        try {
            await AuthManagement.signUp(registerModel, authModel, imageFile);
            showToast('Đăng ký tài khoản thành công', 'success');
            router.back();
        } catch (error: any) {
            console.log(error);
            if (error?.message === 'Người dùng đã tồn tại') {
                setError('email', {
                    type: 'manual',
                    message: 'Tài khoản này đã được đăng ký'
                });
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
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

                        {/* Username */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Tên tài khoản</Text>
                            <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                                <Controller
                                    control={control}
                                    name="name"
                                    rules={{ required: 'Tên tài khoản không được bỏ trống' }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={styles.input}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            placeholder="Nhập tên tài khoản"
                                            autoComplete="off"
                                            autoCorrect={false}
                                            autoFocus={Platform.OS === 'web'}
                                            placeholderTextColor="#a1a1aa"
                                        />
                                    )}
                                />
                                <View style={styles.icon}>
                                    <FontAwesome5 name="user-alt" size={16} color={CommonColors.primary} />
                                </View>
                            </View>
                            {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
                        </View>

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
                                        minLength: {
                                            value: 8,
                                            message: 'Mật khẩu tối thiểu 8 ký tự',
                                        },
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

                        {/* Phone */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Số điện thoại</Text>
                            <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
                                <View style={styles.phonePrefix}>
                                    <Text style={styles.phonePrefixText}>+84</Text>
                                </View>
                                <Controller
                                    control={control}
                                    name="phone"
                                    rules={{
                                        required: 'Số điện thoại không được bỏ trống',
                                        pattern: {
                                            value: /^[0-9]{9}$/,
                                            message: 'Số điện thoại bắt buộc 9 ký tự số (Không tính +84)',
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={[styles.input, styles.phoneInput]}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            placeholder="Nhập số điện thoại"
                                            keyboardType="phone-pad"
                                            maxLength={9}
                                            autoComplete="off"
                                            autoCorrect={false}
                                            placeholderTextColor="#a1a1aa"
                                        />
                                    )}
                                />
                                <View style={styles.icon}>
                                    <FontAwesome name="phone" size={20} color={CommonColors.primary} />
                                </View>
                            </View>
                            {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}
                        </View>

                        {/* Avatar */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Ảnh địa diện</Text>
                            <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
                                {(avatarPreview && !avatarPreview.canceled) ? (
                                    <Image source={{ uri: avatarPreview.assets[0].uri }} style={styles.avatar} />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <FontAwesome5 name="camera" size={20} color="#a1a1aa" />
                                        <Text style={styles.avatarText}>Thêm ảnh</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Gender */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Giới tính</Text>
                            <View style={styles.genderSelectionWrapper}>
                                <TouchableOpacity
                                    onPress={() => setGender(Gender.MALE)}
                                    style={[styles.genderWrapper, gender === Gender.MALE && styles.genderActiveWrapper]}
                                >
                                    <Text
                                        style={[styles.genderText, gender === Gender.MALE && styles.genderActiveText]}
                                    >
                                        Nam
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setGender(Gender.FEMALE)}
                                    style={[styles.genderWrapper, gender === Gender.FEMALE && styles.genderActiveWrapper]}
                                >
                                    <Text
                                        style={[styles.genderText, gender === Gender.FEMALE && styles.genderActiveText]}
                                    >
                                        Nữ
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setGender(Gender.OTHER)}
                                    style={[styles.genderWrapper, gender === Gender.OTHER && styles.genderActiveWrapper]}
                                >
                                    <Text
                                        style={[styles.genderText, gender === Gender.OTHER && styles.genderActiveText]}
                                    >
                                        Khác
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
                            <Text style={styles.submitButtonText}>Đăng ký</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.signInWrapper} onPress={() => router.back()}>
                            <Ionicons name="arrow-back-sharp" size={18} color={"#33adff"} />
                            <Text style={styles.signInTxtSpan}>Quay lại</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </LinearGradient>
        </ImageBackground>
    );
};

const styles = SignUpStyle;

export default SignUpScreen;