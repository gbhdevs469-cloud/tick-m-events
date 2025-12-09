import {
    TableContainer,
    Table,
    TableRow,
    TableBody,
    Paper,
    TableHead,
    TableCell,
    Avatar,
    Box,
    Chip,
    Typography
} from "@mui/material";
import { formatDateTimeCustom, formatTimeToAMPM } from "src/hooks/formate-time";
import {
    NoAccounts as NoAccountsIcon
} from '@mui/icons-material';
import { headerStyle } from "./utils";

interface TableData {
    _id: string,
    name: string;
    ticketType: string;
    entryTime: string;
    status: string;
    // Assuming your data might also have these fields based on your example
    userId: {
        name: string;
    };
    ticketCode:any,
    validation: boolean;
    tickets?: Array<{
        ticketType: string;
        // other ticket properties...
    }>;
}

interface EventValidationTableProps {
    headers: string[];
    data: TableData[];
}



export function EventValidationTable({ headers, data }: EventValidationTableProps) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {headers.map((header) => (
                            <TableCell key={header} align="center" sx={headerStyle}>
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                {
                    data?.length ? (<TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index} sx={{
                                backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#e0e0e0",
                            }}>
                                <TableCell align="center" sx={{fontWeight:600}}>{row.ticketCode}</TableCell>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell align="center">
                                    {row.ticketType || 'N/A'}
                                </TableCell>
                                <TableCell align="center">{formatDateTimeCustom(row.entryTime || 'N/A')}</TableCell>
                                <TableCell align="center" sx={{fontWeight:600, color:"green"}}>
                                    {row.validation ? 'Validated' : 'Invalid'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>) : (
                        <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    color: 'text.secondary'
                                }}>
                                    <NoAccountsIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                                        No Entries Yet
                                    </Typography>
                                    <Typography variant="body2" sx={{ maxWidth: 300, textAlign: 'center' }}>
                                        Attendees who have entered the event will appear here.
                                        Check back later for real-time updates.
                                    </Typography>
                                </Box>
                            </TableCell>
                        </TableRow>
                    )
                }

            </Table>
        </TableContainer>
    );
}