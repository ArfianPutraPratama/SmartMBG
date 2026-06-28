import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://8fb6-182-8-68-206.ngrok-free.app/api', // URL backend Laravel
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': '69420'
    },
    withCredentials: true, // Dibutuhkan jika backend menggunakan Sanctum stateful authentication (cookie)
});

// Anda bisa menambahkan interceptor di sini jika perlu (misalnya untuk menyisipkan token)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
