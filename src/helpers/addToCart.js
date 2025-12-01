import SummaryApi from "../common";
import { toast } from 'react-toastify';

const addToCart = async (e, id) => {
    e?.stopPropagation();
    e?.preventDefault();

    try {
        // Get token from localStorage
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

        if (!token) {
            toast.error("Please login first to add product to cart");
            return { success: false, message: "User not logged in" };
        }

        const response = await fetch(SummaryApi.addToCartProduct.url, {
            method: SummaryApi.addToCartProduct.method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`  // ✅ send token
            },
            body: JSON.stringify({ productId: id })
        });

        const responseData = await response.json();

        if (responseData.success) {
            toast.success(responseData.message);
        } else {
            toast.error(responseData.message || "Failed to add to cart");
        }

        return responseData;
    } catch (error) {
        toast.error("Something went wrong while adding to cart");
        console.error("Add to Cart Error:", error.message);
        return { success: false, message: error.message };
    }
};

export default addToCart;
