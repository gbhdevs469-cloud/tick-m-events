import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Typography,
  Tooltip,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { formatTimeToAMPM } from "src/hooks/formate-time";

interface GrantedProps {
  flagData: any;
  onConfirmEntry: (event: React.FormEvent | null, customVerifyData?: any) => void;
  onCancel: () => void;
}

export function Granted({ flagData, onConfirmEntry, onCancel }: GrantedProps) {
  return (
    <Grid container spacing={2} mt={2}>
      <Grid item xs={12}>
        <Card
          sx={{
            backgroundColor: '#DFFFE0',
            borderRadius: "12px",
            padding: "12px",
            border: "2px solid #ddd",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
          }}
        >
          <HeadingCommon title={flagData.message} baseSize="23px" width={{ md: "34%" }} />
          <HeadingCommon
            title={`Entry Time: ${formatTimeToAMPM(new Date().toISOString())}`}
            baseSize="23px"
            width={{ md: "34%" }}
          />

          {Array.isArray(flagData.ticket.participantDetails) && (
            <Box mt={3}>
              <HeadingCommon title="Participant Details" color="#2aaa54ff" weight={600} baseSize="20px" />

              {flagData.ticket.participantDetails.length > 0 ? (
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                      <TableCell><b>Name</b></TableCell>
                      <TableCell><b>Age</b></TableCell>
                      <TableCell><b>Gender</b></TableCell>
                      <TableCell><b>Action</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {flagData.ticket.participantDetails.map((p: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>{p.age}</TableCell>
                        <TableCell>{p.gender}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: p.validation ? "gray" : "green",
                              color: "white",
                              borderRadius: "6px",
                              "&:hover": {
                                backgroundColor: p.validation ? "gray" : "darkgreen"
                              },
                            }}
                            disabled={p.validation}
                            onClick={() => onConfirmEntry(null, {
                              ticketCode: flagData.ticket.ticketCode || "",
                              participantId: p._id,
                              name: "",
                            })}
                          >
                            {p.validation ? "✔ Entered" : "Confirm"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography color="textSecondary" mt={2}>
                  No participant details available for this ticket.
                </Typography>
              )}
            </Box>
          )}

          <Box
            display="flex"
            justifyContent="space-between"
            my={1}
            flexDirection={{ xs: 'column', sm: 'row', md: 'row' }}
            gap={{ xs: 2, sm: 0, md: 0 }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "green",
                color: "white",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "darkgreen" },
                width: { xs: '100%', sm: 'auto', md: 'auto' }
              }}
              disabled={
                flagData.ticket.verifyEntry ||
                (flagData.ticket.participantDetails?.some((p: any) => !p.validation) ?? false)
              }
              onClick={(e) => onConfirmEntry(e)}
            >
              Confirm Entry
            </Button>

            <Box
              display="flex"
              alignItems="center"
              width={{ xs: '100%', sm: 'auto', md: 'auto' }}
              gap={1}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "darkred" },
                  width: { xs: '100%', sm: 'auto', md: 'auto' }
                }}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Tooltip
                title={
                  <>
                    <HeadingCommon color="white" title={`Name: ${flagData?.ticket?.userId?.name}`} baseSize="12px" />
                    <HeadingCommon color="white" title={`Email: ${flagData?.ticket?.userId?.email}`} baseSize="12px" />
                    <HeadingCommon
                      color="white"
                      title={`Ticket Type: ${flagData?.ticket?.tickets?.[0]?.ticketType || 'N/A'}`}
                      baseSize="12px"
                    />
                    <HeadingCommon
                      title={flagData?.ticket?.verifyEntry ? "Ticket Status: Verified" : "Ticket Status: Unverified"}
                      baseSize="12px"
                      color="white"
                    />
                  </>
                }
                arrow
              >
                <IconButton sx={{ ml: 1 }}>
                  <Iconify icon="mdi:information-outline" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}