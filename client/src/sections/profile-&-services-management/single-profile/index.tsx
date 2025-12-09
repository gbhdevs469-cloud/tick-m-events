import { 
  Typography, Box, CircularProgress, Alert, 
  Card, CardContent, Chip, Rating, Avatar,
  Grid, Paper, Divider, IconButton
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Email, Phone, LocationOn, 
  Facebook, Instagram, LinkedIn, 
  Language, Star, Work, Groups
} from "@mui/icons-material";

import { formatDateTimeCustom } from "src/hooks/formate-time";
import axios from '../../../redux/helper/axios';

// Define TypeScript interfaces
interface Service {
  _id: string;
  serviceName: string;
  description: string;
  price?: number;
  duration?: string;
}

interface SocialLinks {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  tiktok?: string;
  website?: string;
}

interface UserProfile {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  gender: string;
  number: string;
  experience: string;
  address: string;
  serviceCategory: string;
  averageRating: number;
  reviewCount: number;
  avatar: {
    url: string;
    public_id: string;
  };
  cover: {
    url: string;
    public_id: string;
  };
  socialLinks: SocialLinks;
  website: string;
  certified: boolean;
  isVerified: boolean;
  contractsCount: number;
  lastLoginTime: string;
}

interface ProfileData {
  success: boolean;
  message: string;
  user: UserProfile;
  services: Service[];
}

export function ProviderProfile() {
  const { id } = useParams<{ id: string }>();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError("");
        
        if (!id) {
          throw new Error("No user ID provided");
        }

        const response = await axios.get(`/auth/profile/${id}`);
        if (response.status === 200 && response.data.success) {
          setProfileData(response.data.user);
          setServices(response.data.services || []);
          // Preload cover image
          if (response.data.user.cover?.url) {
            const img = new Image();
            img.src = response.data.user.cover.url;
            img.onload = () => setImageLoaded(true);
          } else {
            setImageLoaded(true);
          }
        } else {
          setError(response.data?.message || "Failed to fetch profile data");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err instanceof Error ? err.message : "An error occurred while fetching profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  const SocialIcon = ({ platform, url }: { platform: string; url?: string }) => {
    if (!url) return null;
    
    const icons: { [key: string]: JSX.Element } = {
      facebook: <Facebook />,
      instagram: <Instagram />,
      linkedin: <LinkedIn />,
    };

    return (
      <IconButton 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        sx={{ 
          color: 'primary.main',
          transition: 'all 0.3s ease',
          '&:hover': { 
            transform: 'scale(1.2)',
            color: 'secondary.main'
          }
        }}
      >
        {icons[platform]}
      </IconButton>
    );
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        sx={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          transition: 'all 0.5s ease'
        }}
      >
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{ 
            color: 'primary.main',
            animation: 'pulse 1.5s infinite ease-in-out'
          }} 
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        p={3} 
        sx={{ 
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
          transition: 'all 0.5s ease'
        }}
      >
        <Alert 
          severity="error" 
          sx={{ 
            maxWidth: 500,
            transform: 'scale(0.95)',
            animation: 'scaleIn 0.5s ease forwards',
            '&:hover': {
              transform: 'scale(1.02)',
              transition: 'transform 0.3s ease'
            }
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Box 
        p={3} 
        sx={{ 
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
        }}
      >
        <Alert 
          severity="info" 
          sx={{ 
            maxWidth: 500,
            animation: 'fadeIn 0.8s ease forwards'
          }}
        >
          No profile data available
        </Alert>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        pb: 4
      }}
    >
      {/* Cover Photo with Parallax Effect */}
      <Box 
        sx={{ 
          height: { xs: 200, md: 300 },
          background: profileData.cover?.url 
            ? `url(${profileData.cover.url}) center/cover`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          transition: 'all 0.8s ease',
          opacity: imageLoaded ? 1 : 0,
          transform: imageLoaded ? 'translateY(0)' : 'translateY(-20px)'
        }}
      />
      
      {/* Main Content */}
      <Box 
        sx={{ 
          maxWidth: 1200, 
          mx: 'auto', 
          mt: { xs: -8, md: -25 },
          px: 2,
          animation: 'slideUp 0.8s ease forwards'
        }}
      >
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                mb: 3, 
                borderRadius: 3,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Avatar
                  src={profileData.avatar?.url}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    border: '4px solid white',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    animation: 'scaleIn 0.6s ease forwards'
                  }}
                />
                
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  {profileData.name}
                </Typography>
                
                <Chip 
                  label={`${profileData.username}`} 
                  size="small" 
                  sx={{ mb: 2, background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)', color: 'white' }}
                />
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Rating value={profileData.averageRating} readOnly precision={0.1} />
                  <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                    ({profileData.reviewCount} reviews)
                  </Typography>
                </Box>
                
                {profileData.certified && (
                  <Chip 
                    icon={<Star />} 
                    label="Certified Pro" 
                    color="success" 
                    sx={{ mb: 2 }} 
                  />
                )}
                
                <Divider sx={{ my: 2 }} />
                
                {/* Contact Info */}
                <Box sx={{ textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">{profileData.email}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">{profileData.number}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" textTransform='capitalize'>{profileData.address}</Typography>
                  </Box>
                </Box>
                
                {/* Social Links */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <SocialIcon platform="facebook" url={profileData.socialLinks?.facebook} />
                  <SocialIcon platform="instagram" url={profileData.socialLinks?.instagram} />
                  <SocialIcon platform="linkedin" url={profileData.socialLinks?.linkedin} />
                  {profileData.website && (
                    <IconButton 
                      href={profileData.website} 
                      target="_blank" 
                      sx={{ 
                        color: 'primary.main',
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          transform: 'scale(1.2)',
                          color: 'secondary.main'
                        }
                      }}
                    >
                      <Language />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
            
            {/* Stats Card */}
            <Card 
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Work sx={{ mr: 1 }} /> Statistics
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Completed Contracts:</Typography>
                  <Typography variant="body2" fontWeight="bold">{profileData.contractsCount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Member Since:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatDateTimeCustom(profileData.lastLoginTime)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* About Section */}
            <Card 
              sx={{ 
                mb: 3, 
                borderRadius: 3,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Groups sx={{ mr: 1 }} /> About Me
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  {profileData.experience}
                </Typography>
                <Chip 
                  label={profileData.serviceCategory} 
                  color="primary" 
                  variant="outlined" 
                />
              </CardContent>
            </Card>
            
            {/* Services Section */}
            {services.length > 0 && (
              <Card 
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Services Offered
                  </Typography>
                  <Grid container spacing={2}>
                    {services.map((service, index) => (
                      <Grid item xs={12} key={service._id}>
                        <Paper 
                          elevation={2}
                          sx={{ 
                            p: 3, 
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            animation: `fadeInUp 0.6s ease ${index * 0.1}s forwards`,
                            opacity: 0,
                            transform: 'translateY(20px)',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 15px 30px rgba(0,0,0,0.2)'
                            }
                          }}
                        >
                          <Typography variant="h6" gutterBottom>
                            {service.serviceName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {service.description}
                          </Typography>
                          {service.price && (
                            <Typography variant="h6" color="primary">
                              ${service.price}
                              {service.duration && ` / ${service.duration}`}
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Box>
  );
}