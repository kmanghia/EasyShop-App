# 📱 TÀI LIỆU ỨNG DỤNG CLOTHES APP

## 📋 TỔNG QUAN

**Clothes App** là một ứng dụng thương mại điện tử (E-commerce) được xây dựng bằng React Native với Expo Router, cho phép người dùng mua sắm quần áo trực tuyến. Ứng dụng hỗ trợ đa nền tảng (iOS, Android, Web) và sử dụng Redux để quản lý state.

---

## 🏗️ KIẾN TRÚC DỰ ÁN

### Công nghệ sử dụng:
- **Framework**: React Native 0.76.7 với Expo ~52.0.37
- **Routing**: Expo Router ~4.0.17
- **State Management**: Redux 4.2.1 + Redux Thunk
- **HTTP Client**: Axios 1.8.2
- **Form Handling**: Formik 2.4.6 + React Hook Form 7.55.0
- **Validation**: Yup 1.6.1
- **Real-time**: WebSocket (RxJS 7.8.2)
- **Storage**: AsyncStorage
- **UI Components**: Custom components + Expo Vector Icons

---

## 🎯 CÁC CHỨC NĂNG CHÍNH

### 1. 🔐 XÁC THỰC NGƯỜI DÙNG (Authentication)

#### 1.1. Đăng nhập (Sign In)
- Đăng nhập bằng email và mật khẩu
- Lưu trữ thông tin phiên đăng nhập
- Xử lý session hết hạn
- **Route**: `/(routes)/sign-in`

#### 1.2. Đăng ký (Sign Up)
- Đăng ký tài khoản mới
- Upload ảnh đại diện khi đăng ký
- Validation form đăng ký
- **Route**: `/(routes)/sign-up`

#### 1.3. Đổi mật khẩu (Change Password)
- Thay đổi mật khẩu tài khoản
- Xác thực mật khẩu cũ
- **Route**: `/(routes)/change-password`

#### 1.4. Đăng ký cửa hàng (Register Shop)
- Cho phép người dùng đăng ký trở thành chủ cửa hàng
- Upload logo và ảnh nền cho cửa hàng
- **Route**: `/(routes)/register-shop`

---

### 2. 🏠 TRANG CHỦ (Home)

#### 2.1. Màn hình chính
- Hiển thị danh sách sản phẩm nổi bật
- Hiển thị sản phẩm mới nhất
- Danh mục sản phẩm (Categories)
- Banner quảng cáo
- Pull-to-refresh để làm mới dữ liệu
- **Route**: `/(tabs)/index`

#### 2.2. Tính năng trang chủ
- Tìm kiếm sản phẩm nhanh
- Xem danh mục sản phẩm
- Xem chi tiết sản phẩm
- Thêm vào giỏ hàng từ trang chủ

---

### 3. 🔍 TÌM KIẾM VÀ DANH MỤC (Search & Categories)

#### 3.1. Tìm kiếm sản phẩm
- Tìm kiếm theo tên sản phẩm
- Tìm kiếm theo danh mục
- Tìm kiếm trong cửa hàng
- **Route**: `/(tabs)/search/index`

#### 3.2. Kết quả tìm kiếm
- Hiển thị kết quả với phân trang
- Lọc sản phẩm theo:
  - Giá (min - max)
  - Xuất xứ (origins)
  - Danh mục (category)
  - Đánh giá (ratings)
  - Sắp xếp theo giá (tăng/giảm)
  - Sản phẩm mới nhất
- **Route**: `/(routes)/search-result/index`

#### 3.3. Tìm kiếm theo danh mục
- Xem sản phẩm theo danh mục cha
- Lọc và sắp xếp sản phẩm trong danh mục
- **Route**: `/(routes)/category-search/index`

---

### 4. 🛍️ QUẢN LÝ SẢN PHẨM (Product Management)

#### 4.1. Chi tiết sản phẩm
- Hiển thị thông tin đầy đủ về sản phẩm:
  - Hình ảnh (slider)
  - Tên, giá, mô tả
  - Biến thể (variants): size, màu sắc
  - Đánh giá và bình luận
  - Sản phẩm liên quan
- Thêm vào giỏ hàng
- Thêm vào yêu thích
- Chọn biến thể (size, màu)
- **Route**: `/(routes)/product-details/index`

#### 4.2. Đánh giá sản phẩm
- Xem danh sách đánh giá của sản phẩm
- Xem điểm đánh giá trung bình
- Phân trang đánh giá
- **Route**: `/(routes)/product-review/index`

