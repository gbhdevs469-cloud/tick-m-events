import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";
 
export function HelpCenterAndSecurity() {
    return (
        <>
            <Box mt={3} p={3} boxShadow={3} borderRadius={3} >
                {/* Help Center Title */}
                <Typography variant="h5" fontWeight="bold" gutterBottom color="#0B2E4E">
                    Help Center & Security
                </Typography>
                {/* Quick FAQ Section */}
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                    Quick FAQ
                </Typography>
                <Grid container spacing={2}>
                    {["Revenue payments are processed based on your selected payout method. Withdrawals can be made via Mobile Money, Bank Transfer, or Credit Card.",
                        "Pending funds are transactions that are still being verified or within the holding period before becoming available for withdrawal.",
                        "If a payment fails, check your payment method details, ensure sufficient balance, or contact support for further assistance.",
                        "Go to Payment Settings, select 'Add a Payment Method', and enter your credit card details for verification."].map((text, index) => (
                            <Grid item xs={12} key={index}>
                                <Paper sx={{ p: 2, backgroundColor: "#E0E3E7", borderRadius: 2 }}>
                                    <Typography>{text}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                </Grid>
 
                {/* Quick Access to Support Section */}
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                    Quick Access to Support
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Link to="/contact-us" target="__blank">
                            <Button fullWidth variant="contained" sx={{ backgroundColor: "#0a2940", borderRadius: 3 }}>
                                Contact a TICK-M EVENTS Advisor
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </>
 
    )
}