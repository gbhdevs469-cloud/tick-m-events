import { Card, CardContent, Button, keyframes, Box, Grid, Typography, ButtonProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

import { formatTimeTo12Hour } from 'src/hooks/formate-time';
import { truncateTextletter } from 'src/hooks/description-cutting';

// Define interface for custom button props
interface CustomButtonProps extends ButtonProps {
  customcolor?: {
    bg?: string;
    hover?: string;
    text?: string;
  };
}

// Styled component for the card with gradient background
const GradientCard = styled(Card)(({ theme }: any) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '16px',
  overflow: 'visible',
  position: 'relative',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
}));

// Styled button component with proper TypeScript typing
const CustomButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'customcolor',
})<CustomButtonProps>(({ theme, customcolor }: any) => ({
  fontWeight: 600,
  borderRadius: '8px',
  textTransform: 'none',
  padding: '8px 5px',
  fontSize: '12px',
  background: customcolor?.bg || '#6c5ce7',
  color: customcolor?.text || 'white',
  '&:hover': {
    background: customcolor?.hover || '#5649c9',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  transition: 'all 0.3s ease',
}));

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

export function UpComingCard({ ticket, onShareClick }: { ticket: any; onShareClick?: () => void }) {
  const navigate = useNavigate();
  return (
    <GradientCard sx={{ height: '100%' }}>
      <CardContent sx={{ padding: 3, position: 'relative' }}>
        {/* Decorative elements */}
        <Box
          sx={{
            color: 'transparent',
            background: 'linear-gradient(120deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            animation: `${shimmer} 3s infinite linear`,
            position: 'absolute',
            top: 16,
            right: 16,
            fontSize: 48,
            filter: 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.3))',
            // ...props.sx,
          }}
        >
          🎫
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 120,
            height: 120,
            opacity: 0.05,
            background: 'radial-gradient(circle, transparent 20%, #667eea 20%, #667eea 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, #667eea 20%, #667eea 80%, transparent 80%, transparent) 25px 25px',
            backgroundSize: '50px 50px',
            transform: 'rotate(30deg)',
          }}
        />

        {/* Event title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            fontSize: { xs: 18, sm: 20, md: 22 }
          }}
        >
          {
            truncateTextletter(ticket.eventDetails?.eventName, 21)
          }
        </Typography>

        {/* Event details */}
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            opacity: 0.9,
            fontSize: { xs: 10, sm: 11, md: 12 }
          }}
        >
          {ticket.eventDetails?.location} | {ticket.eventDetails?.date} | {formatTimeTo12Hour(ticket.eventDetails?.time)}
        </Typography>

        {/* Buttons */}
        <Grid container spacing={1}>
          {[
            { text: 'View Ticket', color: { bg: '#6c5ce7', hover: '#5649c9', text: 'white' } },
            { text: 'Explore More', color: { bg: '#00b894', hover: '#00a382', text: 'white' } },
            { text: 'Share', color: { bg: '#fd79a8', hover: '#e6679b', text: 'white' } },
          ].map(({ text, color }: any) => (
            <Grid item xs={4} key={text}>
              <CustomButton
                fullWidth
                size="small"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  if (text === "Explore More") {
                    window.open("/our-event", "_blank");
                  }
                  if (text === "View Ticket") {
                    navigate("/ticket-validation-at-entry");
                  }
                  if (text === "Share" && onShareClick) {
                    onShareClick();
                  }
                }}
                variant="contained"
                customcolor={color}
              >
                {text}
              </CustomButton>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </GradientCard>
  );
}