#### 4.3. Quản lý sản phẩm
- Lấy danh sách sản phẩm
- Lấy sản phẩm mới nhất
- Lấy sản phẩm theo cửa hàng
- Lấy sản phẩm liên quan
- Tìm kiếm và lọc sản phẩm

---

### 5. 🛒 GIỎ HÀNG (Cart)

#### 5.1. Quản lý giỏ hàng
- Xem giỏ hàng
- Thêm sản phẩm vào giỏ hàng
- Cập nhật số lượng sản phẩm
- Xóa sản phẩm khỏi giỏ hàng
- Xóa toàn bộ sản phẩm của một cửa hàng
- Hiển thị số lượng sản phẩm trên tab bar
- **Route**: `/(tabs)/cart/index`

#### 5.2. Tính năng giỏ hàng
- Nhóm sản phẩm theo cửa hàng
- Áp dụng mã giảm giá (coupon) cho từng cửa hàng
- Tính tổng tiền (subtotal, discount, final total)
- Chọn địa chỉ giao hàng
- Thanh toán

---

### 6. 💳 THANH TOÁN (Payment)

#### 6.1. Màn hình thanh toán
- Xem lại đơn hàng
- Chọn địa chỉ giao hàng
- Áp dụng mã giảm giá
- Chọn phương thức thanh toán
- Xác nhận và thanh toán
- **Route**: `/(routes)/payment/index`

#### 6.2. Thanh toán thành công
- Hiển thị thông báo thanh toán thành công
- Hiển thị thông tin đơn hàng
- **Route**: `/(routes)/payment-success/index`

---

### 7. 📦 QUẢN LÝ ĐƠN HÀNG (Order Management)

#### 7.1. Danh sách đơn hàng
- Xem tất cả đơn hàng của người dùng
- Lọc đơn hàng theo trạng thái:
  - Đang chờ xử lý
  - Đang giao hàng
  - Đã giao hàng
  - Đã hủy
- **Route**: `/(routes)/order-manage/index`

#### 7.2. Chi tiết đơn hàng
- Xem thông tin chi tiết đơn hàng
- Xem sản phẩm trong đơn hàng
- Xem trạng thái đơn hàng
- Hủy đơn hàng (nếu có thể)
- **Route**: `/(routes)/order-detail/index`

---

### 8. ⭐ ĐÁNH GIÁ (Review)

#### 8.1. Quản lý đánh giá
- Xem danh sách sản phẩm chưa đánh giá
- Xem danh sách sản phẩm đã đánh giá
- Thêm đánh giá cho sản phẩm đã mua
- **Route**: `/(routes)/review/index`

#### 8.2. Tính năng đánh giá
- Đánh giá bằng sao (1-5 sao)
- Viết bình luận
- Upload ảnh đánh giá
- Chỉ đánh giá sản phẩm đã mua

---

### 9. ❤️ YÊU THÍCH (Favorite)

#### 9.1. Danh sách yêu thích
- Xem tất cả sản phẩm yêu thích
- Thêm/xóa sản phẩm khỏi yêu thích
- **Route**: `/(routes)/favorite/index`

#### 9.2. Tính năng yêu thích
- Lưu trữ danh sách yêu thích
- Đồng bộ với server
- Hiển thị trạng thái yêu thích trên sản phẩm

---

### 10. 🏪 CỬA HÀNG (Shop)

#### 10.1. Trang cửa hàng
- Xem thông tin cửa hàng:
  - Logo, ảnh nền
  - Tên, địa chỉ, email
  - Số lượng sản phẩm
- Xem sản phẩm của cửa hàng:
  - Sản phẩm nổi bật
  - Sản phẩm mới nhất
  - Sản phẩm theo danh mục
  - Sắp xếp theo giá
- **Route**: `/(routes)/shop/index`

#### 10.2. Tìm kiếm trong cửa hàng
- Tìm kiếm sản phẩm trong một cửa hàng cụ thể
- Lọc và sắp xếp sản phẩm
- **Route**: `/(routes)/shop-search/index`

---

### 11. 📍 QUẢN LÝ ĐỊA CHỈ (Address Management)

#### 11.1. Danh sách địa chỉ
- Xem tất cả địa chỉ đã lưu
- Đặt địa chỉ mặc định
- Xóa địa chỉ
- **Route**: `/(routes)/address/index`

#### 11.2. Thêm/Sửa địa chỉ
- Thêm địa chỉ mới
- Sửa địa chỉ hiện có
- Chọn Tỉnh/Thành phố, Quận/Huyện, Phường/Xã
- Đặt làm địa chỉ mặc định
- **Route**: `/(routes)/cru-address/index`

#### 11.3. Chọn địa chỉ
- Chọn địa chỉ khi thanh toán
- **Route**: `/(routes)/select-address/index`

