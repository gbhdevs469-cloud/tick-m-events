import { Box, Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import ProfileAndServiceTable from "src/components/tables/profile-and-service-table";
import { AppDispatch, RootState } from "src/redux/store";
import { fetchServiceReqUserId } from "src/redux/actions";

import { offterTableHeaders } from "./utills";
import { AddServices } from "./add-service";
import { UpdateServices } from "./update-service";

export function OfferAndService() {
    const { services } = useSelector((state: RootState) => state?.profile);
    const dispatch = useDispatch<AppDispatch>();

    const [activeSection, setActiveSection] = useState<'add' | 'update' | null>(null);
    const [serviceOfferRowData, setServiceOfferRowData] = useState({
        _id: "",
        serviceType: "",
        eventLocation: "",
        description: "",
        budget: "",
        additionalOptions: ""
    });

    const handleModify = useCallback((rowData: any) => {
        setServiceOfferRowData(prev => {
            if (prev._id === rowData._id &&
                prev.serviceType === rowData.serviceType &&
                prev.eventLocation === rowData.eventLocation &&
                prev.description === rowData.description &&
                prev.budget === rowData.budget &&
                prev.additionalOptions === rowData.additionalOptions
            ) {
                return prev;
            }
            return {
                _id: rowData._id,
                serviceType: rowData.serviceType,
                description: rowData.description,
                eventLocation: rowData.eventLocation,
                budget: rowData.budget,
                additionalOptions: rowData.additionalOptions
            };
        });
        setActiveSection('update');
    }, []);

    const handleAddServiceClick = useCallback(() => {
        setActiveSection('add');
        // Reset form data when switching to add mode
        setServiceOfferRowData({
            _id: "",
            serviceType: "",
            eventLocation: "",
            description: "",
            budget: "",
            additionalOptions: ""
        });
    }, []);

    useEffect(() => {
        dispatch(fetchServiceReqUserId())
    }, [dispatch])

    return (
        <Box boxShadow={3} borderRadius={3} bgcolor="#FFFFFF" mt={3} p={3}>
            {/* Title */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
            >
                <HeadingCommon variant="h6" title="Offered Services" weight={600} />
                <Button
                    variant="outlined"
                    size="small"
                    disabled={activeSection === "add"}
                    onClick={handleAddServiceClick}
                    sx={{
                        marginX: 0.5,
                        color: "white",
                        borderColor: "gray",
                        backgroundColor: "#0B2E4C",
                        '&:hover': {
                            color: "black",
                            borderColor: "gray",
                        },
                        '&:disabled': {
                            backgroundColor: "#f5f5f5",
                            color: "#9e9e9e"
                        }
                    }}
                >
                    Add Services
                </Button>
            </Box>

            {/* Form Section - Only appears when activeSection is set */}
            {activeSection && (
                <Box
                    mt={4}
                    sx={{
                        borderRadius: "20px",
                        border: "1px solid #00000066",
                        background: "#FFFFFF",
                        p: 3,
                    }}
                >
                    <HeadingCommon 
                        variant="h6" 
                        title={activeSection === 'add' ? 'Add a New Service' : 'Update a Service'} 
                        weight={600} 
                    />
                    {activeSection === 'add' ? (
                        <AddServices setActiveSection={setActiveSection}/>
                    ) : (
                        <UpdateServices 
                            setServiceOfferRowData={setServiceOfferRowData} 
                            updateData={serviceOfferRowData} 
                        />
                    )}
                </Box>
            )}
            
            {/* Table */}
            <ProfileAndServiceTable
                setActiveSection={setActiveSection}
                activeSection={activeSection}
                headers={offterTableHeaders}
                data={services}
                onModify={handleModify}
            />

            
        </Box>
    )
}