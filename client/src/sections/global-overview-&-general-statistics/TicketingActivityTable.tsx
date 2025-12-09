import { useEffect, useState } from 'react';
import {
  Paper, Box, Typography, TextField,
  InputAdornment, IconButton, Button, Stack,
  useTheme, useMediaQuery, Chip
} from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/redux/store';
import { fetchTicketingActivity } from 'src/redux/actions/global-overview-general-statistice.action';
import { formatRevenue } from 'src/hooks/format-revenu';

interface TicketItem {
  id: string;
  eventName: string;
  organizerName: string;
  ticketsSold: number;
  revenue: number;
  status: 'Active' | 'Pending' | 'In Progress' | 'Cancelled';
}

function mapStatus(status: string): TicketItem['status'] {
  const normalized = (status || '').trim().toLowerCase();

  switch (normalized) {
    case 'approved':
    case 'active':
      return 'Active';
    case 'pending':
      return 'Pending';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'In Progress';
  }
}

function formatCurrency(amount: number | undefined | null): string {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '0 XAF';
  return `${amount.toLocaleString('en-CM')} XAF`;
}

const StatusChip = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Active': return { bg: '#e8f5e8', color: '#2e7d32', border: '1px solid #2e7d32' };
      case 'Pending': return { bg: '#fff3e0', color: '#f57c00', border: '1px solid #f57c00' };
      case 'In Progress': return { bg: '#e3f2fd', color: '#1976d2', border: '1px solid #1976d2' };
      case 'Cancelled': return { bg: '#ffebee', color: '#d32f2f', border: '1px solid #d32f2f' };
      default: return { bg: '#f5f5f5', color: '#757575', border: '1px solid #757575' };
    }
  };

  const colors = getStatusColor();

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        border: colors.border,
        fontWeight: 'bold',
        fontSize: '0.75rem',
        minWidth: 80,
      }}
    />
  );
};

