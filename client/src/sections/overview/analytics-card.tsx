import { Box, Paper } from '@mui/material';

import { Chart } from "src/components/chart";
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';

export function AnalyticsCard({ title, value, iconSrc, chartOptions, chartSeries, chartType, chartHeight, additionalContent }: any) {
  return (
    <Paper elevation={3} sx={{
      p: 2,
      borderRadius: "12px",
      textAlign: "center",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between" // Add this to distribute space
    }}>
      {/* Chart at the bottom */}
      <Box sx={{ flexGrow: 1, order: 2 }}> {/* Add order: 2 to move chart down */}
        <Chart
          options={chartOptions}
          series={chartSeries}
          type={chartType}
          height={chartHeight}
        />
      </Box>

      {/* Content above the chart */}
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        gap: 1,
        order: 1, // Add order: 1 to keep this above chart
        mb: 2 // Add some margin at bottom
      }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <HeadingCommon title={value} baseSize="15px" weight={600} />
          {/* {
            value !== "Free Tickets" && (
              <Box component="span">
                <Box
                  alt="Arrow"
                  component="img"
                  src={iconSrc}
                  width={12}
                  height={12}
                />
              </Box>
            )
          } */}

        </Box>
        <Box>
          <HeadingCommon title={title} color="#2395D4" baseSize="13px" weight={600} />
        </Box>
      </Box>

      {/* Additional content if any */}
      {additionalContent && (
        <Box sx={{ order: 3 }}> {/* Add order for additional content */}
          {additionalContent}
        </Box>
      )}
    </Paper>
  );
}