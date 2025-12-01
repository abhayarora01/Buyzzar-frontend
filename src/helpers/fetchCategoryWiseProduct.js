import SummaryApi from "../common";

const fetchCategoryWiseProduct = async (category) => {
  try {
    // Get token from localStorage
    const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

    // Skip if category is empty
    if (!category || (Array.isArray(category) && category.length === 0)) {
      return { data: [] };
    }

    // Convert category to string if array
    const categoryPayload = Array.isArray(category) ? category[0] : category;

    const response = await fetch(SummaryApi.categoryWiseProduct.url, {
      method: SummaryApi.categoryWiseProduct.method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // send token if available
      },
      body: JSON.stringify({ category: categoryPayload }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const dataResponse = await response.json();
    return dataResponse;
  } catch (error) {
    console.error("Error fetching category-wise product:", error.message);
    return { data: [], error: error.message };
  }
};

export default fetchCategoryWiseProduct;
