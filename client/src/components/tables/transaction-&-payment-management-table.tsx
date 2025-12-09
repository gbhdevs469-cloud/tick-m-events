import {
  TableContainer,
  Table,
  TableRow,
  TableBody,
  Paper,
  TableHead,
  TableCell,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

type TransactionAndPaymentManagementTableProps = {
  headers: string[];
  type: string;
  data: any[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function TransactionAndPaymentManagementTable({
  headers,
  data,
  type,
  onEdit,
  onDelete,
}: TransactionAndPaymentManagementTableProps) {

  const theme = useTheme();
  const handleClick = (action: string, rowId: string, index: number) => () => {
    if (action === "Update" && onEdit && rowId) {
      onEdit(rowId); // call parent edit handler
    } else if (action === "Remove" && onDelete && rowId) {
      onDelete(rowId); // call parent delete handler
    } else {
      console.log(`${action} clicked for row ${index + 1}`);
    }
  };

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
                "&:not(:last-child)": {
                  "&::after": {
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
              {/* Render only if type is "0" or "1" */}
              {(type === "0" || type === "1") && (
                <>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {row.date}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {row.requestedService}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {row.location}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {row.amount}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {row.commision}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {row.receivedAmount}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {row.paymentMethod}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color: row.status === "Pending" ? "#F69809" : "#46B800",
                    }}
                  >
                    {row.status}
                  </TableCell>
                  <TableCell align="center">
                    {row.actions?.map((action: string, idx: number) => (
                      <Button
                        key={idx}
                        variant={action === "Remove" ? "outlined" : "contained"}
                        size="small"
                        color={action === "Remove" ? "error" : "primary"}
                        sx={{
                          mx: 0.5,
                          textTransform: "none",
                          color: action === "Remove" ? "#d32f2f" : "white",
                          borderColor: action === "Remove" ? "#d32f2f" : "transparent",
                          backgroundColor: action === "Remove" ? "white" : "#0B2E4C",
                          "&:hover": {
                            backgroundColor: action === "Remove" ? "#ffebee" : "#002244"
                          }
                        }}
                        onClick={() => {
                          if (action === "Update" && onEdit && row.id) {
                            onEdit(row.id); // <-- Call parent edit handler with ID
                          } else {
                            console.log(`${action} clicked for row ${index + 1}`);
                          }
                        }}
                      >
                        {action}
                      </Button>
                    ))}

                  </TableCell>
                </>
              )}
              {type === "banking" && (
                <>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>{row.accountHolder}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>{row.accountNumber}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>{row.bankName}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>{row.cifNumber}</TableCell>
                  <TableCell align="center">
                    {row.actions?.map((action: string, idx: number) => (
                      <Button
                        key={idx}
                        variant={action === "Remove" ? "outlined" : "contained"}
                        size="small"
                        color={action === "Remove" ? "error" : "primary"}
                        sx={{
                          mx: 0.5,
                          textTransform: "none",
                          color: action === "Remove" ? "#d32f2f" : "white",
                          borderColor: action === "Remove" ? "#d32f2f" : "transparent",
                          backgroundColor: action === "Remove" ? "white" : "#0B2E4C",
                          "&:hover": {
                            backgroundColor: action === "Remove" ? "#ffebee" : "#002244"
                          }
                        }}
                        onClick={handleClick(action, row.id, index)}
                      >
                        {action}
                      </Button>

                    ))}
                  </TableCell>
                </>
              )}
              {type === "mobileMoney" && (
                <>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>{row.momoNumber}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>{row.provider}</TableCell>
                  <TableCell align="center">
                    {row.actions?.map((action: string, idx: number) => (
                      <Button
                        key={idx}
                        variant={action === "Remove" ? "outlined" : "contained"}
                        size="small"
                        color={action === "Remove" ? "error" : "primary"}
                        sx={{
                          mx: 0.5,
                          textTransform: "none",
                          color: action === "Remove" ? "#d32f2f" : "white",
                          borderColor: action === "Remove" ? "#d32f2f" : "transparent",
                          backgroundColor: action === "Remove" ? "white" : "#0B2E4C",
                          "&:hover": {
                            backgroundColor: action === "Remove" ? "#ffebee" : "#002244"
                          }
                        }}
                        onClick={handleClick(action, row.id, index)}
                      >
                        {action}
                      </Button>
                    ))}
                  </TableCell>
                </>
              )}
              {type === "card" && (
                <>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {row.details["Cardholder Name"]}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {row.details["Card Number"]}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {row.details["Expiry Date"]}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {/* You usually don't show CVV, so optional */}
                    ****
                  </TableCell>
                  <TableCell align="center">
                    {row.actions?.map((action: string, idx: number) => (
                      <Button
                        key={idx}
                        variant={action === "Remove" ? "outlined" : "contained"}
                        size="small"
                        color={action === "Remove" ? "error" : "primary"}
                        sx={{
                          mx: 0.5,
                          textTransform: "none",
                          color: action === "Remove" ? "#d32f2f" : "white",
                          borderColor: action === "Remove" ? "#d32f2f" : "transparent",
                          backgroundColor: action === "Remove" ? "white" : "#0B2E4C",
                          "&:hover": {
                            backgroundColor: action === "Remove" ? "#ffebee" : "#002244",
                          },
                        }}
                        onClick={handleClick(action, row.id, index)}
                      >
                        {action}
                      </Button>
                    ))}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
