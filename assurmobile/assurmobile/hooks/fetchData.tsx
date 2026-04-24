import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default async function fetchData(path: string, method:string,body?:Object,useToken?:boolean) {
    const token = useToken ? await AsyncStorage.getItem("token") : null;
    const endpoint = `https://snare-recycled-online.ngrok-free.dev/${path}`;
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
    };
    if (useToken && token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(endpoint, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    }).then(response => {
        if(response.status === 401 || response.status === 403) {
            console.log("Unauthorized, logging out...");
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