import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import CartStyle from "./cart.style";
import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { router, Stack } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as CartManagement from "../../data/management/cart.management";
import { CartItemModel, CartModel, CartShopModel } from "@/src/data/model/cart.model";
import { AppConfig } from "@/src/common/config/app.config";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import CheckboxComponent from "@/src/components/checkbox/checkbox.comp";
import QuantityProductComponent from "@/src/components/quantity-product/quantity-product.comp";
import { useToast } from "@/src/customize/toast.context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet"
import VariantSelectComponent from "./comp/variant-select/variant-select.component";
import { ProductVariantModel } from "@/src/data/model/product_variant.model";
import CouponSelectComponent from "./comp/coupon-select/coupon-select.component";
import { CouponModel } from "@/src/data/model/coupon.model";
import * as CouponManagement from "@/src/data/management/coupon.management";
import { formatCurrency, formatPriceRender } from "@/src/common/utils/currency.helper";
import { DiscountTypes } from "@/src/common/resource/discount_type";
import Scissors from "@/assets/images/icon_scissors.svg";
import { CartShopFinalType, RootState } from "@/src/data/types/global";
import { ShopModel } from "@/src/data/model/shop.model";
import { useDispatch, useSelector } from "react-redux";
import { CartStoreState } from "@/src/data/store/reducers/cart/cart.reducer";
import * as CartActions from "@/src/data/store/actions/cart/cart.action";
import * as UserActions from "@/src/data/store/actions/user/user.action";
import { MessageError } from "@/src/common/resource/message-error";
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer";
import LoadingDots from "@apolloeagle/loading-dots";
import BottomSheetComponent from "../product-details/comp/bottom-sheet/bottom-sheet.component";

type Props = {}

