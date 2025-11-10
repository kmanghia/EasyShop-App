import { CommonColors } from "@/src/common/resource/colors"
import { CityModel, DistrictModel, WardModel } from "@/src/data/model/address.model";
import { useEffect, useRef, useState } from "react";
import { Animated, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import * as AddressManagement from '@/src/data/management/address.management';
import { useToast } from "@/src/customize/toast.context";
import { Feather, Octicons } from "@expo/vector-icons";

type Props = {
    initStep?: number;
    initSelectedCity?: CityModel | null;
    initSelectedDistrict?: DistrictModel | null;
    initSelectedWard?: WardModel | null;
    initCities?: CityModel[];
    initDistricts?: DistrictModel[];
    initWards?: WardModel[];
    setOuputCity?: (city: CityModel | null) => void,
    setOutputDistrict?: (district: DistrictModel | null) => void,
    setOutputWard?: (city: WardModel | null) => void,
    closeBottomSheet?: () => any
}

const AddressSelector = ({
    initStep = 0,
    initSelectedCity = null,
    initSelectedDistrict = null,
    initSelectedWard = null,
    setOuputCity,
    setOutputDistrict,
    setOutputWard,
    closeBottomSheet

}: Props) => {
    const { showToast } = useToast();
    const [searchInput, setSearchInput] = useState('');
    const [cities, setCities] = useState<CityModel[]>([]);
    const [districts, setDistricts] = useState<DistrictModel[]>([]);
    const [wards, setWards] = useState<WardModel[]>([]);
    const [displayCities, setDisplayCities] = useState<CityModel[]>([]);
    const [displayDistricts, setDisplayDistricts] = useState<DistrictModel[]>([]);
    const [displayWards, setDisplayWards] = useState<WardModel[]>([]);
    const [selectedCity, setSelectedCity] = useState<CityModel | null>(initSelectedCity);
    const [selectedDistrict, setSelectedDistrict] = useState<DistrictModel | null>(initSelectedDistrict);
    const [selectedWard, setSelectedWard] = useState<WardModel | null>(initSelectedWard);
    const [step, setStep] = useState<number>(initStep);
    const animatedTop = useRef(new Animated.Value(2 * 50)).current;
    const firstInitRef = useRef(true);

    useEffect(() => {
        if (firstInitRef.current) {
            if (selectedCity) {
                fetchDistrictsByCityId(selectedCity.id);
            }
            if (selectedDistrict) {
                fetchWardsByDistrictId(selectedDistrict.id);
            }
            firstInitRef.current = false;
        }
        fetchCities();
    }, [])

    const fetchCities = async () => {
        try {
            const response = await AddressManagement.fetchCities();
            setCities(response);
            setDisplayCities(response);
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', 'error');
        }
    };

    const fetchDistrictsByCityId = async (cityId: number) => {
        try {
            const response = await AddressManagement.fetchDistrictsByCityId(cityId);
            setDistricts(response);
            const listSearch = response.filter(d => d.name.includes(searchInput.trim()));
            setDisplayDistricts(listSearch);
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', 'error');
        }
    };

    const fetchWardsByDistrictId = async (districtId: number) => {
        try {
            const response = await AddressManagement.fetchWardsByDistrictId(districtId);
            setWards(response);
            const listSearch = response.filter(w => w.name.includes(searchInput.trim()));
            setDisplayWards(listSearch);
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', 'error');
        }
    };

    const handleProvinceSelect = async (city: CityModel) => {
        try {
            setSelectedCity(city);
            setSelectedDistrict(null);
            setSelectedWard(null);
            setOuputCity?.(city);
            setOutputDistrict?.(null);
            setOutputWard?.(null);
            await fetchDistrictsByCityId(city.id);
            setStep(1);
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', 'error');
        }
    };

    const handleDistrictSelect = async (dist: DistrictModel) => {
        try {
            setSelectedDistrict(dist);
            setOutputDistrict?.(dist);
            if (!selectedWard) {
                setSelectedWard(null);
                setOutputWard?.(null);
            }
            await fetchWardsByDistrictId(dist.id);
            setStep(2);
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', 'error');
        }
    };

    const handleWardSelect = (ward: WardModel) => {
        setSelectedWard(ward);
        setOutputWard?.(ward);
        closeBottomSheet?.()
    };

    const renderStep = (currentStep: number) => {
        if (currentStep === 0) {
            return (
                <FlatList
                    data={displayCities}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    style={[styles.section, { borderRadius: 0, paddingHorizontal: 0 }]}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            key={item.id.toString()}
                            style={[styles.listItem, { paddingHorizontal: 22 }]}
                            onPress={() => handleProvinceSelect(item)}
                        >
                            <Text style={styles.listItemText}>{item.name}</Text>
                            {selectedCity?.id === item.id && (
                                <Feather name="check" size={24} color={CommonColors.primary} />
                            )}
                        </TouchableOpacity>
                    )}
                    getItemLayout={(_, index) => ({
                        length: 42,       // chiều cao mỗi item (có thể đo cụ thể nếu custom)
                        offset: 42 * index,
                        index,
                    })}
                />
            );
        } else if (currentStep === 1) {
            return (
                <FlatList
                    data={displayDistricts}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    style={[styles.section, { borderRadius: 0, paddingHorizontal: 0 }]}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            key={item.id.toString()}
                            style={[styles.listItem, { paddingHorizontal: 22 }]}
                            onPress={() => handleDistrictSelect(item)}
                        >
                            <Text style={styles.listItemText}>{item.name}</Text>
                            {selectedDistrict?.id === item.id && (
                                <Feather name="check" size={24} color={CommonColors.primary} />
                            )}
                        </TouchableOpacity>
                    )}
                    getItemLayout={(_, index) => ({
                        length: 42,       // chiều cao mỗi item (có thể đo cụ thể nếu custom)
                        offset: 42 * index,
                        index,
                    })}
                />
            );
        } else if (currentStep === 2) {
            return (
                <FlatList
                    data={displayWards}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    style={[styles.section, { borderRadius: 0, paddingHorizontal: 0 }]}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            key={item.id.toString()}
                            style={[styles.listItem, { paddingHorizontal: 22 }]}
                            onPress={() => handleWardSelect(item)}
                        >
                            <Text style={styles.listItemText}>{item.name}</Text>
                            {selectedWard?.id === item.id && (
                                <Feather name="check" size={24} color={CommonColors.primary} />
                            )}
                        </TouchableOpacity>
                    )}
                    getItemLayout={(_, index) => ({
                        length: 42,       // chiều cao mỗi item (có thể đo cụ thể nếu custom)
                        offset: 42 * index,
                        index,
                    })}
                />
            );
        }
        return null;
    };

    const renderNameStep = (currentStep: number) => {
        if (currentStep === 0) {
            return (
                <Text style={{ fontSize: 14, fontWeight: '500' }}>Tỉnh/Thành phố</Text>
            );
        } else if (currentStep === 1) {
            return (
                <Text style={{ fontSize: 14, fontWeight: '500' }}>Quận/Huyện</Text>
            );
        } else if (currentStep === 2) {
            return (
                <Text style={{ fontSize: 14, fontWeight: '500' }}>Phường/Xã</Text>
            );
        }
        return null;
    }

    const onResetSelector = () => {
        setSelectedCity(null);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setOuputCity?.(null);
        setOutputDistrict?.(null);
        setOutputWard?.(null);
        setDistricts([]);
        setWards([]);
        setStep(0);
    }

    useEffect(() => {
        Animated.timing(animatedTop, {
            toValue: step * 50,
            duration: 300,
            useNativeDriver: false,
        }).start();
        setSearchInput('');
        if (step === 0) {
            setDisplayCities(cities)
        } else if (step === 1) {
            setDisplayDistricts(districts);
        } else if (step === 2) {
            setDisplayWards(wards);
        }
    }, [step]);

    useEffect(() => {
        if (step === 0) {
            let listSearch = cities.filter(c => c.name.toLocaleLowerCase().includes(searchInput.trim().toLocaleLowerCase()));
            setDisplayCities(listSearch);
        } else if (step === 1) {
            let listSearch = districts.filter(d => d.name.toLocaleLowerCase().includes(searchInput.trim().toLocaleLowerCase()));
            setDisplayDistricts(listSearch);
        } else if (step === 2) {
            let listSearch = wards.filter(w => w.name.toLocaleLowerCase().includes(searchInput.trim().toLocaleLowerCase()));
            setDisplayWards(listSearch);
        }
    }, [searchInput])

    return (
        <View style={[styles.container]}>
            <View style={[styles.section, { marginBottom: 12 }]}>
                <View style={styles.searchContainer}>
                    <Octicons name="search" size={18} color={CommonColors.lightGray} />
                    <TextInput
                        value={searchInput}
                        onChangeText={(text: string) => setSearchInput(text)}
                        placeholder="Tìm kiếm Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"
                    />
                </View>
            </View>
            <View style={[styles.section, { marginBottom: 12 }]}>
                <View style={{ paddingHorizontal: 10, marginBottom: 13, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: CommonColors.lightGray }}>
                        Khu vực được chọn
                    </Text>
                    <TouchableOpacity onPress={onResetSelector}>
                        <Text style={{ color: CommonColors.primary }}>Thiết lập lại</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.column}>
                    {/* Province */}
                    <TouchableOpacity onPress={() => setStep(0)}>
                        <View style={[styles.row, step === 0 && styles.activeRow]}>
                            <View style={[styles.dotColumn, step === 0 && styles.dotColumnActive]}>
                                <View
                                    style={[
                                        styles.dot,
                                        step === 0 && { backgroundColor: CommonColors.primary },
                                    ]}
                                ></View>
                            </View>

                            <View style={[styles.textColumn, { marginLeft: 10 }]}>
                                <Text
                                    style={[
                                        styles.text,
                                        step === 0 && { color: CommonColors.primary, fontWeight: '500' },
                                    ]}
                                >
                                    {selectedCity ? selectedCity.name : 'Chọn Tỉnh/Thành phố'}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {selectedCity && (
                        <TouchableOpacity onPress={() => setStep(1)}>
                            <View style={[styles.row, step === 1 && styles.activeRow]}>
                                <View style={[styles.dotColumn, step === 1 && styles.dotColumnActive]}>
                                    <View
                                        style={[
                                            styles.dot,
                                            step === 1 && { backgroundColor: CommonColors.primary },
                                        ]}
                                    ></View>
                                </View>

                                <View style={[styles.textColumn, { marginLeft: 10 }]}>
                                    <Text
                                        style={[
                                            styles.text,
                                            step === 1 && { color: CommonColors.primary, fontWeight: '500' },
                                        ]}
                                    >
                                        {selectedDistrict ? selectedDistrict.name : 'Chọn Quận/Huyện'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    {selectedDistrict && (
                        <TouchableOpacity onPress={() => setStep(2)}>
                            <View style={[styles.row, step === 2 && styles.activeRow]}>
                                <View style={[styles.dotColumn, step === 2 && styles.dotColumnActive]}>
                                    <View
                                        style={[
                                            styles.dot,
                                            step === 2 && { backgroundColor: CommonColors.primary },
                                        ]}
                                    ></View>
                                </View>

                                <View style={[styles.textColumn, { marginLeft: 10 }]}>
                                    <Text
                                        style={[
                                            styles.text,
                                            step === 2 && { color: CommonColors.primary, fontWeight: '500' },
                                        ]}
                                    >
                                        {selectedWard ? selectedWard.name : 'Chọn Phường/Xã'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Animated Active Border */}
                    <Animated.View
                        style={[
                            styles.activeBorder,
                            {
                                top: animatedTop.interpolate({
                                    inputRange: [0, 2 * 50],
                                    outputRange: [0, 2 * 50], /** Điều chỉnh để căn giữa */
                                }),
                            },
                        ]}
                    />
                </View>
            </View>
            <View style={{ marginBottom: 12, paddingLeft: 10 }}>
                {renderNameStep(step)}
            </View>
            {renderStep(step)}
        </View>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },


    container: {
        backgroundColor: '#f4f4f4',
    },
    section: {
        backgroundColor: CommonColors.white,
        paddingVertical: 10,
    },
    column: {
        position: 'relative',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 8,
        marginHorizontal: 0
    },
    activeRow: {
        backgroundColor: CommonColors.white,
        zIndex: 2,
        height: 50,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dotColumn: {
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        backgroundColor: CommonColors.white,
        position: 'relative',
    },
    dotColumnActive: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: CommonColors.primary,
        borderRadius: 30
    },
    verticalLine: {
        position: 'absolute',
        width: 2,
        backgroundColor: '#CCC',
        left: 13, // Đã căn giữa với dot
        zIndex: 1, // Dưới activeRow nhưng trên nền chính
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 30,
        backgroundColor: '#DDD',
        padding: 4,
        zIndex: 3, // Đảm bảo dot luôn ở trên cùng
    },
    textColumn: {
        flex: 1,
    },
    text: {
        fontSize: 14,
        color: '#333',
    },
    activeBorder: {
        position: 'absolute',
        left: 5,
        right: 5,
        height: 50,
        borderWidth: 1,
        borderColor: CommonColors.primary,
        borderRadius: 8,
        zIndex: 2,
    },
    reset: {
        marginTop: 16,
        textAlign: 'center',
        color: '#007AFF',
        fontWeight: '500',
    },

    /** List */
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    listItemText: {
        fontSize: 16,
        color: '#333',
    },
})

export default AddressSelector;