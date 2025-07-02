import axios from "axios";

export const instance = axios.create({
    baseURL: "http://192.168.0.23:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})