const CartScreen = (props: Props) => {
    const { showToast } = useToast();
    const [preImage, setPreImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartModel>();
    const [selectedCartShop, setSelectedCartShop] = useState<CartShopModel | null>(null);
    const [selectedCartShopId, setSelectedCartShopId] = useState<number>(0);
    const [selectedCartItem, setSelectedCartItem] = useState<CartItemModel | null>(null);
    const [selectedCartItems, setSelectedCartItems] = useState<CartItemModel[]>([]);
    const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
    const [selectedCartShops, setSelectedCartShops] = useState<Record<string, boolean>>({});
    const userSelector = useSelector((state: RootState) => state.userLogged) as UserStoreState;
    const cartSelector = useSelector((state: RootState) => state.cart) as CartStoreState;
    const dispatch = useDispatch();

    const [isOpenVariantSheet, setIsOpenVariantSheet] = useState(false);
    const [isOpenCouponSheet, setIsOpenCouponSheet] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchPreImage();
            fetchCartByUser();
        }, [])
    )

    const fetchPreImage = () => {
        setPreImage(new AppConfig().getPreImage());
    }

    const fetchCartByUser = async () => {
        if (userSelector.isLogged === false) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await CartManagement.fetchCartByUser();
            setCart(response);
        } catch (error: any) {
            console.log(error);
            if (error?.message === 'Session expired, please log in again') {
                /** Không làm gì cả */
                showToast(MessageError.EXPIRES_SESSION, 'error');
                dispatch(UserActions.UpdateExpiresLogged(false));
                const cart = new CartModel();
                cart.id = cartSelector.id;
                cart.user_id = cartSelector.user_id;
                cart.cart_shops = [];
                dispatch(CartActions.SaveCart(cart));
                setCart(cart);
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }

        setRefreshing(false);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }

    const handleRefreshCart = useCallback(() => {
        setRefreshing(true);
        fetchCartByUser();
    }, [])

    const handleToggleCartShop = (cartShopId: number, isChecked: boolean) => {
        setSelectedCartShops(prev => {
            const updatedShops = { ...prev, [cartShopId]: isChecked };

            // Cập nhật tất cả cart_items trong cartShop này
            setSelectedItems(prevItems => {
                const updatedItems = { ...prevItems };
                const cartShop = cart?.cart_shops?.find(shop => shop.id === cartShopId);
                if (cartShop) {
                    cartShop.cart_items.forEach(item => {
                        updatedItems[`${cartShopId}-${item.id}`] = isChecked;
                    });
                }

                return updatedItems;
            });

            return updatedShops;
        });
    }

    const handleToggleCartItem = (cartShopId: number, cartItemId: number, isChecked: boolean) => {
        setSelectedItems(prev => {
            const updated = {
                ...prev,
                [`${cartShopId}-${cartItemId}`]: isChecked
            };

            const cart_shop = cart?.cart_shops.find(cartShop => cartShop.id === cartShopId);
            if (cart_shop) {
                const isAllCartItemSelected = cart_shop.cart_items.every(item => updated[`${cartShopId}-${item.id}`])
                setSelectedCartShops(prevCartShops => ({
                    ...prevCartShops,
                    [cartShopId]: isAllCartItemSelected
                }))
            }

            return updated;
        })
    }

    const handleUpdateCartItemQuantity = async (
        cart_shop_id: number,
        cart_item_id: number,
        new_quantity: number
    ) => {
        try {
            await CartManagement.updateQuantityCartItem(cart_item_id, new_quantity);
            dispatch(
                CartActions.UpdateQuantityCartItem(
                    cart_item_id,
                    cart_shop_id,
                    new_quantity
                )
            );
            setCart(prevCart => {
                const updatedCart = { ...prevCart } as CartModel;
                const cartShop = updatedCart.cart_shops?.find(
                    shop => shop.id === cart_shop_id
                );

                if (cartShop) {
                    const cartItem = cartShop.cart_items.find(
                        item => item.id === cart_item_id
                    );

                    if (cartItem) {
                        cartItem.quantity = new_quantity;
                    }
                }

                return updatedCart;
            });
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

    const calculatePaymentTotal = (): number => {
        let total = 0;

        cart?.cart_shops.forEach(cartShop => {
            let shopTotal = 0;
            cartShop.cart_items.forEach(cart_item => {
                if (selectedItems[`${cartShop.id}-${cart_item.id}`]) {
                    const price = (cart_item.product_variant?.product?.unit_price ?? 0) * cart_item.quantity;
                    shopTotal += price;
                }
            });
            /** Cart Shop có chọn KM */
            if (cartShop.selectedCoupon) {
                const coupon = cartShop.selectedCoupon;
                if (shopTotal >= coupon.min_order_value) {
                    let discount = 0;
                    if (coupon.discount_type === DiscountTypes.PERCENTAGE) {
                        discount = (shopTotal * coupon.discount_value) / 100;
                        if (coupon.max_discount && discount > coupon.max_discount) {
                            discount = coupon.max_discount;
                        }
                    } else if (coupon.discount_type === DiscountTypes.FIXED) {
                        discount = coupon.discount_value;
                    }

                    shopTotal = Math.max(0, shopTotal - discount);
                }
            }

            total += shopTotal;
        })

        return total;
    }

    const isShopOutOfStock = (cartItems: CartItemModel[]) => {
        return cartItems.some((cartItem) => {
            const requestedQuantity = cartItem.quantity;
            const stockQuantity = cartItem.product_variant?.stock_quantity ?? 0;
            return requestedQuantity > stockQuantity
        });
    }

    const isCartEmpty = () => {
        return cart?.cart_shops.every(
            cart_shop => cart_shop.cart_items.every(
                cart_item => !selectedItems[`${cart_shop.id}-${cart_item.id}`]
            )
        )
    }

    const isAnySelectedOutOfStock = () => {
        return cart?.cart_shops.some(
            cart_shop => cart_shop.cart_items.some(
                cart_item =>
                    selectedItems[`${cart_shop.id}-${cart_item.id}`]
                    && cart_item.quantity > (cart_item.product_variant?.stock_quantity ?? 0)
            )
        )
    }

    /** Kiểm tra min_order_value */
    const calculateCartShopTotal = (cartShop: CartShopModel): number => {
        return cartShop.cart_items.reduce((sum, item) => {
            if (selectedItems[`${cartShop.id}-${item.id}`]) {
                const price = (item.product_variant?.product?.unit_price ?? 0) * item.quantity;
                return sum + price;
            }
            return sum;
        }, 0);
    };

    const handleCheckout = async () => {
        if (isCartEmpty()) {
            showToast('Vui lòng chọn ít nhất một sản phẩm để thanh toán', 'error');
            return;
        }

        if (isAnySelectedOutOfStock()) {
            showToast('Một số sản phẩm không đủ số lượng để thanh toán', 'error');
            return;
        }

        const invalidCoupons = cart?.cart_shops.some(
            cart_shop => cart_shop.selectedCoupon && calculateCartShopTotal(cart_shop) < cart_shop.selectedCoupon.min_order_value
        );

        if (invalidCoupons) {
            showToast(`Một số Voucher không thể sử dụng, cân nhắc bỏ Voucher hoặc tăng giá trị đơn hàng`, 'error');
            return;
        }

        let subTotal = 0;
        let discount = 0;
        // Filter cart shops to only include those with at least one selected item
        const listCartShopFinal: CartShopFinalType[] = cart?.cart_shops
            .filter(cart_shop =>
                cart_shop.cart_items.some(cart_item => selectedItems[`${cart_shop.id}-${cart_item.id}`])
            )
            .map(cart_shop => {
                const listCartItemFinal = cart_shop.cart_items.filter(
                    cart_item => selectedItems[`${cart_shop.id}-${cart_item.id}`]
                );

                // Skip if no selected items (though this should not happen due to the filter above)
                if (listCartItemFinal.length === 0) {
                    return null;
                }

                // Calculate shopTotal for CartShop
                const shopTotalFinal = listCartItemFinal.reduce((sum, item) => {
                    const price = (item.product_variant?.product?.unit_price ?? 0) * item.quantity;
                    return sum + price;
                }, 0);

                // Calculate discount from Coupon (if applicable and valid)
                let shopDiscount = 0;
                if (cart_shop.selectedCoupon && shopTotalFinal >= cart_shop.selectedCoupon.min_order_value) {
                    const selectedCouponByCartShop = cart_shop.selectedCoupon;
                    if (selectedCouponByCartShop.discount_type === DiscountTypes.PERCENTAGE) {
                        shopDiscount = (shopTotalFinal * selectedCouponByCartShop.discount_value) / 100;
                        if (selectedCouponByCartShop.max_discount && shopDiscount > selectedCouponByCartShop.max_discount) {
                            shopDiscount = selectedCouponByCartShop.max_discount;
                        }
                    } else if (selectedCouponByCartShop.discount_type === DiscountTypes.FIXED) {
                        shopDiscount = selectedCouponByCartShop.discount_value;
                    }
                }

                // Add to subtotal and discount
                subTotal += shopTotalFinal;
                discount += shopDiscount;

                // Đảm bảo shop_final_total không âm
                const shopFinalTotal = Math.max(0, shopTotalFinal - shopDiscount);

                return {
                    cart_shop_id: cart_shop.id,
                    shop: cart_shop.shop ?? new ShopModel(),
                    cart_items: listCartItemFinal,
                    selected_coupon: cart_shop.selectedCoupon ? cart_shop.selectedCoupon : null,
                    shop_total: shopTotalFinal,
                    shop_discount: shopDiscount,
                    shop_final_total: shopFinalTotal
                } as CartShopFinalType;
            })
            .filter((item): item is CartShopFinalType => item !== null) ?? [];

        if (!listCartShopFinal || listCartShopFinal.length === 0) {
            showToast('Không có sản phẩm nào được chọn để thanh toán', 'error');
            return;
        }

        const final_total = Math.max(0, subTotal - discount);

        try {
            router.navigate({
                pathname: '/(routes)/payment',
                params: {
                    cart_shops: JSON.stringify(listCartShopFinal),
                    subtotal: subTotal,
                    discount: discount,
                    final_total: final_total
                }
            });
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', 'error');
        }
    };

    const handleRemoveCartItem = async (cart_shop_id: number, cart_item_id: number) => {
        try {
            await CartManagement.removeCartItem(cart_item_id);
            dispatch(
                CartActions.RemoveCartItem(
                    cart_item_id,
                    cart_shop_id
                )
            )
            setCart(prevCart => {
                if (!prevCart) return prevCart;

                const updatedCartShops = prevCart.cart_shops.map(
                    cart_shop => {
                        if (cart_shop.id !== cart_shop_id) {
                            return cart_shop;
                        }

                        const updatedItems = cart_shop.cart_items.filter(
                            item => item.id !== cart_item_id
                        );

                        return {
                            ...cart_shop,
                            cart_items: updatedItems
                        }
                    }
                ) // Loại bỏ cart_shop nếu không còn cart_items
                    .filter(cart_shop => cart_shop.cart_items.length > 0);

                return {
                    ...prevCart,
                    cart_shops: updatedCartShops
                } as CartModel
            })
            showToast('Loại bỏ sản phẩm thành công', "success");
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

    const openVariantSelect = (cart_shop_id: number, cart_item: CartItemModel, cart_items: CartItemModel[]) => {
        setSelectedCartShopId(cart_shop_id);
        setSelectedCartItem(cart_item);
        setSelectedCartItems(cart_items);
        openSheet("variant");
    }

    const handleChangeVariantCartItem = async (
        cart_shop_id: number,
        cart_item_id: number,
        variant: ProductVariantModel,
        quantity: number
    ) => {
        dispatch(
            CartActions.UpdateCartItem(
                variant,
                cart_item_id,
                cart_shop_id,
                quantity
            )
        );
        setCart(prevCart => {
            const updatedCart = { ...prevCart } as CartModel;
            const cartShop = updatedCart.cart_shops?.find(
                shop => shop.id === cart_shop_id
            );

            if (cartShop) {
                const cartItem = cartShop.cart_items.find(
                    item => item.id === cart_item_id
                );

                if (cartItem) {
                    cartItem.product_variant = variant;
                    cartItem.quantity = quantity;
                }
            }

            return updatedCart;
        });
        closeSheet("variant");
    }

    const openCouponSelect = (cartShop: CartShopModel) => {
        setSelectedCartShop(cartShop);
        openSheet("coupon");
    }

    const handleApplyCoupon = async (cart_shop_id: number, coupon: CouponModel) => {
        const shopTotal = selectedCartShop!.cart_items.reduce(
            (sum, item) =>
                selectedItems[`${selectedCartShop!.id}-${item.id}`]
                    ? sum + (item.product_variant?.product?.unit_price ?? 0) * item.quantity
                    : sum,
            0
        );
        if (shopTotal < coupon.min_order_value) {
            showToast(`Đơn hàng cần tối thiểu ${formatCurrency(coupon.min_order_value)}`, "error");
            return;
        }

        try {
            await CouponManagement.applyCouponCartShopMobile(cart_shop_id, coupon.id);
            setCart((prevCart) => {
                const updatedCart = { ...prevCart } as CartModel;
                const cartShop = updatedCart.cart_shops.find(
                    (cart_shop) => cart_shop.id === cart_shop_id
                );
                if (cartShop) {
                    cartShop.selectedCoupon = coupon;
                }
                return updatedCart;
            })
            closeSheet("coupon")
        } catch (error: any) {
            console.log(error);
            if (error?.message === 'Coupon không tồn tại, đã hết hạn, hết lượt dùng, hoặc chưa được lưu') {
                showToast(MessageError.INVALID_COUPON, 'error');
            } else if (error?.message === 'Tổng giá trị không đủ') {
                showToast(MessageError.NOT_ENOUGH_SUM, 'error');
            } else if (error?.message === 'Session expired, please log in again') {
                /** Không làm gì cả */
                router.navigate('/(routes)/sign-in');
                dispatch(UserActions.UpdateExpiresLogged(false));
                showToast(MessageError.EXPIRES_SESSION, 'error');
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }
    }

    const handleRemoveCouponFromCartShop = async (cart_shop_id: number) => {
        try {
            await CouponManagement.removeCouponFromCartShopMobile(cart_shop_id);
            setCart((prevCart) => {
                const updatedCart = { ...prevCart } as CartModel;
                const cartShop = updatedCart.cart_shops.find(
                    (cart_shop) => cart_shop.id === cart_shop_id
                );
                if (cartShop) {
                    cartShop.selectedCoupon = null;
                }
                return updatedCart;
            })
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

    const openSheet = useCallback((sheetType: "variant" | "coupon") => {
        if (sheetType === "variant") {
            setIsOpenVariantSheet(true);
        } else if (sheetType === "coupon") {
            setIsOpenCouponSheet(true);
        }
    }, []);

    const closeSheet = (sheetType: "variant" | "coupon") => {
        if (sheetType === "variant") {
            setIsOpenVariantSheet(false);
        } else if (sheetType === "coupon") {
            setIsOpenCouponSheet(false);
        }
        setSelectedCartShop(null);
        setSelectedCartItem(null);
        setSelectedCartItems([]);
        setSelectedCartShopId(0);
    };

    const navigateToShop = (id: number) => {
        router.navigate({
            pathname: "/(routes)/shop",
            params: {
                shop_id: id
            }
        })
    }

    const headerHeight = useHeaderHeight();
    const shouldDisableCheckout = isCartEmpty() || isAnySelectedOutOfStock();

    if (loading) {
        return (
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    backgroundColor: CommonColors.extraLightGray
                }}
            >
                <LoadingDots size={16} color={CommonColors.primary} />
            </View>
        )
    }

    return (
        <>
            <View style={styles.headerContainer}>
                <Text style={styles.paymentHeaderText}>
                    Giỏ hàng
                </Text>
            </View>
            <View style={[styles.container, { marginTop: headerHeight }]}>
                {cart && cart.cart_shops.length > 0 && (
                    <FlatList
                        data={cart?.cart_shops}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        refreshing={refreshing}
                        onRefresh={handleRefreshCart}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 20 }}></View>
                        )}
                        renderItem={({ index, item }) => {
                            const shopTotal = calculateCartShopTotal(item);
                            const isCouponValid = item.selectedCoupon ? shopTotal >= item.selectedCoupon.min_order_value : true;
                            return (
                                <Animated.View style={styles.cartShopWrapper} entering={FadeInDown.delay(200 + (index * 100)).duration(300)}>
                                    <View style={styles.cartShopHeader}>
                                        <CheckboxComponent
                                            stateChecked={selectedCartShops[item.id]}
                                            toggleCheckedFunc={(isChecked) => handleToggleCartShop(item.id, isChecked)}
                                            disabled={isShopOutOfStock(item.cart_items)}
                                        />
                                        <TouchableOpacity onPress={() => navigateToShop(item.shop?.id ?? -1)}>
                                            <Text style={styles.shopNameText}>{item.shop?.shop_name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.listCartItemWrapper}>
                                        {item.cart_items.map((cart_item, index) => {
                                            const isOutOfStock = cart_item.quantity > (cart_item.product_variant?.stock_quantity ?? 0);
                                            return (
                                                <View key={`item-${cart_item.id}-${index}`} style={styles.cartItemWrapper}>
                                                    <CheckboxComponent
                                                        stateChecked={selectedItems[`${item.id}-${cart_item.id}`]}
                                                        toggleCheckedFunc={(isChecked) => handleToggleCartItem(item.id, cart_item.id, isChecked)}
                                                        disabled={isOutOfStock}
                                                    />
                                                    {/* Thông tin cart item */}
                                                    <View style={styles.cartItemInfo}>
                                                        <Image style={styles.cartItemImage} source={{ uri: `${preImage}/${cart_item.product_variant?.image_url}` }} />
                                                        <View style={styles.cartItemContent}>
                                                            <Text style={styles.cartItemNameText}>{cart_item.product_variant?.product?.product_name}</Text>
                                                            <TouchableOpacity
                                                                style={styles.changeVariantBtn}
                                                                onPress={() => openVariantSelect(item.id, cart_item, item.cart_items)}
                                                            >
                                                                <Text>
                                                                    {`Màu ${cart_item.product_variant?.color?.color_name}, Size ${cart_item.product_variant?.size?.size_code}`}
                                                                </Text>
                                                                <MaterialIcons name="keyboard-arrow-down" size={18} color="black" />
                                                            </TouchableOpacity>
                                                            <View style={styles.cartItemPriceAndQuantity}>
                                                                <View style={styles.priceWrapper}>
                                                                    <Text style={styles.dText}>đ</Text>
                                                                    <Text style={styles.priceText}>
                                                                        {formatPriceRender(cart_item.product_variant?.product?.unit_price ?? 0)}
                                                                    </Text>
                                                                </View>
                                                                <Text style={[styles.stockQuantityText, isOutOfStock && { color: CommonColors.red }]}>
                                                                    Còn lại: {cart_item.product_variant?.stock_quantity ?? 0}
                                                                </Text>
                                                            </View>
                                                            <View style={{ width: 200, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                                                <QuantityProductComponent
                                                                    initialQuantity={cart_item.quantity}
                                                                    min={1}
                                                                    max={cart_item.product_variant?.stock_quantity ?? 99}
                                                                    onQuantityChange={(newQuantity) => handleUpdateCartItemQuantity(item.id, cart_item.id, newQuantity)}
                                                                />
                                                                <TouchableOpacity onPress={() => handleRemoveCartItem(item.id, cart_item.id)}>
                                                                    <Ionicons name="trash-outline" size={25} color={CommonColors.red} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        })}
                                    </View>
                                    <View style={styles.devider}></View>
                                    <View style={styles.promotionWrapper}>
                                        {item.selectedCoupon && (
                                            <TouchableOpacity
                                                style={styles.promotionItem}
                                                onPress={() => handleRemoveCouponFromCartShop(item.id)}
                                            >
                                                <Scissors height={20}></Scissors>
                                                <Text style={styles.promotionText}>Bỏ Voucher</Text>
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity
                                            style={styles.promotionItem}
                                            onPress={() => openCouponSelect(item)}
                                        >
                                            <Ionicons name="ticket-outline" size={24} color={CommonColors.red} />
                                            <Text style={[styles.promotionText, !isCouponValid && { color: CommonColors.lightGray }]}>
                                                {
                                                    item.selectedCoupon
                                                        ? isCouponValid
                                                            ? `Đang áp dụng: ${item?.selectedCoupon?.name}`
                                                            : `Không thể sử dụng Voucher ${item.selectedCoupon?.name}`
                                                        : 'Thêm Voucher ưu đãi'
                                                }
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.promotionItem}>
                                            <MaterialCommunityIcons name="truck-delivery-outline" size={24} color={CommonColors.green} />
                                            <Text style={styles.promotionText}>Miễn phí vận chuyển cho đơn hàng 0đ</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>
                            )
                        }}
                    />
                )}
                {(!cart || cart?.cart_shops.length === 0) && (
                    <Animated.View style={styles.emptyCartContainer}>
                        <Image
                            style={styles.emptyCartImage}
                            source={require('@/assets/images/icon_empty_cart.png')}
                        />
                        <Text style={styles.emptyCartText}>Giỏ hàng của bạn còn trống</Text>
                        <TouchableOpacity
                            style={styles.shopNowButton}
                            onPress={() => router.navigate("/(tabs)")}
                        >
                            <Text style={styles.shopNowButtonText}>Mua sắm ngay</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
            {/* Thanh toán */}
            <Animated.View style={styles.footer} entering={FadeInDown.delay(500).duration(500).springify()}>
                <View style={styles.priceInfoWrapper}>
                    <Text style={{ fontSize: 15 }}>Thành tiền: </Text>
                    <Text style={styles.dText}>đ</Text>
                    <Text style={styles.priceText}>
                        {formatPriceRender(calculatePaymentTotal())}
                    </Text>
                </View>
                <TouchableOpacity
                    disabled={shouldDisableCheckout}
                    style={[
                        styles.checkoutBtn,
                        shouldDisableCheckout && { opacity: 0.7 }
                    ]}
                    onPress={() => handleCheckout()}
                >
                    <Text style={styles.checkoutBtnText}>Thanh toán</Text>
                </TouchableOpacity>
            </Animated.View>
            {/* Bottom sheet */}
            <BottomSheetComponent
                isOpen={isOpenVariantSheet}
                onClose={() => closeSheet("variant")}
            >
                <VariantSelectComponent
                    selectedCartItem={selectedCartItem}
                    selectedCartShopId={selectedCartShopId}
                    selectedCartItems={selectedCartItems}
                    preImage={preImage}
                    setChangeVariantCartItem={handleChangeVariantCartItem}
                />
            </BottomSheetComponent>
            <BottomSheetComponent
                isOpen={isOpenCouponSheet}
                onClose={() => closeSheet("coupon")}
            >
                <CouponSelectComponent
                    preImage={preImage}
                    selectedCartShop={selectedCartShop}
                    onSelectCoupon={handleApplyCoupon}
                />
            </BottomSheetComponent>
        </>
    )
}

const styles = CartStyle;

export default CartScreen;