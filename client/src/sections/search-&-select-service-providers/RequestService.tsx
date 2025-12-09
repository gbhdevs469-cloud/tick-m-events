// RequestService.tsx
import { Box, Typography } from "@mui/material";
import { ServiceRequestTable } from "src/components/tables/service-request-table";

type Props = {
  requests: any[];
};

export default function RequestService({ requests }: Props) {
  return (
    <Box
      sx={{
        p: 3,
        my: 3,
        borderRadius: 3,
        backgroundColor: "#fff",
        border: "1px solid #E0E0E0",
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Your Service Requests
      </Typography>
      <ServiceRequestTable
        requests={requests}
      />
    </Box>
  );
}
