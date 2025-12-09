import { TextField, Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { ColorResult, SketchPicker } from 'react-color';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";

import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { AppDispatch } from "src/redux/store";
import { eventCustomizationCreate } from "src/redux/actions/event.action";

export function StepperStepThree() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [eventLogo, setEventLogo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFrame, setSelectedFrame] = useState('circle');
    const [selectedColor, setSelectedColor] = useState("#F68CB9");
    const [customColor, setCustomColor] = useState("#FF66A1");
    const handleEventThemeLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            // Create object URL for preview
            const previewUrl = URL.createObjectURL(e.target.files[0]);
            setEventLogo(previewUrl);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    // Clean up object URLs when component unmounts
    useEffect(() => () => {
        if (eventLogo) {
            URL.revokeObjectURL(eventLogo);
        }
    }, [eventLogo]);


    const handleColorChange = (color: ColorResult) => {
        setCustomColor(color.hex); // Extract the hex value from ColorResult
    };

    const handleEventCustomize = useCallback(async (event: any) => {
        event.preventDefault();
        setLoading(true);
        const formEventCustomizeData = new FormData();
        const files = fileInputRef.current?.files;
        // Append all form data
        formEventCustomizeData.append("frame", selectedFrame);
        formEventCustomizeData.append("themeColor", selectedColor);
        formEventCustomizeData.append("customColor", customColor);

        if (files && files.length > 0) {
            const selectedFile = files[0];
            formEventCustomizeData.append("eventLogo", selectedFile);
        }
        try {
            // Get current search params
            const searchParams = new URLSearchParams(window.location.search);
            const eventId = searchParams.get('eventId'); // Get existing eventId
            const ticketConfigId = searchParams.get('ticketConfigId'); // Get existing eventId
            const res = await dispatch(eventCustomizationCreate({ formEventCustomizeData, eventId, ticketConfigId }));
            const eventCustomizationId = res?.eventCustomizationId;

            // Add event ID to current URL as search param
            navigate(`?eventId=${eventId}&ticketConfigId=${ticketConfigId}&eventCustomiztionId=${eventCustomizationId}`, { replace: true });

        } catch (error) {
            toast.error("Event creation failed");
        }
    }, [dispatch, navigate, customColor, selectedColor, selectedFrame]);

    return (
        <Card
            sx={{
                borderRadius: 3,
                padding: 3,
                boxShadow: 3,
                border: "2px solid #E0E0E0",
                marginTop: 3,
            }}
        >
            <CardContent>
                <form encType='multipart/form-data' onSubmit={handleEventCustomize}>
                    <Grid container spacing={4}>
                        {/* Left Section: Theme Selection */}
                        <Grid item xs={12} md={6}>
                            <HeadingCommon variant="h5" weight={600} baseSize="33px" title="Event Customization" />
                            <Box>
                                <HeadingCommon variant="h5" weight={800} mb="0px" baseSize="33px" title="Choose Event Theme" color="#0B2E4C" />
                                <HeadingCommon variant="body2" weight={500} mt="-10px" baseSize="17px" title="Choose main colors" color="#0B2E4C" />
                            </Box>
                            <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
                                {["#F68CB9", "#FF592F", "#FEEE4A", "#67A5E1", "#FE5C9D"].map((color) => (
                                    <Box
                                        key={color}
                                        sx={{
                                            width: 45,
                                            height: 45,
                                            backgroundColor: color,
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                            border: selectedColor === color ? "2px solid black" : "none",
                                        }}
                                        onClick={() => setSelectedColor(color)}
                                    />
                                ))}
                            </Box>
                            <HeadingCommon variant="body2" mt={2} weight={500} baseSize="17px" title="Choose Custom Colors" color="#0B2E4C" />

                            <SketchPicker color={customColor} onChangeComplete={handleColorChange} />
                        </Grid>

                        {/* Right Section: Logo Upload & Frame Selection */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" fontWeight="bold">
                                Theme Logo Preview
                            </Typography>

                            <Box
                                sx={{
                                    width: "90px",
                                    height: "90px",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#FFF",
                                    boxShadow: 2,
                                    border: "1px solid #D3D3D3",
                                    overflow: "hidden",
                                    marginBottom: 4,
                                }}
                            >
                                {eventLogo ? (
                                    <img src={eventLogo} alt="Uploaded" width="60px" />
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                        No Logo
                                    </Typography>
                                )}
                            </Box>

                            <Grid container spacing={3}>
                                {/* Logo Upload Section */}
                                <Grid item xs={12} sm={12}>
                                    <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                                        Choose logo
                                    </Typography>
                                    <TextField
                                        type="file"
                                        fullWidth
                                        required
                                        name="eventLogo"
                                        onChange={handleEventThemeLogo}
                                        inputRef={fileInputRef}
                                        InputProps={{
                                            sx: {
                                                borderRadius: '10px',
                                                border: '1px solid #ccc',
                                                backgroundColor: '#F9F9F9',
                                            },
                                            inputProps: {
                                                accept: "image/*",
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Frame Selection Section */}
                                <Grid item xs={12} sm={12}>
                                    <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                                        Choose Frames
                                    </Typography>
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        {["circle", "triangle", "square"].map((frame) => (
                                            <Box
                                                key={frame}
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: frame === "circle" ? "50%" : "4px",
                                                    border: "2px solid",
                                                    borderColor: selectedFrame === frame ? "#007BFF" : "#D3D3D3",
                                                    backgroundColor: "#E0E0E0",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                onClick={() => setSelectedFrame(frame)}
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* Submit Button - Always full width */}
                    <LoadingButton
                        fullWidth
                        loading={loading}
                        size="large"
                        type="submit"
                        color="inherit"
                        variant="contained"
                        sx={{ mt: 3, backgroundColor: "#0B2E4C" }}
                    >
                        Save Customization
                    </LoadingButton>
                </form>
            </CardContent>
        </Card>
    )
}