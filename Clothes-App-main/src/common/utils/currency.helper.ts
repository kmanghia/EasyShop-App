export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    }).format(value);
}

export const formatPriceRender = (value: number) => {
    return parseFloat(value.toString()).toLocaleString('vi-VN');
}