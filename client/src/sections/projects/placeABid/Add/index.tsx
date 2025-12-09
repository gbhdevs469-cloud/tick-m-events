import {
    Box, FormControl, Button, InputLabel, TextField, CircularProgress, Select, ListSubheader, MenuItem, Avatar,
    SelectChangeEvent, Typography, InputAdornment, FormHelperText,
} from "@mui/material";
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { DashboardContent } from "src/layouts/dashboard";
import { fetchAllServiceCategories } from "src/redux/actions";
import { fatchOrgEvents } from "src/redux/actions/organizer/pageEvents";
import { organizerPlaceABid } from "src/redux/actions/organizer/place-a-bid.action";
import { AppDispatch, RootState } from "src/redux/store";
import { EventBreadCrum } from "src/sections/entry-validation/event-status";

interface FormData {
    serviceCategoryId: string;
    eventLocation: string;
    serviceTime: string;
    orgBudget: string;
    orgRequirement: string;
    orgAdditionalRequirement: string;
}

interface FormErrors {
    serviceCategoryId?: string;
    eventLocation?: string;
    serviceTime?: string;
    orgBudget?: string;
    orgRequirement?: string;
    orgAdditionalRequirement?: string;
}

interface ApiResult {
    status: number;
    type: string;
    message: any;
}

