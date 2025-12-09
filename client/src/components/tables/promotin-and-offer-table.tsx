import {
    TableContainer,
    Typography,
    Table,
    TableRow,
    TableBody,
    Paper,
    TableHead,
    TableCell,
    Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { memo } from "react";

// utils/dateFormatter.js
function formatDate(dateString: any) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    // Format: "Apr 23, 2025"
};

const PromotionAndOfferTable = ({
    headers,
    data,
    onModify,
    onStatusChange,
    onCancelEdit,
}: {
    headers: string[];
    data: any[];
    onModify: (rowData: any) => void;
    onStatusChange: (id: string, newStatus: string) => void;
    onCancelEdit?: () => void;
}) => {
    const theme = useTheme();
    const handleModifyClick = (rowData: any) => {
        onModify(rowData);  // Call the callback with row data
    };
    const handleCancelClick = (rowData: any) => {
        const updatedStatus = rowData.status === 'active' ? 'inActive' : 'active'; // Toggle or set to 'inActive'
        onStatusChange(rowData._id, updatedStatus);
        if (onCancelEdit) {
            onCancelEdit();
        }

    };
    return (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        {headers.map((header) => (
                            <TableCell
                                key={header}
                                align="center"
                                sx={{
                                    bgcolor: "#D9D9D9",
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.8rem", sm: "1rem" },
                                    color: theme.palette.common.black,
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
                                    No active promotions available
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    backgroundColor: "#FFF",
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
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "capitalize" }}>
                                    {row.promotionType}
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                    {formatDate(row.validityPeriodStart)}
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                    {row.discountValue}
                                </TableCell>
                                <TableCell align="center" sx={{
                                    fontWeight: "bold",
                                    textTransform:"capitalize",
                                    color:
                                        row.status === "active" ? "#00BE10" : "#BE0003"
                                }}>
                                    {row.status}
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            marginX: 0.5,
                                            color: "white",
                                            borderColor: "gray",
                                            backgroundColor: "#0B2E4C"
                                        }}
                                        onClick={() => handleModifyClick(row)}
                                    >
                                        Modify
                                    </Button>

                                </TableCell>
                            </TableRow>
                        ))
                    )}

                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default memo(PromotionAndOfferTable)