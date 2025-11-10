import { FlatList, Text, TouchableOpacity, View } from "react-native"
import AddressStyle from "./address.style"
import { CommonColors } from "@/src/common/resource/colors";
import { AntDesign } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useToast } from "@/src/customize/toast.context";
import { useCallback, useEffect, useState } from "react";
import { AddressModel } from "@/src/data/model/address.model";
import * as AddressManagement from "@/src/data/management/address.management";
import DialogNotification from "@/src/components/dialog-notification/dialog-notification.component";
import { ActionWebs } from "@/src/common/resource/action";
import { MessageError } from "@/src/common/resource/message-error";
import { useDispatch } from "react-redux";
import * as UserActions from "@/src/data/store/actions/user/user.action";

type Props = {}

interface DeleteSelected {
    item: AddressModel | null,
    index: number
}

const AddressScreen = (props: Props) => {
    const { showToast } = useToast();
    const [addresses, setAddresses] = useState<AddressModel[]>([]);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [deleteSelected, setDeleteSelected] = useState<DeleteSelected>({
        item: null,
        index: -1
    });
    const dispatch = useDispatch();

    const fetchAddresses = async () => {
        try {
            let response = await AddressManagement.fetchAddressesByUser();
            response = response.sort((a, b) => b.id - a.id);
            setAddresses(response);
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

    const renderAddressItem = ({ item, index }: { item: AddressModel, index: number }) => {
        const renderAddressDetails = () => {
            return `${item.address_detail}, ${item.ward?.name}, ${item.district?.name}, ${item.city?.name}`
        }


        return (
            <View style={styles.addressContainer}>
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
        )
    };

    useFocusEffect(
        useCallback(() => {
            fetchAddresses();
        }, [])
    )

    return (
        <View style={styles.container}>
            <Text style={{ paddingHorizontal: 20, paddingVertical: 10, fontSize: 16, fontWeight: '500' }}>
                Địa chỉ
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

const styles = AddressStyle;

export default AddressScreen;