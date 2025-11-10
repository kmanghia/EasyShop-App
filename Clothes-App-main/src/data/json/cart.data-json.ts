export class CartData {
    private carts = {
        "carts": [
            {
                "id": 1,
                "user_id": 1,
                "cart_shops": [
                    {
                        "id": 1,
                        "shop": {
                            "id": 5,
                            "shop_name": "Shop A"
                        },
                        "cart_items": [
                            {
                                "id": 1,
                                "product_variant": {
                                    "id": 1,
                                    "product": {
                                        "id": 2,
                                        "product_name": "Áo thun đỏ",
                                        "unit_price": 200000,
                                    },
                                    "image_url": "product_variants/1742103107567-product_1.png",
                                    "stock_quantity": 1
                                },
                                "quantity": 2
                            },
                            {
                                "id": 2,
                                "product_variant": {
                                    "id": 3,
                                    "product": {
                                        "id": 4,
                                        "product_name": "Quần jean xanh",
                                        "unit_price": 350000,
                                    },
                                    "image_url": "product_variants/1742103107567-product_2.png",
                                    "stock_quantity": 2
                                },
                                "quantity": 1
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "shop": {
                            "id": 6,
                            "shop_name": "Shop B"
                        },
                        "cart_items": [
                            {
                                "id": 3,
                                "product_variant": {
                                    "id": 5,
                                    "product": {
                                        "id": 6,
                                        "product_name": "Giày sneaker",
                                        "unit_price": 800000,
                                    },
                                    "image_url": "product_variants/1742645243088-short_product_8.png",
                                    "stock_quantity": 3
                                },
                                "quantity": 1
                            }
                        ]
                    }
                ]
            }
        ]
    }

    getCartDateJSON() {
        return JSON.stringify(this.carts);
    }
}