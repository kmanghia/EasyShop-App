import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Animated,
    Image,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import RegisterShopStyle from './register-shop.style';
import { useToast } from '@/src/customize/toast.context';
import { router } from 'expo-router';
import { UserModel } from '@/src/data/model/user.model';
import * as UserManagement from '@/src/data/management/user.management';
import * as AuthManagement from '@/src/data/management/auth.management';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/data/types/global';
import { UserStoreState } from '@/src/data/store/reducers/user/user.reducer';
import * as UserActions from '@/src/data/store/actions/user/user.action';
import { MessageError } from '@/src/common/resource/message-error';
import { AppConfig } from '@/src/common/config/app.config';
import { ShopModel } from '@/src/data/model/shop.model';
import { Roles } from '@/src/common/resource/roles';

interface FormDataStep2 {
    logo_url: string | null;
    shop_name: string;
    contact_email: string;
    contact_address: string;
    description: string;
    background_url: string | null;
}

const RegisterShopScreen = () => {
    const { showToast } = useToast();
    const preImage = new AppConfig().getPreImage();
    const [step, setStep] = useState(1);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [logoPreview, setLogoPreview] = useState<ImagePicker.ImagePickerResult & { assets?: ImagePicker.ImagePickerAsset[] } | null>(null);
    const [backgroundPreview, setBackgroundPreview] = useState<ImagePicker.ImagePickerResult & { assets?: ImagePicker.ImagePickerAsset[] } | null>(null);
    const [user, setUser] = useState<UserModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const userSelector = useSelector((state: RootState) => state.userLogged) as UserStoreState;
    const dispatch = useDispatch();

    const {
        control,
        handleSubmit: handleSubmitStep2,
        formState: { errors: errorsStep2, isValid },
        setValue: setValueFormStep2,
        getValues,
        setError,
    } = useForm<FormDataStep2>({
        defaultValues: {
            logo_url: null,
            shop_name: '',
            contact_email: '',
            contact_address: '',
            description: '',
            background_url: null,
        },
        reValidateMode: 'onChange',
        mode: 'onChange',
    });

    const fetchInfoUser = async () => {
        try {
            setIsLoading(true);
            const userLogged = await UserManagement.fetchInfoUser();
            setUser(userLogged);
            setValueFormStep2('contact_email', userLogged.email || '');
            userLogged.expires = true;
            dispatch(UserActions.UpdateInfoLogged(userLogged));
        } catch (error: any) {
            console.log(error);
            if (error?.message === 'Session expired, please log in again') {
                router.back();
                dispatch(UserActions.UpdateExpiresLogged(false));
                showToast(MessageError.EXPIRES_SESSION, 'error');
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInfoUser();
    }, []);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, [step]);

    const pickImage = async (type: 'logo' | 'background') => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            showToast("Quyền bị từ chối, vui lòng cho phép truy cập thư viện ảnh.", 'error');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: type === 'logo' ? [1, 1] : [16, 9],
            quality: 1,
        });

        if (!result.canceled && result.assets?.[0].uri) {
            if (type === 'logo') {
                setLogoPreview(result);
                setValueFormStep2('logo_url', result.assets[0].uri);
            } else {
                setBackgroundPreview(result);
                setValueFormStep2('background_url', result.assets[0].uri);
            }
        }
    };

    const onSubmitStep1 = () => {
        setStep(2);
    };

    const onHandleSubmit = async () => {
        if (!logoPreview || logoPreview.canceled || !logoPreview.assets || !logoPreview.assets[0]) {
            setError('logo_url', {
                type: 'manual',
                message: 'Logo cửa hàng không được bỏ trống'
            })
        }
        if (!backgroundPreview || backgroundPreview.canceled || !backgroundPreview.assets || !backgroundPreview.assets[0]) {
            setError('background_url', {
                type: 'manual',
                message: 'Ảnh nền cửa hàng không được bỏ trống'
            })
        }

        if (!isValid) {
            console.log('INVALID FORM');
            return;

        }
        await onSubmitStep2();
    }

    const onSubmitStep2 = async () => {
        if (!logoPreview || logoPreview.canceled || !logoPreview.assets || !logoPreview.assets[0]) {
            return;
        }
        if (!backgroundPreview || backgroundPreview.canceled || !backgroundPreview.assets || !backgroundPreview.assets[0]) {
            return;
        }

        const logoFile = {
            uri: logoPreview.assets[0].uri,
            type: logoPreview.assets[0].mimeType || 'image/jpeg',
            name: logoPreview.assets[0].fileName || 'logo.jpg',
            size: logoPreview.assets[0].fileSize || 0,
        };

        const backgroundFile = {
            uri: backgroundPreview.assets[0].uri,
            type: backgroundPreview.assets[0].mimeType || 'image/jpeg',
            name: backgroundPreview.assets[0].fileName || 'background.jpg',
            size: backgroundPreview.assets[0].fileSize || 0,
        };

        try {
            const userModel = new UserModel().convertObj(user);
            const shopModel = new ShopModel();
            shopModel.shop_name = getValues('shop_name').trim();
            shopModel.description = getValues('description').trim();
            shopModel.contact_email = getValues('contact_email').trim();
            shopModel.contact_address = getValues('contact_address').trim();

            await AuthManagement.registerShop(
                userModel,
                shopModel,
                logoFile,
                backgroundFile
            )
            let changeRoleUser = userModel;
            changeRoleUser.roles = Roles.OWNER;
            dispatch(UserActions.UpdateInfoLogged(changeRoleUser));
            const userCached = await new AppConfig().getUserInfo();
            if (userCached) {
                userCached.roles = Roles.OWNER;
                await new AppConfig().setUserInfo(userCached);
            }
            showToast('Đăng ký cửa hàng thành công', 'success');
            router.back();
        } catch (error: any) {
            console.log(error);
            showToast(error?.message, "error");
            // showToast('Hệ thống đang bận, vui lòng thử lại', 'error');
        }
    };

    const handleBackStep = () => {
        if (step === 2) {
            setStep(1);
        }
    };

    const handleBackMeScreen = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <LinearGradient
                colors={['rgba(240,248,255,0.9)', 'rgba(224,242,254,0.95)']}
                style={styles.container}
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#33adff" />
                    <Text style={styles.loadingText}>Đang tải thông tin...</Text>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['rgba(240,248,255,0.9)', 'rgba(224,242,254,0.95)']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Animated.View style={[styles.headerWrapper, { opacity: fadeAnim }]}>
                    <TouchableOpacity style={styles.btnBackMe} onPress={handleBackMeScreen}>
                        <Text style={styles.btnBackMeText}>Quay lại</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Đăng ký cửa hàng</Text>
                    <Text style={styles.stepIndicator}>Bước {step}/2</Text>
                </Animated.View>
                <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
                    {step === 1 ? (
                        <>
                            <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
                            {/* Email */}
                            <View style={styles.section}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={user?.email}
                                        editable={false}
                                        placeholder="Nhập địa chỉ Email"
                                        placeholderTextColor="#a1a1aa"
                                    />
                                    <View style={styles.icon}>
                                        <Ionicons name="mail" size={20} color="#33adff" />
                                    </View>
                                </View>
                            </View>
                            {/* Password */}
                            <View style={styles.section}>
                                <Text style={styles.label}>Mật khẩu</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={'*********'}
                                        editable={false}
                                        placeholder="Nhập mật khẩu"
                                        secureTextEntry
                                        placeholderTextColor="#a1a1aa"
                                    />
                                    <View style={styles.icon}>
                                        <FontAwesome5 name="lock" size={16} color="#33adff" />
                                    </View>
                                </View>
                            </View>
                            {/* Avatar */}
                            <View style={styles.section}>
                                <Text style={styles.label}>Ảnh đại diện</Text>
                                <TouchableOpacity style={styles.avatarContainer}>
                                    {user?.image_url && (
                                        <Image
                                            source={{ uri: `${preImage}/${user.image_url}` }}
                                            style={styles.avatar}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                            {/* Phone */}
                            <View style={styles.section}>
                                <Text style={styles.label}>Số điện thoại</Text>
                                <View style={styles.inputContainer}>

                                    <TextInput
                                        style={styles.input}
                                        value={user?.phone}
                                        editable={false}
                                        placeholder="Nhập số điện thoại"
                                        placeholderTextColor="#a1a1aa"
                                    />
                                    <View style={styles.icon}>
                                        <FontAwesome5 name="phone" size={20} color="#33adff" />
                                    </View>
                                </View>
                            </View>
                            {/* Address */}
                            <View style={styles.section}>
                                <Text style={styles.label}>Địa chỉ</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={user?.address}
                                        editable={false}
                                        placeholder="Nhập địa chỉ"
                                        placeholderTextColor="#a1a1aa"
                                    />
                                    <View style={styles.icon}>
                                        <Ionicons name="location" size={20} color="#33adff" />
                                    </View>
                                </View>
                            </View>
                            {/* Confirm Button */}
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={onSubmitStep1}
                            >
                                <Text style={styles.submitButtonText}>Tiếp theo</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.sectionTitle}>Thông tin cửa hàng</Text>
                            {/* Logo */}
                            <View style={styles.section}>
                                <Text style={styles.label}>Logo cửa hàng</Text>
                                <TouchableOpacity style={styles.avatarContainer} onPress={() => pickImage('logo')}>
                                    {(logoPreview && !logoPreview.canceled) ? (
                                        <Image source={{ uri: logoPreview.assets[0].uri }} style={styles.avatar} />
                                    ) : (
                                        <View style={styles.avatarPlaceholder}>
                                            <FontAwesome5 name="camera" size={20} color="#a1a1aa" />
                                            <Text style={styles.avatarText}>Thêm ảnh</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                {errorsStep2.logo_url && (
                                    <Text style={styles.error}>{errorsStep2.logo_url.message}</Text>
                                )}
                            </View>
                            {/* Shop Name */}
                            <View style={styles.section}>
                                <Text style={styles.label}>Tên cửa hàng</Text>
                                <View style={[styles.inputContainer, errorsStep2.shop_name && styles.inputError]}>
                                    <Controller
                                        control={control}
                                        name="shop_name"
                                        rules={{ required: 'Tên cửa hàng không được bỏ trống' }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={styles.input}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                placeholder="Nhập tên cửa hàng"
                                                placeholderTextColor="#a1a1aa"
                                            />
                                        )}
                                    />
                                    <View style={styles.icon}>
                                        <FontAwesome5 name="store" size={16} color="#33adff" />
                                    </View>
                                </View>
                                {errorsStep2.shop_name && (
                                    <Text style={styles.error}>{errorsStep2.shop_name.message}</Text>
                                )}
                            </View>
                            {/* Contact Email */}
                            <View style={styles.section}>
                                <Text style={styles.label}>Email liên hệ</Text>
                                <View style={styles.inputContainer}>
                                    <Controller
                                        control={control}
                                        name="contact_email"
                                        render={({ field: { value } }) => (
                                            <TextInput
                                                style={styles.input}
                                                value={value}
                                                editable={false}
                                                placeholder="Nhập email liên hệ"
                                                placeholderTextColor="#a1a1aa"
                                            />
                                        )}
                                    />
                                    <View style={styles.icon}>
                                        <Ionicons name="mail" size={20} color="#33adff" />
                                    </View>
                                </View>
                            </View>
                            {/* Contact Address */}
                            <View style={styles.section}>
                                <Text style={styles.label}>Địa chỉ liên hệ (Tùy chọn)</Text>
                                <View style={styles.inputContainer}>
                                    <Controller
                                        control={control}
                                        name="contact_address"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={styles.input}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                placeholder="Nhập địa chỉ liên hệ"
                                                placeholderTextColor="#a1a1aa"
                                            />
                                        )}
                                    />
                                    <View style={styles.icon}>
                                        <Ionicons name="location" size={20} color="#33adff" />
                                    </View>
                                </View>
                            </View>
                            {/* Description */}
                            <View style={styles.section}>
                                <Text style={styles.label}>Mô tả cửa hàng</Text>
                                <View style={[styles.inputContainer, errorsStep2.description && styles.inputError]}>
                                    <Controller
                                        control={control}
                                        name="description"
                                        rules={{ required: 'Mô tả cửa hàng không được bỏ trống' }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={[styles.input, styles.textArea]}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                placeholder="Nhập mô tả cửa hàng"
                                                placeholderTextColor="#a1a1aa"
                                                multiline
                                                numberOfLines={4}
                                            />
                                        )}
                                    />
                                </View>
                                {errorsStep2.description && (
                                    <Text style={styles.error}>{errorsStep2.description.message}</Text>
                                )}
                            </View>
                            {/* Background Image */}
                            <View style={styles.section}>
                                <Text style={styles.label}>Ảnh nền cửa hàng</Text>
                                <TouchableOpacity
                                    style={styles.backgroundContainer}
                                    onPress={() => pickImage('background')}
                                >
                                    {(backgroundPreview && !backgroundPreview.canceled) ? (
                                        <Image source={{ uri: backgroundPreview.assets[0].uri }} style={styles.background} />
                                    ) : (
                                        <View style={styles.backgroundPlaceholder}>
                                            <FontAwesome5 name="camera" size={20} color="#a1a1aa" />
                                            <Text style={styles.avatarText}>Thêm ảnh</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                {errorsStep2.background_url && (
                                    <Text style={styles.error}>{errorsStep2.background_url.message}</Text>
                                )}
                            </View>
                            {/* Buttons */}
                            <View style={styles.buttonWrapper}>
                                <TouchableOpacity
                                    style={[styles.submitButton, styles.backButton]}
                                    onPress={handleBackStep}
                                >
                                    <Text style={[styles.submitButtonText, styles.backButtonText]}>Quay lại</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={handleSubmitStep2(onHandleSubmit)}
                                >
                                    <Text style={styles.submitButtonText}>Gửi</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </Animated.View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = RegisterShopStyle;

export default RegisterShopScreen;