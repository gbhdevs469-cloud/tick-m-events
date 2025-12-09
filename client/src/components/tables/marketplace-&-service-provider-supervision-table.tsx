import {
    TableContainer,
    Table,
    TableRow,
    TableBody,
    Paper,
    TableHead,
    TableCell,
    Button,
    Typography,
    Box
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export function MarketplaceAndServiceProviderSupervisionTable({
    headers,
    data,
    type,
    transactionData = []
}: {
    headers: string[];
    type: string;
    data: any[];
    transactionData?: any[];

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
                        <TableRow
                            key={index}
                            sx={{
                                backgroundColor: "#e0e0e0",
                                position: "relative",
                                '&:not(:last-child)': {
                                    '&::after': {
                                        content: '""',
                                        position: "absolute",
                                        bottom: 0,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        width: "96%",
                                        borderBottom: "1px solid #C3C3C3",
                                    },
                                },
                            }}
                        >
                            {headers.map((header, colIndex) => {
                                // Normalize header string to map to data keys
                                const keyMap: Record<string, string> = {
                                    "Date": "date",
                                    "Organizer": "organizer",
                                    "Provider": "provider",
                                    "Issue": "issue",
                                    "Budget": "budget",
                                    "Number of Services": "noService",
                                    "Revenue Earned": "earned",
                                    "Amount": "amount",
                                    "Payment Method": "method",
                                    "Satisfaction Rate": "rate",
                                    "Actions": "actions",
                                };
                                const dataKey = keyMap[header] || "";
                                const cellValue = row[dataKey];
                                if (header === "Status") {
                                    let statusColor = "#46B800";
                                    if (row.status === "Blocked") {
                                        statusColor = "#D90004";
                                    } else if (
                                        ["Pending", "Urgent", "Under Review"].includes(row.status)
                                    ) {
                                        statusColor = "#ACB800";
                                    }

                                    return (
                                        <TableCell
                                            key={colIndex}
                                            align="center"
                                            sx={{
                                                fontWeight: "bold",
                                                color: statusColor,
                                            }}
                                        >
                                            {row.status}
                                        </TableCell>
                                    );
                                }


                                if (header === "Actions" || header === "Action") {
                                    return (
                                        <TableCell key={colIndex} align="center">
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                gap={1}
                                                flexWrap="wrap"
                                            >
                                                {/* Note - shown first */}
                                                {row.note && (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: "#000",
                                                            fontWeight: 500,
                                                            fontSize: "14px",
                                                            whiteSpace: "nowrap" // Prevents breaking into new line
                                                        }}
                                                    >
                                                        {row.note}
                                                    </Typography>
                                                )}

                                                {/* Buttons */}
                                                {row.actions?.map((action: any, idx: number) => {
                                                    const label = action.trim();
                                                    const isContained = [
                                                        "Make a Decision",
                                                        "Block a Provider"
                                                    ].includes(label);

                                                    return (
                                                        <Button
                                                            key={idx}
                                                            variant={isContained ? "contained" : "outlined"}
                                                            size="small"
                                                            sx={{
                                                                color: isContained ? "white" : "black",
                                                                borderColor: "gray",
                                                                backgroundColor: isContained ? "#0B2E4C" : "white",
                                                                textTransform: "none",
                                                                fontSize: "13px",
                                                            }}

                                                        >
                                                            {label}
                                                        </Button>
                                                    );
                                                })}
                                            </Box>
                                        </TableCell>
                                    );
                                }

                                if (header === "Satisfaction Rate") {
                                    const rate = parseInt(row[dataKey] || "0", 10);
                                    return (
                                        <TableCell key={colIndex} align="center">
                                            {[...Array(5)].map((_, i) => (
                                                i < rate ? (
                                                    <StarIcon key={i} sx={{ color: "#000000", fontSize: 20 }} />
                                                ) : (
                                                    <StarBorderIcon key={i} sx={{ color: "#000", fontSize: 20 }} />
                                                )
                                            ))}
                                        </TableCell>
                                    );
                                }


                                return (
                                    <TableCell key={colIndex} align="center" sx={{ fontWeight: "bold" }}>
                                        {cellValue}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>


            </Table>

        </TableContainer>

    );
}
