import { TableContainer, Table, TableRow, TableBody, Paper, TableHead, TableCell, Button, Box, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GridOnIcon from '@mui/icons-material/GridOn';
import { useState } from "react";
import { PaymentHistoryModal } from "../modal/payment-history-model";

export function TransactionAndPaymentTable({ headers = [], data = [], type }: any) {

    const [open, setOpen] = useState({ open: false, rowData: null });
    const theme = useTheme();
    const WithdrawalStatus = {
        Pending: 'pending',
        Approved: 'approved',
        Rejected: 'rejected',
        Completed: 'completed',
    };

    // Status color configuration
    const STATUS_COLORS = {
        [WithdrawalStatus.Pending]: {
            background: '#FFA726', // Orange
            hover: '#F57C00',
        },
        [WithdrawalStatus.Approved]: {
            background: '#4CAF50', // Green
            hover: '#388E3C',
        },
        [WithdrawalStatus.Rejected]: {
            background: '#F44336', // Red
            hover: '#D32F2F',
        },
        [WithdrawalStatus.Completed]: {
            background: '#2196F3', // Blue
            hover: '#1976D2',
        },
    };
    return (
        <TableContainer component={Paper}>
            <Table>
                {/* Table Header */}
                <TableHead>
                    <TableRow sx={{ bgcolor: "#E1E1E1" }}>
                        {headers.map((header: string) => (
                            <TableCell
                                key={header}
                                sx={{
                                    textAlign: 'center',
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.8rem", sm: "1rem" },
                                    color: theme.palette.common.black,
                                    backgroundColor: "#E1E1E1",
                                }}
                            >
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody>
                    {!data || data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={headers.length} align="center" sx={{ py: 4 }}>
                                <Typography variant="body1" color="textSecondary">
                                    {`No ${type === '5' ? "Withdrawal" : type === "2" ? "Refund" : null} Reqest available`}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row: any, index: number) => (
                            <TableRow key={index} sx={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #E1E1E1" }}>
                                {Object.keys(row).map((key, idx) => (
                                    <TableCell
                                        key={idx}
                                        sx={{
                                            textAlign: 'center',

                                            fontSize: { xs: "0.8rem", sm: "1rem" },
                                            fontWeight: "normal",
                                            ...(key === 'status' && {
                                                color: 'white',
                                                fontWeight: 'bold',
                                                borderRadius: '4px',
                                                textAlign: 'center',
                                                ...(row[key] === 'Approved' && {
                                                    color: '#4caf50',
                                                }),
                                                ...(row[key] === 'Rejected' && {
                                                    color: '#f44336',
                                                }),
                                                ...(row[key] === 'Pending' && {
                                                    color: '#ff9800',
                                                }),
                                                ...(row[key] === 'Confirmed' && {
                                                    color: '#4caf50',
                                                }),

                                            }),
                                        }}
                                    >
                                        {key === "details" && type === "1" ? (
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: '#0B2E4E',
                                                    color: theme.palette.common.white,
                                                    "&:hover": { backgroundColor: "#0b243d" },
                                                    fontSize: { xs: "0.7rem", sm: "1rem" },
                                                    width: { xs: "100%", sm: "auto" }
                                                }}
                                                onClick={() => setOpen({ open: true, rowData: row })}
                                            >
                                                {row[key]}
                                            </Button>
                                        ) : key === "action" && type === "2" ? (
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                {row[key].map((action: string, actionIdx: number) => (
                                                    <Button
                                                        key={actionIdx}
                                                        variant="contained"
                                                        disabled={row.status === "Approved"}
                                                        sx={{
                                                            backgroundColor: action === 'Accept'
                                                                ? theme.palette.success.main
                                                                : theme.palette.error.main,
                                                            color: 'white',
                                                            "&:hover": {
                                                                backgroundColor: action === 'Accept'
                                                                    ? theme.palette.success.dark
                                                                    : theme.palette.error.dark
                                                            },
                                                            fontSize: { xs: "0.7rem", sm: "0.8rem" },
                                                            px: 2,
                                                            textTransform: 'none'
                                                        }}
                                                    >
                                                        {action}
                                                    </Button>
                                                ))}
                                            </Box>
                                        ) : key === "action" && type === "3" ? (
                                            <Box sx={{ gap: 1 }}>
                                                {row[key].map((action: any, actionIdx: number) => {
                                                    const isObject = typeof action === 'object' && action !== null;
                                                    const label = isObject ? action.label : action;
                                                    const onClick = isObject ? action.onClick : undefined;

                                                    return (
                                                        <Button
                                                            key={actionIdx}
                                                            variant="contained"
                                                            disabled={row.status === "Pending"}
                                                            onClick={onClick}
                                                            sx={{
                                                                backgroundColor: label.includes('PDF') ? '#1C8BC8' : '#67C81C',
                                                                color: 'white',
                                                                "&:hover": {
                                                                    backgroundColor: label.includes('PDF') ? '#c62828' : '#2e7d32'
                                                                },
                                                                fontSize: { xs: "0.7rem", sm: "0.8rem" },
                                                                px: 2,
                                                                textTransform: 'none',
                                                                minWidth: { xs: '100px', sm: '120px' }
                                                            }}
                                                            startIcon={
                                                                label.includes('PDF') ? <PictureAsPdfIcon /> : <GridOnIcon />
                                                            }
                                                        >
                                                            {label}
                                                        </Button>
                                                    );
                                                })}

                                            </Box>
                                        ) : key === "action" && type === "5" ? (
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: "center" }}>
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        
                                                        backgroundColor: STATUS_COLORS[row.action]?.background || '#666666',
                                                        color: 'white',
                                                        "&:hover": {
                                                            backgroundColor: STATUS_COLORS[row.action]?.hover || '#555555'
                                                        },
                                                        fontSize: { xs: "0.7rem", sm: "0.8rem" },
                                                        px: 2,
                                                        textTransform: 'capitalize',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {row.action}
                                                </Button>
                                            </Box>
                                        ) : (
                                            row[key]
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}

                </TableBody>

                <PaymentHistoryModal
                    open={open.open}
                    rowData={open.rowData}
                    onClose={() => setOpen({ open: false, rowData: null })}
                />
            </Table>
        </TableContainer>
    );
}

// const handleDownloadPDF = (row: any) => {
//     const htmlContent = `
//     <html>
//       <head>
//         <title>Invoice</title>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 20px; }
//           h2 { text-align: center; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th, td { border: 1px solid #333; padding: 10px; text-align: left; }
//           th { background-color: #0B2E4C; color: white; }
//         </style>
//       </head>
//       <body>
//         <h2>Invoice</h2>
//         <table>
//           <tbody>
//             ${Object.entries(row).map(([key, value]) => {
//         if (key === 'action') return ''; // Skip action buttons
//         return `
//                 <tr>
//                   <th>${key.charAt(0).toUpperCase() + key.slice(1)}</th>
//                   <td>${value}</td>
//                 </tr>
//               `;
//     }).join('')}
//           </tbody>
//         </table>
//       </body>
//     </html>
//   `;
//     const blob = new Blob([htmlContent], { type: 'text/html' });
//     const fileName = `invoice-${row.invoiceId || 'document'}-${new Date().toISOString().split('T')[0]}.html`;
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = fileName;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(link.href);
// };
