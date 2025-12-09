import { Box, Button, Paper, Tab, Tabs, Typography, Stack, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "src/redux/store";
import { getRequestsByProvider } from "src/redux/actions/service-request";

import {
    SharedFilesDocumentsTableHeader,
    SharedFilesDocumentsTableData, GeneralConversationsTableHeaders,
    ChatOrganizerTableHeaders, ChatOrganizerTableData
} from "./utills";
import { RequestTabSection } from "./request-tab-section";
import { ChatBox } from "./chatbox";


export function TabWithTableView() {
    const { requests } = useSelector((state: RootState) => state?.serviceRequest);
    const dispatch = useDispatch<AppDispatch>()
    const [tabValue, setTabValue] = useState(0);
    const tabLabels = ["Inbox", "Shared Files"];
    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    useEffect(() => {
        dispatch(getRequestsByProvider());
    }, [dispatch]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    const notifications = [
        {
            id: 1,
            message: 'Your quote needs to be updated.',
            type: 'error',
        },
        {
            id: 2,
            message: 'Reminder: Pending response from the client.',
            type: 'normal',
        },
    ];

    const handleOpenModal = (row: any) => {
        setSelectedRow(row);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRow(null);
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                }}
            >
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    TabIndicatorProps={{ style: { display: "none" } }}
                    sx={{
                        display: "flex",
                    }}
                >
                    {tabLabels.map((label, index) => (
                        <Tab
                            key={index}
                            label={label}
                            disableRipple
                            sx={{
                                px: 3,
                                mx: 1,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 500,
                                fontSize: "0.875rem",
                                color: tabValue === index ? "white !important" : "#0B2E4C", // white for active tab
                                backgroundColor: tabValue === index ? "#0B2E4C" : "transparent",
                                border: tabValue === index ? "none" : "1px solid #ccc",
                                transition: "all 0.3s ease",
                                minWidth: "150px",
                                whiteSpace: "nowrap",
                                "&:hover": {
                                    backgroundColor: tabValue === index ? "#002244" : "#f5f5f5",
                                },
                            }}
                        />
                    ))}
                </Tabs>
            </Box>

            {tabValue === 0 && (
                <>
                    <Paper elevation={6}
                        sx={{
                            mt: 3,
                            p: 3,
                            borderRadius: 2,
                            boxShadow: 3,
                            overflow: "hidden",
                        }}
                    >
                        <RequestTabSection
                            title="Conversations"
                            description=""
                            headers={GeneralConversationsTableHeaders}
                            data={requests}
                            type="2"
                            handleOpenModal={handleOpenModal}
                        />
                    </Paper>

                    {
                        openModal && <Paper elevation={6}
                            sx={{
                                mt: 3,
                                p: 3,
                                borderRadius: 2,
                                boxShadow: 3,
                                overflow: "hidden",
                            }}
                        >
                            <RequestTabSection
                                title="Chat with Organizer"
                                description="Project Details"
                                headers={ChatOrganizerTableHeaders}
                                data={ChatOrganizerTableData}
                                type="3"
                                handleOpenModal=""
                            />
                            <ChatBox handleCloseModal={handleCloseModal} conv={selectedRow} />
                        </Paper>
                    }
                </>

            )}
            {tabValue === 1 && (
                <>
                    <Paper elevation={6}
                        sx={{
                            mt: 2,
                            p: 3,
                            borderRadius: 2,
                            boxShadow: 3,
                            overflow: "hidden",
                        }}
                    >
                        <RequestTabSection
                            title="Shared Files & Documents"
                            description="Exchanged Attachments"
                            headers={SharedFilesDocumentsTableHeader}
                            data={SharedFilesDocumentsTableData}
                            type="5"
                            handleOpenModal=""
                        />
                        <Box sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={12}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#0B2E4C",
                                        color: "white",
                                        "&:hover": { backgroundColor: "#002244" },
                                    }}
                                >
                                    Download All Attachments
                                </Button>
                            </Grid>
                        </Box>
                    </Paper>
                </>
            )}
        </>
    )
}