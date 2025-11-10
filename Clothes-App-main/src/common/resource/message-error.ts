export enum MessageError {
    BUSY_SYSTEM = 'Oops! Hệ thống đang bận, quay lại sau',
    EXPIRES_SESSION = 'Oops! Hết phiên đăng nhập, đăng nhập để tiếp tục',
    EXCEED_QUANTITY_STOCK = 'Quá số lượng tồn kho có thể thêm, chọn sản phẩm khác',
    NOT_ENOUGH_SUM = 'Oops! Giá trị tối thiếu của đơn hàng không đạt yêu cầu',
    INVALID_COUPON = 'Oops! Mã không tồn tại, đã hết hạn, hết lượt dùng',
    ALREADY_REVIEWED_PRODUCT = 'Sản phẩm này đã được đánh giá',
    NOT_LOGGED_TO_EXECUTE = 'Đăng nhập để thao tác có hiệu lực',
    UNAUTHORIZED_VIEW_MESSAGES = 'Không có quyền truy cập cuộc trò chuyện'
}