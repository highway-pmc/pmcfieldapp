import { Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export default class NetworkUtils {
    static async isNetworkAvailable() {
        if (Platform.OS === "android" ) {
            // For Android devices
            const response = await NetInfo.fetch();
            return response.isInternetReachable;
        } else {
            // For iOS devices
            const unsubscribe = NetInfo.addEventListener(state => {
                unsubscribe();
                return state.isInternetReachable;
            });
        }
    }
}