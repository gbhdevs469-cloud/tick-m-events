import {
    TableContainer,
    Typography,
    Table, Chip,
    TableRow,
    TableBody,
    Paper,
    TableHead,
    TableCell, Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ContractDetailsModal } from "src/components/modal/contractModal";
import { formatDateTimeCustom } from "src/hooks/formate-time";
import { updateContractStatus } from "src/redux/actions/homeAndGlobal.action";
import { AppDispatch } from "src/redux/store";

export function ContractTable({
    headers,
    data,
    type,
}: {
    headers: string[];
    type: string;
    data: any[];
}) {

    const theme = useTheme();
    const [selectedContract, setSelectedContract] = useState<any>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedContractForStatus, setSelectedContractForStatus] = useState<any>(null);

    const dispatch = useDispatch<AppDispatch>();

    const handleViewContract = (contract: any) => {
        setSelectedContract(contract);
        setModalOpen(true);
    };

    const handleStatusChangeClick = (contract: any) => {
        setSelectedContractForStatus(contract);
        setStatusModalOpen(true);
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
                                        No projects avalable
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, index) => (
                                <TableRow

                                    key={row._id || index}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#e0e0e0",
                                    }}
                                >
                                    <TableCell align="center" sx={{ textTransform: "capitalize" }}>{row.serviceRequestId?.serviceType}</TableCell>
                                    <TableCell align="center" sx={{ textTransform: "capitalize" }}>{row.eventId?.eventName}</TableCell>
                                    <TableCell align="center" sx={{ textTransform: "capitalize" }}>{row.eventLocation}</TableCell>
                                    <TableCell align="center" sx={{ textTransform: "capitalize" }}>{row.providerProposal?.amount} XAF</TableCell>
                                    <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                                        <Chip
                                            label={row?.isSigned ? "Signed" : "Pending"}
                                            color={row?.isSigned ? "success" : "warning"}
                                            size="small"
                                            sx={{
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                fontSize: '0.65rem',
                                                backdropFilter: 'blur(4px)',
                                                backgroundColor: row?.isSigned ? 'rgba(46, 125, 50, 0.9)' : 'rgba(237, 108, 2, 0.9)',
                                                color: 'white'
                                            }}
                                        /></TableCell>
                                    <TableCell align="center" sx={{ textTransform: "capitalize" }}>{formatDateTimeCustom(row.serviceTime)}</TableCell>
                                    <TableCell width={200} align="center"
                                        sx={{ textTransform: "capitalize", display: "flex", justifyContent: "center" }}
                                    >
                                        <Button
                                            onClick={() => handleViewContract(row)}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                color: "white",
                                                borderColor: "gray",
                                                backgroundColor: "#0B2E4C"
                                            }}
                                        >
                                            View Contract
                                        </Button>
                                    </TableCell>

                                </TableRow>
                            ))
                        )
                        }
                    </TableBody>
                    <ContractDetailsModal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        contract={selectedContract}
                    />

                </Table>
            </TableContainer>
        </>
    );
}
