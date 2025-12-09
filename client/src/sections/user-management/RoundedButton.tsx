import { Button, useMediaQuery, useTheme } from '@mui/material';

interface RoundedButtonProps {
  label: string;
  variant?: 'text' | 'outlined' | 'contained';
  onClick?: () => void;
}

export function RoundedButton({
  label,
  variant = 'contained',
  onClick,
}: RoundedButtonProps) {
  const isContained = variant === 'contained';

  const theme = useTheme();
  const isMediumUp = useMediaQuery(theme.breakpoints.up('md')); 

  return (
    <Button
      variant={variant}
      onClick={onClick}
      fullWidth={isMediumUp}
      sx={{
        borderRadius: '20px',
        textTransform: 'none',
        fontWeight: 500,
        px: 3,
        height: '40px',
        backgroundColor: isContained ? '#0B2E4C' : 'transparent',
        color: isContained ? 'white' : '#0B2E4C',
        borderColor: '#0B2E4C',
        '&:hover': {
          backgroundColor: isContained
            ? 'rgba(6, 28, 47, 0.83)'
            : '#0B2E4C',
          color: 'white',
          borderColor: '#0B2E4C',
        },
      }}
    >
      {label}
    </Button>
  );
}
