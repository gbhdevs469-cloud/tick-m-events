import {
  Container, Grid, Card, CardContent, Typography, Button, Box, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, InputAdornment, IconButton, Snackbar, Alert,
} from "@mui/material";
import { Visibility, VisibilityOff, ContentCopy } from "@mui/icons-material";
import { LoyaltyProgramTable } from "src/components/tables/loyalty-program-table";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/redux/store";
import { fetchAvailableRewards, fetchRewardHistory, redeemReward } from "src/redux/actions/rewardActions";

type Reward = {
  _id: string;
  name: string;
  description: string;
  points: number;
  reason?: string;
  redeemCode?: string | null;
};

export const AvailableRewards = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rewards, loading } = useSelector((state: RootState) => state.reward);

  const [open, setOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [showCode, setShowCode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAvailableRewards() as any);
    dispatch(fetchRewardHistory() as any);
  }, [dispatch]);

  const handleRedeemClick = async (reward: Reward) => {
    setSelectedReward(reward);
    setShowCode(false);

    const code =
      reward.redeemCode ||
      `REWARD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setGeneratedCode(code);

    if (!reward.redeemCode) {
      const result = await dispatch(redeemReward(reward._id, code) as any);

      if (result.status !== 200) {
        alert(`Failed to redeem reward: ${result.message}`);
        return;
      }
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReward(null);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setSnackbarOpen(true);
  };

  const availableRewardTableHeaders = [
    "Reward",
    "Points Required",
    "Details",
    "Action",
  ];

  const rewardTableData =
    rewards?.map((reward: Reward) => ({
      reward: reward.name || "-",
      points: reward.points ? `${reward.points.toLocaleString()} pts` : "0 pts",
      details: reward.description || "-",
      action: (
        <Button
          variant="contained"
          sx={{
            bgcolor: "#0B3558",
            color: "#fff",
            "&:hover": {
              bgcolor: "#0A2D50", // slightly darker for hover
            },
            boxShadow: "none", // optional: remove default shadow if needed
          }}
          onClick={() => handleRedeemClick(reward)}
        >
          Redeem
        </Button>
      ),
    })) || [];

  const hasRewards = rewardTableData.length > 0;

  return (
    <>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight={600}
                fontSize={{ xs: "18px", sm: "22px", md: "26px" }}
                gutterBottom
              >
                Available Rewards
              </Typography>

              <Box boxShadow={3} borderRadius={3}>
                <Paper
                  sx={{
                    p: { xs: 2, sm: 2.5, md: 3 },
                    borderRadius: 2,
                    maxWidth: "1000px",
                    mx: "auto",
                  }}
                >
                  <LoyaltyProgramTable
                    headers={availableRewardTableHeaders}
                    data={rewardTableData}
                    type="1"
                    loading={loading}
                    emptyMessage="No rewards available yet"
                  />
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Redeem Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "16px",
            p: 3,
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: "1.5rem", color: "white" }}>
            🎁 Redeem Your Reward
          </DialogTitle>

          <DialogContent dividers sx={{ borderColor: "rgba(255,255,255,0.2)" }}>
            {selectedReward && (
              <>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {selectedReward.name}
                </Typography>
                <Typography sx={{ opacity: 0.85 }}>
                  Requires: <strong>{selectedReward.points.toLocaleString()} points</strong>
                </Typography>
                <Typography sx={{ mt: 2 }}>{selectedReward.description}</Typography>

                <Box mt={3}>
                  <TextField
                    label="Your Code"
                    type={showCode ? "text" : "password"}
                    value={generatedCode}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowCode(!showCode)}
                            sx={{ color: "white" }}
                          >
                            {showCode ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                          <IconButton onClick={handleCopyCode} sx={{ color: "white" }}>
                            <ContentCopy />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ style: { color: "white" } }}
                    sx={{
                      input: { color: "white" },
                      label: { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                        "&:hover fieldset": { borderColor: "white" },
                      },
                    }}
                  />
                </Box>
              </>
            )}
          </DialogContent>

          <DialogActions sx={{ justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ borderColor: "#fff", color: "#fff" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{ bgcolor: "#00cec9", "&:hover": { bgcolor: "#00b7b1" } }}
            >
              Confirm Redeem
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Code copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};
