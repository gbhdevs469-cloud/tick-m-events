import { TableHead, TableBody, Table, TableCell, TableRow, Paper, Typography, Button, Stack, TableContainer } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';
import { fetchMarketPlaceactivity } from 'src/redux/actions/global-overview-general-statistice.action';
import { AppDispatch, RootState } from 'src/redux/store';

export function MarketplaceActivity() {
  const dispatch = useDispatch<AppDispatch>();
  const { providers } = useSelector((state: RootState) => state?.gogs);
  useEffect(() => {
    dispatch(fetchMarketPlaceactivity())
  }, [dispatch]);

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 2.5,
        border: '1px solid #E0E0E0',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
        backgroundColor: '#fff',

      }}
    >
      <HeadingCommon variant="h6" weight={600} mb={3} title="Marketplace Activity (Providers & Transactions)" />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#E1E1E1" }}>
              {["Provider", "Location", "Service Offered", "Contract Signed", "Status"].map((header: string) => (
                <TableCell
                  key={header}
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "0.8rem", sm: "1rem" },
                    color: "white",
                    backgroundColor: "#1F8FCD",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {providers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    No Data...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              providers?.map((__: any) => (
                <TableRow key={__._id} sx={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #E1E1E1" }}>
                  <TableCell align="center" sx={{ textTransform: "capitalize", fontSize: { xs: "12px", sm: "13px" }, fontWeight: "700" }}>{__.name}</TableCell>
                  <TableCell align="center" sx={{ textTransform: "capitalize", fontSize: { xs: "12px", sm: "13px" }, fontWeight: "normal" }}>{__.address || 'N/A'}</TableCell>
                  <TableCell align="center" sx={{ textTransform: "capitalize", fontSize: { xs: "12px", sm: "13px" }, fontWeight: "normal" }}>{__.serviceCategory || 'N/A'}</TableCell>
                  <TableCell align="center" sx={{ textTransform: "capitalize", fontSize: { xs: "12px", sm: "13px" }, fontWeight: "normal" }}>{__.contractsCount || 0}</TableCell>
                  <TableCell align="center"
                    sx={{
                      textTransform: "capitalize",
                      color:
                        __.status === 'pending'
                          ? 'red'
                          : __.status === 'active'
                            ? 'green'
                            : 'black',
                      fontSize: { xs: "12px", sm: "13px" }, fontWeight: 600
                    }}>{__.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </TableContainer>
      {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4}>
        <ResponsiveActionButton>Analyze an Organizer</ResponsiveActionButton>
        <ResponsiveActionButton>View Provider Transactions</ResponsiveActionButton>
      </Stack> */}
    </Paper>
  );
}



function ResponsiveActionButton({ children }: { children: React.ReactNode }) {
  return (
    <Button
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
