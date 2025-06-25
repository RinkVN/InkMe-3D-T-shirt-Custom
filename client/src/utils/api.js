import axios from "axios";
// require('dotenv/config');

export const baseUrl = import.meta.env.VITE_APP_BASE_URL;

export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await axios.get(baseUrl + url);
        return data;
    } catch (error) {
        console.log('API fetch error:', error);
        return error;
    }
}


export const postData = async (url, formData) => {
    try {
        const response = await fetch(baseUrl + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            return errorData;
        }
    } catch (error) {
        console.log('API edit error:', error);
        return error;
    }
}


export const editData = async (url, updatedData) => {
    try {
        const res = await fetch(`${baseUrl}${url}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        const result = await res.json();
        if (!res.ok) {
            return { error: true, ...result };
        }
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
};

export const deleteData = async (url) => {
    try {
        const response = await axios.delete(`${baseUrl}${url}`);
        return response.data;
    } catch (error) {
        console.log('API delete error:', error);
        if (error.response) {
            return error.response.data;
        }
        return {
            error: true,
            message: "Network error",
            notify: error.message
        };
    }
}

export const uploadImage = async (url, formData) => {
    try {
        const { res } = await axios.post(baseUrl + url, formData);
        return res
    } catch (error) {
        console.log('API edit error:', error);
        return error;
    }
}

export const deleteImages = async (url, image) => {
    const { res } = await axios.delete(`${baseUrl}${url}`, image);
    return res
}