import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Platform } from 'react-native';
import { CommonColors } from '@/src/common/resource/colors';
import { ORIGINS } from '@/src/common/resource/origins';
import * as CategoryManagement from "@/src/data/management/category.management";
import { CategoryModel } from '@/src/data/model/category.model';
import { useToast } from '@/src/customize/toast.context';
import { CategoryGroup, FilterCategoryParams, PriceRange } from '@/src/data/types/global';
import { Sort } from '@/src/common/resource/sort';
import { MessageError } from '@/src/common/resource/message-error';

type Props = {
    onApply: (filterParams: FilterCategoryParams) => void,
    onReset: () => void;
    initFilterParams: FilterCategoryParams
}

const FilterCategoryComponent = ({
    onApply,
    onReset,
    initFilterParams
}: Props) => {
    const { showToast } = useToast();
    const [selectedOrigins, setSelectedOrigins] = useState<string[]>(initFilterParams.origins ?? []);
    const [sortPrice, setSortPrice] = useState<Sort>(initFilterParams.sortPrice ?? Sort.ASC);
    const [minPriceInput, setMinPriceInput] = useState<string>(initFilterParams.minPrice.toString());
    const [maxPriceInput, setMaxPriceInput] = useState<string>(
        initFilterParams.maxPrice !== Infinity ? initFilterParams.maxPrice.toString() : ''
    );
    const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | null>(null);
    const [selectedRatings, setSelectedRatings] = useState<number[]>(initFilterParams.minRatings ?? []);
    const [focusedInput, setFocusedInput] = useState<'min' | 'max' | null>(null);

    const origins: string[] = ORIGINS;
    const priceRanges: PriceRange[] = [
        { label: '0 - 100K', minPrice: 0, maxPrice: 100000 },
        { label: '100K - 200K', minPrice: 100000, maxPrice: 200000 },
        { label: '200K - 300K', minPrice: 200000, maxPrice: 300000 }
    ];
    const ratings: number[] = [5, 4, 3, 2, 1];

    useEffect(() => {

    }, []);


    // Hàm xử lý toggle cho origins (có thể chọn nhiều)
    const toggleOrigin = (origin: string) => {
        if (selectedOrigins.includes(origin)) {
            setSelectedOrigins(selectedOrigins.filter(item => item !== origin));
        } else {
            setSelectedOrigins([...selectedOrigins, origin]);
        }
    };

    // Hàm xử lý toggle cho sortPrice (chỉ chọn 1)
    const toggleSortPrice = (value: Sort) => {
        setSortPrice(value);
    };

    // Hàm xử lý toggle cho priceRange (chỉ chọn 1) và điền giá trị vào ô input
    const togglePriceRange = (range: PriceRange) => {
        if (selectedPriceRange && selectedPriceRange.minPrice === range.minPrice && selectedPriceRange.maxPrice === range.maxPrice) {
            setSelectedPriceRange(null);
            setMinPriceInput('');
            setMaxPriceInput('');
        } else {
            setSelectedPriceRange(range);
            setMinPriceInput(range.minPrice.toString());
            setMaxPriceInput(range.maxPrice.toString());
        }
    };

    // Hàm xử lý toggle cho ratings (có thể chọn nhiều)
    const toggleRating = (rating: number) => {
        if (selectedRatings.includes(rating)) {
            setSelectedRatings(selectedRatings.filter(item => item !== rating));
        } else {
            setSelectedRatings([...selectedRatings, rating]);
        }
    };

    // Hàm áp dụng bộ lọc
    const handleApply = () => {
        // Chuyển đổi giá trị từ ô input thành số
        const minPrice = minPriceInput ? parseFloat(minPriceInput) : 0;
        const maxPrice = maxPriceInput ? parseFloat(maxPriceInput) : Infinity;

        // Kiểm tra giá trị hợp lệ
        if (minPrice < 0 || (maxPrice !== Infinity && maxPrice < minPrice)) {
            alert('Vui lòng nhập khoảng giá hợp lệ');
            return;
        }

        onApply({
            origins: selectedOrigins,
            sortPrice,
            minPrice,
            maxPrice,
            minRatings: selectedRatings
        });
    };

    // Hàm thiết lập lại
    const handleReset = () => {
        setSelectedOrigins([]);
        setSortPrice(Sort.ASC);
        setSelectedPriceRange(null);
        setMinPriceInput('');
        setMaxPriceInput('');
        setSelectedRatings([]);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent} // Thêm contentContainerStyle để điều chỉnh nội dung bên trong
        >
            {/* Nơi Bán */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nơi Bán</Text>
                <View style={styles.optionsContainer}>
                    {origins?.map(origin => (
                        <TouchableOpacity
                            key={origin}
                            style={[
                                styles.optionButton,
                                selectedOrigins.includes(origin) && styles.optionButtonSelected
                            ]}
                            onPress={() => toggleOrigin(origin)}
                        >
                            <Text style={[
                                styles.optionText,
                                selectedOrigins.includes(origin) && styles.optionTextSelected
                            ]}>
                                {origin}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Sắp Xếp Giá */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sắp Xếp Giá</Text>
                <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.optionButton,
                            sortPrice === 'ASC' && styles.optionButtonSelected
                        ]}
                        onPress={() => toggleSortPrice(Sort.ASC)}
                    >
                        <Text style={[
                            styles.optionText,
                            sortPrice === 'ASC' && styles.optionTextSelected
                        ]}>
                            Tăng dần
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.optionButton,
                            sortPrice === 'DESC' && styles.optionButtonSelected
                        ]}
                        onPress={() => toggleSortPrice(Sort.DESC)}
                    >
                        <Text style={[
                            styles.optionText,
                            sortPrice === 'DESC' && styles.optionTextSelected
                        ]}>
                            Giảm dần
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Khoảng Giá */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Khoảng Giá</Text>
                {/* Ô input Tối thiểu và Tối đa */}
                <View style={styles.priceInputContainer}>
                    <TextInput
                        style={[
                            styles.priceInput,
                            focusedInput === 'min' && styles.priceInputFocused
                        ]}
                        placeholder="Tối thiểu"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={minPriceInput}
                        onChangeText={(text) => {
                            setMinPriceInput(text);
                            setSelectedPriceRange(null); // Bỏ chọn gợi ý nếu người dùng nhập tay
                        }}
                        onFocus={() => setFocusedInput('min')}
                        onBlur={() => setFocusedInput(null)}
                    />
                    <Text style={styles.priceInputSeparator}>–</Text>
                    <TextInput
                        style={[
                            styles.priceInput,
                            focusedInput === 'max' && styles.priceInputFocused
                        ]}
                        placeholder="Tối đa"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={maxPriceInput}
                        onChangeText={(text) => {
                            setMaxPriceInput(text);
                            setSelectedPriceRange(null); // Bỏ chọn gợi ý nếu người dùng nhập tay
                        }}
                        onFocus={() => setFocusedInput('max')}
                        onBlur={() => setFocusedInput(null)}
                    />
                </View>
                {/* Các tùy chọn gợi ý */}
                <View style={styles.optionsContainer}>
                    {priceRanges?.map(range => (
                        <TouchableOpacity
                            key={range.label}
                            style={[
                                styles.optionButton,
                                selectedPriceRange && selectedPriceRange.minPrice === range.minPrice && selectedPriceRange.maxPrice === range.maxPrice && styles.optionButtonSelected
                            ]}
                            onPress={() => togglePriceRange(range)}
                        >
                            <Text style={[
                                styles.optionText,
                                selectedPriceRange && selectedPriceRange.minPrice === range.minPrice && selectedPriceRange.maxPrice === range.maxPrice && styles.optionTextSelected
                            ]}>
                                {range.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Đánh Giá */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Đánh Giá</Text>
                <View style={styles.optionsContainer}>
                    {ratings?.map(rating => (
                        <TouchableOpacity
                            key={rating}
                            style={[
                                styles.optionButton,
                                selectedRatings.includes(rating) && styles.optionButtonSelected
                            ]}
                            onPress={() => toggleRating(rating)}
                        >
                            <Text style={[
                                styles.optionText,
                                selectedRatings.includes(rating) && styles.optionTextSelected
                            ]}>
                                {rating} sao
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Nút điều khiển */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                    <Text style={styles.resetButtonText}>Thiết lập lại</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                    <Text style={styles.applyButtonText}>Áp dụng</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        padding: 0,
        paddingBottom: 120,
    },
    section: {
        marginBottom: 24,
        backgroundColor: CommonColors.white,
        padding: 16,

        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    categoryGroup: {
        marginBottom: 16,
    },
    categoryParentTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 8,
        paddingLeft: 4,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 3,
        backgroundColor: CommonColors.white,
    },
    optionButtonSelected: {
        borderColor: CommonColors.primary,
    },
    optionText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#333',
    },
    optionTextSelected: {
        color: CommonColors.primary,
        fontWeight: '600',
    },
    priceInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    priceInput: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: CommonColors.white,
        fontSize: 14,
        color: '#222',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    priceInputFocused: {
        borderColor: CommonColors.primary,
        borderWidth: 1.5,
        ...Platform.select({
            ios: {
                shadowColor: CommonColors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    priceInputSeparator: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        paddingHorizontal: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: CommonColors.white,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    resetButton: {
        flex: 1,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: CommonColors.primary,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: CommonColors.white,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    resetButtonText: {
        fontSize: 16,
        color: CommonColors.primary,
        fontWeight: '700',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: CommonColors.primary,
        borderRadius: 8,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    applyButtonText: {
        fontSize: 16,
        color: CommonColors.white,
        fontWeight: '700',
    },
});

export default FilterCategoryComponent;