export function TicketingActivityTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { activities, loading, error } = useSelector((state: any) => state.gogs);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    dispatch(fetchTicketingActivity());
  }, [dispatch]);

  const transformedData: TicketItem[] = (activities || []).map((item: any, index: number) => ({
    id: index.toString(),
    eventName: item.eventName,
    organizerName: item.organizerName,
    ticketsSold: Number(item.ticketsSold) || 0,
    revenue: Number(item.revenue) || 0,
    status: mapStatus(item.status),
  }));

  const uniqueStatuses = Array.from(new Set(transformedData.map(d => d.status)));

  const filteredData = transformedData.filter(item => {
    const matchesSearch =
      item.eventName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.organizerName.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(item.status);

    return matchesSearch && matchesStatus;
  });

  // Mobile columns - minimal information
  const mobileColumns: GridColDef[] = [
    { 
      field: 'eventName', 
      headerName: 'Event', 
      flex: 1, 
      minWidth: 120,
      align: 'center', 
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography variant="body2" noWrap title={params.value}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'ticketsSold', 
      headerName: 'Sold', 
      width: 80,
      align: 'center', 
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      align: 'center', 
      headerAlign: 'center',
      renderCell: (params) => <StatusChip status={params.value} />
    },
  ];

  // Tablet columns - more information than mobile
  const tabletColumns: GridColDef[] = [
    { 
      field: 'eventName', 
      headerName: 'Event', 
      flex: 1, 
      minWidth: 150,
      align: 'center', 
      headerAlign: 'center',
    },
    { 
      field: 'organizerName', 
      headerName: 'Organizer', 
      flex: 1, 
      minWidth: 120,
      align: 'center', 
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography variant="body2" noWrap title={params.value}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'ticketsSold', 
      headerName: 'Tickets Sold', 
      width: 100,
      align: 'center', 
      headerAlign: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      align: 'center', 
      headerAlign: 'center',
      renderCell: (params) => <StatusChip status={params.value} />
    },
  ];

  // Desktop columns - full information
  const desktopColumns: GridColDef[] = [
    { 
      field: 'eventName', 
      headerName: 'Event Name', 
      flex: 1, 
      minWidth: 200,
      align: 'center', 
      headerAlign: 'center',
    },
    { 
      field: 'organizerName', 
      headerName: 'Organizer', 
      flex: 1, 
      minWidth: 150,
      align: 'center', 
      headerAlign: 'center',
    },
    { 
      field: 'ticketsSold', 
      headerName: 'Tickets Sold', 
      flex: 1, 
      minWidth: 120,
      align: 'center', 
      headerAlign: 'center',
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      flex: 1,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" color="primary">
          {formatRevenue(params.value)}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      align: 'center', 
      headerAlign: 'center',
      renderCell: (params) => <StatusChip status={params.value} />
    },
  ];

  // Choose columns based on screen size
  const getColumns = (): GridColDef[] => {
    if (isMobile) return mobileColumns;
    if (isTablet) return tabletColumns;
    return desktopColumns;
  };

  const columns = getColumns();

  return (
    <Paper
      sx={{
        mt: 3,
        p: { xs: 1, sm: 2, md: 3 },
        borderRadius: 3,
        border: '1px solid #E0E0E0',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}
    >
      <Typography 
        variant={isMobile ? "h6" : "h5"} 
        fontWeight="bold" 
        mb={2}
        sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}
      >
        {isMobile ? 'Ticketing Activity' : 'Ticketing Activity (Events & Tickets)'}
      </Typography>

      {/* Search and Filters */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        mb={2}
      >
        <TextField
          placeholder={isMobile ? "Search..." : "Search event or organizer"}
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize={isMobile ? "small" : "medium"} />
              </InputAdornment>
            ),
            endAdornment: searchText && (
              <IconButton 
                size="small" 
                onClick={() => setSearchText('')}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            ),
          }}
          sx={{ 
            width: { xs: '100%', sm: 250, md: 300 },
            '& .MuiInputBase-root': { 
              height: { xs: 40, sm: 40 } 
            }
          }}
        />

        {/* Status Filter Buttons - Responsive */}
        <Stack 
          direction="row" 
          spacing={1} 
          flexWrap="wrap"
          justifyContent={{ xs: 'center', sm: 'flex-start' }}
          useFlexGap
        >
          {uniqueStatuses.map((status) => (
            <Button
              key={status}
              variant={statusFilter.includes(status) ? 'contained' : 'outlined'}
              size={isMobile ? "small" : "medium"}
              onClick={() => {
                setStatusFilter(prev =>
                  prev.includes(status)
                    ? prev.filter(s => s !== status)
                    : [...prev, status]
                );
              }}
              sx={{
                textTransform: 'capitalize',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                minWidth: { xs: 60, sm: 80 },
                px: { xs: 1, sm: 2 },
                color:
                  status === 'Active' ? 'green' :
                    status === 'Cancelled' ? 'red' :
                      'orange',
                borderColor:
                  status === 'Active' ? 'green' :
                    status === 'Cancelled' ? 'red' :
                      'orange',
                '&.Mui-contained': {
                  backgroundColor:
                    status === 'Active' ? 'green' :
                      status === 'Cancelled' ? 'red' :
                        'orange',
                  color: 'white',
                }
              }}
            >
              {isMobile ? status.slice(0, 3) : status}
            </Button>
          ))}
          {statusFilter.length > 0 && (
            <Button 
              color="error" 
              size={isMobile ? "small" : "medium"}
              onClick={() => setStatusFilter([])}
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                minWidth: { xs: 60, sm: 80 } 
              }}
            >
              {isMobile ? 'Clear' : 'Clear Filters'}
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Data Grid with responsive height and density */}
      <Box sx={{ 
        height: { 
          xs: Math.max(400, filteredData.length * 50 + 100), // Dynamic height for mobile
          sm: 500,
          md: 600 
        }, 
        width: '100%',
        '& .MuiDataGrid-root': {
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }
      }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSizeOptions={[5, 10, 20, 50]}
          loading={loading}
          density={isMobile ? "compact" : "standard"}
          slots={{ toolbar: isDesktop ? GridToolbar : undefined }}
          slotProps={{
            toolbar: {
              showQuickFilter: false,
              printOptions: { disableToolbarButton: true },
            },
          }}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.primary.main,
              color: '#1976d2',
              fontWeight: 'bold',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              minHeight: { xs: '40px !important', sm: '56px !important' },
            },
            '& .MuiDataGrid-cell': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              minHeight: { xs: '40px !important', sm: '52px !important' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            '& .MuiDataGrid-row': {
              minHeight: { xs: '40px !important', sm: '52px !important' },
              maxHeight: { xs: '40px !important', sm: '52px !important' },
            },
            '& .MuiDataGrid-virtualScroller': {
              minHeight: 200,
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
            },
          }}
        />
      </Box>

      {/* Mobile Summary Info */}
      {isMobile && filteredData.length > 0 && (
        <Box sx={{ mt: 2, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2" textAlign="center" color="text.secondary">
            Showing {filteredData.length} events • 
            Total Sold: {filteredData.reduce((sum, item) => sum + item.ticketsSold, 0)} • 
            Revenue: {formatCurrency(filteredData.reduce((sum, item) => sum + item.revenue, 0))}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}