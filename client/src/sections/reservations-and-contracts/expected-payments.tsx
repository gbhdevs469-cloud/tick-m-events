import { Box, Paper,Button,MenuItem, Grid, Select, Typography } from "@mui/material";
import { useState } from "react";
import { ReservationsAndContractsTable } from "src/components/tables/reservations-&-contracts-table";
import { expectedPaymentsTableData, expectedPaymentsTableHeader } from "./utills";

export function ExpectedPayments({requests}:any) {
    const [paymentMethod, setPaymentMethod] = useState("");

    return (
        <Box mt={4}>
            <Paper
                elevation={6}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    boxShadow: "0 4px 30px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                }}
            >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Expected Payments
                </Typography>
                <Typography variant="body2" mb={2}>
                    Displays the status of payments after service completion.
                </Typography>

                <ReservationsAndContractsTable headers={expectedPaymentsTableHeader} data={requests} type="4" />
                {/* Request Details */}

                {/* Update My Payment Method Button */}

                <Box mt={3}>
                    <Button
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            borderRadius: "10px",
                            fontWeight: 500,
                            color: "#000",
                            borderColor: "#000",
                            "&:hover": {
                                backgroundColor: "#f5f5f5",
                                borderColor: "#000",
                            },
                        }}
                    >
                        Update My Payment Method
                    </Button>
                </Box>

                {/* Update Payment Method Card */}
                <Box
                    mt={4}
                    display="flex"
                    justifyContent="center"
                    width="100%"
                >
                    <Paper
                        elevation={4}
                        sx={{
                            width: {
                                xs: '100%',
                                sm: '80%',
                                md: '60%',
                                lg: '70%',
                            },
                            px: { xs: 2, sm: 3 },
                            py: { xs: 2, sm: 3 },
                            borderRadius: "16px",
                            boxShadow: "0 2px 30px rgba(0, 0, 0, 0.15)",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            mb={2}
                        >
                            Update Payment Method
                        </Typography>

                        <Grid container spacing={2}>
                            {/* Select full width */}
                            <Grid item xs={12}>
                                <Select
                                    fullWidth
                                    displayEmpty
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    sx={{
                                        borderRadius: "10px",
                                        fontSize: 14,
                                        height: 40,
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Select Payment Method
                                    </MenuItem>
                                    <MenuItem value="mobile">Mobile Money</MenuItem>
                                    <MenuItem value="bank">Bank Transfer</MenuItem>
                                </Select>
                            </Grid>

                            {/* Save Changes button on next line, aligned right */}
                            <Grid item xs={12} textAlign="right">
                                <Button
                                    variant="outlined"
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: "10px",
                                        height: 40,
                                        px: 2,
                                        fontSize: 14,
                                        fontWeight: 500,
                                        color: "#000",
                                        borderColor: "#000",

                                    }}
                                >
                                    Save Changes
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </Paper>
        </Box>
    )
}