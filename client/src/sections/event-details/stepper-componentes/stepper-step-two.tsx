import {
    Box, Button, Grid, TextField, Typography, Switch, FormControlLabel, RadioGroup, Radio, Checkbox,
    InputAdornment,
    IconButton,
    FormControl,
    ToggleButtonGroup, MenuItem,
    ToggleButton, Select, FormGroup
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from 'src/redux/store';
import { Iconify } from 'src/components/iconify';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';
import { ticketConfigCreate } from 'src/redux/actions/event.action';
import { fetchTicketType, createTicketType } from 'src/redux/actions/ticket-&-reservation-management.action';

interface TicketConfigData {
    purchaseDeadlineDate: string;
    isPurchaseDeadlineEnabled: string;
    paymentMethods: string[];
    fullRefundDaysBefore: string;
    partialRefundPercent: string;
    noRefundDate: string;
    isRefundPolicyEnabled: boolean;
}

export function StepperStepTwo() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { tickets } = useSelector((state: RootState) => state?.ticketReservationMang);
    const [selectedTicket, setSelectedTicket] = useState<string>("");
    const [selectedRefundPolicy, setSelectedRefundPolicy] = useState("");
    const [refundEnabled, setRefundEnabled] = useState(false);
    const [payStatus, setPayStatus] = useState('paid');
    const [ticketConfigData, setTicketConfigData] = useState<TicketConfigData>({
        purchaseDeadlineDate: "",
        isPurchaseDeadlineEnabled: "true",
        paymentMethods: ["Mobile Money"],
        fullRefundDaysBefore: "",
        partialRefundPercent: "",
        noRefundDate: "",
        isRefundPolicyEnabled: false,
    });


    // State to manage ticket rows
    const [ticketRows, setTicketRows] = useState([
        {
            id: 1,
            ticketType: '',
            price: 0, // Keep as number for backend
            isLinkPramotion: false,
            totalTickets: 0, // Keep as number for backend
            description: '',
            isLimitedSeat: true
        }
    ]);

    const filteredTickets = tickets?.filter((ticket: any) => {
        if (payStatus === 'free') {
            // Convert price to string for comparison, or check if it's 0
            return ticket?.price === 0 || String(ticket?.price).includes('Free');
        }
        return ticket?.price !== 0 && !String(ticket?.price).includes('Free');
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const eventId = searchParams.get("eventId");

        if (!eventId) {
            return undefined; // explicitly return, satisfies ESLint
        }

        dispatch(fetchTicketType(eventId));

        const interval = setInterval(() => {
            dispatch(fetchTicketType(eventId));
        }, 20000);

        return () => clearInterval(interval); // cleanup
    }, [dispatch]);


    const handleTicketSelect = (ticketId: string) => {
        setSelectedTicket(ticketId);
        const selected = tickets.find((t: any) => t._id === ticketId);

        if (selected) {
            // Find if this ticket already exists in our rows
            const existingRowIndex = ticketRows.findIndex(row => row.id === selected._id);

            if (existingRowIndex >= 0) {
                // Update existing row
                setTicketRows(ticketRows.map(row =>
                    row.id === selected._id ? {
                        ...row,
                        ticketType: selected.name,
                        price: selected.price,
                        totalTickets: selected.quantity === "Unlimited" ? selected.quantity : selected.quantity,
                        description: selected.ticketDescription.replace(/<[^>]*>/g, ''),
                        isLimitedSeat: selected.quantity !== "Unlimited"
                    } : row
                ));
            } else {
                // Add new row if we have empty rows, or append to the end
                const emptyRowIndex = ticketRows.findIndex(row => row.ticketType === '');

                if (emptyRowIndex >= 0) {
                    // Replace first empty row
                    setTicketRows(ticketRows.map((row, index) =>
                        index === emptyRowIndex ? {
                            id: selected._id,
                            ticketType: selected.name,
                            price: selected.price,
                            isLinkPramotion: false,
                            totalTickets: selected.quantity === "Unlimited" ? selected.quantity : selected.quantity,
                            description: selected.ticketDescription.replace(/<[^>]*>/g, ''),
                            isLimitedSeat: selected.quantity !== "Unlimited"
                        } : row
                    ));
                } else {
                    // Add new row at the end
                    setTicketRows([
                        ...ticketRows,
                        {
                            id: selected._id,
                            ticketType: selected.name,
                            price: selected.price,
                            isLinkPramotion: false,
                            totalTickets: selected.quantity === "Unlimited" ? selected.quantity : selected.quantity,
                            description: selected.ticketDescription.replace(/<[^>]*>/g, ''),
                            isLimitedSeat: selected.quantity !== "Unlimited"
                        }
                    ]);
                }
            }
        }
    };

    const handleTickteConfigChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = event.target;

        if (name === "paymentMethods") {
            setTicketConfigData((prev) => {
                const updated = checked
                    ? [...(prev.paymentMethods || []), value] // ✅ add method
                    : (prev.paymentMethods || []).filter((v) => v !== value); // ❌ remove method
                return { ...prev, paymentMethods: updated };
            });
        } else {
            setTicketConfigData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Add a new row
    const addRow = () => {
        setTicketRows([
            ...ticketRows,
            {
                id: Date.now(),
                isLimitedSeat: true,
                ticketType: '',
                price: 0, // Keep as number
                isLinkPramotion: false,
                totalTickets: 0, // Keep as number
                description: ''
            }
        ]);
    };

    // Update field values
    const handleChange = (id: any, field: any, value: any) => {
        setTicketRows(
            ticketRows.map(row => {
                if (row.id === id) {
                    if (field === "isLimitedSeat" && value === false) {
                        // Unlimited seat selected, set totalTickets = 10000
                        return { ...row, [field]: value, totalTickets: 10000 };
                    }

                    // Convert to number for numeric fields, handle empty input as 0
                    if (field === 'price' || field === 'totalTickets') {
                        return {
                            ...row,
                            [field]: value === '' ? 0 : Number(value)
                        };
                    }

                    return { ...row, [field]: value };
                }
                return row;
            })
        );
    };

    // Remove a row by ID
    const removeRow = (id: any) => {
        if (ticketRows.length > 1) { // Prevent removing the last row
            setTicketRows(ticketRows.filter(row => row.id !== id));
        }
    };

    const handleTicketConfig = useCallback(async (event: any) => {
        event.preventDefault();
        setLoading(true);

        try {
            const searchParams = new URLSearchParams(window.location.search);
            const eventId = searchParams.get("eventId");
            if (!eventId) {
                toast.error("Event ID missing");
                return;
            }

            // 1️⃣ Create ticket types first and collect their ObjectIds
            const createdTickets = await Promise.all(
                ticketRows.map(async (row) => {
                    const res: any = await dispatch(
                        createTicketType({
                            eventId,
                            name: row.ticketType,
                            quantity: String(row.totalTickets),
                            ticketDescription: row.description,
                            price: payStatus === "free" ? "0" : String(row.price),
                            validity: ticketConfigData.purchaseDeadlineDate
                                ? new Date(ticketConfigData.purchaseDeadlineDate).toISOString()
                                : "",
                            options: {
                                transferableTicket: false,
                                personalizedTicket: false,
                                activationCode: false,
                            },
                        })
                    );

                    return {
                        ticketType: row.ticketType,
                        id: res?.ticketTypeId,
                        price: payStatus === "free" ? "0" : String(row.price),
                        totalTickets: row.totalTickets,
                        description: row.description,
                        isLimitedSeat: row.isLimitedSeat ?? true,
                        isLinkPramotion: row.isLinkPramotion ?? false,
                    };
                })
            );

            // 2️⃣ Build FormData with valid ObjectIds for tickets
            const formEventData = new FormData();
            formEventData.append("tickets", JSON.stringify(createdTickets));
            formEventData.append("purchaseDeadlineDate", ticketConfigData.purchaseDeadlineDate);
            formEventData.append("isPurchaseDeadlineEnabled", ticketConfigData.isPurchaseDeadlineEnabled);
            formEventData.append("paymentMethods", JSON.stringify(ticketConfigData.paymentMethods));
            formEventData.append("isRefundPolicyEnabled", refundEnabled.toString());
            formEventData.append("payStatus", payStatus);

            if (selectedRefundPolicy === "fullRefund") {
                formEventData.append("fullRefundCheck", "true");
                formEventData.append("fullRefundDaysBefore", ticketConfigData.fullRefundDaysBefore);
            } else if (selectedRefundPolicy === "partialRefund") {
                formEventData.append("partialRefundCheck", "true");
                formEventData.append("partialRefundPercent", ticketConfigData.partialRefundPercent);
            } else if (selectedRefundPolicy === "noRefundDate") {
                formEventData.append("noRefundAfterDateCheck", "true");
                formEventData.append("noRefundDate", ticketConfigData.noRefundDate);
            }

            // 3️⃣ Now create TicketConfiguration with those ids
            const res = await dispatch(ticketConfigCreate({ formEventData, eventId }));
            const ticketConfigId = res?.ticketConfigId;

            navigate(`?eventId=${eventId}&ticketConfigId=${ticketConfigId}`, { replace: true });

        } catch (error) {
            console.error(error);
            toast.error("Server Error");
        } finally {
            setLoading(false);
        }
    }, [
        navigate,
        payStatus,
        dispatch,
        ticketRows,
        ticketConfigData,
        refundEnabled,
        selectedRefundPolicy,
    ]);

    const handlePayStatus = (newValue: any) => {
        setPayStatus(newValue)
        setTicketRows([
            {
                id: 1,
                ticketType: '',
                price: 0,
                isLinkPramotion: false,
                totalTickets: 0,
                description: '',
                isLimitedSeat: true
            }
        ])
        setTicketConfigData({
            purchaseDeadlineDate: "",
            isPurchaseDeadlineEnabled: "true",
            // paymentMethods: newValue === 'free' ? '' : "Cash",
            paymentMethods: [] as string[],
            fullRefundDaysBefore: "",
            partialRefundPercent: "",
            noRefundDate: '',
            isRefundPolicyEnabled: false,
        })
    }
    return (
        <Box sx={{ p: 1, maxWidth: '100%', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <HeadingCommon variant="h6" title="Ticket Configuration" weight={600} baseSize="33px" />
                {filteredTickets?.length > 0 ? (
                    <FormControl sx={{ minWidth: 200, ml: 2 }}>
                        <Select
                            value={selectedTicket}
                            onChange={(e) => handleTicketSelect(e.target.value)}
                            displayEmpty
                            size="small"
                            sx={{ height: 40, textTransform: "capitalize" }}
                        >
                            <MenuItem value="" disabled>
                                Select existing ticket
                            </MenuItem>
                            {filteredTickets.map((ticket: any) => (
                                <MenuItem key={ticket._id} value={ticket._id} sx={{ textTransform: "capitalize" }}>
                                    {ticket.name} ({ticket.price})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    null
                )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="body1" sx={{ mr: 2 }}>Ticket Type:</Typography>
                <ToggleButtonGroup
                    color="primary"
                    value={payStatus}
                    exclusive
                    onChange={(event: any, newValue: any) => {
                        if (newValue !== null) {

                            handlePayStatus(newValue);
                        }
                    }}
                    aria-label="Payment Status"
                >
                    <ToggleButton value="paid" aria-label="paid">
                        Paid Event
                    </ToggleButton>
                    <ToggleButton value="free" aria-label="free">
                        Free Event
                    </ToggleButton>

                </ToggleButtonGroup>
            </Box>
            <form encType='multipart/form-data' onSubmit={handleTicketConfig}>
                {ticketRows.map((row: any, index: any) => (
                    <Grid container spacing={2} alignItems="center" key={row.id} sx={{ mt: index > 0 ? 2 : 0, alignItems: "flex-start" }}>
                        {/* Ticket Types */}
                        <Grid item xs={12} sm={5} md={3}>
                            <TextField
                                fullWidth
                                required
                                inputProps={{
                                    style: {
                                        textTransform: "capitalize"
                                    }
                                }}
                                label="Ticket Types"
                                placeholder="Standard, VIP, Premium"
                                value={row.ticketType}
                                onChange={(e) => handleChange(row.id, 'ticketType', e.target.value)}
                            />
                        </Grid>

                        {/* Price per Ticket */}
                        {
                            payStatus === 'free' ? null : <Grid item xs={12} sm={5} md={3}>
                                <TextField
                                    type='number'
                                    fullWidth
                                    required
                                    sx={{ textTransform: "capitalize" }}
                                    label="Price for each ticket"
                                    value={row.price === 0 ? '' : row.price} // Show empty when 0
                                    onChange={(e) => handleChange(row.id, 'price', e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                XAF
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        }


                        {/* Total Tickets */}
                        <Grid item xs={12} sm={5} md={payStatus === 'free' ? 4 : 3}>
                            <TextField
                                fullWidth
                                type='number'
                                label="Total Tickets"
                                placeholder={row?.isLimitedSeat ? "100" : "Unlimited"}
                                value={row.totalTickets === 0 ? '' : row.totalTickets} // Show empty when 0
                                onChange={(e) => handleChange(row.id, 'totalTickets', e.target.value)}
                                disabled={!row.isLimitedSeat}
                            />
                            <Box key={row.id} sx={{ width: "100%" }}>
                                <RadioGroup
                                    name="isLimitedSeat"
                                    value={row.isLimitedSeat.toString()}
                                    onChange={(event) => handleChange(row.id, 'isLimitedSeat', event.target.value === 'true')}
                                    sx={{
                                        mt: 1,
                                        display: 'flex',
                                        flexDirection: 'row', // Explicitly set to row (default)
                                        alignItems: 'center' // Vertical alignment
                                    }}
                                >
                                    <FormControlLabel
                                        value="true"
                                        control={<Radio size="small" />} // Smaller radio button
                                        label="Limited"
                                        sx={{
                                            marginRight: 2, // Additional right margin
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '11px',
                                                fontWeight: 500,
                                                color: 'text.primary'
                                            }
                                        }}
                                    />
                                    <FormControlLabel
                                        value="false"
                                        control={<Radio size="small" />}
                                        label="Unlimited Seats"
                                        sx={{
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '11px',
                                                fontWeight: 500,
                                                color: 'text.primary'
                                            }
                                        }}
                                    />
                                </RadioGroup>
                            </Box>
                        </Grid>

                        {/* Ticket Description */}
                        <Grid item xs={12} sm={5} md={payStatus === 'free' ? 4 : 2}>
                            <TextField
                                fullWidth
                                label="Description"
                                placeholder="Access to all areas"
                                value={row.description}
                                onChange={(e) => handleChange(row.id, 'description', e.target.value)}
                            />
                        </Grid>

                        {/* Action Buttons (Add/Remove) */}
                        <Grid item xs={12} sm={2} md={1} >
                            <Box >
                                {/* Plus Button (only on last row) */}
                                {index === ticketRows.length - 1 && (
                                    <IconButton onClick={addRow} color="primary" sx={{ p: "18px" }}>
                                        <Iconify icon="ic:round-plus" />
                                    </IconButton>
                                )}

                                {/* Minus Button (show on all rows except the last one) */}
                                {index !== ticketRows.length - 1 && (
                                    <IconButton onClick={() => removeRow(row.id)} color="error" sx={{ p: "18px" }}>
                                        <Iconify icon="ic:round-minus" />
                                    </IconButton>
                                )}
                            </Box>

                        </Grid>
                    </Grid>
                ))}

                <Box mt={2}>
                    <Grid container spacing={3}>
                        {/* Purchase Deadline */}
                        <Grid item xs={12} md={payStatus === 'free' ? 12 : 3}>
                            <Typography fontWeight="bold">
                                {payStatus === "free" ? "Reservation deadline" : "Purchase deadline"}
                            </Typography>
                            <Box display="flex" flexDirection="column" mt={1}>
                                <TextField
                                    value={ticketConfigData.purchaseDeadlineDate}
                                    onChange={handleTickteConfigChange}
                                    fullWidth
                                    required={ticketConfigData.isPurchaseDeadlineEnabled === "true"} // only required if enabled
                                    disabled={ticketConfigData.isPurchaseDeadlineEnabled === "false"} // disable when "Disabled" is selected
                                    name="purchaseDeadlineDate"
                                    type="date"
                                    label="Select Date"
                                    InputLabelProps={{ shrink: true }}
                                />
                                <RadioGroup
                                    name="isPurchaseDeadlineEnabled" // Make sure the name matches your state field
                                    value={ticketConfigData.isPurchaseDeadlineEnabled.toString()}
                                    onChange={handleTickteConfigChange}
                                    sx={{
                                        mt: 1,
                                        display: 'flex',
                                        flexDirection: 'row', // Explicitly set to row (default)
                                        alignItems: 'center' // Vertical alignment
                                    }}
                                >
                                    <FormControlLabel
                                        sx={{
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '11px',
                                                fontWeight: 500,
                                                color: 'text.primary'
                                            }
                                        }} value="true" control={<Radio />} label="Enabled" />
                                    <FormControlLabel
                                        sx={{
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '11px',
                                                fontWeight: 500,
                                                color: 'text.primary'
                                            }
                                        }}
                                        value="false" control={<Radio />} label="Disabled" />
                                </RadioGroup>
                            </Box>
                        </Grid>

                        {/* Accepted Payment Methods */}
                        {/* {
                            payStatus === 'free' ? null : <Grid item xs={12} md={3}>
                                <Typography fontWeight="bold">Accepted payment methods</Typography>
                                <Box
                                    border={1}
                                    borderRadius={2}
                                    p={2}
                                    mt={1}
                                    sx={{ borderColor: '#ccc', minHeight: '150px' }}
                                >
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            aria-label="payment-methods"
                                            name="paymentMethods" // Make sure the name matches your state field
                                            value={ticketConfigData.paymentMethods}
                                            onChange={handleTickteConfigChange}
                                        >
                                            <FormControlLabel
                                                value="Mobile Money"
                                                control={<Radio size="small" />}
                                                label={
                                                    <Box display="flex" alignItems="center">
                                                        <PaymentIcon sx={{ mr: 1 }} />
                                                        <HeadingCommon baseSize="14px" title="Mobile Money" />
                                                    </Box>
                                                }
                                                sx={{ margin: 0 }} // Remove default margin
                                            />

                                            <FormControlLabel
                                                value="Credit Card"
                                                control={<Radio size="small" />}
                                                label={
                                                    <Box display="flex" alignItems="center">
                                                        <CreditCardIcon sx={{ mr: 1 }} />
                                                        <HeadingCommon baseSize="14px" title="Credit Card" />
                                                    </Box>
                                                }
                                                sx={{ margin: 0 }}
                                            />

                                            <FormControlLabel
                                                value="Cash"
                                                control={<Radio size="small" />}
                                                label={
                                                    <Box display="flex" alignItems="center">
                                                        <MoneyIcon sx={{ mr: 1 }} />
                                                        <HeadingCommon baseSize="14px" title="Cash" />
                                                    </Box>
                                                }
                                                sx={{ margin: 0 }}
                                            />

                                            <FormControlLabel
                                                value="Bank Transfer"
                                                control={<Radio size="small" />}
                                                label={
                                                    <Box display="flex" alignItems="center">
                                                        <AccountBalanceIcon sx={{ mr: 1 }} />
                                                        <HeadingCommon baseSize="14px" title="Bank Transfer" />
                                                    </Box>
                                                }
                                                sx={{ margin: 0 }}
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>
                            </Grid>
                        } */}
                        {/* Accepted Payment Methods */}
                        {payStatus === "free" ? null : (
                            <Grid item xs={12} md={3}>
                                <Typography fontWeight="bold">Accepted payment methods</Typography>
                                <Box
                                    border={1}
                                    borderRadius={2}
                                    p={2}
                                    mt={1}
                                    sx={{ borderColor: "#ccc", minHeight: "150px" }}
                                >
                                    <FormControl component="fieldset">
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        size="small"
                                                        name="paymentMethods"
                                                        value="Mobile Money"
                                                        checked={ticketConfigData.paymentMethods.includes("Mobile Money")}
                                                        onChange={handleTickteConfigChange}
                                                    />
                                                }
                                                label={
                                                    <Box display="flex" alignItems="center">
                                                        <PaymentIcon sx={{ mr: 1 }} />
                                                        <HeadingCommon baseSize="14px" title="Mobile Money" />
                                                    </Box>
                                                }
                                            />

                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        size="small"
                                                        name="paymentMethods"
                                                        value="Cash"
                                                        checked={ticketConfigData.paymentMethods.includes("Cash")}
                                                        onChange={handleTickteConfigChange}
                                                    />
                                                }
                                                label={
                                                    <Box display="flex" alignItems="center">
                                                        <MoneyIcon sx={{ mr: 1 }} />
                                                        <HeadingCommon baseSize="14px" title="Cash" />
                                                    </Box>
                                                }
                                            />
                                        </FormGroup>
                                    </FormControl>
                                </Box>
                            </Grid>
                        )}

                        {/* Refund Policy */}
                        {
                            payStatus === 'free' ? null : <Grid item xs={12} md={4}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography fontWeight="bold" mb={1}>
                                        Refund policy
                                    </Typography>
                                    <Switch
                                        name="isRefundPolicyEnabled"
                                        checked={refundEnabled}
                                        onChange={(e) => setRefundEnabled(e.target.checked)}
                                    />
                                </Box>


                                {refundEnabled && (
                                    <Box mt={2}>
                                        <RadioGroup
                                            value={selectedRefundPolicy}
                                            onChange={(e) => setSelectedRefundPolicy(e.target.value)}
                                            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                                        >
                                            {/* Full Refund */}
                                            <FormControlLabel
                                                value="fullRefund"
                                                control={<Radio size="small" />}
                                                label="Full Refund Available up to X days before the event"
                                                sx={{ '& .MuiFormControlLabel-label': { fontSize: '11px', fontWeight: 'bold' } }}
                                            />
                                            {selectedRefundPolicy === "fullRefund" && (
                                                <TextField
                                                    name="fullRefundDaysBefore"
                                                    type="text"
                                                    size="small"
                                                    placeholder="Enter number of days"
                                                    value={ticketConfigData.fullRefundDaysBefore}
                                                    onChange={handleTickteConfigChange}
                                                    sx={{ ml: 4, width: "200px" }}
                                                />
                                            )}

                                            {/* Partial Refund */}
                                            <FormControlLabel
                                                value="partialRefund"
                                                control={<Radio size="small" />}
                                                label="Partial Refund with Fee (% of ticket price retained)"
                                                sx={{ '& .MuiFormControlLabel-label': { fontSize: '11px', fontWeight: 'bold' } }}
                                            />
                                            {selectedRefundPolicy === "partialRefund" && (
                                                <TextField
                                                    name="partialRefundPercent"
                                                    type="text"
                                                    size="small"
                                                    placeholder="Enter percentage"
                                                    value={ticketConfigData.partialRefundPercent}
                                                    onChange={handleTickteConfigChange}
                                                    sx={{ ml: 4, width: "200px" }}
                                                />
                                            )}

                                            {/* No Refund After a Specific Date */}
                                            <FormControlLabel
                                                value="noRefundDate"
                                                control={<Radio size="small" />}
                                                label="No Refund After a Specific Date"
                                                sx={{ '& .MuiFormControlLabel-label': { fontSize: '11px', fontWeight: 'bold' } }}
                                            />
                                            {selectedRefundPolicy === "noRefundDate" && (
                                                <TextField
                                                    name="noRefundDate"
                                                    type="date"
                                                    size="small"
                                                    value={ticketConfigData.noRefundDate}
                                                    onChange={handleTickteConfigChange}
                                                    sx={{ ml: 4, width: "200px" }}
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            )}
                                        </RadioGroup>
                                    </Box>
                                )}
                            </Grid>
                        }


                        {/* Save Tickets Button */}

                        <Grid item xs={12} md={payStatus === 'free' ? 12 : 2} >
                            <LoadingButton
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                loading={loading}
                                sx={{ color: "black", backgroundColor: "#2295D4" }}
                            >
                                {
                                    payStatus === 'free' ? 'Activate Free Entry' : 'Save Tickets'
                                }

                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Box>
            </form>
            {/* Physical Sales Points */}

            {/* <Box mt={6}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Physical Ticket Sales Points
                </Typography>
                <RadioGroup row defaultValue="own">
                    <FormControlLabel
                        value="activate"
                        control={<Radio />}
                        label="Activate Physical Ticket Sales Points"
                    />
                    <FormControlLabel
                        value="own"
                        control={<Radio />}
                        label="Use my own physical point of sales"
                    />
                </RadioGroup>

                <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth label="Location Name" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth label="Address" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth label="Contact" />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth
                            label="Available Ticket Types"
                            placeholder="Standard, VIP, Premium"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Sales Start" type="date" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Sales End" type="date" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Limit on Tickets Sold per Location" placeholder="500" />
                    </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth variant="contained" sx={{ color: "white", backgroundColor: "#0B2E4C" }}>
                            Remove
                        </Button>
                    </Grid>
                </Grid>
            </Box> */}
        </Box>
    );
}
