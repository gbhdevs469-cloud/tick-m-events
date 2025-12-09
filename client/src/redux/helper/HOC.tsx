import { Navigate } from 'react-router-dom';

const Protected = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");

    // Check if the token exists and is not expired
    if (token && expiresAt && Date.now() < parseInt(expiresAt, 10)) {
        return children;
    }

    // Clear localStorage if the token is expired
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("expiresAt");

    return <Navigate to="/home" />;
};

export default Protected;
