import {
  Button,
  Grid,
} from '@mui/material';

interface InfoCardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function InfoCard({ activeTab, setActiveTab }: InfoCardProps) {
  const tabs = ['Approve Event', 'Verify Transaction'];

  return (
    <>
      {/* Tab Buttons */}
      <Grid container spacing={2} mt={2} display="flex" justifyContent="center">
        {tabs.map((label) => (
          <Grid item xs={12} md={4} key={label}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setActiveTab(label)}
              sx={{
                bgcolor: activeTab === label ? '#0e2a47' : 'white',
                color: activeTab === label ? 'white' : '#0e2a47',
                border: '1px solid #0e2a47',
                borderRadius: 2,
                py: 1.5,
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: activeTab === label ? '#0b2035' : '#0e2a47',
                  color: 'white',
                },
              }}
            >
              {label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
