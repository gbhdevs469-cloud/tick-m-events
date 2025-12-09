import {
    TableContainer,
    Table,
    TableRow,
    TableBody,
    Paper,
    TableHead,
    TableCell
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function MusicFestivalTable({
    headers,
    data,
    type,
}: {
    headers: string[];
    type: string;
    data: any[];
}) {
    const theme = useTheme();

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {headers.map((header) => (
                            <TableCell
                                key={header}
                                align="center"
                                sx={{
                                    bgcolor: "#1F8FCD",
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.8rem", sm: "1rem" },
                                    color: theme.palette.common.white,
                                }}
                            >
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {data.map((row, index) => (
                        // First check if tickets exist, otherwise show "No tickets" row
                        row.tickets?.length > 0 ? (
                            // Map through each ticket in the tickets array
                            row.tickets.map((ticket: any, ticketIndex: any) => (
                                <TableRow
                                    key={ticket._id || `${index}-${ticketIndex}`}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#e0e0e0",
                                    }}
                                >
                                    <TableCell align="center" sx={{ textTransform: "uppercase", fontWeight: "bold" }}>
                                        {ticket.ticketType || "N/A"}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                        {ticket.price || "N/A"}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                        {ticket.description || "N/A"}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                        Available
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            // Show this if no tickets exist for this event
                            <TableRow key={`no-tickets-${index}`}>
                                <TableCell colSpan={4} align="center">
                                    No tickets available
                                </TableCell>
                            </TableRow>
                        )
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
