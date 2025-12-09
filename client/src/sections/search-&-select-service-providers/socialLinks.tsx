import {
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Instagram,
  Facebook,
  LinkedIn,
  MusicNote as TikTokIcon
} from '@mui/icons-material';

export const SocialLinks = ({ socialLinks }:any) => {
   
  // List of social platforms we want to display
  const platforms = [
    { 
      name: 'instagram',
      icon: <Instagram />,
      color: '#E1306C',
      baseUrl: 'https://www.instagram.com/'
    },
    { 
      name: 'facebook',
      icon: <Facebook />,
      color: '#1877F2',
      baseUrl: 'https://www.facebook.com/'
    },
    { 
      name: 'linkedin',
      icon: <LinkedIn />,
      color: '#0077B5',
      baseUrl: 'https://www.linkedin.com/in/'
    },
    { 
      name: 'tiktok',
      icon: <TikTokIcon />,
      color: '#000000',
      baseUrl: 'https://www.tiktok.com/@'
    }
  ];

  return (
    <Box display="flex" gap={1}>
      {platforms.map((platform) => {
        // Check if link exists and is not just the base URL
        const link = socialLinks?.[platform.name];
        const isValidLink = link && link !== platform.baseUrl;
        
        if (!isValidLink) return null;

        return (
          <Tooltip key={platform.name} title={platform.name.charAt(0).toUpperCase() + platform.name.slice(1)}>
            <IconButton
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                color: platform.color,
                '&:hover': { 
                  backgroundColor: `${platform.color}20` // 20 = 12% opacity
                }
              }}
            >
              {platform.icon}
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
};