import {
  Box, Grid, Typography, TextField, Button, IconButton, Tooltip, Alert,
  Snackbar, AlertColor
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { Iconify } from "../iconify";
import { SubscriptionModal } from "../modal/SubscriptionModal";
import axios from '../../redux/helper/axios'
import { TermsOfUseModal } from "../modal/TermsOfUseModal";
import { PrivacyPolicyModal } from "../modal/PrivacyPolicyModal";

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(''); // 'success' or 'error'
  const [modalMessage, setModalMessage] = useState('');
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const validateEmail = (emaila: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emaila);
  };

  const handleSubscribe = async () => {
    // Validate email
    if (!email.trim()) {
      showSnackbar('Please enter your email address', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showSnackbar('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/subs/subscribe', { email });

      if (response.data.success) {
        setModalStatus('success');
        setModalMessage(response.data.message);
        setModalOpen(true);
        setEmail(''); // Clear input
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Subscription failed. Please try again.';

      setModalStatus('error');
      setModalMessage(errorMessage);
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: AlertColor = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  const handleCloseTermsModal = () => {
    setTermsModalOpen(false);
  };

  const handleClosePrivacyModal = () => {
    setPrivacyModalOpen(false);
  };

  const handleLinkClick = (linkName: string, e: React.MouseEvent) => {
    switch (linkName) {
      case "FAQ":
        e.preventDefault();
        navigate('/about-us', { state: { scrollTo: 'faq' } });
        break;
      case "Blog":
        e.preventDefault();
        navigate('/home', { state: { scrollTo: 'blog' } });
        break;
      case "Terms of Use":
        e.preventDefault();
        setTermsModalOpen(true);
        break;
      case "Privacy Policy":
        e.preventDefault();
        setPrivacyModalOpen(true);
        break;
      default:
        // Allow normal navigation for other links
        break;
    }
  };
  return (
    <Box sx={{ bgcolor: "#0d0d0d", color: "#fff", mt: 6, pt: 6, pb: 3, px: { xs: 3, md: 8 } }}>
      <Grid container spacing={4} justifyContent="space-around" alignItems="center">
        {/* Newsletter Section */}
        <Grid item xs={12} md={5}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Receive the best events and news every week
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              variant="outlined"
              placeholder="Enter your email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              error={!!email && !validateEmail(email)}
              helperText={email && !validateEmail(email) ? "Please enter a valid email" : ""}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: "gray" }} />,
                sx: {
                  bgcolor: "#fff",
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSubscribe}
              disabled={loading || !email || !validateEmail(email)}
              sx={{
                bgcolor: "#002D5B",
                borderRadius: 2,
                px: 3,
                textTransform: "none",
                '&:disabled': {
                  bgcolor: 'grey.400'
                }
              }}
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </Box>
        </Grid>
        {/* Subscription Modal */}
        <SubscriptionModal
          open={modalOpen}
          onClose={handleCloseModal}
          status={modalStatus}
          message={modalMessage}
        />

        <TermsOfUseModal
          open={termsModalOpen}
          onClose={handleCloseTermsModal}
        />

        <PrivacyPolicyModal
          open={privacyModalOpen}
          onClose={handleClosePrivacyModal}
        />

        {/* Snackbar for quick messages */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        {/* Payment Methods */}
        <Grid item xs={12} md={5}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2, textAlign: { xs: "left", md: "right" } }}>
            Our Payment Methods
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: { xs: "flex-start", md: "flex-end" },
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Fapshi */}
            <Box
              component="img"
              src="/assets/images/payment-gateway-logo/fapshi.png"
              alt="Mobile Money"
              sx={{ height: 40 }}
            />
            {/* Mtn */}
            <Box
              component="img"
              src="/assets/images/payment-gateway-logo/mobile-money.png"
              alt="PayPal"
              sx={{ height: 40 }}
            />
            {/* Orange */}
            <Box
              component="img"
              src="/assets/images/payment-gateway-logo/orange-money.png"
              alt="PayPal"
              sx={{ height: 40 }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Footer Links */}
      <Grid container spacing={4} sx={{ mt: 6 }} justifyContent="space-around">
        <Grid item xs={12} md={3}>
          <Typography fontWeight={700} sx={{ mb: 2 }}>
            Tick-m events
          </Typography>
          <Typography variant="body2">Douala - Nyalla Cobblestone Street, before the ZZ Hotel.</Typography>
          {/* <Typography variant="body2" sx={{ mt: 1 }}>Hours: 8:00 - 17:00, Mon - Sat</Typography> */}
          <Typography
            variant="body2"
            component="a"
            href="mailto:tickmevents@gmail.com?subject=Inquiry&body=Hello, I would like to know more about..."
            sx={{
              mt: 1,
              display: "block",
              textDecoration: "none",
              color: "inherit",
              "&:hover": {
                color: "primary.main",
                textDecoration: "underline"
              }
            }}
          >
            tickmevents@gmail.com
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Need help? Call us <br />
            <>
              <Typography
                component="a"
                href="tel:+237 697 182 551"
                sx={{ color: "primary.main", fontWeight: 600, mr: 1 }}
              >
                +237 697 182 551
              </Typography>
            </>

          </Typography>
        </Grid>

        {[
          {
            title: "Company",
            links: [
              { name: "About Us", path: "/about-us" },
              { name: "Blog", path: "#" },
              { name: "FAQ", path: "/about-us#faq" },
              { name: "Terms of Use", path: "#" },
              { name: "Privacy Policy", path: "#" },
              { name: "Contact", path: "/contact-us" }
            ]
          },
          {
            title: "Support",
            links: [
              { name: "Help Center", path: "/contact-us" },
              { name: "How it works", path: "/about-us" },
            ]
          },
        ].map((section, idx) => (
          <Grid item xs={6} md={2} key={idx}>
            <Typography fontWeight={700} sx={{ mb: 2 }}>
              {section.title}
            </Typography>
            {section.links.map((link, i) => (
              <Typography
                key={i}
                component={Link}
                to={link.path}
                variant="body2"
                onClick={(e) => handleLinkClick(link.name, e)}
                sx={{
                  mb: 1,
                  cursor: "pointer",
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": { color: "primary.main" }
                }}
              >
                {link.name}
              </Typography>
            ))}
          </Grid>
        ))}
      </Grid>

      {/* Bottom Bar */}
      <Box
        sx={{
          borderTop: "1px solid rgba(255,255,255,0.2)",
          mt: 6,
          pt: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Typography variant="body2" color="gray">
          © 2025 Tick-M Inc. All rights Reserved.
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Email */}
          <Tooltip title="Email: tickmevents@gmail.com">
            <IconButton
              sx={{ color: "#fff" }}
              onClick={() => window.open('mailto:tickmevents@gmail.com')}
            >
              <Iconify width={24} icon="ic:outline-email" />
            </IconButton>
          </Tooltip>

          {/* Fax */}
          <Tooltip title="Fax: +237 652 590 797">
            <IconButton
              sx={{ color: "#fff" }}
              onClick={() => window.open('tel:+237652590797', '_blank')}
            >
              <Iconify width={24} icon="emojione-monotone:fax-machine" />
            </IconButton>
          </Tooltip>

          {/* WhatsApp */}
          <Tooltip title="WhatsApp: +237 697 182 551">
            <IconButton
              sx={{ color: "#fff" }}
              onClick={() => window.open('https://wa.me/237697182551', '_blank')}
            >
              <Iconify width={24} icon="ic:baseline-whatsapp" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}