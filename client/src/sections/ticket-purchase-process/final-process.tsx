import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check'; // Import check icon
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { RootState } from "src/redux/store";

import { HeadProcess } from "./head-process";
import axios from "../../redux/helper/axios";

export function FinalProcess({ onNext }: any) {
    const { order } = useSelector((state: RootState) => state?.order);


    const handleDownloadTicket = async (orderId: string) => {
        try {

            const response = await axios.get(`/event-order/ticket/${orderId}`, {
                responseType: 'blob',
            });
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ticket-${orderId}.pdf`);

            // Safely append and remove the link
            document.body.appendChild(link);
            link.click();

            // Type-safe removal
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }

            // Revoke the object URL to free memory
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('Error downloading ticket:', error);
        }
    };

    return (
        <Box mt={6}>
            <Paper sx={{ width: "100%", p: 4, boxShadow: 3, borderRadius: 2, position: "relative" }}>
                <HeadProcess title="Congratulations! Your Purchase is Confirmed" step={<CheckIcon />} />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',  // Horizontal centering
                        justifyContent: 'center',  // Vertical centering (if needed)
                        textAlign: 'center',  // Center text
                        mb: 2  // Optional bottom margin
                    }}
                >
                    <Typography>{order.ticketCode}</Typography>
                    <img
                        src={order?.qrCode}
                        alt="QR Code"
                        style={{
                            width: '200px',
                            height: '200px',
                            border: '1px solid #ddd',
                            borderRadius: '8px'
                        }}
                    />
                </Box>

                <Grid container spacing={2}>
                    {/* {["Add to Apple Wallet / Google Pay", "Share My Ticket", "View My Tickets"].map((label, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Button fullWidth variant="contained" sx={{ backgroundColor: "#0B2E4C", color: "#fff", "&:hover": { backgroundColor: "#333" } }}>
                                Download Full Report ({label})
                            </Button>
                        </Grid>
                    ))} */}
                    <Grid item xs={12} md={6}>
                        <Link to='/ticket-management'>
                            <Button fullWidth variant="contained" sx={{ backgroundColor: "#0B2E4C", color: "#fff", "&:hover": { backgroundColor: "#333" } }}>
                                Ticket History
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button onClick={() => handleDownloadTicket(order?._id)} fullWidth variant="contained" sx={{ backgroundColor: "#0B2E4C", color: "#fff", "&:hover": { backgroundColor: "#333" } }}>
                            Download My Ticket (PDF)
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}