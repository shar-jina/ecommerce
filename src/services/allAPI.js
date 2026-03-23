import commonAPI from "./commonAPI";
import SERVER_URL from "./serverurl";



export const registerAPI=async(reqbody)=>{
    return await commonAPI("POST",`${SERVER_URL}/api/auth/register`,reqbody,)



}
export const verifyOTPAPI=async(reqbody)=>{
    return await commonAPI("POST",`${SERVER_URL}/api/auth/verify-otp`,reqbody,)
}
export const loginAPI=async(reqbody)=>{
    return await commonAPI("POST",`${SERVER_URL}/api/auth/login`,reqbody,)
}

// Product Management
export const addProductAPI = async (product, header) => {
    return await commonAPI("POST", `${SERVER_URL}/api/products/add`, product, header);
}

export const getProductsAPI = async () => {
    return await commonAPI("GET", `${SERVER_URL}/api/products`, "", "");
}

export const deleteProductAPI = async (id, header) => {
    return await commonAPI("DELETE", `${SERVER_URL}/api/products/${id}`, {}, header);
}

export const updateProductAPI = async (id, product, header) => {
    return await commonAPI("PUT", `${SERVER_URL}/api/products/${id}`, product, header);
}

// Order Management
export const placeOrderAPI = async (orderData, header) => {
    return await commonAPI("POST", `${SERVER_URL}/api/orders`, orderData, header);
}

export const getUserOrdersAPI = async (header) => {
    return await commonAPI("GET", `${SERVER_URL}/api/orders/user`, "", header);
}

export const getAllOrdersAPI = async (header) => {
    return await commonAPI("GET", `${SERVER_URL}/api/orders/all`, "", header);
}

export const updateOrderStatusAPI = async (id, status, header) => {
    return await commonAPI("PUT", `${SERVER_URL}/api/orders/status/${id}`, status, header);
}

// Posts API
export const addPostAPI = async (reqBody, reqHeader) => {
    return await commonAPI("POST", `${SERVER_URL}/api/posts/add`, reqBody, reqHeader);
};

export const getPostsAPI = async () => {
    return await commonAPI("GET", `${SERVER_URL}/api/posts`, "", "");
};

export const updatePostAPI = async (id, reqBody, reqHeader) => {
    return await commonAPI("PUT", `${SERVER_URL}/api/posts/${id}`, reqBody, reqHeader);
};

export const deletePostAPI = async (id, reqHeader) => {
    return await commonAPI("DELETE", `${SERVER_URL}/api/posts/${id}`, {}, reqHeader);
};

// Notifications API
export const addNotificationAPI = async (notification, header) => {
    return await commonAPI("POST", `${SERVER_URL}/api/notifications`, notification, header);
}

export const getNotificationsAPI = async () => {
    return await commonAPI("GET", `${SERVER_URL}/api/notifications`, "", "");
}

export const deleteNotificationAPI = async (id, header) => {
    return await commonAPI("DELETE", `${SERVER_URL}/api/notifications/${id}`, {}, header);
}
