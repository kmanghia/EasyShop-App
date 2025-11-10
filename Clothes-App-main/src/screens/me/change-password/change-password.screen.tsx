import { ActivityIndicator, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { FontAwesome5, Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useToast } from "@/src/customize/toast.context"
import { Controller, useForm } from "react-hook-form"
import { AppConfig } from "@/src/common/config/app.config"
import { useState } from "react"
import { CommonColors } from "@/src/common/resource/colors"
import * as ImagePicker from 'expo-image-picker';
import * as UserActions from '@/src/data/store/actions/user/user.action';
import * as AuthMana from "@/src/data/management/auth.management";
import { useDispatch } from "react-redux"
import { MessageError } from "@/src/common/resource/message-error"
import ChangePasswordStyle from "./change-password.style"

type FormData = {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
}

type Props = {}

const ChangePasswordScreen = ({

}: Props) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const initValueForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    }
    const {
        control,
        handleSubmit: OnSaveForm,
        formState: { errors },
        setValue,
        watch,
        setError
    } = useForm<FormData>({
        defaultValues: initValueForm,
        mode: 'onChange',
        reValidateMode: 'onChange'
    });
    const newPassword = watch('newPassword');

    const saveInfoUser = async (data: FormData) => {
        try {
            setLoading(true);
            const payload = {
                currentPassword: data.currentPassword.trim(),
                newPassword: data.newPassword.trim(),
                confirmPassword: data.confirmPassword.trim()
            }
            await AuthMana.changePassword(payload);
            setLoading(false);
            router.back();
            showToast("Đổi mật khẩu thành công", "success");
        } catch (error: any) {
            console.log(error);
            setLoading(false);
            if (error?.message === 'Session expired, please log in again') {
                router.navigate('/(routes)/sign-in');
                dispatch(UserActions.UpdateExpiresLogged(false));
                showToast(MessageError.EXPIRES_SESSION, 'error');
            } else if (error?.message === 'Mật khẩu không đúng') {
                setError('currentPassword', {
                    type: 'manual',
                    message: 'Mật khẩu hiện tại không trùng khớp'
                })
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
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
                    Đổi mật khẩu
                </Text>
            </View>
            <ScrollView style={styles.container}>
                <View style={styles.sectionWrapper}>
                    {/* Mật khẩu hiện tại */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Mật khẩu hiện tại</Text>
                        <View style={[styles.inputContainer, errors.currentPassword && styles.inputError]}>
                            <Controller
                                control={control}
                                name="currentPassword"
                                rules={{
                                    required: 'Mật khẩu hiện tại không được bỏ trống',
                                    minLength: {
                                        value: 8,
                                        message: 'Mật khẩu tối thiểu 8 ký tự',
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        value={value}
                                        onChangeText={(text) => onChange(text)}
                                        placeholder="Nhập mật khẩu hiện tại"
                                        autoComplete="off"
                                        autoCorrect={false}
                                        spellCheck={false}
                                        autoFocus={Platform.OS === 'web'}
                                    />
                                )}
                            />
                            <View style={styles.icon}>
                                <FontAwesome5 name="lock" size={16} color={CommonColors.primary} />
                            </View>
                        </View>
                        {errors.currentPassword && (
                            <Text style={styles.error}>
                                {errors.currentPassword.message}
                            </Text>
                        )}
                    </View>
                    {/* Mật khẩu mới */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Mật khẩu mới</Text>
                        <View style={[styles.inputContainer, errors.newPassword && styles.inputError]}>
                            <Controller
                                control={control}
                                name="newPassword"
                                rules={{
                                    required: 'Mật khẩu mới không được bỏ trống',
                                    minLength: {
                                        value: 8,
                                        message: 'Mật khẩu tối thiểu 8 ký tự',
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        value={value}
                                        onChangeText={(text) => onChange(text)}
                                        placeholder="Nhập mật khẩu mới"
                                        autoComplete="off"
                                        autoCorrect={false}
                                        spellCheck={false}
                                        autoFocus={Platform.OS === 'web'}
                                    />
                                )}
                            />
                            <View style={styles.icon}>
                                <FontAwesome5 name="lock" size={16} color={CommonColors.primary} />
                            </View>
                        </View>
                        {errors.newPassword && (
                            <Text style={styles.error}>
                                {errors.newPassword.message}
                            </Text>
                        )}
                    </View>
                    {/* Xác nhận mật khẩu */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Xác nhận mật khẩu</Text>
                        <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                            <Controller
                                control={control}
                                name="confirmPassword"
                                rules={{
                                    required: 'Xác nhận mật khẩu không được bỏ trống',
                                    minLength: {
                                        value: 8,
                                        message: 'Mật khẩu tối thiểu 8 ký tự',
                                    },
                                    validate: (value) =>
                                        !errors.newPassword && value === newPassword || 'Mật khẩu không trùng khớp'
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        value={value}
                                        onChangeText={(text) => onChange(text)}
                                        placeholder="Xác nhận mật khẩu"
                                        autoComplete="off"
                                        autoCorrect={false}
                                        spellCheck={false}
                                        keyboardType="visible-password"
                                        autoFocus={Platform.OS === 'web'}
                                    />
                                )}
                            />
                            <View style={styles.icon}>
                                <FontAwesome5 name="lock" size={16} color={CommonColors.primary} />
                            </View>
                        </View>
                        {errors.confirmPassword && (
                            <Text style={styles.error}>
                                {errors.confirmPassword.message}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={OnSaveForm(saveInfoUser)}>
                        {loading ? (
                            <ActivityIndicator color={CommonColors.white} size={'small'} />
                        ) : (
                            <Text style={styles.submitButtonText}>Xác nhận</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    )
}

const styles = ChangePasswordStyle;

export default ChangePasswordScreen;