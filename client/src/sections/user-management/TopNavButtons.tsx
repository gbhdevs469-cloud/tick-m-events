import { Button, Grid } from '@mui/material';

interface TopNavButtonsProps {
  active: string;
  onChange: (value: string) => void;
}

const options = [
  'User List',
  'KYC Verification',
  'Activity History',
];

export function TopNavButtons({ active, onChange }: TopNavButtonsProps) {

  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      sx={{ mb: 3, mx: 'auto', maxWidth: 900 }}
    >
      {options.map((label) => (
        <Grid
          item
          key={label}
          xs={12}   
          sm={6}   
          md={3}    
        >
          <Button
            fullWidth
            onClick={() => onChange(label)}
            variant="outlined"
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              backgroundColor: active === label ? '#0B2E4C' : 'white',
              color: active === label ? 'white' : '#0B2E4C',
              borderColor: '#0B2E4C',
              whiteSpace: 'nowrap',
              '&:hover': {
                borderColor: '#0B2E4C',
                backgroundColor:
                  active === label ? 'rgba(6, 28, 47, 0.83)' : '#0B2E4C',
                color: 'white',
              },
            }}
          >
            {label}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}
