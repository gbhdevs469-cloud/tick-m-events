import { Box, Typography, Grid } from "@mui/material";
import { flagship } from "./utills";

export default function HowItWorks() {
  return (
    <Box sx={{ textAlign: "center", py: 8, bgcolor: "#f9f9f9" }}>
      <Box sx={{ maxWidth: "1050px", mx: "auto", px: 2 }}>
        {/* Section Header */}
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: "#000" }}>
          OUR FLAGSHIP FEATURES – All-in-one
        </Typography>
        <Typography variant="body1" sx={{ mb: 6, color: "#555" }}>
          TICK-M EVENTS gives you more than just tools.
          <br />
          It gives you the power to succeed in your events.
        </Typography>

        {/* Features Grid */}
        <Grid container spacing={4} justifyContent="center">
          {flagship.map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  borderRadius: 2,
                  boxShadow: 2,
                  p: 3,
                  height: "100%",
                  transition: "0.3s",
                  bgcolor: "#fff",
                  textAlign: "center",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{step.icon}</Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#000", mb: 1 }}
                >
                  {step.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", fontSize: "14px" }}
                >
                  {step.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
