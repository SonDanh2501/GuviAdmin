import axiosClient from "../axios";

export const googlePlaceAutocomplete = (value) => {
  return axiosClient.get(`/google_map/auto_complete?input=${value}`);
};

export const getPlaceDetailApi = (id) => {
  return axiosClient.get(`/google_map/place_detail?place_id=${id}`);
};
