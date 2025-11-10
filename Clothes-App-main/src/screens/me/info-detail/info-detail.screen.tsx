import { ActivityIndicator, Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import InfoDetailStyle from "./info-detail.style"
import { AntDesign, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useToast } from "@/src/customize/toast.context"
import { Controller, useForm } from "react-hook-form"
import { Gender } from "@/src/common/resource/gender"
import { AppConfig } from "@/src/common/config/app.config"
import * as UserManagement from "@/src/data/management/user.management"
import { useEffect, useRef, useState } from "react"
import { UserModel } from "@/src/data/model/user.model"
import DialogNotification from "@/src/components/dialog-notification/dialog-notification.component"
import { CommonColors } from "@/src/common/resource/colors"
import * as ImagePicker from 'expo-image-picker';
import * as UserActions from '@/src/data/store/actions/user/user.action';
import { useDispatch } from "react-redux"
import { MessageError } from "@/src/common/resource/message-error"
import { Fonts } from "@/src/common/resource/fonts"

type FormData = {
    name: string;
    phone: string;
    gender: number;
    address: string;
}

type Props = {}

const InfoDetailScreen = ({

}: Props) => {
    const { showToast } = useToast();
    const preImage = new AppConfig().getPreImage();
    const [avatarImage, setAvatarImage] = useState('');
    const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const initValueForm = {
        name: '',
        phone: '',
        gender: 1,
        address: ''
    }
    const {
        control,
        handleSubmit: OnSaveForm,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormData>({
        defaultValues: initValueForm,
        mode: 'onChange',
        reValidateMode: 'onChange'
    });
    const gender = watch('gender');
    const [openWarningSave, setOpenWarningSave] = useState(false);

    useEffect(() => {
        fetchInfoUser();
    }, [])

    const fetchInfoUser = async () => {
        try {
            const user = await UserManagement.fetchInfoUser();
            setAvatarImage(user.image_url);
            setValue("name", user.name);
            setValue("gender", user.gender);
            setValue("phone", user.phone !== '' ? `${user.phone.slice(3)}` : '');
            setValue("address", user.address);
            dispatch(UserActions.UpdateInfoLogged(user));
        } catch (error: any) {
            console.log(error);
            if (error?.message === 'Session expired, please log in again') {
                /** Không làm gì cả */
                dispatch(UserActions.UpdateExpiresLogged(false));
                showToast(MessageError.EXPIRES_SESSION, 'error');
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }
    }

    const onChangeGender = (value: Gender) => {
        if (value === gender) {
            return;
        }
        setValue("gender", value, { shouldValidate: true });
    }

    const saveInfoUser = async (data: FormData) => {

        setOpenWarningSave(false);

        if (data.name.trim() === '') {
            showToast("Tên người dùng không được bỏ trống", "error");
            return;
        }

        if (data.phone.trim() === '') {
            showToast("Số điện thoại không được bỏ trống", "error");
            return;
        }

        const user = new UserModel();
        user.name = data.name.trim();
        user.phone = `+84${data.phone}`;
        user.gender = data.gender;
        user.address = data.address;
        user.image_url = avatarImage;

        try {
            setLoading(true);
            await UserManagement.editInfoUser(user);
            dispatch(UserActions.UpdateInfoLogged(user));
            const userStorage = await new AppConfig().getUserInfo();
            if (userStorage) {
                userStorage.name = user.name;
                userStorage.phone = user.phone;
                userStorage.gender = user.gender;
                userStorage.address = user.address;
                await new AppConfig().setUserInfo(userStorage);
            }
            setLoading(false);
            setTimeout(() => {
                showToast("Thay đổi thông tin hồ sơ thành công", "success");
            }, 500)
        } catch (error: any) {
            console.log(error);
            setLoading(false);
            if (error?.message === 'Session expired, please log in again') {
                /** Không làm gì cả */
                router.navigate('/(routes)/sign-in');
                dispatch(UserActions.UpdateExpiresLogged(false));
                showToast(MessageError.EXPIRES_SESSION, 'error');
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }
    }

    const saveAvatarUser = async (imageResult: ImagePicker.ImagePickerResult) => {
        if (imageResult === null || imageResult.canceled) {
            return;
        }

        try {
            const imageFile = {
                uri: imageResult.assets[0].uri,
                type: imageResult.assets[0].mimeType, // 'image/png'
                name: imageResult.assets[0].fileName,  // 'Filename.png'
                size: imageResult.assets[0].fileSize,  // 75016
            };

            const response = await UserManagement.editAvatarUser(imageFile);
            const userStorage = await new AppConfig().getUserInfo();
            if (userStorage) {
                userStorage.image_url = response;
                await new AppConfig().setUserInfo(userStorage);
            }
            setAvatarImage(response);
            dispatch(UserActions.UpdateImageInfo(response));
            showToast("Chỉnh sửa ảnh đại diện thành công", "success");
        } catch (error: any) {
            console.log(error);
            if (error?.message === 'Session expired, please log in again') {
                /** Không làm gì cả */
                router.navigate('/(routes)/sign-in');
                dispatch(UserActions.UpdateExpiresLogged(false));
                showToast(MessageError.EXPIRES_SESSION, 'error');
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }
    }

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1
        });

        if (!result.canceled) {
            setImage(result);
            await saveAvatarUser(result);
        }
    }

    return (
        <>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-sharp" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.paymentHeaderText}>
                    Chi tiết hồ sơ
                </Text>
                {loading ? (
                    <ActivityIndicator
                        style={styles.btnSaveForm}
                    />
                ) : (
                    <TouchableOpacity onPress={() => setOpenWarningSave(true)} style={styles.btnSaveForm}>
                        <Text style={styles.btnSaveFormText}>Lưu</Text>
                    </TouchableOpacity>
                )}
            </View>
            <ScrollView style={styles.container}>
                <View style={styles.sectionWrapper}>
                    {/* Ảnh đại diện */}
                    <View style={styles.avatarInfo}>
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatar}>
                                <Image style={styles.avatarImage} source={{ uri: `${preImage}/${avatarImage}` }} />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => handlePickImage()} style={styles.editImageButton}>
                            <Text style={styles.editImageButtonText}>Upload</Text>
                            <AntDesign name="upload" size={18} color={CommonColors.white} />
                        </TouchableOpacity>
                    </View>
                    {/* Tên người dùng */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Tên người dùng</Text>
                        <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                            <Controller
                                control={control}
                                name="name"
                                rules={{ required: 'Tên người dùng không được bỏ trống' }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        value={value}
                                        onChangeText={(text) => onChange(text)}
                                        placeholder="Nhập tên người dùng"
                                        autoComplete="off"
                                        autoCorrect={false}
                                        spellCheck={false}
                                        autoFocus={Platform.OS === 'web'}
                                    />
                                )}
                            />
                            <View style={styles.icon}>
                                <FontAwesome5 name="user-alt" size={16} color="black" />
                            </View>
                        </View>
                        {errors.name && (
                            <Text style={styles.error}>
                                {errors.name.message}
                            </Text>
                        )}
                    </View>
                    {/* Số điện thoại */}
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
                                        message: 'Số điện thoại phải có đúng 9 chữ số (không tính +84)'
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={[styles.input, styles.phoneInput]}
                                        value={value}
                                        onChangeText={(text) => onChange(text)}
                                        keyboardType="phone-pad"
                                        placeholder="Nhập số điện thoại"
                                        maxLength={9}
                                        autoComplete="off"
                                        autoCorrect={false}
                                        spellCheck={false}
                                        autoFocus={Platform.OS === 'web'}
                                    />
                                )}
                            />
                            <View style={styles.icon}>
                                <FontAwesome name="phone" size={24} color="black" />
                            </View>
                        </View>
                        {errors.phone && (
                            <Text style={styles.error}>
                                {errors.phone.message}
                            </Text>
                        )}
                    </View>
                    {/* Giới tính */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Giới tính</Text>
                        <View style={styles.genderSelectionWrapper}>
                            <TouchableOpacity onPress={() => onChangeGender(Gender.MALE)} style={[styles.genderWrapper, gender === Gender.MALE && styles.genderActiveWrapper]}>
                                <Text style={[styles.genderText, gender === Gender.MALE && styles.genderActiveText]}>
                                    Nam
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onChangeGender(Gender.FEMALE)} style={[styles.genderWrapper, gender === Gender.FEMALE && styles.genderActiveWrapper]}>
                                <Text style={[styles.genderText, gender === Gender.FEMALE && styles.genderActiveText]}>
                                    Nữ
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onChangeGender(Gender.OTHER)} style={[styles.genderWrapper, gender === Gender.OTHER && styles.genderActiveWrapper]}>
                                <Text style={[styles.genderText, gender === Gender.OTHER && styles.genderActiveText]}>
                                    Khác
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Địa chỉ */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Địa chỉ</Text>
                        <View style={[styles.inputContainer]}>
                            <Controller
                                control={control}
                                name="address"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        value={value}
                                        onChangeText={(text) => onChange(text)}
                                        placeholder="Nhập địa chỉ"
                                        multiline
                                        autoComplete="off"
                                        autoCorrect={false}
                                        spellCheck={false}
                                        autoFocus={Platform.OS === 'web'}
                                    />
                                )}
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => router.navigate('/(routes)/change-password')} style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Text style={{ fontFamily: Fonts.ROBOTO_REGULAR, color: CommonColors.primary }}>Đổi mật khẩu</Text>
                    </TouchableOpacity>
                </View>
                <DialogNotification
                    visible={openWarningSave}
                    message="Thông tin sau khi lưu không thể hoàn tác. Bạn có chắc muốn tiếp tục?"
                    onClose={() => setOpenWarningSave(false)}
                    onConfirm={OnSaveForm(saveInfoUser)}
                    textClose="Đóng"
                    textConfirm="Xác nhận"
                />
            </ScrollView>
        </>
    )
}

const styles = InfoDetailStyle;

export default InfoDetailScreen;