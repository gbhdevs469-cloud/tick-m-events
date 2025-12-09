import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Stack,
} from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const featuresLeft = [
  'Expert Certified Staff',
  'Get Reasonable Price',
  'Genuine Sellers',
];

const featuresRight = [
  'First Class Services',
  '24/7 Customer assistance',
  'Free Pick-Up & Drop-Off',
];

export default function LiveEventPromo() {
  return (
    <Paper
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        p: 3,
        mt: 4,
        mb: 4,
        backgroundColor: '#f9f9f9',
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* Left Column - Image with Play Button */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              width: '100%',
              aspectRatio: '1 / 1',
              backgroundImage: 'url(assets/home-global-img/dicover.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '50%',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlayCircleIcon sx={{ fontSize: 40, color: '#333' }} />
            </Box>
          </Box>
        </Grid>

        {/* Right Column - Text Content */}
        <Grid item xs={12} md={6}>
          <Box>
            <Button
              variant="contained"
              sx={{
                mb: 2,
                borderRadius: 20,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: 14,
                backgroundColor: '#0d1b2a',
                '&:hover': { backgroundColor: '#1b263b' },
              }}
            >
              Best Live Events In Town
            </Button>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Discover and book tickets to the Live events Near You.
            </Typography>

            <Typography color="text.secondary" mb={3}>
              We are committed to delivering exceptional service, competitive pricing, and a diverse selection of options for our customers.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  {featuresLeft.map((feature) => (
                    <Box key={feature} display="flex" alignItems="center">
                      <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                      <Typography>{feature}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  {featuresRight.map((feature) => (
                    <Box key={feature} display="flex" alignItems="center">
                      <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                      <Typography>{feature}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