export function AddPlaceABid() {
    const { __events } = useSelector((state: RootState) => state.organizer);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { categories } = useSelector((state: RootState) => state?.serviceReqCategories);
    const [charCount, setCharCount] = useState(0);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        serviceCategoryId: "",
        eventLocation: selectedEvent?.location || "",
        serviceTime: "",
        orgBudget: "",
        orgRequirement: "",
        orgAdditionalRequirement: ""
    });

    // Count characters in orgRequirement (strip HTML tags)
    useEffect(() => {
        const textContent = formData.orgRequirement.replace(/<[^>]*>/g, '');
        setCharCount(textContent.length);
    }, [formData.orgRequirement]);

    const handleEventSelect = (event: Event | null) => {
        setSelectedEvent(event);
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user selects something
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // Update formData when selectedEvent changes
    useEffect(() => {
        if (selectedEvent?.location) {
            setFormData(prev => ({
                ...prev,
                eventLocation: selectedEvent.location
            }));
        }
    }, [selectedEvent?.location]);

    const handleDescriptionChange = (value: string) => {
        setFormData(prev => ({ ...prev, orgRequirement: value }));
        // Clear error when user starts typing
        if (errors.orgRequirement) {
            setErrors(prev => ({ ...prev, orgRequirement: undefined }));
        }
    };

    useEffect(() => {
        dispatch(fatchOrgEvents());
        dispatch(fetchAllServiceCategories());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        // Validate service category
        if (!formData.serviceCategoryId.trim()) {
            newErrors.serviceCategoryId = "Service category is required";
            isValid = false;
        }

        // Validate event location
        if (!formData.eventLocation.trim()) {
            newErrors.eventLocation = "Event location is required";
            isValid = false;
        }

        // Validate service time
        if (!formData.serviceTime.trim()) {
            newErrors.serviceTime = "Service time is required";
            isValid = false;
        }

        // Validate budget
        if (!formData.orgBudget.trim()) {
            newErrors.orgBudget = "Budget is required";
            isValid = false;
        }

        // Validate org requirement (strip HTML tags for character count)
        const textContent = formData.orgRequirement.replace(/<[^>]*>/g, '');
        if (!textContent.trim()) {
            newErrors.orgRequirement = "Description is required";
            isValid = false;
        } else if (textContent.length < 80) {
            newErrors.orgRequirement = "Description must be at least 80 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }, [formData.serviceCategoryId, formData.eventLocation, formData.serviceTime,
    formData.orgBudget, formData.orgRequirement, setErrors]);

    const isFormValid = () => (
        formData.serviceCategoryId.trim() !== "" &&
        formData.eventLocation.trim() !== "" &&
        formData.serviceTime.trim() !== "" &&
        formData.orgBudget.trim() !== "" &&
        formData.orgRequirement.replace(/<[^>]*>/g, '').trim().length >= 80
    );

    const handleConfirm = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the validation errors before submitting");
            return;
        }

        setIsSubmitting(true);

        const formDataObj = new FormData();
        formDataObj.append("eventId", selectedEvent?._id || "");
        formDataObj.append("serviceCategoryId", formData.serviceCategoryId);
        formDataObj.append("serviceTime", formData.serviceTime);
        formDataObj.append("eventLocation", formData.eventLocation);
        formDataObj.append("orgBudget", formData.orgBudget.toString());
        formDataObj.append("orgRequirement", formData.orgRequirement);
        formDataObj.append("orgAdditionalRequirement", formData.orgAdditionalRequirement);

        try {
            const result = await dispatch(organizerPlaceABid(formDataObj)) as ApiResult;
            if (result?.status === 201) {
                toast.success("Requested Successfully...");
                setFormData({
                    serviceCategoryId: "",
                    eventLocation: selectedEvent?.location || "",
                    serviceTime: "",
                    orgBudget: "",
                    orgRequirement: "",
                    orgAdditionalRequirement: ""
                });
                setErrors({});
            } else {
                toast.error(result?.message || "Service creation failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    }, [dispatch, formData, selectedEvent, validateForm]);

    return (
        <>
            <EventBreadCrum events={__events} onEventSelect={handleEventSelect} />
            <DashboardContent>
                <Box
                    sx={{
                        p: 3,
                        my: 3,
                        borderRadius: 3,
                        backgroundColor: "#fff",
                        border: "1px solid #E0E0E0",
                        boxShadow: 3,
                    }}
                >
                    <form onSubmit={handleConfirm}>
                        <Box>
                            <HeadingCommon variant="h6" title="Service Accepted Form" />

                            {/* Service Category */}
                            <FormControl fullWidth error={!!errors.serviceCategoryId}>
                                <InputLabel id="service-category-label">Type of Service Needed</InputLabel>
                                <Select
                                    labelId="service-category-label"
                                    name="serviceCategoryId"
                                    value={formData.serviceCategoryId}
                                    onChange={handleSelectChange}
                                    required
                                    label="Type of Service Needed"
                                    renderValue={(selected) => {
                                        if (!categories) return 'Loading...';
                                        const selectedItem = categories
                                            ?.flatMap((cat: any) => cat.subcategories || [])
                                            ?.find((child: any) => child._id === selected);
                                        return selectedItem ? selectedItem.name : 'Select Category';
                                    }}
                                    disabled={!categories}
                                >
                                    {!categories ? (
                                        <MenuItem disabled value="">
                                            <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                                                <CircularProgress size={24} />
                                                <Box ml={2}>Loading categories...</Box>
                                            </Box>
                                        </MenuItem>
                                    ) : (
                                        categories?.map((parent: any) => (
                                            parent.subcategories?.length > 0 && [
                                                <ListSubheader key={`header-${parent._id}`}>{parent.name}</ListSubheader>,
                                                ...parent.subcategories.map((child: any) => (
                                                    <MenuItem key={child._id} value={child._id}>
                                                        {child.name}
                                                    </MenuItem>
                                                ))
                                            ]
                                        ))
                                    )}
                                </Select>
                                {errors.serviceCategoryId && (
                                    <FormHelperText>{errors.serviceCategoryId}</FormHelperText>
                                )}
                            </FormControl>

                            {/* Event Location */}
                            <TextField
                                required
                                fullWidth
                                label="Event Location"
                                margin="normal"
                                name="eventLocation"
                                value={formData.eventLocation}
                                onChange={handleChange}
                                placeholder="Enter event location"
                                error={!!errors.eventLocation}
                                helperText={errors.eventLocation || "Pre-filled with event location. You can modify it as needed."}
                            />

                            {/* Service Time */}
                            {/* <TextField
                                required
                                fullWidth
                                label="Date and Time of the Service"
                                type="datetime-local"
                                margin="normal"
                                name="serviceTime"
                                value={formData.serviceTime}
                                onChange={handleChange}
                                error={!!errors.serviceTime}
                                helperText={errors.serviceTime}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            /> */}
                            {/* Service Time */}
                            <TextField
                                required
                                fullWidth
                                label="Date and Time of the Service"
                                type="datetime-local"
                                margin="normal"
                                name="serviceTime"
                                value={formData.serviceTime}
                                onChange={handleChange}
                                error={!!errors.serviceTime}
                                helperText={errors.serviceTime}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    max: selectedEvent?.date ? `${selectedEvent.date}T23:59` : undefined,
                                }}
                            />

                            {/* Budget */}
                            <TextField
                                required
                                fullWidth
                                type="text"
                                label="Estimated Budget"
                                margin="normal"
                                placeholder="e.g. 1500 - 2000"
                                name="orgBudget"
                                value={formData.orgBudget}
                                onChange={handleChange}
                                error={!!errors.orgBudget}
                                helperText={errors.orgBudget}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">XAF</InputAdornment>,
                                }}
                            />

                            {/* Rich Text Editor for Requirements */}
                            <Box my={2}>
                                <Typography fontWeight={600} color="text.secondary" mb={1}>
                                    Full Description of Requirements *
                                </Typography>
                                <div translate="no" className="notranslate" data-nosnippet>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.orgRequirement}
                                        onChange={handleDescriptionChange}
                                        className="custom-quill"
                                        placeholder="Full Description of Requirements (minimum 80 characters)"
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, false] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['link', 'clean']
                                            ]
                                        }}
                                    />
                                </div>
                                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography
                                        variant="caption"
                                        color={charCount < 80 ? "error" : "textSecondary"}
                                    >
                                        {charCount} characters (Minimum 80 required)
                                    </Typography>
                                    {errors.orgRequirement && (
                                        <Typography variant="caption" color="error">
                                            {errors.orgRequirement}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            {/* Submit Button */}
                            <Button
                                variant="contained"
                                size="small"
                                type="submit"
                                disabled={!isFormValid() || isSubmitting}
                                sx={{
                                    backgroundColor: "#08043bff",
                                    color: 'white',
                                    width: "100%",
                                    mt: 2,
                                    p: 1,
                                    '&:disabled': {
                                        backgroundColor: '#f5f5f5',
                                        color: '#bdbdbd'
                                    }
                                }}
                            >
                                {isSubmitting ? <CircularProgress size={24} /> : "Send Request"}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </DashboardContent>
        </>
    );
}