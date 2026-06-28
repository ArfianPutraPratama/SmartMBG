import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://smartmbg-backend-git-main-fians-projects-ae029f5d.vercel.app/api', // URL backend Laravel
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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
