import { Box, Grid, Typography, Button, Card, CardMedia, CardContent, CircularProgress } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useEffect } from "react";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/redux/store";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { fetchAllCategories } from "src/redux/actions/event.action";

export function ExploreMoreSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.event);


  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  return (
    <Box boxShadow={3} borderRadius={3} p={3} mt={3} bgcolor="#fff">
      <HeadingCommon title="Explore More" weight={600} baseSize="34px" variant="h5" />

      <Grid container spacing={3}>
        {categories?.length > 0 ? (
          categories.slice(0, 4).map((cat: any) => (
            <Grid item xs={12} sm={6} md={3} key={cat._id}>
              <Card sx={{
                borderRadius: 3,
                height: "100%",
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={cat.cover.url}
                  alt={cat.name}
                  sx={{
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    objectFit: 'cover'
                  }}
                />
                <CardContent sx={{
                  bgcolor: "#f5f5f5",
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <HeadingCommon
                    title={cat.name}
                    weight={600}
                    baseSize="18px"
                    variant="subtitle1"
                    sx={{
                      minHeight: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  />

                  <Box sx={{
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Marquee speed={50} gradient={false}>
                      {cat?.subcategories?.map((subcat: any, index: number) => (
                        <React.Fragment key={subcat._id}>
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{
                              color: "#0B2E4C",
                              display: 'inline-block',
                              px: 1
                            }}
                          >
                            {subcat.name}
                          </Typography>
                          {index < cat.subcategories.length - 1 && (
                            <Typography
                              component="span"
                              sx={{
                                color: "#0B2E4C",
                                px: 1
                              }}
                            >
                              |
                            </Typography>
                          )}
                        </React.Fragment>
                      ))}
                    </Marquee>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        borderRadius: 1,
                        fontSize: "12px",
                        px: 2,
                        py: 0.5,
                        backgroundColor: "#0B2E4C",
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {cat.events.length} Events
                    </Button>

                    <Button
                      component={Link}
                      to={`/category/${cat?._id}`}
                      target="_blank"
                      size="small"
                      sx={{
                        minWidth: "30px",
                        backgroundColor: "white",
                        borderRadius: "15px",
                        color: "#0B2E4C"
                      }}
                    >
                      <ArrowForwardIcon />
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12} sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 50
          }}>
            <CircularProgress color="primary" size={50} />
          </Grid>
        )}
      </Grid>

      {/* Bottom CTA - Only show when categories exist */}
      {categories?.length > 0 && (
        <Box textAlign="center" mt={2}>
          <Link to='/category' target="__blank">
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "999px",
                px: 5,
                py: 1.5,
                fontWeight: 600,
                bgcolor: "#0B2E4C",
                "&:hover": {
                  bgcolor: "#05406b",
                },
              }}
            >
              View All Available Events

            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
}