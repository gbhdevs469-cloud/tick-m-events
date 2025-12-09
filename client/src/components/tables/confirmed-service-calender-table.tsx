import {
    TableContainer,
    Table,
    TableRow,
    TableBody,
    Paper,
    TableHead,
    TableCell,
    Button,
    Box,
    Typography,
    Checkbox
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function ConfirmedServiceCalenderTable({
    headers,
    data,
    type
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
                        <TableRow
                            key={`${row.service}-${index}`} // Better key combining unique identifier
                            sx={{
                                backgroundColor: "#e0e0e0",
                                position: "relative",
                                '&:not(:last-child)::after': {
                                    content: '""',
                                    position: "absolute",
                                    bottom: 0,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "96%",
                                    borderBottom: "1px solid #C3C3C3",
                                },
                            }}
                        >
                            {/* Common cell styling extracted to theme */}
                            {['service', 'location', 'date', 'payment'].map((field) => (
                                <TableCell
                                    key={field}
                                    align="center"
                                    sx={{ fontWeight: "bold" }}
                                >
                                    {row[field]}
                                </TableCell>
                            ))}

                            {/* Conditionally rendered reminders column */}
                            {type === "2" && (
                                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                     {row.reminders}
                                </TableCell>
                            )}

                            {/* Status with conditional coloring */}
                            {/* <TableCell
                                align="center"
                                sx={{
                                    fontWeight: "bold",
                                    color: row.status === "Pending Execution" ? "#F69809" : "#46B800"
                                }}
                            >
                                {row.status}
                            </TableCell>

                            <TableCell align="center">
                                <ActionButtons actions={row.actions} />
                            </TableCell> */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

// ReminderList.tsx
const ReminderList = ({ reminders, theme }: { reminders: string[] | undefined, theme: any }) => {
    if (!Array.isArray(reminders)) return null;

    return (
          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            {reminders.map((reminder, idx) => (
                <Box key={idx} display="flex" alignItems="center">
                    <Checkbox
                        checked
                        sx={{
                            padding: '4px',
                            color: theme.palette.primary.main,
                            '&.Mui-checked': { color: theme.palette.primary.main },
                        }}
                    />
                    <Typography variant="body2">{reminder}</Typography>
                </Box>
            ))}
        </Box>
    );
};


// ActionButtons.tsx
const ActionButtons = ({ actions }: { actions: string[] }) => (
    <>
        {actions?.map((action) => (
            <Button
                key={action}
                variant="outlined"
                size="small"
                sx={{
                    marginX: 0.5,
                    color: action !== "View Contract" ? "black" : "white",
                    borderColor: "gray",
                    m: 0.2,
                    backgroundColor: action !== "View Contract" ? "white" : "#0B2E4C"
                }}
            >
                {action}
            </Button>
        ))}
    </>
);