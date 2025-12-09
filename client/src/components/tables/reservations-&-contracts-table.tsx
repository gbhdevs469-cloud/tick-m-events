import {
    TableContainer,
    Table,
    TableRow,
    TableBody,
    Paper,
    TableHead,
    TableCell,
    Button, Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { formatTimeTo12Hour } from "src/hooks/formate-time";
import { ReservationsContractModal } from "../modal/reservations-contract-modal";


export function ReservationsAndContractsTable({
    headers,
    data,
    type
}: {
    headers: string[];
    type: string;
    data: any[];

}) {
    const theme = useTheme();
    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const handleOpenModal = (row: any) => {
        setSelectedRow(row);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRow(null);
    };
    return (
        <>
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
                        {!data || data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={headers.length} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body1" color="textSecondary">
                                        No Reqest available
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row) => (
                                <TableRow
                                    key={row._id}
                                    sx={{
                                        backgroundColor: "#e0e0e0",
                                        position: "relative",
                                        '&:not(:last-child)': {
                                            '&::after': {
                                                content: '""',
                                                position: "absolute",
                                                bottom: 0,
                                                left: "50%",
                                                transform: "translateX(-50%)", // Center the line
                                                width: "96%",         // You can adjust this to change the line length
                                                borderBottom: "1px solid #C3C3C3", // The border itself
                                            },
                                        },
                                    }}
                                >
                                    {
                                        type === '2' || type === '3' || type === '4' ? <TableCell align="center" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                                            {row?.serviceRequestId?.serviceType}
                                        </TableCell> :
                                            <TableCell align="center" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                                                {row?.organizerId?.name}
                                            </TableCell>
                                    }
                                    {
                                        type === '2' || type === '3' || type === '4' ? <TableCell align="center" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                                            {row?.eventId?.location}
                                        </TableCell> :
                                            <TableCell align="center" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                                                {row.serviceRequestId.serviceType}
                                            </TableCell>
                                    }
                                    {
                                        type === '2' || type === '3' ? <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                            {`${row?.eventId?.date} - ${formatTimeTo12Hour(row?.eventId?.time)}`}
                                        </TableCell> : null
                                    }
                                    {
                                        type === "4" ? <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                            Mobile Money
                                        </TableCell> : null
                                    }
                                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                        {`${row.orgBudget} XAF`}
                                    </TableCell>

                                    {
                                        <TableCell align="center"
                                            sx={{
                                                textTransform: 'capitalize',
                                                fontWeight: "bold",
                                                color:
                                                    row.contractStatus === "pending" ? "#F69809" :
                                                        row.contractStatus === "signed" ? "#3A86FF" :
                                                            row.contractStatus === "ongoing" ? "#8338EC" :
                                                                "#46B800" // default for completed
                                            }}>
                                            {row.contractStatus}
                                        </TableCell>
                                    }
                                    {
                                        type === '1' ? <TableCell align="center" >
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleOpenModal(row)}
                                                sx={{
                                                    marginX: 0.5,
                                                    color: 'black',
                                                    borderColor: "gray",
                                                    backgroundColor: "white"
                                                }}>View Details
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    marginX: 0.5,
                                                    color: 'white',
                                                    borderColor: "gray",
                                                    backgroundColor: "#0B2E4C"
                                                }}>Contact Client
                                            </Button>
                                        </TableCell>
                                            : type === '2' ? <TableCell align="center"  ><Button
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    marginX: 0.5,
                                                    color: 'white',
                                                    borderColor: "gray",
                                                    backgroundColor: "#0B2E4C"
                                                }}>View Contract
                                            </Button>
                                            </TableCell> :
                                                type === '3' ?
                                                    <TableCell align="center" width="30%">
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{
                                                                marginX: 0.5,
                                                                color: 'black',
                                                                borderColor: "gray",
                                                                backgroundColor: "white"
                                                            }}>Confirm Completion
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{
                                                                marginX: 0.5,
                                                                color: 'white',
                                                                borderColor: "gray",
                                                                backgroundColor: "#0B2E4C"
                                                            }}>Cancel
                                                        </Button>
                                                    </TableCell>
                                                    : <TableCell align="center" width="24%" >
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{
                                                                marginX: 0.5,
                                                                color: 'white',
                                                                borderColor: "gray",
                                                                backgroundColor: "#0B2E4C"
                                                            }}>View Transection Details
                                                        </Button>
                                                    </TableCell>
                                    }


                                </TableRow>
                            ))
                        )}

                   
                    </TableBody>
                </Table>
            </TableContainer>

            <ReservationsContractModal openModal={openModal} handleCloseModal={handleCloseModal} selectedRow={selectedRow} />
        </>
    );
}
