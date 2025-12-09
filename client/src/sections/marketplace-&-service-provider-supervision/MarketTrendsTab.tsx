// src/components/tabs/MarketTrendsTab.tsx
import { Typography, Badge, Box, Button, Grid, Paper } from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { TabButton } from "src/components/button/multiple-button";
import { fetchMonitoringMarketplace } from "src/redux/actions/admin/marketPlace-supervision";
import { AppDispatch, RootState } from "src/redux/store";

import { RequestTabSection } from "./request-tab-section";
import {
  marketTrendsTableData,
  marketTrendsTableHeader,
} from "./utills";
import { PerformanceSummary } from "./performance-summary";



export const MarketTrendsTab = ({ selectedProviderId,selectedProviderName }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { barGraphData,rawData,summary } = useSelector((state: RootState) => state?.admin?.performanceSumm);


  const [providerValue, setProviderValue] = useState(0);
  const providerLabels = [
    "Performance Summary",
    "Financial Analysis",
    "Client Feedback",
    "Recommendations",
  ];

  const handleProviderChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setProviderValue(newValue);
  };

  useEffect(() => {
    dispatch(fetchMonitoringMarketplace(selectedProviderId));
  }, [dispatch, selectedProviderId]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          mt: 3,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          {selectedProviderName || 'N/A'}
        </Typography>

        {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Badge
            badgeContent={12}
            color="primary"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#0048a5",
                color: "#fff",
                fontSize: "0.7rem",
                fontWeight: "bold",
              },
            }}
          >
            <NotificationsNoneOutlinedIcon color="action" />
          </Badge>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Notification | Overall Performance Status
          </Typography>
        </Box> */}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
          mb: 2
        }}
      >
        <TabButton
          tabValue={providerValue}
          tabLabels={providerLabels}
          onChange={handleProviderChange}
        />
      </Box>
      <Paper elevation={6}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          overflow: "hidden",
          mb: 3
        }}
      >
        {providerValue === 0 && (
          <PerformanceSummary barGraphData={barGraphData} rawData={rawData} summary={summary}/>
        )}

        {providerValue === 1 && (
          <RequestTabSection
            title="Finance"
            description=""
            type="2"
            headers={[]}
            data={[]}
          />
        )}
        {providerValue === 2 && (
          <RequestTabSection
            title="Client feedback"
            description=""
            type="3"
            headers={[]}
            data={[]}
          />
        )}
        {providerValue === 3 && (
          <RequestTabSection
            title="Recommendations"
            description=""
            type="4"
            headers={[]}
            data={[]}
          />
        )}
      </Paper>

      {/* <RequestTabSection
        title="Top Performing Service Providers"
        description=""
        headers={marketTrendsTableHeader}
        data={marketTrendsTableData}
        type="3"
      />

      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={4} sm={3}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                borderRadius: 3,
                backgroundColor: "#0B2E4C",
                color: "white",
                "&:hover": { backgroundColor: "#002244" },
              }}
            >
              View Full Report
            </Button>
          </Grid>
          <Grid item xs={4} sm={3}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                borderRadius: 3,
                backgroundColor: "#0B2E4C",
                color: "white",
                "&:hover": { backgroundColor: "#002244" },
              }}
            >
              Send Report to Providers
            </Button>
          </Grid>
        </Grid>
      </Box> */}
    </>
  );
};
