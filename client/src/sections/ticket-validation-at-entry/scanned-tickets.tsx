import { Box, Button, Card, Grid } from "@mui/material";
import { useEffect, useState } from "react";

import { formatTimeTo12Hour } from "src/hooks/formate-time";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

import axios from "../../redux/helper/axios";

export function ScannedTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(3); // Start with 3 tickets visible

    useEffect(() => {
        const fetchValidatedTickets = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/event-order/validated');

                if (response.data.success) {
                    setTickets(response.data.tickets);
                } else {

                    setError(response.data.message || 'Failed to fetch tickets');
                }
            } catch (err) {
                setError(err.response.data.message || 'An error occurred while fetching tickets');
            } finally {
                setLoading(false);
            }
        };

        fetchValidatedTickets();
    }, []);

    const loadMoreTickets = () => {
        setVisibleCount(prevCount => prevCount + 3); // Show 3 more tickets
    };

    if (loading) {
        return <HeadingCommon variant="body2" title="Loading tickets..." baseSize="16px" weight={400} />
    }

    if (error) {
        return <Box
            display="flex"
            justifyContent="center" // horizontal centering
            alignItems="center"    // vertical centering
            minHeight="100px"
            m="auto"
        >
            <HeadingCommon
                variant="body2"
                title={error}
                baseSize="16px"
                weight={400}
            />
        </Box>
    }

    if (tickets.length === 0) {
        return <HeadingCommon variant="body2" title="No validated tickets found" baseSize="16px" weight={400} />
    }

    const visibleTickets = tickets.slice(0, visibleCount);
    const hasMoreTickets = tickets.length > visibleCount;

    return (
        <Grid item xs={12} md={12}>
            <Card sx={{ p: 3, borderRadius: "12px" }}>
                <HeadingCommon variant="body2" title="Scanned Tickets" weight={600} />
                <HeadingCommon variant="body2" title="Please keep your QR code visible for quick scanning." baseSize="16px" weight={400} />

                {/* Visible Tickets */}
                {visibleTickets.map((ticket: any, index: any) => (
                    <Box
                        key={ticket._id || index}
                        display="flex"
                        justifyContent="space-between"
                        borderBottom="1px solid #ddd"
                        py={1}
                    >
                        <Box>
                            <HeadingCommon title={ticket?.event?.name || 'Unnamed Event'} baseSize="16px" weight={600} />
                            <HeadingCommon variant="body2" title={`Date: ${ticket?.event?.date || 'N/A'} | Time: ${formatTimeTo12Hour(ticket?.event?.time) || 'N/A'}`} baseSize="16px" weight={400} />
                        </Box>
                        <HeadingCommon color="#3A8810" variant="body2" title="Validated" baseSize="16px" weight={600} />

                    </Box>
                ))}

                {/* Load More Button - Only shows if there are more tickets */}
                {hasMoreTickets && (
                    <Button
                        fullWidth
                        onClick={loadMoreTickets}
                        sx={{
                            mt: 2,
                            backgroundColor: "#0D3B66",
                            color: "white",
                            "&:hover": { backgroundColor: "#092C4C" },
                        }}
                    >
                        View My Full History
                    </Button>
                )}
            </Card>
        </Grid>
    );
}