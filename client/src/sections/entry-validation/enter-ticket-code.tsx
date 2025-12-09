import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';

import { confirmTicketEntry, verifyTicketCode } from "src/redux/actions/eventOrder";
import { AppDispatch } from 'src/redux/store';
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

import { EarlyEntryCountdown } from "./validation-cards/too-early";
import { InvalidAndExpiry } from "./validation-cards/invalid-and-expiry";
import { PaymentPending } from "./validation-cards/payment-pending";
import { Already } from "./validation-cards/already";
import { Granted } from "./validation-cards/granted";

interface Ticket {
    _id: string;
    eventId: string;
    ticketCode: string;
    tickets: Array<{
        ticketType: string;
    }>;
    verifyEntry: boolean;
    entryTime?: string;
    userId?: {
        name: string;
        email: string;
        _id: string;
    };
    paymentStatus?: "pending" | "confirmed" | "failed";
    participantDetails?: Array<{
        _id: string;
        name: string;
        age: string;
        gender: string;
        validation?: boolean;
    }>;
}

interface FlagState {
    counter: string;
    message: string;
    eventDetails: any;
    ticket: Partial<Ticket>;
}

interface ApiResult {
    status: number;
    eventDetails: any;
    type: string;
    message: any;
    flag: any;
    ticket: Ticket;
}

