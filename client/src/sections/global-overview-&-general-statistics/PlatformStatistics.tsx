import React, { memo, useState } from 'react';
import { Box, Grid, Menu, MenuItem } from '@mui/material';
import { PictureAsPdf, InsertDriveFile } from '@mui/icons-material';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';
import { formatRevenue } from 'src/hooks/format-revenu';

interface StatBoxProps {
  label: string;
  value: string;
}

const StatBox = memo(({ label, value }: StatBoxProps) => (
  <Box
    sx={{
      backgroundColor: '#B3D9F3',
      borderRadius: 2,
      py: 5,
      px: 4,
      mx: 1,
      textAlign: 'center',
      boxShadow: 1,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3,
      },
    }}
  >
    <HeadingCommon title={label} baseSize="18px" mb={0} />
    <HeadingCommon title={value} baseSize="17px" mb={0} />
  </Box>
));

interface PlatformStatisticsProps {
  statistics: {
    totalUsers?: string;
    totalEvents?: string;
    totalRevenue?: any;
    activeProviders?: string;
    processedTransactions?: any
  };
}

const PlatformStatistics = memo(({ statistics }: PlatformStatisticsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const open = Boolean(anchorEl);

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    setIsExporting(true);
    setAnchorEl(null);

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      alert(`Data exported as ${format.toUpperCase()}`);
      // In a real app, you would trigger a download here
    }, 1500);
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2.5,
        border: '1px solid #E0E0E0',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        mb: 3,
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
        },
      }}
    >

      <HeadingCommon variant="h5" title="Global Platform Statistics" color="#0A2540" mb={3} />

      <Grid container spacing={2} mb={3} sx={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        {[
          { label: 'Total Users', value: statistics?.totalUsers || '0' },
          { label: 'Total Events', value: statistics?.totalEvents || '0' },
          { label: 'Total Revenue', value: formatRevenue(statistics?.totalRevenue) || '0 XAF' },
          { label: 'Active Providers', value: statistics?.activeProviders || 0 },
          { label: 'Processed Transactions', value: statistics?.processedTransactions || 0 },
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={4} key={i} >
            <StatBox label={stat.label} value={stat.value} />
          </Grid>
        ))}
      </Grid>

      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="center"
        gap={2}
      >
        {/* <Button
          variant="contained"
          startIcon={<Visibility />}
          onClick={handleViewFullReport}
          sx={{
            backgroundColor: '#0A2540',
            borderRadius: 2.5,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            width: { xs: '100%', sm: '200px', md: '300px' },
            '&:hover': {
              backgroundColor: '#14385e',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.2s',
          }}
        >
          View Full Report
        </Button>

        <Button
          variant="contained"
          startIcon={isExporting ? <CircularProgress size={20} color="inherit" /> : <Download />}
          onClick={handleExportClick}
          disabled={isExporting}
          sx={{
            backgroundColor: '#14385e',
            borderRadius: 2.5,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            width: { xs: '100%', sm: '200px', md: '300px' },
            '&:hover': {
              backgroundColor: '#079a65',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.2s',
            '&.Mui-disabled': {
              backgroundColor: '#bdbdbd',
            },
          }}
        >
          {isExporting ? 'Exporting...' : 'Export Data'}
        </Button> */}

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleExportClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleExport('csv')} sx={{ gap: 1 }}>
            <InsertDriveFile fontSize="small" color="primary" />
            Export as CSV
          </MenuItem>
          <MenuItem onClick={() => handleExport('excel')} sx={{ gap: 1 }}>
            <InsertDriveFile fontSize="small" color="success" />
            Export as Excel
          </MenuItem>
          <MenuItem onClick={() => handleExport('pdf')} sx={{ gap: 1 }}>
            <PictureAsPdf fontSize="small" color="error" />
            Export as PDF
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
});

export default PlatformStatistics;