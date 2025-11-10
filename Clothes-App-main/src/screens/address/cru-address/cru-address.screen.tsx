import React, { useState, useEffect, useRef } from 'react';
import { Text, TextInput, View, TouchableOpacity, Dimensions, Switch, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as AddressManagement from '@/src/data/management/address.management';
import { useToast } from '@/src/customize/toast.context';
import { AddressModel, CityModel, DistrictModel, WardModel } from '@/src/data/model/address.model';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AddressType } from '@/src/common/resource/address';
import CRUAddressStyle from './cru-address.style';
import CustomBottomSheet from '@/src/components/custom-bottom-sheet/custom-bottom-sheet.component';
import AddressSelector from '../comp/address-selector.component';
import { useRoute } from '@react-navigation/native';
import { ActionWebs } from '@/src/common/resource/action';
import SwitchComponent from '@/src/components/switch/switch.component';
import DialogNotification from '@/src/components/dialog-notification/dialog-notification.component';
import { MessageError } from '@/src/common/resource/message-error';
import { useDispatch } from 'react-redux';
import * as UserActions from "@/src/data/store/actions/user/user.action";

type FormData = {
    id: number;
    name: string;
    phone: string;
    province: number;
    district: number;
    ward: number;
    address_details: string;
    address_type: string;
    is_default: boolean;
};

type Props = {};

