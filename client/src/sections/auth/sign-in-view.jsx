// SignInView.jsx
import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { InputAdornment, Typography, IconButton, TextField, Button, Grid, Box, Link } from '@mui/material';
import { toast } from 'react-toastify';
import LoadingButton from '@mui/lab/LoadingButton';

import { Iconify } from 'src/components/iconify';
import { login } from 'src/redux/actions';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';
import { ForgotPasswordModal } from 'src/components/modal/reset-password-modal';

// ----------------------------------------------------------------------

export function SignInView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [active, setActive] = useState("google");
  const { authenticate } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    email: 'organizer.rabada12@gmail.com',
    password: 'Nitin@123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignIn = useCallback(async (event) => {
    event.preventDefault();
    const result = await dispatch(login(formData));

    if (result.status === 200) {
      toast.success(result?.message);

      // Check for pending purchase
      const pendingPurchase = sessionStorage.getItem('pendingPurchase');
      if (pendingPurchase) {
        const purchaseData = JSON.parse(pendingPurchase);
        navigate(purchaseData.redirectTo);
      }
      const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');
      if (redirectAfterLogin) {
        const redirectData = JSON.parse(redirectAfterLogin);
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectData.redirectTo);
        return;
      }
      // If user came from BUY (redirect URL), send them back
      // Example after login success
      const redirect = searchParams.get('redirect');
      if (redirect) {
        window.location.href = decodeURIComponent(redirect);
      } else {
        window.location.href = '/';
      }
      // Otherwise go to home
      navigate('/');

    } else {
      toast.error(result?.message);
    }
  }, [formData, dispatch, navigate, searchParams]);

  useEffect(() => {
    if (authenticate) {
      navigate("/", { replace: true });
    }
  }, [authenticate, navigate]);

  const renderForm = (
    <>
      <HeadingCommon variant="h4" title="Welcome back" weight={600} mb={2} />

      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        sx={{
          position: 'relative',
          left: 0,
          opacity: 1,
          transition: 'all 0.3s ease',
          width: '100%'
        }}
      >
        <TextField
          fullWidth
          required
          name="email"
          type='email'
          label="Email address"
          placeholder='Email / Username'
          value={formData.email}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          required
          name="password"
          placeholder='********'
          label="Password"
          value={formData.password}
          onChange={handleChange}
          type={showPassword ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="body2">
          <Link
            component="button"
            type="button"
            onClick={handleOpenModal}
            sx={{
              ml: 0.5,
              textDecoration: 'none',
              color: 'primary.main',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Forgot Password?
          </Link>
        </Typography>
        <LoadingButton
          sx={{ mt: 3 }}
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
        >
          Sign in
        </LoadingButton>

      </Box>
    </>
  );

  return (
    <Grid container sx={{ minHeight: "50vh" }}>
      {/* Left image (hide on xs/sm) */}
      <Grid
        item
        xs={0}
        md={6}
        sx={{
          display: { xs: "none", md: "block" },
          backgroundImage: `url('./assets/images/login-banner.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Right content */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }} textAlign="center">
          <Button size="small" variant="h6" fontWeight={600} mb={2} sx={{ backgroundColor: "#1F8FCD", color: "white" }}>
            Sign In
          </Button>
          <form encType='multipart/form-data' onSubmit={handleSignIn}>
            {renderForm}
          </form>

          <Typography variant="body2" my={2}>
            Don&apos;t have an account?
            <Link
              component={RouterLink}
              to="/register"
              sx={{
                ml: 0.5,
                textDecoration: 'none',
                color: 'primary.main',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Register Here!
            </Link>
          </Typography>
        </Box>
      </Grid>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal open={openModal} onClose={handleCloseModal} />
    </Grid>
  );
}