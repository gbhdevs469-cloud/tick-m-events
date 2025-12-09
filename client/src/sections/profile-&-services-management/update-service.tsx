import { Button, Grid, TextField } from "@mui/material";
import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { serviceReqUpdate } from "src/redux/actions";
import { AppDispatch } from "src/redux/store";

interface ApiResult {
    status: number;
    type: string;
    message: any;
    // Add other properties if needed
}

export function UpdateServices({ updateData, setServiceOfferRowData }: any) {
    const fullDesRef = useRef<ReactQuill>(null);
    const addOptionRef = useRef<ReactQuill>(null);

    const dispatch = useDispatch<AppDispatch>();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setServiceOfferRowData((prev: any) => ({ ...prev, [name]: value }));
    };
    const handleServiceUpdate = useCallback(async (event: any) => {
        event.preventDefault();
        const serviceUpdateData = new FormData();
        serviceUpdateData.append("serviceType", updateData.serviceType);
        serviceUpdateData.append("budget", updateData.budget);
        serviceUpdateData.append("eventLocation", updateData.eventLocation)
        serviceUpdateData.append("description", fullDesRef.current?.value as string);
        serviceUpdateData.append("additionalOptions", addOptionRef.current?.value as string);
        try {
            const result = await dispatch(serviceReqUpdate({ serviceUpdateData, serviceId: updateData?._id }));
            if ((result as ApiResult)?.status === 200) {
                toast.success(result?.message);

            } else {
                toast.error(result?.message);
            }

        } catch (error) {
            toast.error("Profile update failed");
        }
    }, [dispatch, updateData])

    return (
        <form onSubmit={handleServiceUpdate}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        name="serviceType"
                        value={updateData.serviceType}
                        onChange={handleChange}
                        fullWidth
                        defaultValue="Service Name"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'black', // Default border color
                                },
                                '&:hover fieldset': {
                                    borderColor: 'black', // Border color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'black', // Border color when focused
                                },
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <div translate="no" className="notranslate" data-nosnippet>
                        <ReactQuill
                            placeholder="Description..."
                            theme="snow"
                            className="custom-quill"
                            ref={fullDesRef}
                            value={updateData.description || ''}
                            onChange={(value) => setServiceOfferRowData((prev: any) => ({ ...prev, description: value }))}
                        />
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="budget"
                        value={updateData.budget}
                        onChange={handleChange}
                        fullWidth
                        defaultValue="Indicative Price"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'black', // Default border color
                                },
                                '&:hover fieldset': {
                                    borderColor: 'black', // Border color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'black', // Border color when focused
                                },
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth
                        name="eventLocation"
                        value={updateData.eventLocation}
                        onChange={handleChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'black', // Default border color
                                },
                                '&:hover fieldset': {
                                    borderColor: 'black', // Border color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'black', // Border color when focused
                                },
                            },
                        }}
                    />

                </Grid>
                <Grid item xs={12}>
                    <div translate="no" className="notranslate" data-nosnippet>
                        <ReactQuill
                            placeholder="Additional Options..."
                            theme="snow"
                            className="custom-quill"
                            ref={addOptionRef}
                            value={updateData.additionalOptions || ''}
                            onChange={(value) => setServiceOfferRowData((prev: any) => ({ ...prev, additionalOptions: value }))}
                        />
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: "#0B2E4C",
                            textTransform: "none",
                            fontWeight: "bold",
                            borderRadius: "14px",
                            py: 1.5,
                            "&:hover": {
                                backgroundColor: "#0B2E4C",
                            },
                        }}
                    >
                        Update a Service
                    </Button>
                </Grid>
            </Grid>
        </form>

    )
}