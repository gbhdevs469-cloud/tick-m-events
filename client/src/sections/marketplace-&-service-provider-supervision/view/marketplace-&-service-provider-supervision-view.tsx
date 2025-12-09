import { Paper, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { DashboardContent } from "src/layouts/dashboard";
import { PageTitleSection } from "src/components/page-title-section";
import { fetchProviderList } from "src/redux/actions/admin/marketPlace-supervision";
import { AppDispatch, RootState } from "src/redux/store";

import { MarketTrendsTab } from "../MarketTrendsTab";

export function MarketplaceAndServiceProviderSupervisionView() {
    const dispatch = useDispatch<AppDispatch>();
    const { providerList } = useSelector((state: RootState) => state?.admin);
    const [selectedProvider, setSelectedProvider] = useState({ _id: "", name: "" });

    useEffect(() => {
        dispatch(fetchProviderList());
    }, [dispatch]);

    // Set the first provider as selected when providerList is loaded or changes
    useEffect(() => {
        if (providerList && providerList.length > 0 && !selectedProvider._id) {
            setSelectedProvider({ _id: providerList[0]._id, name: providerList[0].name });
        }
    }, [providerList, selectedProvider._id]);

    const handleProviderChange = (event: any) => {
        const selectedId = event.target.value;
        const provider = providerList.find((p: any) => p._id === selectedId);
        setSelectedProvider({ _id: selectedId, name: provider?.name || "" });
    };

    return (
        <DashboardContent>
            <PageTitleSection
                title="Marketplace And Service Provider Supervision"
            />

            {/* Select Box */}
            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                <InputLabel id="provider-select-label">Select Provider</InputLabel>
                <Select
                    labelId="provider-select-label"
                    id="provider-select"
                    value={selectedProvider._id}
                    label="Select Provider"
                    onChange={handleProviderChange}
                >
                    {providerList && providerList.map((provider: any) => (
                        <MenuItem key={provider._id} value={provider._id}>
                            {provider.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Paper elevation={6}
                sx={{
                    mt: 3,
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    overflow: "hidden",
                }}
            >
                {/* Pass both ID and name to the child component */}
                <MarketTrendsTab 
                    selectedProviderId={selectedProvider?._id} 
                    selectedProviderName={selectedProvider?.name} 
                />
            </Paper>
        </DashboardContent>
    )
}