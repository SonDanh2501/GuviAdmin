import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("access_token");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const setToken = async (token) =>
  await AsyncStorage.setItem("access_token", JSON.stringify(token));

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("access_token");
  } catch (e) {
    // error reading value
  }
};
