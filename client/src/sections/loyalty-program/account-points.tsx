import { useEffect } from "react";
import { Container, Grid, Card, CardContent, Typography, Button, Divider, Box, LinearProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import { fetchUserPoints } from "src/redux/actions/rewardActions";

export const AccountPoints = () => {
  const dispatch = useDispatch();

  // Get points from Redux store
  const points = useSelector((state: RootState) => state.reward.points || 0);

  // Define next level thresholds (you can adjust as needed)
  const nextLevelThresholds = [2000, 5000, 10000, 20000];
  const nextLevel = nextLevelThresholds.find(level => level > points) || points;

  // Calculate progress percentage
  const prevLevel = nextLevelThresholds.slice().reverse().find(level => level <= points) || 0;
  const progress = ((points - prevLevel) / (nextLevel - prevLevel)) * 100;

  // Fetch points on mount
  useEffect(() => {
    dispatch(fetchUserPoints() as any);
  }, [dispatch]);

  const earningActivities = [
    { label: "Purchase of a Standard Ticket", points: 10 },
    { label: "Purchase of a VIP Ticket", points: 10 },
    { label: "Purchase of a Premium Ticket", points: 10 },
    { label: "Sharing an event on social media", points: 10 },
    { label: "Inviting a friend to buy a ticket", points: 10 },
    { label: "Validation of attendance at an event (ticket scan or manual verification)", points: 30 },
    { label: "Sponsorship (registered godchild + 1st purchase)", points: 100 },
    { label: "Leave a verified review of an event", points: 20 }
  ];

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3, mt: 4, mb: 4 }} id="earn-more-points-section">
      <Typography variant="h6" fontWeight={600} fontSize={{ xs: "18px", sm: "22px", md: "26px" }} gutterBottom>
        My Accumulated Points
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: 14, p: 2, mt: 2 }}>
        <CardContent>
          <Box textAlign="center" mt={2}>
            <Typography fontWeight={500}>You currently have:</Typography>
            <Typography variant="h5" fontWeight="bold" color="#2090CE">
              {points.toLocaleString()} loyalty points
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 1, my: 2 }}
            />
            <Typography color="black">
              Next level at {nextLevel.toLocaleString()} points
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, boxShadow: 14, p: 2, mt: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            Ways to Earn More Points
          </Typography>
          <Box mt={2}>
            {earningActivities.map((activity, index) => (
              <Box key={index} display="flex" justifyContent="space-between" py={1}>
                <Typography fontWeight={500}>{activity.label}</Typography>
                <Typography color="#0B2E4C" fontWeight={600}>+{activity.points} pts</Typography>
              </Box>
            ))}
          </Box>
          <Button fullWidth variant="contained" sx={{ bgcolor: "#0B3558", borderRadius: 2, mt: 2 }}>
            Invite a Friend & Earn Points
          </Button>
        </CardContent>
      </Card>
    </Card>
  );
};
