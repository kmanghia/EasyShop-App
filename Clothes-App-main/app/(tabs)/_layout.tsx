import React, { useCallback, useEffect, useRef } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useFocusEffect } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TabConfig } from '@/src/common/resource/tab.config';
import { Fonts } from '@/src/common/resource/fonts';
import { AppConfig } from '@/src/common/config/app.config';
import * as UserManagement from "@/src/data/management/user.management";
import * as CartManagement from "@/src/data/management/cart.management";
import * as FavoriteManagement from "@/src/data/management/favorite.management";
import * as NotificationMana from "@/src/data/management/notification.management";
import * as UserActions from "@/src/data/store/actions/user/user.action";
import * as CartActions from "@/src/data/store/actions/cart/cart.action";
import * as NotificationActions from "@/src/data/store/actions/notification/notification.action";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/data/types/global';
import { UserStoreState } from '@/src/data/store/reducers/user/user.reducer';
import { CartStoreState } from '@/src/data/store/reducers/cart/cart.reducer';
import { NotificationStoreState } from '@/src/data/store/reducers/notification/notification.reducer';

export default function TabLayout() {
  const preImage = new AppConfig().getPreImage();
  const userSelector: UserStoreState = useSelector((state: RootState) => state.userLogged);
  const cartSelector: CartStoreState = useSelector((state: RootState) => state.cart);
  const notificationSelector: NotificationStoreState = useSelector((state: RootState) => state.notification);
  const dispatch = useDispatch();

  useFocusEffect(useCallback(() => {
    if (userSelector.isLogged === false) {
      console.log('Access without logging in');
      return;
    }

    fetchUserInfo();
    fetchFavoriteUsers();
    fetchCart();
    fetchUnreadNotificationCount();
  }, []));

  const fetchUserInfo = async () => {
    try {
      const user = await UserManagement.fetchInfoUser();
      user.expires = true;
      dispatch(UserActions.SaveInfoLogged(user));
    } catch (error: any) {
      console.log(error);
      if (error?.message === 'Session expired, please log in again') {
        const user = await new AppConfig().getUserInfo();
        if (user) {
          user.expires = false;
          dispatch(UserActions.SaveInfoLogged(user));
        }
      }
    }
  }

  const fetchFavoriteUsers = async () => {
    try {
      const products = await FavoriteManagement.fetchFavoritesByUser();
      let productIds = products.map(product => product.id);
      dispatch(UserActions.SaveFavorites(productIds));
    } catch (error: any) {
      console.log(error);
    }
  }

  const fetchCart = async () => {
    try {
      const response = await CartManagement.fetchCartByUserNonAuthenticate();
      dispatch(CartActions.SaveCart(response));
    } catch (error) {
      console.log(error);
    }
  }

  const fetchUnreadNotificationCount = async () => {
    try {
      const unreadCount = await NotificationMana.fetchUnreadNotificationCount();
      if (typeof unreadCount === 'number') {
        dispatch(NotificationActions.SaveUnreadCount(unreadCount));
      }
    } catch (error: any) {
      console.log(error);
      if (error?.message === 'Session expired, please log in again') {
        const user = await new AppConfig().getUserInfo();
        if (user) {
          user.expires = false;
          dispatch(UserActions.SaveInfoLogged(user));
        }
      }
    }
  }

  const calculateTotalProduct = () => {
    let total = 0;
    cartSelector.cart_shops.forEach((cart_shop) => {
      total += cart_shop.cart_items.length;
    })
    return total;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: TabConfig.colorTabs["light"].tabIconSelected,
        tabBarInactiveTintColor: TabConfig.colorTabs["light"].tabIconDefault,
        tabBarStyle: style.tabBarStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 13
          },
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="search/index"
        options={{
          title: "Danh mục",
          tabBarLabelStyle: {
            fontSize: 13
          },
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={24} name={'search'} color={color} />,
        }}
      />

      <Tabs.Screen
        name="notification/index"
        options={{
          title: "Thông báo",
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 13
          },
          tabBarIcon: ({ color }) => (
            <View>
              <FontAwesome size={20} name={'bell'} color={color} />
              {notificationSelector.unreadCount > 0 && (
                <View style={style.notifiWrapper}>
                  <Text style={style.notifyText}>{notificationSelector.unreadCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="cart/index"
        options={{
          title: "Giỏ hàng",
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 13
          },
          tabBarIcon: ({ color }) => (
            <View>
              <FontAwesome size={22} name={'shopping-cart'} color={color} />
              {calculateTotalProduct() > 0 && (
                <View style={style.notifiWrapper}>
                  <Text style={style.notifyText}>{calculateTotalProduct()}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="me/index"
        options={{
          title: "Tài khoản",
          headerShown: true,
          tabBarLabelStyle: {
            fontSize: 13
          },
          tabBarIcon: ({ color }) => (
            <View style={style.avatarContainer}>
              {(userSelector.isLogged && userSelector.image_url !== '') ? (
                <Image
                  source={{ uri: `${preImage}${userSelector.image_url}` }}
                  style={style.avatar}
                  onError={(error) => console.log('Failed to load avatar:', error)}
                />
              ) : (
                <FontAwesome size={24} name={'user'} color={color} />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const style = StyleSheet.create({
  notifiWrapper: {
    position: "absolute",
    right: -10,
    top: -6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFF",
    width: 20,
    height: 20,
  },
  notifyText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: Fonts.POPPINS_REGULAR,
  },
  tabBarStyle: {
    fontSize: 14,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingTop: 8,
    height: 70,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});
