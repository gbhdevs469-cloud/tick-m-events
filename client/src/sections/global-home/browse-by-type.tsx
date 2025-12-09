import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AppDispatch, RootState } from "src/redux/store";
import { Link } from "react-router-dom";
import { fetchAllCategories } from "../../redux/actions/event.action";

export default function BrowseByType() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading } = useSelector((state: RootState) => state.event);

  useEffect(() => {
    dispatch(fetchAllCategories() as any);
  }, [dispatch]);

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Browse by Type
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Find the perfect event for any occasion
          </Typography>
        </Box>
        {/* <Button
          variant="contained"
          sx={{
            borderRadius: 2,
            backgroundColor: "#002D5B",
            textTransform: "none",
            px: 3,
            py: 1,
          }}
          endIcon={<ArrowForwardIosIcon />}
        >
          View More
        </Button> */}
      </Box>

      {/* Loader */}
      {loading && <Typography>Loading categories...</Typography>}

      {/* Event Cards */}
      <Grid container spacing={3}>
        {categories?.map((cat: any, index: number) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                overflow: "hidden",
                position: "relative",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
              }}
            >
              <CardMedia
                component="img"
                height="150"
                image={cat.cover?.url || "/assets/home-global-img/Card/img.png"}
                alt={cat.name}
              />
              <CardContent sx={{ p: 2 }}>
                <Typography fontWeight={600}>{cat.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {`${cat.events?.length ?? 0} Events`}
                </Typography>
              </CardContent>
              <Box
                component={Link}
                to={`/category/${cat?.urlSlug||cat?._id}`}
                target="_blank"
                sx={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  bgcolor: "primary.main",
                  borderRadius: "50%",
                  p: 1,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
