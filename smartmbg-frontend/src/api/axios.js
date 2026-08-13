import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api', // Menggunakan proxy Vercel untuk menghindari CORS
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
