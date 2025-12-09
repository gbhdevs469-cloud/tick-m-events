import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";

const blogs = [
  {
    title: "Best Midsize 3-row SUVs 2024",
    date: "18 August 2024",
    image: "/assets/home-global-img/EventBlogs/Frame 1000004528.png",
  },
  {
    title: "5 Best Luxury event coupes 2024",
    date: "18 August 2024",
    image: "/assets/home-global-img/EventBlogs/Frame 1000004531.png",
  },
  {
    title: "Best Small hatchbacks 2024 and 2025",
    date: "18 August 2024",
    image: "/assets/home-global-img/EventBlogs/Frame 1000004530.png",
  },
];

export default function EventsBlog() {
  return (
    <Box sx={{ p: { xs: 2, md: 6 }, bgcolor: "#F9FAFB" }} id="blog">
      {/* Header */}
      <Box 
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            Events Blog
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Expert insights and honest evaluations to help you choose the perfect car
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            borderRadius: 2,
            backgroundColor: "#002D5B",
            textTransform: "none",
            px: 3,
            py: 1,
            fontWeight: 600,
            "&:hover": { backgroundColor: "#001B38" },
          }}
          endIcon={<ArrowForwardIosIcon />}
        >
          View More
        </Button>
      </Box>

      {/* Content */}
      <Grid container spacing={3}>
        {/* Left Featured Blog */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <Box sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                src="/assets/home-global-img/EventBlogs/Frame.png"
                alt="Featured Blog"
                sx={{ height: 300, borderRadius: "12px 12px 0 0" }}
              />
              <PlayCircleFilledWhiteIcon
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: 64,
                  color: "#fff",
                }}
              />
            </Box>
            <CardContent>
              <Typography fontWeight={700} gutterBottom>
                Featured Event Headline Goes Here
              </Typography>
              <Typography variant="body2" color="text.secondary">
                18 August 2024
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Blog List */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              bgcolor: "#0074C2",
              borderRadius: 3,
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              height: "100%",
            }}
          >
            {blogs.map((blog, index) => (
              <Card
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "transparent",
                  color: "#fff",
                  boxShadow: "none",
                }}
              >
                {/* Thumbnail */}
                <Box sx={{ position: "relative", minWidth: 120, mr: 2 }}>
                  <CardMedia
                    component="img"
                    src={blog.image}
                    alt={blog.title}
                    sx={{
                      width: 120,
                      height: 90,
                      borderRadius: 2,
                      objectFit: "cover",
                    }}
                  />
                  <PlayCircleFilledWhiteIcon
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: 36,
                      color: "#fff",
                    }}
                  />
                </Box>

                {/* Blog Info */}
                <CardContent sx={{ p: 0 }}>
                  <Typography fontWeight={600} sx={{ mb: 0.5 }}>
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#E0E0E0" }}>
                    {blog.date}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
