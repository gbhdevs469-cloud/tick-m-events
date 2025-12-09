import { Box, Tab, Tabs, Typography } from "@mui/material";

export function TabButton({ providersList, tabValue, onChange, tabLabels }: any) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Tabs
        value={tabValue}
        onChange={onChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        TabIndicatorProps={{ style: { display: "none" } }}
        textColor="inherit"
        sx={{
          "& .MuiTabs-scroller": {
            overflow: "auto !important",
            display: 'flex',
            alignItems: 'center'
          },
          flex: 1
        }}
      >
        {tabLabels.map((label: any, index: any) => (
          <Tab
            key={index}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {label}
               
              </Box>
            }
            sx={{
              px: { xs: 1, sm: 3 },
              margin: "0px 5px",
              minWidth: "unset",
              textTransform: "none",
              borderRadius: 2,
              border: "1px solid #0B2E4C",
              backgroundColor: tabValue === index ? "#0B2E4C" : "white",
              fontWeight: tabValue === index ? "bold" : "normal",
              color: tabValue === index ? "white" : "black",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              '&.Mui-disabled': {
                opacity: 0.5,
                borderColor: '#ccc'
              }
            }}
          />
        ))}
      </Tabs>
    </Box>
  )
}