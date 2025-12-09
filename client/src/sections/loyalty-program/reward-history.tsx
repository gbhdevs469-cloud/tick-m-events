import { useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import { LoyaltyProgramTable } from "src/components/tables/loyalty-program-table";
import { useDispatch, useSelector } from "react-redux";
import { fetchRewardHistory } from "src/redux/actions/rewardActions";
import { RootState } from "src/redux/store";

export const RewardsHistory = () => {
  const dispatch = useDispatch();

  const { history, loading, error } = useSelector((state: RootState) => state.reward);

  const rewardRecordsTableHeaders = ["Reward", "Redemption Date", "Status", "Action"];

  useEffect(() => {
    dispatch(fetchRewardHistory() as any);
  }, [dispatch]);

  // Prepare table data (safe fallback for empty list)
  const tableData = history?.map((item: any) => ({
    Reward: item.name,
    "Redemption Date": new Date(item.date).toLocaleDateString(),
    Status: item.status || "Used",
    action: "View Details",
  })) || [];

  return (
    <Grid container spacing={3} mt={2}>
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
          <CardContent>
            <Typography
              variant="h6"
              fontWeight={600}
              fontSize={{ xs: "18px", sm: "22px", md: "26px" }}
              gutterBottom
            >
              Reward History
            </Typography>

            <Box mt={2} boxShadow={3} borderRadius={3}>
              <Paper
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2,
                  maxWidth: "1000px",
                  mx: "auto",
                }}
              >
                {loading ? (
                  <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Typography color="error" align="center">
                    {error.message || "Failed to load reward history"}
                  </Typography>
                ) : (
                  <LoyaltyProgramTable
                    headers={rewardRecordsTableHeaders}
                    data={tableData}
                    type="2"
                  />
                )}
              </Paper>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
