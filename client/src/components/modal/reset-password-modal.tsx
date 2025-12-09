import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  CircularProgress,
  Paper,
  Alert,
  Modal,
  Typography,
  TextField,
  Button,
  Box
} from '@mui/material';
import { AppDispatch } from 'src/redux/store';
import { resetPassword, sendResetCode, verifyResetCode } from 'src/redux/actions';
import { modalStyle } from 'src/sections/auth/utils';


// ----------------------------------------------------------------------

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormErrors {
  email?: string;
  resetCode?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface ResetResponse {
  status: number;
  message?: string;
  error?: string;
}

export function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [step, setStep] = useState<number>(1); // 1: email, 2: code verification, 3: new password
  const [email, setEmail] = useState<string>('');
  const [resetCode, setResetCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleClose = (): void => {
    onClose();
    setStep(1);
    setEmail('');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    setError(null);
    setMessage('');
  };

  const validateEmail = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCode = (): boolean => {
    const newErrors: FormErrors = {};
    if (!resetCode) {
      newErrors.resetCode = 'Reset code is required';
    } else if (resetCode.length !== 6) {
      newErrors.resetCode = 'Code must be 6 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (): boolean => {
    const newErrors: FormErrors = {};
    if (!newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setMessage('');

    if (validateEmail()) {
      const response = await dispatch(sendResetCode(email)) as ResetResponse;
      if (response.status === 200) {
        setTimeout(() => {
          setStep(2);
        }, 2000);
        setLoading(false);
        setMessage(response.message || 'Code sent successfully');
        setError(null);
      } else {
        setLoading(false);
        setError(response.error || 'Failed to send code');
      }
    } else {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setMessage('');

    if (validateCode()) {
      const response = await dispatch(verifyResetCode(email, resetCode)) as ResetResponse;
      if (response.status === 200) {
        setTimeout(() => {
          setStep(3);
        }, 2000);
        setLoading(false);
        setMessage(response.message || 'Code verified successfully');
        setError(null);
      } else {
        setLoading(false);
        setError(response.error || 'Invalid verification code');
        setMessage('');
      }
    } else {
      setLoading(false);
    }
  };

  const handleResetPassword = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setMessage('');

    if (validatePassword()) {
      const response = await dispatch(resetPassword(email, resetCode, newPassword)) as ResetResponse;
      if (response.status === 200) {
        setTimeout(() => {
          handleClose();
        }, 2000);
        setLoading(false);
        setMessage(response.message || 'Password reset successfully');
      } else {
        setLoading(false);
        setError(response.error || 'Failed to reset password');
        setMessage('');
      }
    } else {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handleResetCodeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6));
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(e.target.value);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper sx={modalStyle}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        {step === 1 && (
          <>
            <Typography variant="h6" gutterBottom>
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Enter your email address and we&apos;ll send you a verification code.
            </Typography>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={handleSendCode}
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Send Code'}
              </Button>
            </Box>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="h6" gutterBottom>
              Enter Verification Code
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              We&apos;ve sent a 6-digit code to {email}. Please check your email.
            </Typography>
            <TextField
              fullWidth
              label="Verification Code"
              value={resetCode}
              onChange={handleResetCodeChange}
              error={!!errors.resetCode}
              helperText={errors.resetCode}
              margin="normal"
              inputProps={{ maxLength: 6 }}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button onClick={() => setStep(1)}>Back</Button>
              <Button
                onClick={handleVerifyCode}
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Verify Code'}
              </Button>
            </Box>
          </>
        )}

        {step === 3 && (
          <>
            <Typography variant="h6" gutterBottom>
              Set New Password
            </Typography>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              margin="normal"
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button onClick={() => setStep(2)}>Back</Button>
              <Button
                onClick={handleResetPassword}
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Modal>
  );
}