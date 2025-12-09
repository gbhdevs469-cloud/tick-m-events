import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, IconButton, Chip, useTheme, } from "@mui/material";
import {
  ArrowBackIos, LaptopMac,
  ArrowForwardIos,
  LocationOn,
  AccessTime,
  Event,
  Star,
} from "@mui/icons-material";
import { Link } from "react-router-dom";


export default function UpcomingEvents({ title, des, filterdEvent, loading }: any) {
  const theme = useTheme();


  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        px: { xs: 2, sm: 4, md: 8 },
        py: { xs: 6, md: 10 },
        bgcolor: "background.default",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: { xs: 4, md: 6 },
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {des}
          </Typography>
        </Box>

        {/* small nav arrows like screenshot */}
        <Box>
          <IconButton
            aria-label="prev"
            size="small"
            sx={{
              bgcolor: "background.paper",
              border: `1px solid ${theme.palette.divider}`,
              mr: 1,
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="next"
            size="small"
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Grid of cards */}

      {loading ? (
        <Typography>Loading events...</Typography>
      ) : !filterdEvent?.length ? (
        <Typography>No upcoming events found</Typography>
      ) : (
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {filterdEvent.map((ev: any,index:any) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* Image */}
                <Box
                  sx={{
                    position: "relative",
                    height: { xs: 180, sm: 200, md: 220 },
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={ev.coverImage?.url}
                    alt={ev.eventName}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <Chip
                    icon={<Star sx={{ fontSize: 16 }} />}
                    label={`${ev.averageRating} (${ev.reviewCount} reviews)`}
                    size="small"
                    sx={{
                      position: "absolute",
                      right: 12,
                      top: 12,
                      bgcolor: "background.paper",
                      boxShadow: 2,
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {/* Content */}
                <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {ev.eventName}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary", mt: 0.5 }}>
                    <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {ev.location}
                    </Typography>
                  </Box>

                  {/* Details */}
                  <Grid container spacing={1} sx={{ mt: 2, color: "text.secondary", fontSize: 13 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTime fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">{ev.time}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Event fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">{ev.date}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {ev.format === "online" ? (
                          <LaptopMac fontSize="small" sx={{ mr: 1, color: "blue" }} />
                        ) : (
                          <LaptopMac fontSize="small" sx={{ mr: 1, color: "blue" }} />
                        )}
                        <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                          {ev.eventType}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      {/* <Box sx={{ display: "flex", alignItems: "center" }}>
                              <LocationOn fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="body2">{ev.venue}</Typography>
                            </Box> */}
                    </Grid>

                  </Grid>

                  {/* Footer */}
                  <Box
                    sx={{
                      pt: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderTop: `1px solid ${theme.palette.divider}`,
                      mt: 3,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      From :{" "}
                      {ev.payStatus === "free"
                        ? "Free Event"
                        : ev.tickets?.[0]?.tickets?.length
                          ? (() => {
                            // infer ticket type
                            type Ticket = { price: string };
                            const minPrice = ev.tickets[0].tickets.reduce(
                              (min: number, t: Ticket) => {
                                const numericPrice = parseFloat(t.price);
                                return Number.isNaN(numericPrice) ? min : Math.min(min, numericPrice);
                              },
                              Infinity
                            );
                            const currency = "XAF";
                            return `${minPrice} ${currency}`.trim();
                          })()
                          : "0"}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/our-event/${ev.urlSlug||ev._id}`}
                      variant="contained"
                      size="small"
                      sx={{
                        px: 3,
                        py: 0.8,
                        textTransform: "none",
                        boxShadow: 0,
                      }}
                    >
                      Book Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
