import { Typography, IconButton, Box, Button, Card, Grid, Tooltip, TableCell, TableBody, Table, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import QrReader from 'react-qr-scanner'
import { useDispatch } from "react-redux";

import { Iconify } from "src/components/iconify";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { verifyTicketCode, confirmTicketEntry } from "src/redux/actions/eventOrder";
import { AppDispatch } from "src/redux/store";
import { formatTimeToAMPM } from "src/hooks/formate-time";

interface Ticket {
    _id: string;
    eventId: string;
    tickets: Array<{
        ticketType: string;
        // add other ticket properties as needed
    }>;
    verifyEntry: boolean;
    entryTime?: string;
    userId?: {
        name: string;
        email: string;
        _id: string;
    };
    ticket: null;
    participantDetails?: Array<{
        name: string;
        age: string;
        gender: string;
        validation?: boolean;
        _id?: string;
    }>;

}

interface TicketScannerProps {
    _selectEve: any;
}

export function TicketScanner({ _selectEve }: TicketScannerProps) {

    const dispatch = useDispatch<AppDispatch>();
    const [delay] = useState<number>(100);
    const [result, setResult] = useState<string>('No result');
    const [showScanner, setShowScanner] = useState<boolean>(false);
    const [flag, setFlag] = useState<{
        status: string;
        message: string;
        ticket?: Partial<Ticket> | null
    }>({ status: '', message: '' });
    const [isScanning, setIsScanning] = useState(false);
    const [scanMessage, setScanMessage] = useState<string | null>(null);
    const [hasScanned, setHasScanned] = useState(false);
    const allParticipantsValidated = flag.ticket?.participantDetails?.every(p => p.validation) ?? false;

    const handleScan = async (data: any) => {
        if (data && !hasScanned) {
            let scannedText = "";

            if (typeof data === "string") {
                scannedText = data;
            } else if (typeof data === "object" && data?.text) {
                scannedText = data.text;
            } else {
                console.error("Unexpected scan data:", data);
                return;
            }

            setResult(scannedText);
            setScanMessage("✅ QR Code scanned successfully!");
            setHasScanned(true);
            setShowScanner(false);
            setIsScanning(false);
            setTimeout(() => setScanMessage(null), 3000);

            try {
                const parts = scannedText.split("/");
                const ticketCode = parts[parts.length - 1];
                const eventId = parts[parts.length - 1];

                const res = await dispatch(verifyTicketCode({ ticketCode, eventId: _selectEve?._id, }));
                if (res.type === "VERIFY_TICKET_SUCCESS") {
                    const ticket = res.ticket;

                    // 🔴 check payment status first
                    if (ticket.paymentStatus !== "confirmed") {
                        setFlag({
                            status: "payment-pending",
                            message: "❌ Payment not confirmed. Please complete payment.",
                            ticket: null,
                        });
                        return;
                    }

                    // proceed with normal checks
                    if (res.flag === "granted") {
                        setFlag({ status: "granted", message: res.message, ticket });
                    } else if (res.flag === "already") {
                        setFlag({ status: "already", message: "Ticket already used.", ticket });
                    } else if (res.flag === "expired") {
                        setFlag({ status: "expired", message: "Ticket has expired.", ticket });
                    } else {
                        setFlag({ status: "invalid", message: "Invalid or expired ticket.", ticket: null });
                    }
                } else {
                    setFlag({ status: "error", message: res.message, ticket: null });
                }
            } catch (err) {
                console.error(err);
                setFlag({ status: "error", message: "Verification failed. Try again." });
            }
        }
    };


    const handleError = (err: Error) => {
        setIsScanning(false);
        setScanMessage("❌ QR Scanner encountered an error.");
        setTimeout(() => setScanMessage(null), 3000);
    };

    const handleVerifyClick = async () => {
        if (!result || result === 'No result') return;
        // Extract ticket code from the result (full URL or path)
        let ticketCode = result;
        try {
            const url = new URL(result);
            const parts = url.pathname.split('/');
            ticketCode = parts[parts.length - 1];
        } catch {

            const parts = result.split('/');
            ticketCode = parts[parts.length - 1];
        }
        try {
            const res = await dispatch(verifyTicketCode({ ticketCode, eventId: _selectEve?._id, }));
            if (res.type === "VERIFY_TICKET_SUCCESS") {
                // Check ticket status
                if (res.flag === "granted") {
                    setFlag({ status: "granted", message: res.message, ticket: res.ticket });
                } else if (res.flag === "already") {
                    setFlag({ status: "already", message: "Ticket already used.", ticket: res.ticket });
                } else if (res.flag === "expired") {
                    setFlag({ status: "expired", message: "Ticket has expired.", ticket: res.ticket });
                } else {
                    setFlag({ status: "invalid", message: "Invalid or expired ticket.", ticket: null });
                }
            } else {
                setFlag({ status: res.flag || "invalid", message: res.message, ticket: null });
            }

        } catch (error) {
            setFlag({ status: "error", message: "Verification failed. Try again." });
        }
    };


    const handleConfirmEntry = async () => {
        const ticketCode = result?.split('/')?.pop();
        if (!ticketCode) return;

        const now = new Date();
        const entryTime = now.toISOString();

        const res = await dispatch(
            confirmTicketEntry({
                verifyData: {
                    ticketCode,
                    eventId: _selectEve?._id
                },
                verifyEntry: true,
                entryTime
            })
        );

        if (res.type === "ENTER_USER_EVENT_SUCCESS") {
            setFlag((prev) => ({
                ...prev,
                message: res.message,
                ticket: {
                    ...prev.ticket,
                    verifyEntry: res.verifyEntry,
                    entryTime: res.entryTime,
                },
            }));
        } else {
            console.error(res.message);
        }
    };

    const handleConfirmParticipant = async (participantId: string) => {
        const ticketCode = result?.split("/")?.pop();
        if (!ticketCode) return;

        const now = new Date();
        const entryTime = now.toISOString();

        const res = await dispatch(
            confirmTicketEntry({
                verifyData: {
                    ticketCode,
                    participantId,
                },
                verifyEntry: true,
                entryTime,
            })
        );

        console.log("Confirm Participant Response:", res);

        if (res.type === "ENTER_USER_EVENT_SUCCESS") {
            // update UI so participant row shows validation true
            setFlag((prev) => ({
                ...prev,
                ticket: {
                    ...prev.ticket,
                    participantDetails: prev.ticket?.participantDetails?.map((p) =>
                        p._id === participantId ? { ...p, validation: true, entryTime } : p
                    ),
                },
            }));
        }
    };
    const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("environment");

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const cameraConstraints = {
        video: {
            facingMode: { ideal: cameraFacing }, // important fix
        }
    };


    return (
        <Box mt={3} boxShadow={3} borderRadius={3} p={3} bgcolor="white">
            <HeadingCommon title="Ticket Scanner" color="#0B2E4C" weight={600} baseSize="33px" />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#0B2E4E',
                        color: "#fff",
                        width: "100%",
                        flexDirection: "column",
                        position: "relative",
                        minHeight: showScanner ? 260 : "auto", // enough height for QR when open
                        padding: showScanner ? 0 : "6px 16px",
                        overflow: "hidden",
                    }}
                    onClick={() => setShowScanner(prev => !prev)}
                >
                    {!showScanner && (
                        <>
                            <Iconify icon="mdi:barcode-scan" width={20} height={20} />
                            <Box component="span" sx={{ ml: 1 }}>
                                Add a Ticket
                            </Box>
                        </>
                    )}

                    {showScanner && (
                        // <QrReader
                        //     delay={delay}
                        //     style={{ width: "100%", height: 240 }}
                        //     onError={handleError}
                        //     onScan={handleScan}
                        //     constraints={cameraConstraints as any}
                        // />
                        <QrReader
                         key={cameraFacing}
                            delay={delay}
                            style={{ width: "100%", height: 240 }}
                            onError={handleError}
                            onScan={handleScan}
                             constraints={cameraConstraints as any} // THIS WORKS ON MOBILE
                        />

                    )}


                    {isScanning && (
                        <Typography align="center" mt={1} color="white">
                            Scanning...
                        </Typography>
                    )}

                    {scanMessage && (
                        <Typography align="center" mt={1} color={scanMessage.includes("✅") ? "white" : "error"}>
                            {scanMessage}
                        </Typography>
                    )}

                </Button>

            </Box>
            <Box display="flex" mt={2} gap={1}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#0B2A4A",
                        color: "white",
                        borderRadius: "8px",
                        "&:hover": { backgroundColor: "#0A1E36" }
                    }}
                    onClick={handleVerifyClick}
                    disabled={flag.status === "payment-pending"}
                >
                    Verify
                </Button>

                {isMobile && showScanner && (
                    <Button
                        variant="outlined"
                        sx={{ borderRadius: "8px" }}
                        onClick={() =>
                            setCameraFacing(prev =>
                                prev === "environment" ? "user" : "environment"
                            )
                        }
                    >
                        Switch Camera
                    </Button>
                )}
            </Box>


            {["granted", "already", "invalid", "error", "payment-pending", "expired"].includes(flag.status) && (
                <Grid container spacing={2} mt={2}>
                    <Grid item xs={12}>
                        <Card
                            sx={{
                                backgroundColor:
                                    flag.status === "granted"
                                        ? "#DFFFE0"
                                        : flag.status === "already"
                                            ? "#FFD9A3"
                                            : flag.status === "invalid"
                                                ? "#FFCCCC"
                                                : "#F0F0F0",
                                borderRadius: "12px",
                                padding: "12px",
                                display: "flex",
                                flexDirection: flag.status === "granted" ? "column" : "row",
                                justifyContent: flag.status === "granted" ? "flex-start" : "space-between",
                                border: "2px solid #ddd",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                gap: flag.status === "granted" ? 2 : 0,
                            }}
                        >
                            <HeadingCommon title={flag.message} baseSize="23px" width={{ md: "34%" }} />

                            {flag.status === "granted" && (
                                <>
                                    <HeadingCommon
                                        title={`Entry Time: ${formatTimeToAMPM(new Date().toISOString())}`}
                                        baseSize="23px"
                                        width={{ md: "34%" }}
                                    />

                                    <Box mt={2} p={2} border="1px solid #ccc" borderRadius="8px" bgcolor="#f9f9f9">
                                        <Typography variant="h6" mb={1}>Participant Details</Typography>

                                        {flag.ticket?.participantDetails?.length ? (
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                                                        <TableCell><b>Name</b></TableCell>
                                                        <TableCell><b>Age</b></TableCell>
                                                        <TableCell><b>Gender</b></TableCell>

                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {flag.ticket.participantDetails.map((p: any, i: number) => (
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
                                                                        "&:hover": { backgroundColor: p.validation ? "gray" : "darkgreen" },
                                                                    }}
                                                                    disabled={p.validation} // disable if already validated
                                                                    onClick={() => handleConfirmParticipant(p._id)}
                                                                >
                                                                    {p.validation ? "✔ Entered" : "Confirm"}
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <Typography fontSize="14px" color="text.secondary">
                                                No participant details found
                                            </Typography>
                                        )}
                                    </Box>


                                    {/* existing Confirm / Cancel buttons */}
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        my={1}
                                        flexDirection={{ xs: "column", sm: "row", md: "row" }}
                                        gap={{ xs: 2, sm: 0, md: 0 }}
                                    >
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: "green",
                                                color: "white",
                                                borderRadius: "8px",
                                                "&:hover": { backgroundColor: "darkgreen" },
                                            }}
                                            onClick={handleConfirmEntry}
                                            disabled={!allParticipantsValidated || flag.ticket?.verifyEntry}
                                        >
                                            Confirm Entry
                                        </Button>

                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: "red",
                                                color: "white",
                                                borderRadius: "8px",
                                                "&:hover": { backgroundColor: "darkred" },
                                            }}
                                            onClick={() => {
                                                setShowScanner(false);
                                                setResult("No result");
                                                setFlag({ status: "", message: "", ticket: undefined });
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </>
                            )}


                            {flag.status !== "granted" && (
                                <Tooltip
                                    title={
                                        flag.status === "invalid" ? (
                                            <HeadingCommon color="white" title="No data found in this ticket code" baseSize="12px" />
                                        ) : flag.status === "already" ? (
                                            <HeadingCommon color="white" title="Book another ticket" baseSize="12px" />
                                        ) : (
                                            <HeadingCommon color="white" title="An error occurred" baseSize="12px" />
                                        )
                                    }
                                    arrow
                                >
                                    <IconButton sx={{ ml: 1 }}>
                                        <Iconify icon="mdi:information-outline" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    )
}