import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native"
import SelectAddressStyle from "./select-address.style";
import { CommonColors } from "@/src/common/resource/colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useToast } from "@/src/customize/toast.context";
import { useCallback, useEffect, useState } from "react";
import { AddressModel } from "@/src/data/model/address.model";
import * as AddressManagement from "@/src/data/management/address.management";
import DialogNotification from "@/src/components/dialog-notification/dialog-notification.component";
import { ActionWebs } from "@/src/common/resource/action";
import { useRoute } from "@react-navigation/native";
import CheckboxComponent from "@/src/components/checkbox/checkbox.comp";

type Props = {}

interface DeleteSelected {
    item: AddressModel | null,
    index: number
}

const SelectAddressSreen = (props: Props) => {
    const { cart_shops, subtotal, discount, final_total, address_id } = useRoute().params as {
        cart_shops: string;
        subtotal: number;
        discount: number;
        final_total: number;
        address_id: number;
    };

    const { showToast } = useToast();
    const [addresses, setAddresses] = useState<AddressModel[]>([]);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [deleteSelected, setDeleteSelected] = useState<DeleteSelected>({
        item: null,
        index: -1
    });
    const [selectedAddressId, setSelectedAddressId] = useState<number>(
        address_id ? +address_id : -1
    );
    const { width: WIDTH_SCREEN, height: HEIGHT_SCREEN } = Dimensions.get('screen');

    const fetchAddresses = async () => {
        try {
            let response = await AddressManagement.fetchAddressesByUser();
            response = response.sort((a, b) => b.id - a.id);
            setAddresses(response);
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', "error");
        }
    }

    const navigateToCreateAddress = () => {
        router.navigate("/(routes)/cru-address");
    }

    const navigateToUpdateAddress = (id: number) => {
        router.navigate({
            pathname: "/(routes)/cru-address",
            params: {
                id: id,
                action: ActionWebs.UPDATE
            }
        })
    }

    const openConfirmDeleteDialog = (item: AddressModel, index: number) => {
        setDeleteDialogVisible(true);
        setDeleteSelected({
            item: item,
            index: index
        });
    }

    const handleClose = () => {
        setDeleteDialogVisible(false);
    };

    const handleDeleteAddress = async () => {
        if (deleteSelected.item === null || deleteSelected.index < 0) {
            setDeleteDialogVisible(false);
            return;
        }

        let item = deleteSelected.item;
        let index = deleteSelected.index;
        setDeleteSelected({
            item: null,
            index: -1
        })
        try {
            setDeleteDialogVisible(false);
            await AddressManagement.deleteAddressById(item?.id ?? 0);
            setAddresses(prev => {
                let updatedAddresses = [...prev];
                if (item?.is_default) {
                    const remainingAddresses = updatedAddresses.filter((_, i) => i !== index);
                    if (remainingAddresses.length > 0) {
                        const latestAddress = remainingAddresses.reduce<AddressModel | undefined>(
                            (latest, addr) => {
                                return !latest || (addr.created_at && latest.created_at && new Date(addr.created_at) > new Date(latest.created_at)) ? addr : latest;
                            }, undefined
                        );

                        // Cập nhật is_default cho địa chỉ mới nhất
                        if (latestAddress) {
                            updatedAddresses = updatedAddresses.map(addr =>
                                addr.id === latestAddress.id ? { ...addr, is_default: true } as AddressModel : { ...addr, is_default: false } as AddressModel
                            );
                        }
                    }
                }
                updatedAddresses.splice(index, 1);

                return updatedAddresses;
            });
            showToast("Xóa địa chỉ thành công", "success");
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', "error");
        }
    }

    const renderAddressItem = ({ item, index }: { item: AddressModel, index: number }) => {
        const renderAddressDetails = () => {
            return `${item.address_detail}, ${item.ward?.name}, ${item.district?.name}, ${item.city?.name}`
        }


        return (
            <TouchableOpacity
                onPress={() => setSelectedAddressId(item.id)}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: WIDTH_SCREEN,
                    paddingLeft: 10,
                    backgroundColor: 'white'
                }}
            >
                <View style={{ width: '5%', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckboxComponent
                        stateChecked={item.id === selectedAddressId}
                        toggleCheckedFunc={(isChecked) => setSelectedAddressId(item.id)}
                        circle={true}
                    />
                </View>
                <View style={[styles.addressContainer, { width: '95%' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.phoneText}>{item.name} | {item.phone}</Text>
                        <View style={{ flexDirection: 'row', gap: 5 }}>
                            <TouchableOpacity onPress={() => navigateToUpdateAddress(item.id)}>
                                <Text style={{ fontSize: 14, color: CommonColors.green }}>
                                    Sửa
                                </Text>
                            </TouchableOpacity>
                            <Text style={{ color: 'rgba(0, 0, 0, 0.5)' }}>|</Text>
                            <TouchableOpacity onPress={() => openConfirmDeleteDialog(item, index)}>
                                <Text style={{ fontSize: 14, color: CommonColors.red }}>
                                    Xóa
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={styles.addressText}>{renderAddressDetails()}</Text>
                    {item.is_default && (
                        <View
                            style={{
                                borderRadius: 3,
                                borderWidth: 1,
                                borderColor: CommonColors.primary,
                                width: 70,
                                height: 26,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={styles.defaultLabel}>
                                Mặc định
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        )
    };

    const onConfirm = () => {
        router.navigate({
            pathname: "/(routes)/payment",
            params: {
                address_id: selectedAddressId ?? -1,
                cart_shops, subtotal, discount, final_total
            }
        })
    }

    useFocusEffect(
        useCallback(() => {
            fetchAddresses();
        }, [])
    )

    const disabled = selectedAddressId === -1;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-sharp" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.paymentHeaderText}>
                    Chọn địa chỉ
                </Text>
            </View>
            <Text style={{ paddingHorizontal: 20, paddingVertical: 10, fontSize: 16, fontWeight: '500' }}>
                Chọn địa chỉ
            </Text>
            <FlatList
                data={addresses}
                renderItem={({ item, index }) => renderAddressItem({ item, index })}
                keyExtractor={(item) => `${item.id}`}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={() => (
                    <TouchableOpacity style={styles.addButtonContainer} onPress={navigateToCreateAddress}>
                        <AntDesign name="pluscircleo" size={18} color={CommonColors.primary} />
                        <Text style={styles.addButtonText}>Thêm Địa Chỉ Mới</Text>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity
                disabled={disabled}
                onPress={() => onConfirm()}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: CommonColors.primary,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: disabled ? 0.8 : 1
                }}
            >
                <Text style={{ fontSize: 16, fontWeight: '700', color: CommonColors.white }}>
                    Xác nhận
                </Text>
            </TouchableOpacity>
            <DialogNotification
                visible={deleteDialogVisible}
                message="Thao tác sẽ làm dữ liệu biến mất hoàn toàn và không thể hoàn tác"
                textClose="Đóng"
                textConfirm="Đồng ý"
                onConfirm={handleDeleteAddress}
                onClose={handleClose}
            />
        </View>
    )
}

const styles = SelectAddressStyle;

export default SelectAddressSreen;