import {
  Box, Paper, Typography, Button, Grid, CircularProgress, InputAdornment, IconButton, TextField, Stack,ButtonProps
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

import { fetchAdminActivities } from 'src/redux/actions/activityActions';
import { AppDispatch, RootState } from "src/redux/store";

export default function UserActivityCard() {
  const [localLoading, setLocalLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, activities = [], error } = useSelector((state: any) => state.activities);
  const [page] = useState(1);
  const [limit] = useState(50);
  const [searchText, setSearchText] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  const getActivityKey = (label: string) => {
    const map: Record<string, string> = {
      'Login Success': 'login_success',
      'Logout Success': 'logout_success',
      'Event Created': 'event_created',
      'Ticket Purchased': 'ticket_purchased',
      'Profile Updated': 'profile_updated',
      'Password Changed': 'password_changed',
    };

    // Normalize case
    const entry = Object.entries(map).find(
      ([labelText]) => labelText.toLowerCase() === label.toLowerCase()
    );

    return entry ? entry[1] : label.toLowerCase().replace(/\s+/g, '_');
  };

  const activityOptions = Object.entries({
    login_success: 'Login Success',
    logout_success: 'Logout Success',
    event_created: 'Event Created',
    ticket_purchased: 'Ticket Purchased',
    profile_updated: 'Profile Updated',
    password_changed: 'Password Changed',
  }).map(([key, value]) => ({
    key,
    label: value,
  }));


  useEffect(() => {
    const loadWithDelay = async () => {
      await dispatch(fetchAdminActivities({ page, limit }));
      setTimeout(() => {
        setLocalLoading(false);
      }, 1000);
    };

    loadWithDelay();
  }, [dispatch, page, limit]);


  const tableData = useMemo(() => activities.docs || activities, [activities]);


  const rows = tableData.map((item: any, index: number) => {
    const raw = getActivityKey(item.activityType || '');
    return {
      id: index + 1,
      date: new Date(item.timestamp).toLocaleDateString(),
      user: item.userId?.name || item.userId?.email || 'N/A',
      action: activityOptions.find(opt => opt.key === raw)?.label || raw,
      rawAction: raw,             
      location: item.location?.split(',')[0]?.trim() || '-',

    };
  }).filter((row: any) => {
    const matchesSearch =
      row.user.toLowerCase().includes(searchText.toLowerCase()) ||
      row.action.toLowerCase().includes(searchText.toLowerCase()) ||
      row.location.toLowerCase().includes(searchText.toLowerCase());

    const matchesActionFilter =
      selectedActions.length === 0 ||
      selectedActions.includes(row.rawAction);

    return matchesSearch && matchesActionFilter;
  });

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 1.5,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography fontWeight="500">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'user',
      headerName: 'User',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography fontWeight="bold" textTransform="capitalize">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 2,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography textTransform="capitalize">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography>
          {params.value}
        </Typography>
      ),
    },
  ];


  const trendData = useMemo(() => {
    const today = new Date();
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const counts: Record<string, number> = {
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Today: 0,
    };

    tableData.forEach((item: any) => {
      const activityDate = new Date(item.timestamp);
      const isToday =
        activityDate.toDateString() === today.toDateString();

      const weekday = activityDate.toLocaleDateString('en-US', { weekday: 'short' });

      if (isToday) {
        counts.Today += 1;
      }

      if (counts[weekday] !== undefined) {
        counts[weekday] += 1;
      }
    });

    return [...dayLabels.map(day => ({ day, value: counts[day] })), { day: 'Today', value: counts.Today }];
  }, [tableData]);


  if (loading || localLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
        width="100%"
      >
        <CircularProgress />
      </Box>
    );

  if (!activities || activities.length === 0)
    return (
      <Box
        className="text-center text-gray-600"
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="300px"
      >
        <Typography variant="h6" className="text-gray-500">
          No Activity History Found.
        </Typography>
      </Box>
    );


  if (error) return <Typography color="error">Error: {error.message || error}</Typography>;
  const downloadCSV = () => {
    if (!rows || rows.length === 0) {
      alert("No data available to download.");
      return;
    }
    type RowType = {
      date: string;
      user: string;
      action: string;
      location: string;
    };
    const headers = ["Date", "User", "Action", "Location"];
    const csvRows = [
      headers.join(","),
      ...rows.map((row: RowType) =>
        [row.date, row.user, row.action, row.location]
          .map(field => `"${(field || "").toString().replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `user_activity_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 0 10px rgba(0,0,0,0.4)' }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>User Activity History</Typography>

      {/* Data Grid Table */}
      <Box sx={{ width: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchText('')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Button
            startIcon={<FilterListIcon />}
            onClick={() => setFilterOpen(!filterOpen)}
            variant={filterOpen ? "contained" : "outlined"}
          >
            Filters
          </Button>
        </Stack>
        {filterOpen && (
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={3}
            mb={3}
            p={2}
            bgcolor="#f5f5f5"
            borderRadius={2}
          >
            <Box flex={1}>
              <Typography variant="subtitle2" mb={1}>Actions</Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {activityOptions.map((option) => (
                  <Button
                    key={option.key}
                    variant={selectedActions.includes(option.key) ? 'contained' : 'outlined'}
                    size="small"
                    sx={{
                      textTransform: "capitalize",
                      color: selectedActions.includes(option.key) ? 'white' : '#2395d4',
                      borderColor: '#2395d4', 
                      backgroundColor: selectedActions.includes(option.key) ? '#2395d4' : 'transparent',
                      '&:hover': {
                        backgroundColor: selectedActions.includes(option.key) ? '#1565c0' : 'rgba(25, 118, 210, 0.1)',
                        borderColor: '#2395d4',
                      },
                    }}
                    onClick={() => {
                      setSelectedActions(prev =>
                        prev.includes(option.key)
                          ? prev.filter(action => action !== option.key)
                          : [...prev, option.key]
                      );
                    }}
                  >
                    {option.label}
                  </Button>
                ))}

                {/* Optional: Clear Filters Button */}
                {selectedActions.length > 0 && (
                  <Button
                    onClick={() => setSelectedActions([])}
                    color="secondary"
                    size="small"
                    variant="outlined"
                    sx={{ ml: 1, textTransform: 'none', borderRadius: 20 }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Stack>
            </Box>
          </Box>
        )}


        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <Typography>Loading users...</Typography>
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <Typography color="error">Error: {error}</Typography>
          </Box>
        ) : (
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              slots={{
                toolbar: GridToolbar,
              }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#1976d2',
                  color: '#2395D4', 
                  fontSize: '1rem',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #E0E0E0',
                  display: 'flex',
                  alignItems: 'center', // Vertical center
                  justifyContent: 'center', // Horizontal center
                },
                '& .MuiDataGrid-row': {

                  '&:hover': {
                    backgroundColor: 'rgba(35, 149, 212, 0.08)', // Updated to match new color
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(35, 149, 212, 0.12)',
                    '&:hover': {
                      backgroundColor: 'rgba(35, 149, 212, 0.16)',
                    },
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>

      {/* Chart + Actions */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              border: '1px solid #ddd',
              borderRadius: 3,
              height: '100%',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              User Trends
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trendData}>
                <XAxis dataKey="day" />
                <Tooltip />
                <Bar dataKey="value" fill="#1F8FCD" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Button Section aligned to bottom right */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <StyledActionButton onClick={downloadCSV}>Download Activity Report</StyledActionButton>
            <StyledActionButton>Analyze Suspicious Behavior</StyledActionButton>
          </Box>
        </Grid>
      </Grid>

    </Paper>
  );
}

function StyledActionButton({ sx, children, ...rest }: ButtonProps) {
  return (
    <Button
      {...rest}
      sx={{
        borderRadius: '20px',
        backgroundColor: '#0B2E4C',
        color: 'white',
        height: 45,
        textTransform: 'none',
        '&:hover': {
          backgroundColor: '#071E33',
        },
        ...sx, 
      }}
    >
      {children} 
    </Button>
  );
}
