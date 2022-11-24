import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

export const getToken = async () => {
  try {
    const jsonValue = await storage.getString("access_token");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const setToken = async (token) =>
  await storage.set("access_token", JSON.stringify(token));

export const removeToken = async () => {
  try {
    await storage.delete("access_token");
  } catch (e) {
    // error reading value
  }
};
