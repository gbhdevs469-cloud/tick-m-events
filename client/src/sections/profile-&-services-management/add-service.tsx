import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, Grid, IconButton, ListSubheader } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchAllServiceCategories, serviceReqCreate } from "src/redux/actions";
import { AppDispatch, RootState } from "src/redux/store";

import { FORM_INITIAL_STATE, inputStyles } from "./utills";


interface ApiResult {
    status: number;
    type: string;
    message: any;
    // Add other properties if needed
}

export function AddServices({ setActiveSection }: any) {
    const dispatch = useDispatch<AppDispatch>();
    const [eventBanners, setEventBanners] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [formData, setFormData] = useState(FORM_INITIAL_STATE);
    const fullDesRef = useRef<ReactQuill>(null);
    const addOptionRef = useRef<ReactQuill>(null);
    const { categories } = useSelector((state: RootState) => state?.serviceReqCategories);

    useEffect(() => {
        dispatch(fetchAllServiceCategories());
    }, [dispatch]);


    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: { target: { value: string } }) => {
        setFormData(prev => ({ ...prev, serviceType: e.target.value }));
    };

    const handleEventBanners = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);

            // Limit to 5 images
            const selectedFiles = files.slice(0, 5 - eventBanners.length);

            setEventBanners(prev => [...prev, ...selectedFiles]);

            // Create preview URLs
            const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
        }
    };

    const removeImage = (index: number) => {
        setEventBanners(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));

        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(previewUrls[index]);
    };

    const resetForm = () => {
        setFormData(FORM_INITIAL_STATE);
        setEventBanners([]);
        setPreviewUrls([]);
        fullDesRef.current?.getEditor().setText('');
        addOptionRef.current?.getEditor().setText('');
    };

    const handleSubmit = useCallback(async (event: React.FormEvent, status: string) => {
        event.preventDefault();

        const formServiceData = new FormData();
        formServiceData.append("serviceType", formData.serviceType);
        formServiceData.append("eventLocation", formData.location);
        formServiceData.append("budget", formData.budget);
        formServiceData.append("description", fullDesRef.current?.value as string);
        formServiceData.append("additionalOptions", addOptionRef.current?.value as string);
        formServiceData.append("status", status);

        // Append all images
        eventBanners.forEach((file, index) => {
            formServiceData.append(`images`, file);
        });

        try {
            const result = await dispatch(serviceReqCreate(formServiceData)) as ApiResult;

            if (result?.status === 201) {
                toast.success("Requested Successfully...");
                setActiveSection(null)
                resetForm();
            } else {
                toast.error(result?.message || "Service creation failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        }
    }, [dispatch, formData, eventBanners, setActiveSection]);

    // Form sections
    const renderServiceTypeField = () => (
        <Box mt={2}>
            <Typography fontWeight={600} color="text.primary" mb={1}>
                Type of Service Needed
            </Typography>
            <FormControl fullWidth sx={inputStyles}>
                <Select
                    required
                    value={formData.serviceType}
                    onChange={handleSelectChange}
                    displayEmpty
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 400,
                            },
                        },
                    }}
                >
                    <MenuItem value="" disabled>
                        Select a Service
                    </MenuItem>
                    {categories?.map((category: any) => (
                        [
                            <ListSubheader
                                key={`header-${category._id}`}
                                sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: '#f5f5f5',
                                    pointerEvents: 'none' // Makes it non-interactive
                                }}
                            >
                                {category.name}
                            </ListSubheader>,
                            ...category.subcategories.map((subcategory: any) => (
                                <MenuItem
                                    key={subcategory._id}
                                    value={subcategory.name}
                                    sx={{
                                        pl: 4, // Indent child items
                                        ml: 2, // Additional margin
                                        borderLeft: '2px solid #ddd' // Visual indicator
                                    }}
                                >
                                    {subcategory.name}
                                </MenuItem>
                            ))
                        ]
                    ))}
                </Select>
            </FormControl>
        </Box>
    )

    const renderTextField = (label: string, name: string, placeholder: string, type = 'text') => (
        <Box mt={2}>
            <Typography fontWeight={600} color="text.primary" mb={1}>
                {label}
            </Typography>
            <TextField
                placeholder={placeholder}

                required={name !== 'coverImage'}
                name={name}
                type={type}
                value={formData[name as keyof typeof formData] || ''}
                onChange={handleChange}
                fullWidth
                sx={{ ...inputStyles, textTransform: "capitalize" }}
                InputLabelProps={type === 'datetime-local' ? { shrink: true } : undefined}
                InputProps={name === 'coverImage' ? {
                    inputProps: { accept: "image/*" }
                } : undefined}
            />
        </Box>
    );

    const renderRichTextEditor = (label: string, ref: React.RefObject<ReactQuill>) => (
        <Box my={2}>
            <Typography fontWeight={600} color="text.primary" mb={1}>
                {label}
            </Typography>
            <div translate="no" className="notranslate" data-nosnippet>
                <ReactQuill
                    placeholder={label.includes('Full') ? 'Description...' : 'Add Additional...'}
                    theme="snow"
                    className="custom-quill"
                    ref={ref}
                />
            </div>
        </Box>
    );

    const renderImagePreviews = () => {
        if (previewUrls.length === 0) return null;

        return (
            <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                {previewUrls.map((url, index) => (
                    <Box key={index} position="relative" width={50} height={50}>
                        <img
                            src={url}
                            alt={`Preview ${index}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '4px'
                            }}
                        />
                        <IconButton
                            size="small"

                            onClick={() => removeImage(index)}
                            sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.7)'
                                }
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ))}
            </Box>
        );
    };

    const renderButtons = () => (
        <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            gap={2}
            mt={4}
        >
            <Button
                variant="contained"
                type="submit"
                onClick={(e) => handleSubmit(e, 'active')}
                sx={{
                    backgroundColor: '#0D274D',
                    borderRadius: '25px',
                    px: 2,
                    py: 1,
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#0b223f' },
                    width: { xs: '100%', md: '40%', lg: '50%' },
                }}
            >
                Send Request
            </Button>

            <Button
                variant="outlined"
                type="submit"
                onClick={(e) => handleSubmit(e, 'draft')}
                sx={{
                    borderRadius: '25px',
                    px: 2,
                    py: 1,
                    fontWeight: 600,
                    borderColor: '#0D274D',
                    color: '#0D274D',
                    '&:hover': { backgroundColor: '#f1f1f1' },
                    width: { xs: '100%', md: '40%', lg: '50%' },
                }}
            >
                Save as Draft
            </Button>
        </Box>
    );

    return (
        <form encType="multipart/form-data">
            {renderServiceTypeField()}
            {renderTextField('Event Location', 'location', 'eg.. London')}
            {renderTextField('Estimated Budget', 'budget', "eg.. 100 XAF - 200 XAF")}
            {renderRichTextEditor('Full Description of Requirements', fullDesRef)}

            <Grid item xs={12} mt={2}>
                <Typography fontWeight={600} color="text.primary" mb={1}>
                    Upload Images (Max 5)
                </Typography>

                {renderImagePreviews()}

                <TextField
                    type="file"
                    fullWidth
                    name="images"
                    onChange={handleEventBanners}
                    sx={inputStyles}
                    InputProps={{
                        inputProps: {
                            accept: "image/*",
                            multiple: true
                        }
                    }}
                    disabled={eventBanners.length >= 5}
                />
                {eventBanners.length >= 5 && (
                    <Typography variant="caption" color="text.secondary">
                        Maximum 5 images reached
                    </Typography>
                )}
            </Grid>

            {renderRichTextEditor('Additional Options', addOptionRef)}
            {renderButtons()}
        </form>

    )
}