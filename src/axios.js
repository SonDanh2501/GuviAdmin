import axios from "axios";
// import config from './config';

const axiosClient = axios.create({
	baseURL: "http://localhost:5000",
	// withCredentials: true
});

axiosClient.interceptors.response.use((response) => {
	// Thrown error for request with OK status code
	const { data } = response;
	return response.data;

});

export default axiosClient;



