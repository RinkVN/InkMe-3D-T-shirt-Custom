import axios from "axios";
// require('dotenv/config');

export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await axios.get(process.env.REACT_APP_BASE_URL + url );
        return data;
    } catch (error) {
        console.log('API fetch error:', error);
        return error;
    }
}


export const postData = async (url, formData) => {
    try {
        const response = await fetch(process.env.REACT_APP_BASE_URL + url, {
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
        const { res } = await axios.put(`${process.env.REACT_APP_BASE_URL}${url}`, updatedData);
        return res
    } catch (error) {
        console.log('API edit error:', error);
        return error;
    }
}

export const deleteData = async (url) => {
    try {
        const { res } = await axios.delete(`${process.env.REACT_APP_BASE_URL}${url}`);
        return res
    } catch (error) {
        console.log('API edit error:', error);
        return error;
    }
}

export const uploadImage = async (url, formData) => {
    try {
        const { res } = await axios.post(process.env.REACT_APP_BASE_URL + url, formData);
        return res
    } catch (error) {
        console.log('API edit error:', error);
        return error;
    }
}

export const deleteImages = async (url, image) => {
    const { res } = await axios.delete(`${process.env.REACT_APP_BASE_URL}${url}`, image);
    return res
}

