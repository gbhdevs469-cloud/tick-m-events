import { Button, Checkbox, FormControlLabel, Box, Paper, TextField, Typography, Grid } from "@mui/material";
import { useCallback, useState } from "react";
import { toast, ToastContent } from 'react-toastify';
import { useDispatch } from "react-redux";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createTicketType } from "src/redux/actions/ticket-&-reservation-management.action";
import { AppDispatch } from "src/redux/store";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

export interface TicketFormData {
    name: string;
    quantity: string;
    ticketDescription: string;
    price: string;
    validity: string;
    options: any,
     eventId: string;
}

interface ApiResponse {
    status: number;
    message: string;
    data?: any;
}

export function TicketCreationAndConfiguration({ onSuccess, eventId }: any) {
    const dispatch = useDispatch<AppDispatch>();
    const [isFree, setIsFree] = useState(false);
    const [isUnlimited, setIsUnlimited] = useState(false);
    const [ticketTypeData, setTicketTypeData] = useState({
        name: "",
        price: "",
        quantity: "",
        validity: "",
        description: "",
    });
    const [ticketTypeOption, setTicketTypeOption] = useState({
        transferableTicket: false,
        personalizedTicket: false,
        activationCode: false,
    });

    const handleIsFreeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setIsFree(isChecked);

        // Automatically set price to "FREE" when checked, or clear when unchecked
        setTicketTypeData(prev => ({
            ...prev,
            price: isChecked ? "Free" : ""
        }));
    };

    const handleIsUnlimitedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setIsUnlimited(isChecked);

        // Automatically set price to "FREE" when checked, or clear when unchecked
        setTicketTypeData(prev => ({
            ...prev,
            quantity: isChecked ? "Unlimited" : ""
        }));
    };

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setTicketTypeData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Special handler for Quill editor
    const handleDescriptionChange = (value: any) => {
        setTicketTypeData(prev => ({ ...prev, description: value }));
    };
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setTicketTypeOption(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form submission behavior
        // Create TicketFormData object instead of FormData
        const ticketData: TicketFormData = {
            name: ticketTypeData.name,
            quantity: isUnlimited ? "Unlimited" : ticketTypeData.quantity,
            ticketDescription: ticketTypeData.description,
            price: isFree ? "Free" : ticketTypeData.price,
            validity: ticketTypeData.validity,
            options: ticketTypeOption,// Make sure this matches the TicketFormData options interface
            eventId
        };

        try {
            const result = await dispatch(createTicketType(ticketData) as unknown as Promise<ApiResponse>)
            if (result.status === 201) {
                toast.success("Saved and Published Tickets Successfully...");
                // Reset form state
                setTicketTypeData({
                    name: "",
                    price: "",
                    quantity: "",
                    validity: "",
                    description: "",
                });
                setTicketTypeOption({
                    transferableTicket: false,
                    personalizedTicket: false,
                    activationCode: false,
                });
                setIsFree(false);
                setIsUnlimited(false);

                // Call the success callback if it exists
                onSuccess?.();
            } else {
                toast.error(result.message as ToastContent);
            }
        } catch (error) {
            toast.error('An unexpected error occurred' as ToastContent);
        }
    }, [dispatch, ticketTypeOption, onSuccess, isUnlimited, isFree, ticketTypeData,eventId]);

    return (
        <Box boxShadow={3} borderRadius={3} mt={3}>
            <Paper sx={{ width: "100%", p: 3, maxWidth: { xs: "800px", sm: "800px", md: "100%" } }}>
                {/* Section Title */}
                <HeadingCommon baseSize="33px" weight={600} variant="h5" color='#0B2E4C' title="Ticket Creation & Configuration" />

                {/* Table Header */}
                <Box
                    sx={{
                        border: "1px solid #969696",
                        borderRadius: 1,
                        mt: 2,
                        p: 2,
                        bgcolor: "white",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "start",
                            width: { xs: "100%", sm: "100%", md: "42%" }, // Make it responsive
                            pb: 1,
                            borderBottom: "1px solid #969696",
                            flexWrap: "wrap", // Allow wrapping on smaller screens
                        }}
                    >
                        {["Name", "Price", "Quantity", "Validity", "Options"].map((header) => (
                            <Typography key={header} variant="body2" fontWeight="medium" sx={{ paddingRight: { xs: "10px", sm: "10px", md: "20px" }, fontSize: { xs: "12px", sm: "14px", md: "16px" } }}>
                                {header}
                            </Typography>
                        ))}
                    </Box>
                </Box>

                {/* Form Section */}
                <HeadingCommon baseSize="33px" weight={600} variant="h5" color='#0B2E4C' title="Create a Ticket Type" mt={3} />

                {/* Inputs - Responsive Grid */}
                <form onSubmit={handleSubmit}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <TextField
                            label="name"
                            name="name"
                            placeholder="e.g., Vip"
                            value={ticketTypeData.name}
                            onChange={handleChange}
                            sx={{
                                '& input': {
                                    textTransform: 'capitalize',
                                },
                            }}
                            required
                            fullWidth
                            type="text"
                        />
                        <Grid item xs={12} sm={5} md={3}>
                            <TextField
                                label="Price"
                                name="price"
                                required
                                placeholder={isFree ? undefined : "10000 XAF"}
                                value={isFree ? "FREE" : ticketTypeData.price}
                                disabled={isFree}
                                onChange={handleChange}
                                sx={{
                                    '& input': {
                                        textTransform: 'uppercase',
                                    },
                                }}
                                fullWidth
                            />
                            <Box sx={{ width: "100%" }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={isFree}
                                            onChange={handleIsFreeChange}
                                        />
                                    }
                                    label="Free"
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '11px',
                                        },
                                        mr: 1,
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={5} md={3}>
                            <TextField
                                label="Available Quantity"
                                name="quantity"
                                placeholder={isUnlimited ? undefined : "1"}
                                value={isUnlimited ? "Unlimited" : ticketTypeData.quantity}
                                disabled={isUnlimited}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            <Box sx={{ width: "100%" }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={isUnlimited}
                                            onChange={handleIsUnlimitedChange}
                                        />
                                    }
                                    label="Unlimited"
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '11px',
                                        },
                                        mr: 1,
                                    }}
                                />
                            </Box>
                        </Grid>

                    </Box>

                    {/* Description */}
                       <div translate="no" className="notranslate" data-nosnippet>
                    <ReactQuill
                        theme="snow"
                        value={ticketTypeData.description}
                        onChange={handleDescriptionChange}
                        style={{ height: '90px', margin: "20px 0px 40px 0px" }}
                    />
</div>
                    {/* Validity */}
                    <TextField
                        label="Validity e.g., 2025-06-15"
                        type="date"
                        name="validity"
                        required
                        value={ticketTypeData.validity}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{
                            shrink: true, // Forces the label to always appear above (no placeholder overlap)
                        }}
                        InputProps={{
                            inputProps: {
                                placeholder: "", // Explicitly set empty placeholder
                            },
                        }}
                        sx={{ mt: { xs: 6, sm: 5, md: 3 } }}
                    />

                    {/* Checkboxes */}
                    <Box sx={{ mt: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="transferableTicket"
                                    checked={ticketTypeOption.transferableTicket}
                                    onChange={handleOptionChange}
                                    sx={{ color: "blue", "&.Mui-checked": { color: "#0B2E4C" } }}
                                />
                            }
                            label="Transferable Ticket (Can be resold or given to another person)"
                        />
                    </Box>

                    {/* Buttons - Centered on Mobile */}
                    <Box
                        sx={{
                            mt: 3,
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap",
                            justifyContent: { xs: "center", md: "flex-start" },
                        }}
                    >
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ backgroundColor: '#0B2E4C' }}
                        >
                            Save & Publish Tickets
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    )
}