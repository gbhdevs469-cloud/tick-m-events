import { Typography, TableContainer, Table, TableRow, TableBody, Paper, TableHead, TableCell, Button, Box } from "@mui/material";
import { useTheme } from '@mui/material/styles';


export function LoyaltyProgramTable({ headers, data }: any) {
    const theme = useTheme();

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
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.8rem", sm: "1rem" },
                                    color: theme.palette.common.white,
                                    backgroundColor: "#1F8FCD",
                                    textAlign: 'center',
                                }}
                            >
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={headers.length} align="center" sx={{ py: 3 }}>
                                <Typography color="text.secondary" fontSize="0.9rem">
                                    No record found.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (data.map((row: any, index: number) => (
                        <TableRow key={index} sx={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #E1E1E1" }}>
                            {Object.keys(row).map((key, idx) => (
                                <TableCell
                                    key={idx}
                                    sx={{
                                        fontSize: { xs: "0.8rem", sm: "1rem" },
                                        fontWeight: "normal",
                                        textAlign: 'center',
                                        ...(key === 'status' && {
                                            color: 'black',
                                            fontWeight: 'bold',
                                            borderRadius: '4px',
                                            textAlign: 'center',
                                            ...(row[key] === 'Used' && {
                                                color: '#2B9A58',
                                            }),
                                            ...(row[key] === 'Pending Use' && {
                                                color: '#FFA50F',
                                            }),
                                            ...(row[key] === 'Pending' && {
                                                color: '#ff9800',
                                            }),
                                        }),
                                    }}
                                >
                                    {key === "action" ? (
                                        row[key] === "Insufficient Points" ? (
                                            <Typography
                                                sx={{
                                                    color: "#ff9800", // Orange color for insufficient points
                                                    fontWeight: 600,
                                                    fontSize: { xs: "0.7rem", sm: "1rem" }
                                                }}
                                            >
                                                {row[key]}
                                            </Typography>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: "#0B2E4E",
                                                    color: theme.palette.common.white,
                                                    "&:hover": { backgroundColor: "#0b243d" },
                                                    fontSize: { xs: "0.7rem", sm: "1rem" },
                                                    width: { xs: "100%", sm: "auto" }
                                                }}
                                            >
                                                {row[key]}
                                            </Button>
                                        )
                                    ) : (
                                        row[key]
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                        )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}