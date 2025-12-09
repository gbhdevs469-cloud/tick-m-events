import axios from 'axios'

// for live
const instance = axios.create({
    // baseURL: import.meta.env.VITE_LOCAL_LIVE_URL || 'https://tick-m-events-server.onrender.com/api/v1',
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// ✅ REQUEST INTERCEPTOR – CHECK expiresAt INSTEAD OF JWT exp
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        const expiresAt = localStorage.getItem("expiresAt");

        if (token && expiresAt) {
            const isExpired = Date.now() > Number(expiresAt);

            if (isExpired) {
                // ✅ Token expired → force logout
                localStorage.clear();
                window.location.href = "/sign-in";
                return Promise.reject(new Error("Session expired"));
            }

            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR – HANDLE 401 GLOBALLY
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.clear();
            window.location.href = "/sign-in";
        }
        return Promise.reject(error);
    }
);

export default instance;