---

### 12. 💬 TRÒ CHUYỆN (Chat)

#### 12.1. Danh sách cuộc trò chuyện
- Xem danh sách các cuộc trò chuyện với chủ cửa hàng
- Hiển thị tin nhắn cuối cùng
- Hiển thị số tin nhắn chưa đọc
- **Route**: `/(routes)/list-chat/index`

#### 12.2. Chi tiết cuộc trò chuyện
- Gửi và nhận tin nhắn
- Gửi ảnh
- Đánh dấu đã đọc
- Real-time messaging qua WebSocket
- **Route**: `/(routes)/chat-detail/index`

---

### 13. 🤖 CHATBOT (AI Assistant)

#### 13.1. Trợ lý AI
- Chat với chatbot để tìm kiếm sản phẩm
- Tìm kiếm cửa hàng
- Hỏi đáp về sản phẩm
- Hiển thị kết quả tìm kiếm dạng sản phẩm/cửa hàng
- **Route**: `/(routes)/chatbot/index`

#### 13.2. Tính năng chatbot
- Lưu lịch sử hội thoại (cho người dùng đã đăng nhập)
- Quản lý nhiều session chat
- Tìm kiếm thông minh sản phẩm và cửa hàng
- Hiển thị sản phẩm với hình ảnh, giá, thông tin

---

### 14. 🔔 THÔNG BÁO (Notification)

#### 14.1. Danh sách thông báo
- Xem tất cả thông báo
- Đánh dấu đã đọc
- Hiển thị số thông báo chưa đọc trên tab bar
- Phân trang thông báo
- **Route**: `/(tabs)/notification/index`

#### 14.2. Tính năng thông báo
- Nhận thông báo real-time qua WebSocket
- Thông báo về đơn hàng
- Thông báo về tin nhắn mới
- Điều hướng đến chi tiết từ thông báo

---

### 15. 👤 TÀI KHOẢN (User Profile)

#### 15.1. Trang cá nhân
- Xem thông tin cá nhân
- Chỉnh sửa thông tin
- Upload ảnh đại diện
- Xem đơn hàng
- Xem yêu thích
- Đăng xuất
- **Route**: `/(tabs)/me/index`

#### 15.2. Chi tiết thông tin
- Chỉnh sửa thông tin cá nhân
- Upload ảnh đại diện
- **Route**: `/(routes)/info-detail/index`

---

### 16. 🎟️ MÃ GIẢM GIÁ (Coupon/Voucher)

#### 16.1. Quản lý mã giảm giá
- Xem mã giảm giá của cửa hàng
- Xem mã giảm giá của người dùng
- Lưu mã giảm giá
- Áp dụng mã giảm giá vào giỏ hàng
- Xóa mã giảm giá khỏi giỏ hàng

---

## 🔧 CÁC COMPONENT CHÍNH

### UI Components:
1. **Header**: Header tùy chỉnh với nút back, title
2. **InputField**: Input field tùy chỉnh
3. **ImageSlider**: Slider hiển thị nhiều ảnh
4. **Checkbox**: Checkbox tùy chỉnh
5. **Pagination**: Phân trang
6. **QuantityProduct**: Chọn số lượng sản phẩm
7. **SelectVariant**: Chọn biến thể sản phẩm (size, màu)
8. **Loader**: Loading indicator
9. **CustomBottomSheet**: Bottom sheet tùy chỉnh
10. **DialogNotification**: Dialog thông báo
11. **SearchOverlay**: Overlay tìm kiếm
12. **SocialSignInButton**: Nút đăng nhập mạng xã hội
13. **Switch**: Switch component

---

## 📂 CẤU TRÚC THƯ MỤC

```
Clothes-App-main/
├── app/                    # Routes (Expo Router)
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Trang chủ
│   │   ├── search/        # Tìm kiếm
│   │   ├── cart/          # Giỏ hàng
│   │   ├── notification/  # Thông báo
│   │   └── me/            # Tài khoản
│   └── (routes)/          # Stack navigation
│       ├── sign-in/       # Đăng nhập
│       ├── sign-up/       # Đăng ký
│       ├── product-details/ # Chi tiết sản phẩm
│       ├── payment/       # Thanh toán
│       └── ...
├── src/
│   ├── common/            # Utilities, configs
│   │   ├── config/        # App config, axios config
│   │   ├── model/         # Common models
│   │   ├── resource/      # Constants, enums
│   │   ├── service/       # Core services
│   │   ├── styles/        # Common styles
│   │   └── utils/         # Helper functions
│   ├── components/        # Reusable components
│   ├── customize/         # Context providers
│   │   ├── socket.context.tsx  # WebSocket context
│   │   └── toast.context.tsx    # Toast context
│   ├── data/
│   │   ├── management/    # Business logic layer
│   │   ├── model/         # Data models
│   │   ├── service/       # API services
│   │   ├── store/         # Redux store
│   │   │   ├── actions/   # Redux actions
│   │   │   └── reducers/  # Redux reducers
│   │   └── types/          # TypeScript types
│   └── screens/           # Screen components
│       ├── home/          # Trang chủ
│       ├── auth/          # Authentication
│       ├── cart/          # Giỏ hàng
│       ├── product-details/ # Chi tiết sản phẩm
│       └── ...
└── assets/                # Images, fonts, animations
```

