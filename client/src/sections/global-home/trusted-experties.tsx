import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function TrustedExpertise() {
  return (
    <Box
      sx={{
        my: 3,
        mx: { xs: 2, sm: 4, md: 8 },
        borderRadius: 4,
        bgcolor: "#2196F3",
        p: { xs: 3, md: 6 },
        mt: 4,
        mb: 4,
        color: "#fff",
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* Left Content */}
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            {/* Label */}
            <Chip
              label="Trusted Expertise"
              sx={{
                bgcolor: "#0D1B2A",
                color: "#fff",
                fontWeight: 600,
                borderRadius: "8px",
                width: "fit-content",
              }}
            />

            {/* Title */}
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ lineHeight: 1.3 }}
            >
              Get a great deal for your <br /> tickets sell to us now
            </Typography>

            {/* Subtitle */}
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Get the best value for your vehicle with our transparent
              and straightforward selling process
            </Typography>

            {/* Checklist */}
            <Stack spacing={1.2} sx={{ mt: 2 }}>
              {[
                "Experienced Professionals You Can Trust",
                "Clear and Transparent Pricing. No Hidden Fees",
                "Effortless and Streamlined Selling Process",
              ].map((item, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircleIcon sx={{ color: "#fff", fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={500}>
                    {item}
                  </Typography>
                </Box>
              ))}
            </Stack>

            {/* Button */}
            <Button
              variant="contained"
              endIcon={<ArrowForwardIosIcon />}
              sx={{
                mt: 3,
                borderRadius: 2,
                bgcolor: "#0D1B2A",
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: "#07111C" },
                width: "fit-content",
              }}
            >
              Get Started Now
            </Button>
          </Stack>
        </Grid>

        {/* Right Side Blocks */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {["#7E57C2", "#FFB300", "#388E3C", "#E0E0E0", "#F50057", "#FF5722"].map(
              (color, i) => (
                <Grid item xs={4} key={i}>
                  <Box
                    sx={{
                      bgcolor: color,
                      height: 120,
                      borderRadius: 4,
                    }}
                  />
                </Grid>
              )
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
