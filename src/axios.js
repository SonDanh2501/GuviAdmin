import axios from "axios";
// import config from './config';

const axiosClient = axios.create({
	baseURL: 'https://guvico-be.herokuapp.com',
	// withCredentials: true
});

axiosClient.interceptors.response.use((response) => {
	// Thrown error for request with OK status code
	const {
		data
	} = response;
	return response.data;

});

export default axiosClient;