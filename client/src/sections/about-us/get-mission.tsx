import {
  Box,
  Grid,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function GetMission() {
  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 8 }, py: { xs: 6, md: 10 } }}>
      <Grid container spacing={6} alignItems="center">
        {/* Left Content */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* Small Badge */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#0d2a4d",
                color: "white",
                borderRadius: 3,
                px: 3,
                py: 1,
                mb: 2,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Our Mission
            </Button>

            {/* Title */}
            <Typography
              variant="h4"
              fontWeight={700}
              mb={2}
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.2rem" },
                lineHeight: 1.3,
              }}
            >
              Book Your Best Events Or Sell Your Events Tickets Easily
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              color="text.secondary"
              mb={3}
              sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
            >
              Our mission is to make car rental easy, accessible, and affordable
              for everyone. We believe that renting a car should be a hassle-free
              experience, and we&apos;re dedicated to ensuring that every customer
              finds the perfect vehicle for their journey.
            </Typography>

            {/* Features */}
            <Stack spacing={2} mb={4}>
              {[
                "Explore a wide range of flexible rental options to suit your needs",
                "Comprehensive insurance coverage for complete peace of mind",
                "24/7 customer support for assistance anytime, anywhere",
              ].map((item, index) => (
                <Box key={index} display="flex" alignItems="center" gap={1}>
                  <CheckCircleIcon sx={{ color: "#0d9c4d" }} />
                  <Typography variant="body1">{item}</Typography>
                </Box>
              ))}
            </Stack>

            {/* CTA Button */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#0d2a4d",
                borderRadius: 2,
                px: 3,
                py: 1.2,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#0b223e" },
              }}
              endIcon={<ArrowForwardIcon />}
            >
              Get Started Now
            </Button>
          </Box>
        </Grid>

        {/* Right Images */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {[
              "/assets/images/about/image (2).png",
              "/assets/images/about/image.png",
              "/assets/images/about/image (3).png",
              "/assets/images/about/Frame 1000004870.png",
            ].map((img, index) => (
              <Grid item xs={6} key={index}>
                <Box
                  component="img"
                  src={img}
                  alt="Event"
                  sx={{
                    width: "100%",
                    borderRadius: 3,
                    boxShadow: 2,
                    objectFit: "cover",
                    height: { xs: 140, sm: 180, md: img[0]?300:200 },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
