import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000"
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD



export const getUsers = async()=>{
    return await axios.get(`${BASE_URL}admin/users/${ADMIN_PASSWORD}`)
}

export const getSettings = async()=>{
    return await axios.get(`${BASE_URL}admin/settings/${ADMIN_PASSWORD}`)
}

export const updateSetting = async(apiKey,key, value)=>{
    return await axios.put(`${BASE_URL}admin/settings/${ADMIN_PASSWORD}`,{apiKey,key,value})
}

export const switchUser = async(userId,blocked)=>{
    return await axios.post(`${BASE_URL}admin/users/${ADMIN_PASSWORD}/${userId}/blockUnblock`,{blocked})
}