export function EnterTicketCode({ _selectEve, eventSelected }: any) {
    const dispatch = useDispatch<AppDispatch>();
    const [verifyData, setVerifyData] = useState({
        ticketCode: "",
        participantId: "",
        name: "",
    });

    const [flag, setFlag] = useState<FlagState>({
        counter: "",
        message: "",
        ticket: {},
        eventDetails: {}
    });

    // Reset flag and form data when eventSelected changes
    useEffect(() => {
        setFlag({
            counter: "",
            message: "",
            ticket: {},
            eventDetails: {}
        });
        setVerifyData({
            ticketCode: "",
            participantId: "",
            name: "",
        });
    }, [eventSelected]);

    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setVerifyData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVerifyTicketCode = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const result = await dispatch(verifyTicketCode({ ...verifyData, eventId: eventSelected._id })) as ApiResult;

            if (result?.status === 200) {
                if (result.ticket?.paymentStatus !== "confirmed") {
                    setFlag({
                        counter: "paymentPending",
                        message: "Payment not done",
                        ticket: result.ticket,
                        eventDetails: {}
                    });
                    return;
                }

                setFlag({
                    counter: result.flag,
                    message: result.message,
                    ticket: result.ticket,
                    eventDetails: {}
                });

            } else {
                setFlag({
                    counter: result?.flag,
                    message: result?.message,
                    ticket: result?.ticket,
                    eventDetails: result?.eventDetails
                });
            }
        } catch (error: any) {
            toast.error(error.message || "Verification failed");
        }
    }, [verifyData, dispatch, eventSelected._id]);

    const handleCancelState = () => {
        setFlag({
            counter: "",
            message: "",
            ticket: {},
            eventDetails: {}
        });
        setVerifyData({
            ticketCode: "",
            participantId: "",
            name: "",
        });
    };

    const handleConfirmEntry = useCallback(
        async (
            event: React.FormEvent | null,
            customVerifyData?: typeof verifyData
        ) => {
            if (event) event.preventDefault();

            const now = new Date();
            const entryTime = now.toISOString();
            const data = {
                verifyData: customVerifyData || verifyData,
                verifyEntry: true,
                entryTime,
            };

            try {
                const result = (await dispatch(confirmTicketEntry(data))) as ApiResult;

                if (result?.status === 200) {
                    // ✅ If it's for the whole ticket (no custom participantId passed)
                    if (!customVerifyData) {
                        toast.success("Entry Successfully");

                        setTimeout(() => {
                            setFlag({
                                counter: "",
                                message: "",
                                ticket: {},
                                eventDetails: {}
                            });
                            setVerifyData({
                                ticketCode: "",
                                participantId: "",
                                name: "",
                            });
                        }, 4000);
                    } else {
                        // ✅ Update participant as entered (no toast)
                        setFlag((prev) => ({
                            ...prev,
                            ticket: {
                                ...prev.ticket,
                                participantDetails: prev.ticket?.participantDetails?.map((p) =>
                                    p._id === customVerifyData.participantId
                                        ? { ...p, validation: true }
                                        : p
                                ),
                            },
                        }));
                    }
                }
            } catch (error) {
                if (!customVerifyData) {
                    toast.error("Ticket verification failed");
                }
                console.error("Verification error:", error);
            }
        },
        [verifyData, dispatch]
    );

    const listViewMethods = _selectEve?.listViewMethods || [];

    return (
        <Box mt={3} boxShadow={3} borderRadius={3} p={3} bgcolor="white">
            <HeadingCommon title="Enter Ticket Code" color="#0B2E4C" weight={600} baseSize="30px" />
            <HeadingCommon
                title={flag.counter === 'field' ? flag.message : null}
                color="#e22121ff"
                weight={600}
                baseSize="13px"
            />

            {/* Form with proper submission handling */}
            <form onSubmit={handleVerifyTicketCode}>
                <Grid container spacing={2} alignItems="center" mt={0.1}>
                    {/* Calculate the grid size based on number of fields */}
                    {(() => {
                        const fieldCount = listViewMethods.length;
                        const gridSize = fieldCount > 0 ? Math.floor(12 / fieldCount) : 12;

                        return (
                            <>
                                {/* Manual Code Field */}
                                {listViewMethods.includes('manualCode') && (
                                    <Grid item xs={12} sm={gridSize} md={gridSize}>
                                        <TextField
                                            fullWidth
                                            type="text"
                                            name="ticketCode"
                                            label="Enter Ticket Code"
                                            variant="outlined"
                                            placeholder="583-356"
                                            size="small"
                                            value={verifyData.ticketCode}
                                            onChange={handleEventChange}
                                        />
                                    </Grid>
                                )}

                                {/* Account ID Field */}
                                {listViewMethods.includes('accountId') && (
                                    <Grid item xs={12} sm={gridSize} md={gridSize}>
                                        <TextField
                                            fullWidth
                                            type="text"
                                            name="participantId"
                                            label="Search by Participant ID"
                                            variant="outlined"
                                            placeholder="Enter Participant ID"
                                            size="small"
                                            value={verifyData.participantId}
                                            onChange={handleEventChange}
                                        />
                                    </Grid>
                                )}

                                {/* Name List Field */}
                                {listViewMethods.includes('nameList') && (
                                    <Grid item xs={12} sm={gridSize} md={gridSize}>
                                        <TextField
                                            fullWidth
                                            name="name"
                                            type="text"
                                            label="Search by Participant Name"
                                            variant="outlined"
                                            placeholder="Enter Participant Name"
                                            size="small"
                                            value={verifyData.name}
                                            onChange={handleEventChange}
                                        />
                                    </Grid>
                                )}
                            </>
                        );
                    })()}

                    {/* Verify Button - Only show if at least one field is visible */}
                    <Grid item xs={12} sm={6} md={4} mt={2}>
                        <Button
                            variant="contained"
                            fullWidth
                            type="submit"
                            sx={{
                                backgroundColor: "#0B2A4A",
                                color: "white",
                                textTransform: "none",
                                fontWeight: "bold",
                                borderRadius: "8px",
                                height: "40px",
                                '&:hover': {
                                    backgroundColor: '#0A2351'
                                }
                            }}
                        >
                            Verify
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {/* Conditional rendering of validation components */}
            {flag.counter === 'too_early' && (
                <EarlyEntryCountdown flagData={flag} />
            )}

            {flag.counter === 'invalid' || flag.counter === 'expired' ? (
                <InvalidAndExpiry flagData={flag} />
            ) : null}

            {flag.counter === 'paymentPending' && (
                <PaymentPending flagData={flag} />
            )}

            {flag.counter === 'already' && (
                <Already flagData={flag} />
            )}

            {flag.counter === 'granted' && (
                <Granted
                    flagData={flag}
                    onConfirmEntry={handleConfirmEntry}
                    onCancel={handleCancelState}
                />
            )}
        </Box>
    );
}