import { useEffect, useState } from "react";
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockIcon from '@mui/icons-material/Lock';
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { DashboardContent } from "src/layouts/dashboard";

export function PasswordRecoveryView() {
    const [method, setMethod] = useState("email");
    const [input, setInput] = useState("");
    const [error, setError] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showResetBox, setShowResetBox] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only("xs"));

    // Check for token in URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("token")) {
            setShowResetBox(true);
        }
    }, []);

    const handleSend = () => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
        const isPhone = /^\d{10,15}$/.test(input);

        if ((method === "email" && !isEmail) || (method === "sms" && !isPhone)) {
            setError(true);
            setSubmitted(false);
        } else {
            setError(false);
            setSubmitted(true);
         
        }
    };

    const handleResetPassword = () => {
        if (!newPassword || newPassword !== confirmPassword) {
            alert("Passwords do not match or are empty.");
            return;
        }

        alert("Password reset successfully (simulated)");
        setShowResetBox(false);
    };

    if (showResetBox) {
        // ✅ Reset Password View
        return (
            <DashboardContent>
                <Box
                    width="100%"
                    mx="auto"
                    mt={8}
                    p={3}
                    border="2px solid #ccc"
                    borderRadius="12px"
                >
                    <Typography variant="h6" mb={2}>
                        Reset Your Password
                    </Typography>
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleResetPassword}
                        sx={{
                            backgroundColor: "#0A2B4A",
                            color: "white",
                            textTransform: "none",
                            py: 1.5,
                            borderRadius: "20px",
                            "&:hover": {
                                backgroundColor: "#093049",
                            },
                        }}
                    >
                        Submit New Password
                    </Button>
                </Box>
            </DashboardContent>
        );
    }

    return (
        <DashboardContent>
            {/* Box 1 - Choose Method */}
            <Box width="100%" mx="auto" mt={3} p={3} border="2px solid #ccc" borderRadius="12px">
                <Typography variant="h6">Recover your account</Typography>
                <Typography variant="body1" mb={3}>
                    Enter your email or phone number. We’ll send you a reset link.
                </Typography>

                <FormControl fullWidth>
                    <RadioGroup
                        value={method}
                        onChange={(e) => {
                            setMethod(e.target.value);
                            setError(false);
                            setInput("");
                            setSubmitted(false);
                        }}
                    >
                        <FormControlLabel
                            value="email"
                            control={<Radio sx={{ color: "#0A2B4A", "&.Mui-checked": { color: "#0A2B4A" } }} />}
                            label="Receive via Email"
                        />
                        <FormControlLabel
                            value="sms"
                            control={<Radio sx={{ color: "#0A2B4A", "&.Mui-checked": { color: "#0A2B4A" } }} />}
                            label="Receive via SMS"
                        />
                    </RadioGroup>
                </FormControl>

                <TextField
                    fullWidth
                    placeholder={method === "email" ? "example@email.com" : "Enter phone number"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    error={error}
                    helperText={
                        error
                            ? method === "email"
                                ? "Invalid email address"
                                : "Invalid phone number"
                            : " "
                    }
                    sx={{
                        mt: 2,
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                        },
                    }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSend}
                    sx={{
                        backgroundColor: "#0A2B4A",
                        color: "white",
                        textTransform: "none",
                        paddingY: "12px",
                        borderRadius: "20px",
                        "&:hover": {
                            backgroundColor: "#093049",
                        },
                    }}
                >
                    Send Recovery Link
                </Button>
            </Box>

            {/* Box 2 - Confirmation */}
            {submitted && (
                <Box width="100%" mx="auto" mt={3} p={3} border="1px solid #ccc" borderRadius="12px">
                    <Typography color="green" fontWeight="bold" display="flex" alignItems="center" mb={1}>
                        <CheckCircleIcon sx={{ color: "green", mr: 1 }} />
                        A reset link has been sent to your {method}.
                    </Typography>
                    <Typography mb={2}>
                        Check your inbox or SMS and follow the instructions.
                    </Typography>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: "#0A2B4A",
                            color: "white",
                            textTransform: "none",
                            py: 1.5,
                            borderRadius: "20px",
                            "&:hover": {
                                backgroundColor: "#093049",
                            },
                        }}
                    >
                        Resend Link
                    </Button>
                </Box>
            )}

            {/* Box 3 - Reset Password (conditionally shown if token in URL) */}
            {showResetBox && (
                <Box width="100%" mx="auto" mt={3} p={3} border="2px solid #ccc" borderRadius="12px">
                    <Typography variant="h6" mb={2}>
                        Reset Your Password
                    </Typography>
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleResetPassword}
                        sx={{
                            backgroundColor: "#0A2B4A",
                            color: "white",
                            textTransform: "none",
                            py: 1.5,
                            borderRadius: "20px",
                            "&:hover": {
                                backgroundColor: "#093049",
                            },
                        }}
                    >
                        Submit New Password
                    </Button>
                </Box>
            )}
            <Box
                width="100%"
                mx="auto"
                mt={3}
                p={3}
                border="2px solid #ccc"
                borderRadius="12px"
            >
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Security & Recommendations{" "}
                    <LockIcon sx={{ color: "#f1c40f", verticalAlign: "middle" }} />
                </Typography>

                <Box display="flex" alignItems="center" mb={2}>
                    <ShieldOutlinedIcon sx={{ color: "#0E028E", mr: 1, fontSize: 16 }} />
                    <Typography fontSize="16px" fontWeight="500">
                        Use a unique and secure password.
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                    <PersonOffOutlinedIcon sx={{ color: "#FF4B4B", mr: 1, fontSize: 16 }} />
                    <Typography fontSize="16px" fontWeight="500">
                        Never share your password with anyone.
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                    <LockOutlinedIcon sx={{ color: "#00C853", mr: 1, fontSize: 16 }} />
                    <Typography fontSize="16px" fontWeight="500">
                        Enable two-factor authentication for added security.
                    </Typography>
                </Box>
            </Box>
        </DashboardContent>
    );
}
