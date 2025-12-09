import { Typography, TableContainer, Table, TableRow, TableBody, Paper, TableHead, TableCell, Box, IconButton } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export function ParticipantTable({ headers, data, ticketQuantities, handleDecrement, handleIncrement }: any) {
    const theme = useTheme();

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: "#E1E1E1" }}>
                        {headers.map((header: string) => (
                            <TableCell
                                key={header}
                                align="center"
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.8rem", sm: "1rem" },
                                    color: theme.palette.common.white,
                                    backgroundColor: "#1F8FCD",
                                }}
                            >
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {data?.length === 0 || data?.every((ticket: any) => ticket?.tickets?.length === 0) ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                <Typography variant="body1" color="textSecondary">
                                    No ticket available
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data?.map((ticket: any) => (
                            ticket?.tickets?.length > 0 ? (
                                ticket?.tickets?.map((row: any, index: any) => (
                                    <TableRow key={row._id} sx={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #E1E1E1" }}>
                                        {/* Your existing table cells */}
                                        <TableCell align="center" sx={{ fontSize: { xs: "0.8rem", sm: "1rem" }, fontWeight: "normal" }}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                fontSize: { xs: "0.8rem", sm: "1rem" },
                                                fontWeight: "normal",
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            {row.ticketType} Ticket
                                            {row.isLimitedSeat && row.totalTickets === "0" && (
                                                <span style={{ color: "#3CB1F1" }}> (Sold Out)</span>
                                            )}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                fontSize: { xs: "0.8rem", sm: "1rem" },
                                                fontWeight: "normal",
                                            }}
                                        >
                                            {row?.price}
                                            {row.isLimitedSeat && row.totalTickets !== "0" && (
                                                <span style={{ fontSize: "0.8rem", color: "#666" }}>
                                                    ({row.totalTickets} available)
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                fontSize: { xs: "0.8rem", sm: "1rem" },
                                                fontWeight: "normal",
                                            }}
                                        >
                                            {row?.description}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                fontSize: { xs: "0.8rem", sm: "1rem" },
                                                fontWeight: "normal",
                                            }}
                                        >
                                            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: theme.palette.grey[300],
                                                        '&:hover': { backgroundColor: theme.palette.grey[400] },
                                                        '&:disabled': { opacity: 0.5 }
                                                    }}
                                                    onClick={() => handleDecrement(row?._id)}
                                                    disabled={ticketQuantities[row?._id] <= 0}
                                                >
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>
                                                <Typography mx={1}>{ticketQuantities[row?._id] || 0}</Typography>
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: theme.palette.grey[300],
                                                        '&:hover': { backgroundColor: theme.palette.grey[400] }
                                                    }}
                                                    onClick={() => handleIncrement(row?._id, row?.totalTickets)}
                                                    disabled={row?.isLimitedSeat && row?.totalTickets !== "0" &&
                                                        ticketQuantities[row?._id] >= parseInt(row?.totalTickets, 10)}
                                                >
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                        {/* Rest of your table cells */}
                                    </TableRow>
                                ))
                            ) : null
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}