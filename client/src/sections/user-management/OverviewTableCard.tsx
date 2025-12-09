import {
  Box, Paper, Typography, Button, Stack,
  TextField, InputAdornment, IconButton
} from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';

import { AppDispatch, RootState } from "src/redux/store";
import ConfirmActionModal from 'src/components/modal/confirm-action-modal';

import { getAllUsers, validateUser, blockUser } from '../../redux/actions/userActions';
import UserDetailsModal from '../../components/modal/user-details-modal';


interface Verification {
  emailVerified: boolean;
  whatsappVerified: boolean;
  paymentVerified: boolean;
  identityVerified: boolean;
  identityDocuments?: {
    status: string;
  }[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  number: string;
  gender: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  avatar?: {
    url?: string;
  };
  isVerified: boolean;
  isAdmin: boolean;
  address?: string;
  verification?: Verification | null;
}

export function OverviewTableCard() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, users, error } = useSelector((state: RootState) => state.user);
  const [searchText, setSearchText] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => { });
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmDesc, setConfirmDesc] = useState('');

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const getActionButtons = (row: any) => {
    const buttons = [
      <Button
        key="view"
        variant="outlined"
        size="small"
        sx={{ textTransform: 'none', flexShrink: 0 }}
        onClick={() => handleViewDetails(row)}
      >
        View Profile
      </Button>
    ];

    if (row.status === 'pending' || row.status === 'block') {
      buttons.push(
        <Button
          key="validate"
          variant="contained"
          color="success"
          size="small"
          sx={{ flexShrink: 0 }}
          onClick={() =>
            handleConfirmAction(
              () => dispatch(validateUser(row.id)),
              "Validate User",
              "Are you sure you want to validate this user?"
            )
          }
        >
          Validate
        </Button>
      );
    }

    if (row.status === 'pending' || row.status === 'active') {
      buttons.push(
        <Button
          key="block"
          variant="contained"
          color="error"
          size="small"
          sx={{ flexShrink: 0 }}
          onClick={() =>
            handleConfirmAction(
              () => dispatch(blockUser(row.id)),
              "Block User",
              "Are you sure you want to temporary block this user?"
            )
          }
        >
          Block
        </Button>
      );
    }

    if (row.status === 'inActive') {
      buttons.push(
        <Button
          key="reactivate"
          variant="contained"
          color="success"
          size="small"
          sx={{ flexShrink: 0 }}
          onClick={() =>
            handleConfirmAction(
              () => dispatch(validateUser(row.id)),
              "Reactivate User",
              "Are you sure you want to reactivate this user?"
            )
          }
        >
          Reactivate
        </Button>
      );
    }


    return buttons;
  };

  // Transform users data for DataGrid
  const transformedUsers = users?.map((user: any) => ({
    id: user._id || Math.random().toString(36).substr(2, 9),
    name: user.name,
    role: user.role,
    // email: user.email,
    createdAt: new Date(user.createdAt).toLocaleDateString(),
    status: user.status,
  })) || [];

  // Filter users based on search and filters
  const filteredUsers = transformedUsers.filter((user: User) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.role.toLowerCase().includes(searchText.toLowerCase());

    const matchesRole = roleFilter.length === 0 || roleFilter.includes(user.role);
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(user.status);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography fontWeight="bold" textTransform="capitalize">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography textTransform="capitalize">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Registration Date',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        let color;
        switch (params.value) {
          case 'Pending': color = 'orange'; break;
          case 'Suspended': color = 'red'; break;
          case 'Active': color = 'green'; break;
          default: color = 'inherit';
        }
        return (
          <Typography fontWeight="bold" color={color} textTransform="capitalize">
            {params.value}
          </Typography>
        );
      }
    },
    {
      field: 'Actions',
      headerName: 'Actions',
      flex: 1.5,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            width: '100%',
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: '2px',
            },
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{ minWidth: '100%', py: 1, px: 0.5 }}
          >
            {getActionButtons(params.row)}

            <UserDetailsModal
              open={detailsOpen}
              onClose={handleCloseDetails}
              user={selectedUser}
            />

            <ConfirmActionModal
              open={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              onConfirm={handleConfirm}
              title={confirmTitle}
              description={confirmDesc}
            />
          </Stack>
        </Box>
      )

    }
  ];

  // Extract unique roles and statuses for filter options
  const uniqueRoles = Array.from(new Set(transformedUsers.map((user: User) => user.role)));
  const uniqueStatuses = Array.from(new Set(transformedUsers.map((user: User) => user.status)));

  const exportToCSV = (data: any[], filename: string = 'export.csv') => {
    if (!data.length) return;

    const filteredData = data.map((user: any, index: number) => ({
      id: user._id || index.toString(),
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      status: user.status,
    }));

    const header = Object.keys(filteredData[0]).join(',');
    const rows = filteredData.map(obj => Object.values(obj).join(','));
    const csvContent = [header, ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Profile details modal
  const handleViewDetails = (row: any) => {
    const fullUser = users.find((user: any) => user._id === row.id);
    setSelectedUser(fullUser || null);
    setDetailsOpen(true);
  };


  const handleCloseDetails = () => {
    setSelectedUser(null);
    setDetailsOpen(false);
  };

  // block and validation
  const handleConfirmAction = (action: () => void, title: string, description: string) => {
    setConfirmTitle(title);
    setConfirmDesc(description);
    setConfirmAction(() => action);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await confirmAction();
      toast.success("Action completed successfully!");
    } catch (err) {
      toast.error("Something went wrong.");
    }
    setConfirmOpen(false);
  };

  return (
    <Paper
      sx={{
        mt: 3,
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        border: '1px solid #E0E0E0',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
        backgroundColor: '#fff',
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          User Management
        </Typography>
        <Typography variant="subtitle1">
          Overview of Accounts
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          placeholder="Search users..."
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
              <IconButton size="small" onClick={() => setSearchText('')}>
                <ClearIcon fontSize="small" />
              </IconButton>
            )
          }}
          sx={{ width: { xs: '100%', sm: '300px' } }}
        />
        <Button
          startIcon={<FilterListIcon />}
          onClick={() => setFilterOpen(!filterOpen)}
          variant={filterOpen ? "contained" : "outlined"}
        >
          Filters
        </Button>
      </Box>

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
            <Typography variant="subtitle2" mb={1}>Role</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {uniqueRoles.map((role: any) => (
                <Button
                  key={role}
                  variant={roleFilter.includes(role) ? "contained" : "outlined"}
                  size="small"
                  sx={{ textTransform: "capitalize" }}
                  onClick={() => {
                    if (roleFilter.includes(role)) {
                      setRoleFilter(roleFilter.filter(r => r !== role));
                    } else {
                      setRoleFilter([...roleFilter, role]);
                    }
                  }}
                >
                  {role}
                </Button>
              ))}
            </Stack>
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle2" mb={1}>Status</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {uniqueStatuses.map((status: any) => (
                <Button
                  key={status}
                  variant={statusFilter.includes(status) ? "contained" : "outlined"}
                  size="small"
                  onClick={() => {
                    if (statusFilter.includes(status)) {
                      setStatusFilter(statusFilter.filter(s => s !== status));
                    } else {
                      setStatusFilter([...statusFilter, status]);
                    }
                  }}
                  sx={{
                    textTransform: "capitalize",
                    color: status === 'pending' ? 'orange' :
                      status === 'suspended' ? 'red' :
                        status === 'active' ? 'green' : 'inherit',
                    borderColor: status === 'pending' ? 'orange' :
                      status === 'suspended' ? 'red' :
                        status === 'active' ? 'green' : 'inherit',
                  }}
                >
                  {status}
                </Button>
              ))}
            </Stack>
          </Box>
          <Box alignSelf="flex-end">
            <Button
              variant="text"
              color="error"
              onClick={() => {
                setRoleFilter([]);
                setStatusFilter([]);
              }}
            >
              Clear All
            </Button>
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
            rows={filteredUsers}
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
                alignItems: 'center', 
                justifyContent: 'center', 
              },
              '& .MuiDataGrid-row': {

                '&:hover': {
                  backgroundColor: 'rgba(35, 149, 212, 0.08)', 
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
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4}>
        {/* <ResponsiveActionButton>View Account Details</ResponsiveActionButton> */}
        <ResponsiveActionButton onClick={() => exportToCSV(filteredUsers, 'users.csv')}>
          Export Data
        </ResponsiveActionButton>
      </Stack>
    </Paper>
  );
}
function ResponsiveActionButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      fullWidth
      sx={{
        borderRadius: '20px',
        backgroundColor: '#0B2E4C',
        color: 'white',
        height: 45,
        textTransform: 'none',
        '&:hover': {
          backgroundColor: '#071E33',
        },
      }}
    >
      {children}
    </Button>
  );
}