---

## 🔄 STATE MANAGEMENT (Redux)

### Redux Store Structure:
1. **userLogged**: Thông tin người dùng đã đăng nhập
2. **cart**: Giỏ hàng
3. **notification**: Thông báo
4. **action**: Actions chung

### Redux Actions:
- User actions: Đăng nhập, lưu thông tin, yêu thích
- Cart actions: Thêm, sửa, xóa giỏ hàng
- Notification actions: Thêm, đánh dấu đã đọc thông báo

---

## 🌐 API & SERVICES

### Các service chính:
1. **Auth Service**: Xác thực, đăng ký, đổi mật khẩu
2. **Product Service**: Quản lý sản phẩm
3. **Cart Service**: Quản lý giỏ hàng
4. **Order Service**: Quản lý đơn hàng
5. **Shop Service**: Quản lý cửa hàng
6. **Review Service**: Quản lý đánh giá
7. **Chat Service**: Quản lý tin nhắn
8. **Address Service**: Quản lý địa chỉ
9. **Coupon Service**: Quản lý mã giảm giá
10. **Favorite Service**: Quản lý yêu thích
11. **Notification Service**: Quản lý thông báo
12. **User Service**: Quản lý người dùng
13. **Category Service**: Quản lý danh mục

---

## 🔌 WEBSOCKET

### Real-time Features:
- Nhận thông báo real-time
- Chat real-time với chủ cửa hàng
- Cập nhật trạng thái đơn hàng real-time

---

## 📱 NAVIGATION

### Tab Navigation (Bottom Tabs):
1. **Trang chủ** (Home)
2. **Danh mục** (Search/Categories)
3. **Thông báo** (Notification)
4. **Giỏ hàng** (Cart)
5. **Tài khoản** (Me)

### Stack Navigation:
- Authentication flows
- Product details
- Payment flows
- Order management
- Address management
- Chat flows
- And more...

---

## 🎨 UI/UX FEATURES

- **Pull-to-refresh**: Làm mới dữ liệu
- **Infinite scroll**: Tải thêm dữ liệu khi scroll
- **Image loading**: Lazy loading hình ảnh
- **Loading states**: Hiển thị trạng thái loading
- **Error handling**: Xử lý lỗi và hiển thị thông báo
- **Toast notifications**: Thông báo dạng toast
- **Bottom sheets**: Bottom sheet cho các tùy chọn
- **Animations**: Animations mượt mà

---

## 🔐 BẢO MẬT

- JWT token authentication
- Session management
- Secure storage với AsyncStorage
- Xử lý session hết hạn
- Validation form inputs

---

## 📦 DEPENDENCIES CHÍNH

- **expo**: ~52.0.37
- **react-native**: 0.76.7
- **expo-router**: ~4.0.17
- **redux**: 4.2.1
- **redux-thunk**: 2.4.2
- **axios**: ^1.8.2
- **formik**: ^2.4.6
- **react-hook-form**: ^7.55.0
- **yup**: ^1.6.1
- **rxjs**: ^7.8.2
- **@react-native-async-storage/async-storage**: ^1.23.1
- **expo-image-picker**: ~16.0.6
- **react-native-reanimated**: ~3.16.1
- **@gorhom/bottom-sheet**: ^5.1.2

---

## 🚀 CHẠY ỨNG DỤNG

### Cài đặt dependencies:
```bash
npm install
```

### Chạy ứng dụng:
```bash
# Development
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

---

## 📝 GHI CHÚ

- Ứng dụng sử dụng TypeScript để đảm bảo type safety
- Sử dụng Expo Router cho file-based routing
- Redux được sử dụng để quản lý state toàn cục
- WebSocket được sử dụng cho real-time features
- Hỗ trợ đa ngôn ngữ (tiếng Việt)
- Responsive design cho nhiều kích thước màn hình

---

## 📄 LICENSE

Private project

---

**Tài liệu được tạo tự động dựa trên phân tích codebase**

