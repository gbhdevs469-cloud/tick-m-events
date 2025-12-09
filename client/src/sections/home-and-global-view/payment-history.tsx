import { Box, Paper, Typography } from "@mui/material";
import { useState } from "react";

export function PaymentHistory() {
    const [selectedTicket, setSelectedTicket] = useState("all"); // Default to "all"
    const [selectedTicketDate, setSelectedTicketDate] = useState("all"); // Default to "all"

    return (
        <>
            <Typography variant="h5" fontSize={{ xs: 20, sm: 25, md: 33 }} fontWeight={600} sx={{ mt: 3 }} >
                Payment History
            </Typography>

            <Box mt={2} boxShadow={3} borderRadius={3} >
                {/* Card Wrapper */}
                <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2, maxWidth: "1000px", mx: "auto" }}>
                    {/* Filters */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "column", md: "row" }, // Stack on xs & sm, row on md+
                            alignItems: { xs: "stretch", sm: "stretch", md: "center" }, // Full width on small screens
                            gap: 2, // Maintain spacing
                            flexWrap: "wrap", // Wrap items for better fit
                            mb: 2
                        }}
                    />
                   


                    {/* Table with filtered data */}
                    
                </Paper>
            </Box>
        </>
    )
}