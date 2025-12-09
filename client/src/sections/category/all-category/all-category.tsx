import {
  Box,
  Grid,
  Typography, Container,
  Button,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import React, { useEffect } from 'react';
import Marquee from 'react-fast-marquee';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { AppDispatch, RootState } from 'src/redux/store';
import { DashboardContent } from 'src/layouts/dashboard';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';
import { fetchAllCategories } from 'src/redux/actions/event.action';

export function AllCategoriesView() {
  const dispatch = useDispatch<AppDispatch>();

  const { categories, loading } = useSelector((state: RootState) => state.event);
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  return (
    <DashboardContent>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 }, mb: 3 }}>
        <Box
          sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 3, md: 4 },
            mt: 3,
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': {
              boxShadow: 3,
            },
            transition: 'box-shadow 0.3s ease-in-out',
          }}
        >
          <Box
            sx={{
              mb: 4,
              textAlign: 'center',
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                width: '80px',
                height: '4px',
                backgroundColor: 'primary.main',
                margin: '16px auto 0',
                borderRadius: '2px',
              },
            }}
          >
            <HeadingCommon
              title="Explore Our Categories"
              weight={600}
              baseSize="34px"
              variant="h4"
              sx={{
                color: 'text.primary',
                letterSpacing: '0.5px',
              }}
            />
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                mt: 1,
                maxWidth: '700px',
                mx: 'auto',
              }}
            >
              Browse through our diverse range of event categories
            </Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <CircularProgress color="primary" size={60} />
            </Box>
          ) : (
            <>
              {categories?.length > 0 ? (
                <Grid
                  container
                  spacing={{ xs: 2, sm: 3, md: 4 }}
                  sx={{
                    px: { xs: 0, sm: 2 },
                    py: 1,
                  }}
                >
                  {categories.map((cat: any) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={cat._id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <Card
                        sx={{
                          borderRadius: 3,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.3s ease-in-out',
                          maxWidth: '360px',
                          width: '100%',
                          position: 'relative',
                          overflow: 'hidden',
                          minHeight: '320px', // Reduced height
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: 6,
                          },
                        }}
                      >
                        {/* Background Image with Overlay */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 0,
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background:
                                'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={cat.cover.url}
                            alt={cat.name}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>

                        {/* Card Content */}
                        <CardContent
                          sx={{
                            position: 'relative',
                            zIndex: 1,
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            p: 3,
                            height: '100%',
                            color: 'text.primary',
                            backgroundColor: 'transparent',
                            '& h6': {
                              color: 'common.white',
                            },
                          }}
                        >
                          <HeadingCommon
                            title={cat.name}
                            weight={600}
                            baseSize="20px"
                            variant="h6"
                            sx={{
                              mb: 2,
                              textAlign: 'center',
                              minHeight: '60px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              color: 'text.primary',
                            }}
                          />
                          <Box sx={{ flexGrow: 1 }} /> {/* Spacer to push content down */}
                          {/* Marquee moved to bottom */}
                          <Box
                            sx={{
                              minHeight: '50px',
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: 1,
                              px: 1,
                              py: 0.5,
                              backdropFilter: 'blur(4px)',
                            }}
                          >
                            <Marquee speed={50} gradient={false}>
                              {cat?.subcategories?.map((subcat: any, index: number) => (
                                <React.Fragment key={subcat._id}>
                                  <Typography
                                    variant="body2"
                                    component="span"
                                    sx={{
                                      color: 'common.white',
                                      display: 'inline-block',
                                      px: 1,
                                      fontWeight: 500,
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {subcat.name}
                                  </Typography>
                                  {index < cat.subcategories.length - 1 && (
                                    <Typography
                                      component="span"
                                      sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        px: 1,
                                      }}
                                    >
                                      •
                                    </Typography>
                                  )}
                                </React.Fragment>
                              ))}
                            </Marquee>
                          </Box>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography
                              sx={{
                                borderRadius: 2,
                                fontSize: '12px',
                                px: 2,
                                py: 1,
                                color:"#fff",
                                backgroundColor: 'primary.main',
                                whiteSpace: 'nowrap',
                                fontWeight: 600,
                              }}
                            >
                              {cat.events.length} Events
                            </Typography>

                            <Button
                              component={Link}
                              to={`/category/${cat?.urlSlug || cat?._id}`}
                              size="small"
                              target="_blank"
                              variant="outlined"
                              sx={{
                                minWidth: '36px',
                                minHeight: '36px',
                                borderRadius: '50%',
                                color: 'common.white',
                                borderColor: 'common.white',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  borderColor: 'common.white',
                                },
                              }}
                            >
                              <ArrowForwardIcon fontSize="small" />
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box
                  width="100%"
                  textAlign="center"
                  py={8}
                  sx={{
                    backgroundColor: 'background.default',
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h5" color="text.secondary">
                    Loading...
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>
    </DashboardContent>
  );
}
