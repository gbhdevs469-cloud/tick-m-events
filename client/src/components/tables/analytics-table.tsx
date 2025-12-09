import { TableContainer, Table, TableRow, TableBody, Paper, TableHead, TableCell, TextField, Button } from "@mui/material";
import { useTheme } from '@mui/material/styles';

export function AnalyticsTable({ headers, data, type }: any) {
    const theme = useTheme();

    return (
        <TableContainer component={Paper}>
            <Table>
                {/* Table Header */}
                <TableHead>
                    <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                        {headers.map((header: string) => (
                            <TableCell
                                key={header}
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.8rem", sm: "1rem" }, // Responsive text size
                                    color: theme.palette.common.white,
                                    backgroundColor: theme.palette.primary.main,
                                }}
                            >
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody>
                    {data.map((row: any, index: number) => (
                        <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#e0e0e0" }}>
                            {Object.keys(row).map((key, idx) => (
                               <TableCell
                               key={idx}
                               sx={{
                                   fontSize: { xs: "0.8rem", sm: "1rem" },
                                   fontWeight: idx === 0 ? "bold" : "normal", // First column bold
                               }}
                           >
                               {/* Conditionally render inputs or text based on column name */}
                               {type === "1" && ["price", "total", "remaining"].includes(key) ? (
                                   <TextField
                                       fullWidth
                                       sx={{ minWidth: { xs: "80px" } }}
                                       variant="outlined"
                                       size="small"
                                       defaultValue={row[key]}
                                   />
                               ) : key === "revenue" && type === "1" ? (
                                   <Button
                                       variant="contained"
                                       sx={{
                                           backgroundColor: "#0B2E4E",
                                           color: theme.palette.common.white,
                                           "&:hover": { backgroundColor: "#0b243d" },
                                           fontSize: { xs: "0.7rem", sm: "1rem" },
                                           width: { xs: "100%", sm: "auto" } // Full width on mobile
                                       }}
                                   >
                                       Edit
                                   </Button>
                               ) : (
                                   row[key]
                               )}
                           </TableCell>
                           
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
