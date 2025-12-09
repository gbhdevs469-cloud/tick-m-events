import { Paper, Tab, Tabs } from "@mui/material";
import { useMemo, useState } from "react";
import { tabLabels, onServiceTableData, onServiceTableHeader, pendingRequestTableHeaders, requestDetails, serviceContract, signedContractTableData, signedContractTableHeader } from "./utills";
import { RequestTabSection } from "./request-tab-section";
import { ExpectedPayments } from "./expected-payments";



export function TabWithTableView({ requests }: any) {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Filter requests based on contractStatus
    const filteredRequests = useMemo(() => {
        switch (tabValue) {
            case 0: // Pending Requests
                return requests.filter((request: any) =>
                    request.contractStatus === 'pending');
            case 1: // Signed Contracts
                return requests.filter((request: any) =>
                    request.contractStatus === 'signed');
            case 2: // Ongoing & Completed
                return requests.filter((request: any) =>
                    request.contractStatus === 'ongoing' ||
                    request.contractStatus === 'completed');
            default:
                return [];
        }
    }, [requests, tabValue]);

    return (
        <>
            <Paper
                elevation={3}
                sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    overflow: "hidden",
                    marginTop: 3,
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    TabIndicatorProps={{ style: { display: "none" } }}
                    textColor="inherit"
                    sx={{
                        "& .MuiTabs-scroller": {
                            overflow: "auto !important"
                        }
                    }}
                >
                    {tabLabels.map((label, index) => (
                        <Tab
                            key={index}
                            label={label}
                            sx={{
                                px: { xs: 1, sm: 3 },
                                minWidth: "unset",
                                textTransform: "none",
                                fontWeight: tabValue === index ? "bold" : "normal",
                                color: tabValue === index ? "black" : "gray",
                                fontSize: { xs: "0.75rem", sm: "0.875rem" }
                            }}
                        />
                    ))}
                </Tabs>
            </Paper>

            <Paper elevation={6}
                sx={{
                    mt: 2,
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    overflow: "hidden",
                }}
            >
                {/* Pending Request */}
                {tabValue === 0 && (
                    <RequestTabSection
                        title="Pending Requests"
                        description="Tracks sent proposals and ongoing negotiations with event organizers."
                        headers={pendingRequestTableHeaders}
                        data={filteredRequests}
                        type="1"
                    />
                )}

                {/* Signed Request */}
                {tabValue === 1 && (
                    <RequestTabSection
                        title="Signed Contracts"
                        description="Tracks confirmed services with the 10% commission deposit to TICK-M."
                        headers={signedContractTableHeader}
                        data={filteredRequests}
                        type="2"
                    // detailsTitle="Contract Details"
                    // details={[
                    //     { label: "Service", value: serviceContract.service },
                    //     { label: "Organizer", value: serviceContract.organizer },
                    //     { label: "Provider", value: serviceContract.provider },
                    //     { label: "Location", value: serviceContract.location },
                    //     { label: "Date", value: serviceContract.date },
                    //     { label: "Amount", value: serviceContract.amount },
                    //     { label: "Deposit", value: serviceContract.deposit },
                    //     { label: "Remaining Payment", value: serviceContract.payment },
                    //     { label: "Terms & Conditions", value: serviceContract["terms & Conditions"] }
                    // ]}
                    // buttons={[
                    //     { label: "Download Contract (PDF)", variant: "contained" },
                    //     { label: "Contact the Organizer", variant: "outlined" }
                    // ]}
                    />
                )}


                {/* Ongoing & Completed Reqeust */}
                {tabValue === 2 && (
                    <RequestTabSection
                        title="Ongoing & Completed Services"
                        description="Manage confirmed services and track their progress."
                        headers={onServiceTableHeader}
                        data={filteredRequests}
                        type="3"
                    />
                )}


            </Paper>
                <ExpectedPayments requests={requests}/>

        </>
    )
}