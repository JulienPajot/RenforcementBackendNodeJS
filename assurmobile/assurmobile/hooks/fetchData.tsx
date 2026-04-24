import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default async function fetchData(path: string, method: string, body?: Object, useToken?: boolean) {
    const token = useToken ? await AsyncStorage.getItem("token") : null;
    const endpoint = `https://snare-recycled-online.ngrok-free.dev/${path}`;

    const isFormData = body instanceof FormData;

    const headers: Record<string, string> = {
        "ngrok-skip-browser-warning": "true",
    };

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    if (useToken && token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(endpoint, {
        method,
        headers,
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    }).then(response => {
        if (response.status === 401 || response.status === 403) {
            AsyncStorage.removeItem("token");
            router.push("/login");
            return null;
        }
        return response.json();
    }).catch(error => {
        console.error("Fetch error:", error);
        return null;
    });
}