const CRUAddressScreen = (props: Props) => {
    const route = useRoute();
    const { id: ADDRESS_ID, action } = route.params as {
        id: string, /** Do URL */
        action: string
    }
    const { showToast } = useToast();
    const [selectedProvince, setSelectedProvince] = useState<CityModel | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<DistrictModel | null>(null);
    const [selectedWard, setSelectedWard] = useState<WardModel | null>(null);
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
    const [isVisibleDefaultAddress, setIsVibleDefaultAddress] = useState(false);
    const dispatch = useDispatch();

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<FormData>({
        defaultValues: {
            id: -1,
            name: '',
            phone: '',
            province: -1,
            district: -1,
            ward: -1,
            address_details: '',
            address_type: AddressType.HOUSE,
            is_default: false
        },
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const address_type = watch('address_type');
    const is_default_watch = watch('is_default');

    const openAddressBottomSheet = () => {
        setIsBottomSheetVisible(true);
    };

    const closeAddressBottomSheet = () => {
        setIsBottomSheetVisible(false);
    };

    const onSubmit = async (data: FormData) => {
        const formData = {
            ...data,
            phone: `+84${data.phone}`,
        };
        console.log('Form data:', formData);
        if (!selectedProvince || !selectedDistrict || !selectedWard) {
            showToast("Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện, Phường Xã", "error");
            return;
        }
        const model = new AddressModel();
        model.id = data.id;
        model.name = data.name;
        model.phone = `+84${data.phone}`;
        model.city = selectedProvince;
        model.district = selectedDistrict;
        model.ward = selectedWard;
        model.address_detail = data.address_details;
        model.is_default = data.is_default;

        try {
            if (action && action === ActionWebs.UPDATE) {
                await AddressManagement.editAddressByUser(model);
                showToast('Chỉnh sửa địa chỉ thành công', "success");
                router.back();
                return
            }
            await AddressManagement.addAddressByUser(model);
            showToast('Tạo địa chỉ nhận hàng thành công', 'success');
            router.back();
        } catch (error: any) {
            console.log(error);
            if (error?.message === 'Session expired, please log in again') {
                /** Không làm gì cả */
                showToast(MessageError.EXPIRES_SESSION, 'error');
                dispatch(UserActions.UpdateExpiresLogged(false));
                router.navigate('/(routes)/sign-in');
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }

    };

    const handleSetSelectedCity = (city: CityModel | null) => {
        setSelectedProvince(city);
        setValue("province", city ? city.id : -1, { shouldValidate: true });
    }

    const handleSetSelectedDistrict = (d: DistrictModel | null) => {
        setSelectedDistrict(d);
        setValue("district", d ? d.id : -1, { shouldValidate: true });
    }

    const handleSetSelectedWard = (w: WardModel | null) => {
        setSelectedWard(w);
        setValue("ward", w ? w.id : -1, { shouldValidate: true });
    }

    const getFullAddress = () => {
        const parts = [];
        if (selectedWard) parts.push(selectedWard.name);
        if (selectedDistrict) parts.push(selectedDistrict.name);
        if (selectedProvince) parts.push(selectedProvince.name);
        return parts.length > 0 ? parts.join(', ') : 'Chọn Tỉnh/Thành phố, Quận/Huyện, Phường/Xã';
    };

    const fetchDetailAddress = async () => {
        try {
            const response = await AddressManagement.fetchAddressById(+ADDRESS_ID);
            setValue("id", response.id);
            setValue("name", response.name);
            setValue("phone", response.phone.slice(3));
            setValue("province", response.city?.id ?? -1);
            setValue("district", response.district?.id ?? -1);
            setValue("ward", response.ward?.id ?? -1);
            setValue("address_details", response.address_detail);
            setValue("address_type", AddressType.HOUSE);
            setValue("is_default", response.is_default);
            setSelectedProvince(response.city ?? null);
            setSelectedDistrict(response.district ?? null);
            setSelectedWard(response.ward ?? null);
        } catch (error: any) {
            console.log(error);
            if (error?.message === 'Session expired, please log in again') {
                /** Không làm gì cả */
                showToast(MessageError.EXPIRES_SESSION, 'error');
                dispatch(UserActions.UpdateExpiresLogged(false));
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }
    }

    const getInitStep = () => {
        let initStep = 0;
        if (selectedDistrict) {
            initStep = 1;
        }

        if (selectedWard) {
            initStep = 2;
        }

        return initStep;
    }

    const onChangeToggleDefault = (value: boolean, onChange: (value: boolean) => void) => {
        if (action === ActionWebs.UPDATE && is_default_watch.valueOf()) {
            setIsVibleDefaultAddress(true);
            return;
        }
        onChange(value)
    }

    useEffect(() => {
        if (ADDRESS_ID && action === ActionWebs.UPDATE) {
            fetchDetailAddress()
        }
    }, [])

    const { height: HEIGHT_SCREEN } = Dimensions.get('window');

    return (
        <>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-sharp" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.paymentHeaderText}>
                    {
                        action === ActionWebs.UPDATE
                            ? 'Sửa địa chỉ'
                            : 'Thêm địa chỉ mới'
                    }
                </Text>
            </View>

            <View style={styles.container}>
                {/* Tên nguồn nhận */}
                <Text style={styles.label}>Tên nguồn nhận *</Text>
                <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                    <Controller
                        control={control}
                        name="name"
                        rules={{ required: 'Tên nguồn nhận là bắt buộc' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                value={value}
                                onChangeText={(text) => onChange(text)}
                                onBlur={onBlur}
                                placeholder="Nhập tên nguồn nhận"
                                autoComplete="off"
                                autoCorrect={false}
                                spellCheck={false}
                            />
                        )}
                    />
                    <View style={styles.icon}>
                        <FontAwesome5 name="user-alt" size={16} color="black" />
                    </View>
                </View>
                {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

                {/* Số điện thoại */}
                <Text style={styles.label}>Số điện thoại *</Text>
                <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
                    <View style={styles.phonePrefix}>
                        <Text style={styles.phonePrefixText}>+84</Text>
                    </View>
                    <Controller
                        control={control}
                        name="phone"
                        rules={{
                            required: 'Số điện thoại là bắt buộc',
                            pattern: {
                                value: /^[0-9]{9}$/,
                                message: 'Số điện thoại phải có đúng 9 chữ số (không tính +84)',
                            },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[styles.input, styles.phoneInput]}
                                value={value}
                                onChangeText={(text) => onChange(text)}
                                onBlur={onBlur}
                                keyboardType="phone-pad"
                                placeholder="Nhập số điện thoại"
                                maxLength={9}
                                autoComplete="off"
                                autoCorrect={false}
                                spellCheck={false}
                            />
                        )}
                    />
                </View>
                {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

                {/* Tỉnh/Thành phố, Quận/Huyện, Phường/Xã */}
                <Text style={styles.label}>Tỉnh/Thành phố, Quận/Huyện, Phường/Xã *</Text>
                <TouchableOpacity onPress={openAddressBottomSheet}>
                    <View
                        style={[
                            styles.inputContainer,
                            (errors.province || errors.district || errors.ward) && styles.inputError,
                        ]}
                    >
                        <Text style={styles.addressText}>{getFullAddress()}</Text>
                        <Ionicons name="chevron-forward" size={20} color="black" />
                    </View>
                </TouchableOpacity>
                {(errors.province || errors.district || errors.ward) && (
                    <Text style={styles.error}>Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện, Phường/Xã</Text>
                )}

                {/* Tên đường/tòa nhà */}
                <Text style={styles.label}>Tên đường/tòa nhà *</Text>
                <View style={[styles.inputContainer, errors.address_details && styles.inputError]}>
                    <Controller
                        control={control}
                        name="address_details"
                        rules={{ required: 'Tên đường/tòa nhà là bắt buộc' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                value={value}
                                onChangeText={(text) => onChange(text)}
                                onBlur={onBlur}
                                placeholder="Nhập tên đường/tòa nhà"
                                autoComplete="off"
                                autoCorrect={false}
                                spellCheck={false}
                            />
                        )}
                    />
                </View>
                {errors.address_details && <Text style={styles.error}>{errors.address_details.message}</Text>}

                {/* Địa chỉ mặc định */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Text style={styles.label}>Đặt làm địa chỉ mặc định</Text>
                    <Controller
                        control={control}
                        name="is_default"
                        render={({ field: { onChange, value } }) => (
                            <SwitchComponent value={value} onChange={(value) => onChangeToggleDefault(value, onChange)} />
                        )}
                    />
                </View>

                {/* Loại địa chỉ */}
                <Text style={styles.label}>Loại địa chỉ *</Text>
                <View style={styles.addressTypeContainer}>
                    <TouchableOpacity
                        style={[styles.addressTypeButton, address_type === AddressType.HOUSE && styles.addressTypeSelected]}
                        onPress={() => setValue('address_type', AddressType.HOUSE, { shouldValidate: true })}
                    >
                        <Text
                            style={[styles.addressTypeText, address_type === AddressType.HOUSE && styles.addressTypeTextSelected]}
                        >
                            Nhà
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.addressTypeButton, address_type === AddressType.OFFICE && styles.addressTypeSelected]}
                        onPress={() => setValue('address_type', AddressType.OFFICE, { shouldValidate: true })}
                    >
                        <Text
                            style={[styles.addressTypeText, address_type === AddressType.OFFICE && styles.addressTypeTextSelected]}
                        >
                            Văn phòng
                        </Text>
                    </TouchableOpacity>
                </View>
                {errors.address_type && <Text style={styles.error}>{errors.address_type.message}</Text>}

                {/* Nút Lưu */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.saveButtonText}>Lưu</Text>
                </TouchableOpacity>
            </View>

            {/* Custom Bottom Sheet */}
            <CustomBottomSheet
                isVisible={isBottomSheetVisible}
                onClose={closeAddressBottomSheet}
                height={HEIGHT_SCREEN - 80}
            >
                <AddressSelector
                    initStep={getInitStep()}
                    initSelectedCity={selectedProvince}
                    initSelectedDistrict={selectedDistrict}
                    initSelectedWard={selectedWard}
                    setOuputCity={handleSetSelectedCity}
                    setOutputDistrict={handleSetSelectedDistrict}
                    setOutputWard={handleSetSelectedWard}
                    closeBottomSheet={closeAddressBottomSheet}
                />
            </CustomBottomSheet>

            <DialogNotification
                type='warning'
                visible={isVisibleDefaultAddress}
                message='Để hủy địa chỉ mặc định này, vui lòng chọn địa chỉ khác làm địa chỉ mặc định mới'
                onConfirm={() => setIsVibleDefaultAddress(false)}
                textConfirm='Đóng'
            />
        </>
    );
};

const styles = CRUAddressStyle;

export default CRUAddressScreen;