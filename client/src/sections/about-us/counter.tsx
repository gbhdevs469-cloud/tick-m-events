import { Box, Grid, Typography } from "@mui/material";

export default function StatsSection() {
  const stats = [
    { value: "45+", label: "Global Branches" },
    { value: "29K", label: "Destinations Collaboration" },
    { value: "20+", label: "Years Experience" },
    { value: "168K", label: "Happy Customers" },
    { value: "90M", label: "Visitors Per day" },
  ];

  return (
    <Box
      sx={{
        bgcolor: "#2196f3", // 🔹 Blue background
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 6 },
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {stats.map((stat, index) => (
          <Grid
            item
            xs={6}   // 🔹 2 per row on mobile
            sm={4}   // 🔹 3 per row on tablets
            md={2.4} // 🔹 5 equal columns on desktop
            key={index}
          >
            <Box textAlign="center">
              <Typography
                variant="h4"
                fontWeight={700}
                color="white"
                sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="body2"
                color="white"
                sx={{
                  fontSize: { xs: "0.85rem", md: "1rem" },
                  lineHeight: 1.4,
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
