import axios from 'axios';

export const axiosInstance = axios.create({})

export const apiConnector = (method, url, bodyData, headers = {}, params = {}) => {
    return axiosInstance({
    method: method,
    url: url,
    data: bodyData || null,
    headers: headers,   // ✅ always pass an object, even if empty
    params: params
    })

}